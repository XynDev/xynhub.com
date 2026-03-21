import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { useTheme } from "../ThemeProvider"
import { Moon, Sun, Menu, X } from "lucide-react"
import { getNavigation } from "../../lib/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

export function Header() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<AnyData[]>([
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Process", path: "/process" },
    { label: "Portofolio", path: "/portofolio" },
    { label: "Intel", path: "/blogs" }
  ]);

  useEffect(() => {
    async function load() {
      try {
        const res = await getNavigation()
        if (res.data && res.data.length > 0) {
          setNavLinks(res.data)
        }
      } catch (err) {
        console.error("Failed to load navigation:", err)
      }
    }
    load()
  }, [])

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-6">
      <nav className="max-w-[1200px] w-full mx-auto glass-nav rounded-full px-8 py-3 flex justify-between items-center shadow-sm">
        <Link to="/" className="flex items-center">
          <img
            src={theme === "light" ? "/logo-text-dark.png" : "/logo-text-white.png"}
            alt="XYN Logo"
            className="h-8 w-auto"
          />
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((item) => (
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
          ))}
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link to="/services" className="hidden md:inline-flex bg-primary text-on-primary hover:opacity-90 transition-opacity font-semibold px-6 py-2.5 rounded-full text-sm">
            Get Started
          </Link>

          <button
            className="md:hidden p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
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
          <Link
            to="/services"
            onClick={() => setIsMenuOpen(false)}
            className="bg-primary text-on-primary hover:opacity-90 transition-opacity font-semibold px-6 py-3 rounded-full text-sm text-center w-full"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  )
}
