import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { cn } from "../lib/utils"
import { BentoCard } from "../components/ui/BentoCard"
import { Button } from "../components/ui/Button"
import { PageHeader } from "../components/layout/PageHeader"
import { SectionHeader } from "../components/layout/SectionHeader"
import { SEO } from "../components/SEO"
import { getPageContent, getTeam } from "../lib/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

// Auto bento grid span patterns for variable-count ethos items
const ETHOS_SPANS: Record<number, string[]> = {
  1: ["md:col-span-12"],
  2: ["md:col-span-6", "md:col-span-6"],
  3: ["md:col-span-8", "md:col-span-4", "md:col-span-12"],
  4: ["md:col-span-8", "md:col-span-4", "md:col-span-4", "md:col-span-8"],
  5: ["md:col-span-8", "md:col-span-4", "md:col-span-4", "md:col-span-4", "md:col-span-4"],
  6: ["md:col-span-8", "md:col-span-4", "md:col-span-4", "md:col-span-4", "md:col-span-4", "md:col-span-12"],
}
const ETHOS_BGS = [
  "", "bg-surface-container-low", "", "bg-surface-container-low", "", "bg-surface-container-low",
]

function getEthosSpan(total: number, index: number): string {
  const pattern = ETHOS_SPANS[total]
  if (pattern) return pattern[index] || "md:col-span-4"
  // For 7+ items, alternate 8/4 pattern
  return index % 3 === 0 ? "md:col-span-8" : "md:col-span-4"
}

// Social media icon mapping
function getSocialIcon(platform: string): string {
  const p = platform.toLowerCase()
  if (p.includes("linkedin")) return "LinkedIn"
  if (p.includes("twitter") || p.includes("x.com")) return "𝕏"
  if (p.includes("github")) return "GitHub"
  if (p.includes("instagram")) return "IG"
  if (p.includes("facebook")) return "FB"
  if (p.includes("dribbble")) return "Dr"
  if (p.includes("behance")) return "Be"
  return platform.slice(0, 2).toUpperCase()
}

function getSocialLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace("www.", "")
    if (host.includes("linkedin")) return "linkedin"
    if (host.includes("twitter") || host.includes("x.com")) return "x"
    if (host.includes("github")) return "github"
    if (host.includes("instagram")) return "instagram"
    if (host.includes("facebook")) return "facebook"
    return host.split(".")[0]
  } catch {
    return "link"
  }
}

