import { useEffect, useRef, useCallback } from "react"

interface TurnstileProps {
  siteKey: string
  onVerify: (token: string) => void
  onExpire?: () => void
  theme?: "light" | "dark" | "auto"
  size?: "normal" | "compact"
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
    onTurnstileLoad?: () => void
  }
}

let scriptLoaded = false
let scriptLoading = false
const loadCallbacks: (() => void)[] = []

function loadTurnstileScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve()
  return new Promise((resolve) => {
    if (scriptLoading) {
      loadCallbacks.push(resolve)
      return
    }
    scriptLoading = true
    window.onTurnstileLoad = () => {
      scriptLoaded = true
      scriptLoading = false
      resolve()
      loadCallbacks.forEach((cb) => cb())
      loadCallbacks.length = 0
    }
    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad"
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  })
}

export function Turnstile({ siteKey, onVerify, onExpire, theme = "auto", size = "normal" }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  const handleVerify = useCallback((token: string) => {
    onVerify(token)
  }, [onVerify])

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    let mounted = true

    loadTurnstileScript().then(() => {
      if (!mounted || !containerRef.current || !window.turnstile) return

      // Clean up existing widget
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current)
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: handleVerify,
        "expired-callback": onExpire,
        theme,
        size,
      })
    })

    return () => {
      mounted = false
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [siteKey, handleVerify, onExpire, theme, size])

  if (!siteKey) return null

  return <div ref={containerRef} className="mt-3" />
}

export function resetTurnstile(widgetId: string) {
  window.turnstile?.reset(widgetId)
}
