import { useState, useEffect } from "react"
import { useTheme } from "../ThemeProvider"
import { getFooter } from "../../lib/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

export function Footer() {
  const { theme } = useTheme();
  const [footerData, setFooterData] = useState<AnyData | null>(null)

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

  // Footer data comes as keyed object: { brand, platform, company, newsletter, bottom }
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
                <a className="font-['Inter'] text-sm text-on-surface-variant hover:text-primary transition-colors uppercase tracking-tight" href={link.url || "#"}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-8">{company?.title || "Company"}</h4>
          <ul className="space-y-4">
            {(company?.links || [{ label: "About Us" }, { label: "Careers" }, { label: "Legal" }]).map((link: AnyData) => (
              <li key={link.label}>
                <a className="font-['Inter'] text-sm text-on-surface-variant hover:text-primary transition-colors uppercase tracking-tight" href={link.url || "#"}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-4 lg:col-span-1">
          <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-8">
            {newsletter?.title || "Newsletter"}
          </h4>
          <div className="flex bg-surface-container-low rounded-full p-1 border border-outline-variant">
            <input className="bg-transparent border-none focus:ring-0 text-sm px-4 outline-none flex-grow text-primary placeholder:text-on-surface-variant/50" placeholder={newsletter?.placeholder || "Email Address"} type="email"/>
            <button className="bg-primary text-on-primary text-[10px] font-bold px-5 py-3 rounded-full uppercase tracking-widest hover:opacity-80 transition-opacity">
              {newsletter?.button_text || "Join"}
            </button>
          </div>
        </div>

        <div className="col-span-4 pt-12 border-t border-outline-variant mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-['Inter'] text-[0.70rem] uppercase tracking-widest text-on-surface-variant">
            {bottom?.copyright || "© 2024 XYN Engineering Ecosystem. All rights reserved."}
          </div>
          <div className="flex gap-8">
            {(bottom?.links || [{ label: "Privacy Policy" }, { label: "Terms of Service" }]).map((link: AnyData) => (
              <a key={link.label} className="font-['Inter'] text-[0.70rem] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href={link.url || "#"}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
