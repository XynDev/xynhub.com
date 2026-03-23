/**
 * Anti-spam protection: Cloudflare Turnstile + honeypot + timing fallback.
 * - Turnstile: managed Cloudflare challenge widget
 * - Honeypot: hidden field that bots auto-fill but humans never see
 * - Timing: reject submissions that happen faster than a human could type
 *
 * Uses callback ref so the widget renders even if the container div
 * appears in the DOM after initial mount (e.g. behind a loading gate).
 */
import { useRef, useEffect, useState, useCallback } from "react"

const TURNSTILE_SCRIPT_ID = "cf-turnstile-script"
let scriptPromise: Promise<void> | null = null

function loadTurnstileScript(): Promise<void> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    if (window.turnstile) { resolve(); return }
    if (document.getElementById(TURNSTILE_SCRIPT_ID)) {
      const existing = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () => reject(new Error("Turnstile script failed")))
      return
    }
    const script = document.createElement("script")
    script.id = TURNSTILE_SCRIPT_ID
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => { scriptPromise = null; reject(new Error("Turnstile script failed to load")) }
    document.head.appendChild(script)
  })
  return scriptPromise
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

interface UseAntiSpamReturn {
  /** Callback ref — use as ref={antiSpam.turnstileRef} on the container div */
  turnstileRef: (node: HTMLDivElement | null) => void
  /** Honeypot props — spread onto a hidden <input> */
  honeypotProps: { name: string; autoComplete: string; tabIndex: number; style: React.CSSProperties; "aria-hidden": boolean }
  honeypotRef: React.RefObject<HTMLInputElement | null>
  /** Call before submit — returns { isBot, token } */
  check: () => { isBot: boolean; token: string }
  /** Reset Turnstile widget after a submit */
  reset: () => void
  /** Whether Turnstile is ready (verified) */
  ready: boolean
}

export function useAntiSpam(minSeconds = 3): UseAntiSpamReturn {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || ""
  const honeypotRef = useRef<HTMLInputElement | null>(null)
  const mountTime = useRef<number>(Date.now())
  const widgetIdRef = useRef<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const tokenRef = useRef<string>("")
  const [ready, setReady] = useState(false)

  const renderWidget = useCallback((container: HTMLDivElement) => {
    if (!siteKey || !window.turnstile || !container) return
    // Avoid double-render
    if (widgetIdRef.current) return
    try {
      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: siteKey,
        theme: "auto",
        callback: (token: string) => {
          tokenRef.current = token
          setReady(true)
        },
        "expired-callback": () => {
          tokenRef.current = ""
          setReady(false)
        },
        "error-callback": () => {
          // Turnstile failed — fall back to honeypot-only mode
          tokenRef.current = ""
          setReady(false)
        },
      })
    } catch {
      // Widget render failed — honeypot fallback
    }
  }, [siteKey])

  // Callback ref: fires when the div enters or leaves the DOM
  const turnstileRef = useCallback((node: HTMLDivElement | null) => {
    // Cleanup old widget if the node is removed
    if (!node) {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current) } catch { /* noop */ }
        widgetIdRef.current = null
      }
      containerRef.current = null
      return
    }
    containerRef.current = node
    if (!siteKey) return
    // Load script then render widget into this specific container
    loadTurnstileScript()
      .then(() => { setTimeout(() => renderWidget(node), 50) })
      .catch(() => { /* Script failed — honeypot fallback */ })
  }, [siteKey, renderWidget])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current) } catch { /* noop */ }
        widgetIdRef.current = null
      }
    }
  }, [])

  const check = (): { isBot: boolean; token: string } => {
    // Honeypot check
    if (honeypotRef.current && honeypotRef.current.value.length > 0) {
      return { isBot: true, token: "" }
    }
    // Timing check
    const elapsed = (Date.now() - mountTime.current) / 1000
    if (elapsed < minSeconds) {
      return { isBot: true, token: "" }
    }
    // If Turnstile is configured and no token — not verified yet
    if (siteKey && !tokenRef.current) {
      return { isBot: true, token: "" }
    }
    return { isBot: false, token: tokenRef.current }
  }

  const reset = () => {
    tokenRef.current = ""
    setReady(false)
    if (widgetIdRef.current && window.turnstile) {
      try { window.turnstile.reset(widgetIdRef.current) } catch { /* noop */ }
    }
  }

  return {
    turnstileRef,
    honeypotProps: {
      name: "website_url",
      autoComplete: "off",
      tabIndex: -1,
      style: { position: "absolute" as const, left: "-9999px", top: "-9999px", opacity: 0, height: 0, width: 0, overflow: "hidden" as const },
      "aria-hidden": true as const,
    },
    honeypotRef,
    check,
    reset,
    ready,
  }
}
