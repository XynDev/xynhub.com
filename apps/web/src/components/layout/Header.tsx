import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { useTheme } from "../ThemeProvider"
import { Moon, Sun, Menu, X } from "lucide-react"
import { getNavigation, getSettings } from "../../lib/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

export function Header() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<AnyData[]>([]);
  const [navLoaded, setNavLoaded] = useState(false);
  const [headerCta, setHeaderCta] = useState<{ text: string; url: string }>({ text: "Get Started", url: "/services" });
  const [logoLight, setLogoLight] = useState("/logo-text-dark.png");
  const [logoDark, setLogoDark] = useState("/logo-text-white.png");

  useEffect(() => {
    async function load() {
      try {
        const [navRes, settingsRes] = await Promise.all([
          getNavigation(),
          getSettings(),
        ])
        if (navRes.data && navRes.data.length > 0) {
          setNavLinks(navRes.data)
        } else {
          // Fallback if API returns empty
          setNavLinks([
            { label: "Home", path: "/" },
            { label: "About", path: "/about" },
            { label: "Services", path: "/services" },
            { label: "Process", path: "/process" },
            { label: "Portofolio", path: "/portofolio" },
            { label: "Blogs", path: "/blogs" },
          ])
        }
        setNavLoaded(true)
        // Parse settings
        const settings = settingsRes.data
        if (settings) {
          // Header CTA button
          const ctaSetting = settings.header_cta
          if (ctaSetting) {
            const ctaVal = ctaSetting.value || ctaSetting
            if (ctaVal.text) setHeaderCta({ text: ctaVal.text, url: ctaVal.url || "/services" })
          }
          // Logos from settings
          const ll = settings.logo_light
          if (ll) {
            const v = ll.value?.url || ll.value?.value || ll.value || ll.url
            if (v && typeof v === "string" && v.length > 1) setLogoLight(v)
          }
          const ld = settings.logo_dark
          if (ld) {
            const v = ld.value?.url || ld.value?.value || ld.value || ld.url
            if (v && typeof v === "string" && v.length > 1) setLogoDark(v)
          }
        }
      } catch (err) {
        console.error("Failed to load navigation:", err)
        // Show fallback nav on error
        setNavLinks([
          { label: "Home", path: "/" },
          { label: "About", path: "/about" },
          { label: "Services", path: "/services" },
          { label: "Process", path: "/process" },
          { label: "Portofolio", path: "/portofolio" },
          { label: "Blogs", path: "/blogs" },
        ])
        setNavLoaded(true)
      }
    }
    load()
  }, [])

  const isExternal = headerCta.url?.startsWith("http")

  const ctaButton = isExternal ? (
    <a href={headerCta.url} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex bg-primary text-on-primary hover:opacity-90 transition-opacity font-semibold px-6 py-2.5 rounded-full text-sm">
      {headerCta.text}
    </a>
  ) : (
    <Link to={headerCta.url} className="hidden md:inline-flex bg-primary text-on-primary hover:opacity-90 transition-opacity font-semibold px-6 py-2.5 rounded-full text-sm">
      {headerCta.text}
    </Link>
  )

  const mobileCta = isExternal ? (
    <a href={headerCta.url} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)} className="bg-primary text-on-primary hover:opacity-90 transition-opacity font-semibold px-6 py-3 rounded-full text-sm text-center w-full block">
      {headerCta.text}
    </a>
  ) : (
    <Link to={headerCta.url} onClick={() => setIsMenuOpen(false)} className="bg-primary text-on-primary hover:opacity-90 transition-opacity font-semibold px-6 py-3 rounded-full text-sm text-center w-full block">
      {headerCta.text}
    </Link>
  )

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-6">
      <nav className="max-w-[1200px] w-full mx-auto glass-nav rounded-full px-8 py-3 flex justify-between items-center shadow-sm">
        <Link to="/" className="flex items-center">
          <img
            src={theme === "light" ? logoLight : logoDark}
            alt="XYN Logo"
            className="h-8 w-auto"
          />
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {navLoaded ? navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "text-xs font-bold tracking-tight uppercase transition-colors",
                location.pathname === item.path ? "text-primary" : "text-on-surface-variant hover:text-primary"
              )}
            >
              {item.label}
            </Link>
          )) : (
            // Skeleton placeholders while loading
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-3 w-14 bg-surface-container-high rounded animate-pulse" />
            ))
          )}
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {ctaButton}

          <button
            className="md:hidden p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && navLoaded && (
        <div className="md:hidden absolute top-20 left-6 right-6 bg-surface-container border border-outline-variant/30 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-sm font-bold tracking-tight uppercase transition-colors p-2 rounded-lg",
                  location.pathname === item.path ? "text-primary bg-surface-container-low" : "text-on-surface-variant hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {mobileCta}
        </div>
      )}
    </header>
  )
}