export function About() {
  const [pageData, setPageData] = useState<AnyData | null>(null)
  const [teamData, setTeamData] = useState<AnyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tenetsPage, setTenetsPage] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const [page, team] = await Promise.all([
          getPageContent("about"),
          getTeam(),
        ])
        setPageData(page)
        setTeamData(team.data)
      } catch (err) {
        console.error("Failed to load about data:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading || !pageData) {
    return (
      <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto flex items-center justify-center min-h-screen">
        <div className="text-on-surface-variant text-sm uppercase tracking-widest animate-pulse">Loading...</div>
      </main>
    )
  }

  const hero = pageData.hero || {}
  const timeline = pageData.timeline || {}
  const tenets = pageData.tenets || {}
  const culture = pageData.culture || {}
  const leadership = pageData.leadership || {}
  const ctaData = pageData.cta || {}
  const contact = pageData.contact || {}

  // Convert team API response (grouped object) to array format
  const teams = teamData
    ? Object.entries(teamData).map(([group, members], idx) => ({
        id: idx + 1,
        group,
        members: members as AnyData[],
      }))
    : leadership.teams || []

  // Milestones from CMS
  const milestones = timeline.milestones || []

  // Tenets pagination (3 per page)
  const tenetsItems = tenets.items || []
  const TENETS_PER_PAGE = 3
  const totalTenetsPages = Math.ceil(tenetsItems.length / TENETS_PER_PAGE)
  const visibleTenets = tenetsItems.slice(
    tenetsPage * TENETS_PER_PAGE,
    (tenetsPage + 1) * TENETS_PER_PAGE
  )

  // Culture/ethos items
  const cultureItems = culture.items || []

  // CTA URL
  const ctaUrl = ctaData.buttonUrl || "/services"
  const ctaIsExternal = ctaUrl.startsWith("http")

  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <SEO title="About Us" description="Architecting the invisible layer between human intent and machine execution." />

      {/* Hero Section */}
      <PageHeader
        label={hero.label}
        headline={hero.headline}
        description={hero.description}
      />

      {/* Story Section: Bento Timeline — dynamic milestones */}
      <section className="mb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {milestones.map((m: AnyData, i: number) => {
            const isEven = i % 2 === 0
            return (
              <div key={m.id || i} className={cn("contents")}>
                {/* Image card (8 cols) + Text card (4 cols), alternating left/right */}
                <BentoCard className={cn(
                  "md:col-span-8 h-[400px] p-0 relative group !rounded-[3rem]",
                  !isEven && "md:order-2"
                )}>
                  {m.image && (
                    <img
                      alt={m.title || `Milestone ${i + 1}`}
                      className="w-full h-full object-cover grayscale opacity-50 transition-transform duration-700 group-hover:scale-105"
                      src={m.image}
                    />
                  )}
                  <div className={cn(
                    "absolute inset-0",
                    isEven ? "bg-gradient-to-t from-surface to-transparent opacity-60" : "bg-gradient-to-r from-surface to-transparent opacity-80"
                  )} />
                  <div className="absolute bottom-12 left-12">
                    <span className="label-sm text-primary tracking-widest">{m.label || `PHASE ${String(i + 1).padStart(2, "0")}`}</span>
                    <h3 className="text-xl md:text-3xl font-bold tracking-tight text-primary mt-2">{m.title}</h3>
                  </div>
                </BentoCard>

                <BentoCard className={cn(
                  "md:col-span-4 flex flex-col justify-center !rounded-[3rem] p-5 md:p-10",
                  !isEven && "md:order-1 bg-surface-container-low"
                )}>
                  <span className="text-2xl md:text-4xl font-black text-outline/20 mb-4">{m.id}</span>
                  <h4 className="text-xl font-bold text-primary mb-4">{m.title}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{m.description}</p>
                </BentoCard>
              </div>
            )
          })}
        </div>
      </section>

      {/* Core Tenets Section — with carousel pagination */}
      <section className="mb-32">
        <SectionHeader title={tenets.title} label={tenets.label} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleTenets.map((item: AnyData) => (
            <BentoCard key={item.id || item.title} className="bg-surface-container-low hover:bg-surface-container transition-colors duration-300 !rounded-[3rem] p-5 md:p-10 flex flex-col">
              <div className="w-12 h-12 bg-surface-container-high rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4 uppercase tracking-tight">{item.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{item.description}</p>
            </BentoCard>
          ))}
        </div>
        {/* Pagination controls */}
        {totalTenetsPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setTenetsPage(p => Math.max(0, p - 1))}
              disabled={tenetsPage === 0}
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary disabled:opacity-30 transition-opacity hover:bg-surface-container-highest"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalTenetsPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTenetsPage(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === tenetsPage ? "bg-primary w-6" : "bg-outline/30"
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => setTenetsPage(p => Math.min(totalTenetsPages - 1, p + 1))}
              disabled={tenetsPage === totalTenetsPages - 1}
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary disabled:opacity-30 transition-opacity hover:bg-surface-container-highest"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        )}
      </section>

      {/* Engineering Ethos Section — auto bento layout */}
      <section className="mb-32">
        <SectionHeader title={culture.title} label={culture.label} />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {cultureItems.map((item: AnyData, idx: number) => {
            const spanClass = item.span || getEthosSpan(cultureItems.length, idx)
            const bgClass = item.bg || ETHOS_BGS[idx % ETHOS_BGS.length]
            return (
              <BentoCard key={item.id || item.title} className={cn(spanClass, bgClass, "!rounded-[3rem] p-5 md:p-10 md:p-12 flex flex-col justify-center")}>
                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-primary mb-4 uppercase tracking-tighter">{item.title}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg">{item.description}</p>
                </div>
                {item.iconbg && (
                  <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[12rem] text-primary/5 group-hover:text-primary/10 transition-colors duration-500">{item.iconbg}</span>
                )}
              </BentoCard>
            )
          })}
        </div>
      </section>

      {/* Core Leadership Section — with social media links */}
      <section className="mb-32">
        <SectionHeader title={leadership.title} label={leadership.label} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {teams.map((team: AnyData) => (
            <div key={team.id}>
              <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-outline mb-8">{team.group}</h3>
              <div className="space-y-4">
                {team.members?.map((member: AnyData) => {
                  const socials: AnyData[] = member.social_links || []
                  return (
                    <div key={member.id} className="flex items-center gap-6 p-6 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-all">
                      <div className="w-16 h-16 rounded-full overflow-hidden grayscale bg-surface-bright shrink-0">
                        {(member.image_url || member.image) ? (
                          <img alt={member.name} className="w-full h-full object-cover" src={member.image_url || member.image} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl font-bold text-outline">
                            {member.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-primary tracking-tight">{member.name}</div>
                        <div className="text-[10px] uppercase font-bold text-outline tracking-widest">{member.role}</div>
                      </div>
                      {socials.length > 0 && (
                        <div className="flex gap-2 shrink-0">
                          {socials.map((s: AnyData, si: number) => (
                            <a
                              key={si}
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-[9px] font-bold text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors"
                              title={getSocialLabel(s.url)}
                            >
                              {getSocialIcon(s.url)}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section — with dynamic URL */}
      <section className="mb-32">
        <BentoCard className="bg-surface-container-high border border-outline-variant/30 p-16 flex flex-col md:flex-row items-center justify-between gap-12 !rounded-[3rem]">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl md:text-4xl md:text-5xl font-black tracking-tighter leading-none mb-6">{ctaData.headline}</h2>
            <p className="text-on-surface-variant font-medium">{ctaData.description}</p>
          </div>
          {ctaIsExternal ? (
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
              <Button className="px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity whitespace-nowrap">
                {ctaData.buttonText}
              </Button>
            </a>
          ) : (
            <Link to={ctaUrl}>
              <Button className="px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity whitespace-nowrap">
                {ctaData.buttonText}
              </Button>
            </Link>
          )}
        </BentoCard>
      </section>

      {/* Contact & Global Locations Section */}
      <section className="mb-32">
        <SectionHeader title={contact.title} label={contact.label} />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <BentoCard className="md:col-span-4 bg-surface-container-low !rounded-[3rem] p-5 md:p-10 flex flex-col">
            <h4 className="text-xs font-bold text-outline uppercase tracking-widest mb-6">The Hub</h4>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-primary tracking-tighter mb-2">{contact.hq?.city}</p>
              <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">{contact.hq?.address}</p>
            </div>
          </BentoCard>

          {/* Map card — clickable if URL provided */}
          {contact.map?.url ? (
            <a href={contact.map.url} target="_blank" rel="noopener noreferrer" className="md:col-span-8 block">
              <BentoCard className="h-[350px] p-0 relative !rounded-[3rem] bg-surface-container overflow-hidden cursor-pointer group">
                <div className="absolute inset-0 opacity-20 grayscale scale-110 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="200" cy="150" fill="white" r="2" />
                    <circle cx="500" cy="200" fill="white" r="4" />
                    <circle cx="800" cy="300" fill="white" r="2" />
                    <path d="M200 150 L500 200 L800 300" fill="none" stroke="white" strokeDasharray="4" strokeWidth="0.5" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12">
                  <span className="label-sm text-outline tracking-[0.5em] block mb-4">{contact.map.label}</span>
                  <h4 className="text-xl md:text-3xl font-bold text-primary tracking-tighter">{contact.map.text}</h4>
                  <span className="material-symbols-outlined text-primary mt-4 opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                </div>
              </BentoCard>
            </a>
          ) : (
            <BentoCard className="md:col-span-8 h-[350px] p-0 relative !rounded-[3rem] bg-surface-container overflow-hidden">
              <div className="absolute inset-0 opacity-20 grayscale scale-110 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="200" cy="150" fill="white" r="2" />
                  <circle cx="500" cy="200" fill="white" r="4" />
                  <circle cx="800" cy="300" fill="white" r="2" />
                  <path d="M200 150 L500 200 L800 300" fill="none" stroke="white" strokeDasharray="4" strokeWidth="0.5" />
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
                <div className="text-center">
                  <span className="label-sm text-outline tracking-[0.5em] block mb-4">{contact.map?.label}</span>
                  <h4 className="text-xl md:text-3xl font-bold text-primary tracking-tighter">{contact.map?.text}</h4>
                </div>
              </div>
            </BentoCard>
          )}

          {/* Contact channels — clickable if URL provided */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {contact.channels?.map((ch: AnyData) => {
              const inner = (
                <>
                  <span className="material-symbols-outlined text-outline">{ch.icon}</span>
                  <span className="font-bold text-sm tracking-tight">{ch.text}</span>
                  {ch.url && <span className="material-symbols-outlined text-outline/40 text-sm ml-auto">open_in_new</span>}
                </>
              )
              if (ch.url) {
                return (
                  <a key={ch.id || ch.text} href={ch.url} target="_blank" rel="noopener noreferrer">
                    <BentoCard className="!rounded-[2rem] bg-surface-container-lowest border border-outline-variant/20 p-5 md:p-8 flex flex-row items-center gap-4 hover:border-outline-variant/40 transition-colors">
                      {inner}
                    </BentoCard>
                  </a>
                )
              }
              return (
                <BentoCard key={ch.id || ch.text} className="!rounded-[2rem] bg-surface-container-lowest border border-outline-variant/20 p-5 md:p-8 flex flex-row items-center gap-4">
                  {inner}
                </BentoCard>
              )
            })}
          </div>
        </div>
      </section>

    </main>
  )
}
