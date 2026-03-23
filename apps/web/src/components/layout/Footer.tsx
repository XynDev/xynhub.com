import { useState, useEffect } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../ThemeProvider"
import { getFooter } from "../../lib/api"
import { supabase } from "../../lib/supabase"
import { Turnstile } from "../ui/Turnstile"

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || ""

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

function FooterLink({ url, label }: { url?: string; label: string }) {
  if (!url || url === "#") {
    return <span className="font-['Inter'] text-sm text-on-surface-variant uppercase tracking-tight">{label}</span>
  }
  // External link
  if (url.startsWith("http")) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="font-['Inter'] text-sm text-on-surface-variant hover:text-primary transition-colors uppercase tracking-tight">
        {label}
      </a>
    )
  }
  // Internal link - use React Router Link
  return (
    <Link to={url} className="font-['Inter'] text-sm text-on-surface-variant hover:text-primary transition-colors uppercase tracking-tight">
      {label}
    </Link>
  )
}

export function Footer() {
  const { theme } = useTheme();
  const [footerData, setFooterData] = useState<AnyData | null>(null)
  const [email, setEmail] = useState("")
  const [subscribing, setSubscribing] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [turnstileToken, setTurnstileToken] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const res = await getFooter()
        setFooterData(res.data)
      } catch (err) {
        console.error("Failed to load footer:", err)
      }
    }
    load()
  }, [])

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault()
    setEmailError("")

    if (!email) {
      setEmailError("Email is required")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email")
      return
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setEmailError("Please complete the verification.")
      return
    }

    setSubscribing(true)
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .upsert({ email, is_active: true }, { onConflict: "email" })
      if (error) throw new Error(error.message)
      setSubscribed(true)
      setEmail("")
      setTurnstileToken("")
    } catch {
      setEmailError("Failed to subscribe. Try again.")
    } finally {
      setSubscribing(false)
    }
  }

  const brand = footerData?.brand
  const platform = footerData?.platform
  const company = footerData?.company
  const newsletter = footerData?.newsletter
  const bottom = footerData?.bottom

  return (
    <footer className="w-full rounded-t-[3rem] bg-surface-container mt-12 border-t border-outline-variant">
      <div className="grid grid-cols-4 gap-12 px-10 md:px-20 py-20 w-full max-w-[1440px] mx-auto">
        <div className="col-span-4 lg:col-span-1">
          <div className="mb-8">
            <img
              src={theme === "light" ? "/logo-text-dark.png" : "/logo-text-white.png"}
              alt="XYN Logo"
              className="h-10 w-auto"
            />
          </div>
          <p className="font-['Inter'] text-sm leading-relaxed text-on-surface-variant max-w-[250px]">
            {brand?.description || "Engineering the next generation of digital monoliths. Built for the future of synaptic computing."}
          </p>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-8">{platform?.title || "Platform"}</h4>
          <ul className="space-y-4">
            {(platform?.links || [{ label: "Infrastructure" }, { label: "Security" }, { label: "Ecosystem" }]).map((link: AnyData) => (
              <li key={link.label}>
                <FooterLink url={link.url} label={link.label} />
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-8">{company?.title || "Company"}</h4>
          <ul className="space-y-4">
            {(company?.links || [{ label: "About Us" }, { label: "Careers" }, { label: "Legal" }]).map((link: AnyData) => (
              <li key={link.label}>
                <FooterLink url={link.url} label={link.label} />
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-4 lg:col-span-1">
          <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-8">
            {newsletter?.title || "Newsletter"}
          </h4>
          {subscribed ? (
            <div className="text-sm text-primary">Subscribed! Thank you.</div>
          ) : (
            <form onSubmit={handleSubscribe}>
              <div className="flex bg-surface-container-low rounded-full border border-outline-variant overflow-hidden">
                <input
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  className="bg-transparent border-none focus:ring-0 text-sm px-4 py-3 outline-none flex-grow min-w-0 text-primary placeholder:text-on-surface-variant/50"
                  placeholder={newsletter?.placeholder || "Email Address"}
                  type="email"
                />
                <button
                  type="submit"
                  disabled={subscribing || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
                  className="bg-primary text-on-primary text-[10px] font-bold px-5 py-3 uppercase tracking-widest hover:opacity-80 transition-opacity shrink-0 disabled:opacity-50"
                >
                  {subscribing ? "..." : (newsletter?.button_text || "Join")}
                </button>
              </div>
              <Turnstile
                siteKey={TURNSTILE_SITE_KEY}
                onVerify={setTurnstileToken}
                onExpire={() => setTurnstileToken("")}
                theme="dark"
                size="compact"
              />
              {emailError && <p className="text-xs text-red-500 mt-1 px-4">{emailError}</p>}
            </form>
          )}
        </div>

        <div className="col-span-4 pt-12 border-t border-outline-variant mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-['Inter'] text-[0.70rem] uppercase tracking-widest text-on-surface-variant">
            {bottom?.copyright || "\u00A9 2024 XYN Engineering Ecosystem. All rights reserved."}
          </div>
          <div className="flex gap-8">
            {(bottom?.links || [
              { label: "Privacy Policy", url: "/privacy-policy" },
              { label: "Terms of Service", url: "/terms-of-service" },
            ]).map((link: AnyData) => {
              const url = link.url || "#"
              if (url.startsWith("http")) {
                return (
                  <a key={link.label} href={url} target="_blank" rel="noopener noreferrer" className="font-['Inter'] text-[0.70rem] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
                    {link.label}
                  </a>
                )
              }
              return (
                <Link key={link.label} to={url} className="font-['Inter'] text-[0.70rem] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
