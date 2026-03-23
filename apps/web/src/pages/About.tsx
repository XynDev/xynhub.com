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

// Cycling bento pattern for ethos items:
// Every 4 items repeats: [8, 4, 4, 8] → creates alternating wide/narrow rows
// Remaining items (1-3 leftover) get handled gracefully
const CYCLE_PATTERN = ["md:col-span-8", "md:col-span-4", "md:col-span-4", "md:col-span-8"]
const CYCLE_BGS = ["", "bg-surface-container-low", "", "bg-surface-container-low"]

// For leftover items at the end that don't fill a full cycle of 4
const REMAINDER_PATTERNS: Record<number, string[]> = {
  1: ["md:col-span-12"],
  2: ["md:col-span-6", "md:col-span-6"],
  3: ["md:col-span-8", "md:col-span-4", "md:col-span-12"],
}

function getEthosSpan(total: number, index: number): string {
  const remainder = total % 4
  const fullCycles = total - remainder
  // Items within full cycles use the repeating pattern
  if (index < fullCycles) {
    return CYCLE_PATTERN[index % 4]
  }
  // Remaining items use a special layout
  const remainderIdx = index - fullCycles
  const pattern = REMAINDER_PATTERNS[remainder]
  return pattern ? pattern[remainderIdx] : "md:col-span-6"
}

function getEthosBg(index: number): string {
  return CYCLE_BGS[index % 4]
}

// Known social platforms with their SVG icons
const SOCIAL_PLATFORMS: Record<string, { label: string; icon: React.ReactNode }> = {
  linkedin: {
    label: "LinkedIn",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  instagram: {
    label: "Instagram",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z"/></svg>,
  },
  whatsapp: {
    label: "WhatsApp",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  },
  website: {
    label: "Website",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  },
  other: {
    label: "Link",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  },
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
      <section className="mb-32 space-y-6">
        {milestones.map((m: AnyData, i: number) => {
          const isEven = i % 2 === 0
          // Each milestone is its own 12-col grid row — no cross-item ordering issues
          const imageCard = (
            <BentoCard className="md:col-span-8 h-[400px] p-0 relative group !rounded-[3rem]">
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
          )
          const textCard = (
            <BentoCard className={cn(
              "md:col-span-4 flex flex-col justify-center !rounded-[3rem] p-5 md:p-10",
              !isEven && "bg-surface-container-low"
            )}>
              <span className="text-2xl md:text-4xl font-black text-outline/20 mb-4">{m.id}</span>
              <h4 className="text-xl font-bold text-primary mb-4">{m.title}</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">{m.description}</p>
            </BentoCard>
          )
          return (
            <div key={m.id || i} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {isEven ? <>{imageCard}{textCard}</> : <>{textCard}{imageCard}</>}
            </div>
          )
        })}
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
            const bgClass = item.bg || getEthosBg(idx)
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
                  const links = member.social_links || {}
                  const activeSocials = Object.entries(links).filter(
                    ([, url]) => typeof url === "string" && (url as string).length > 0
                  ) as [string, string][]
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
                      {activeSocials.length > 0 && (
                        <div className="flex gap-2 shrink-0">
                          {activeSocials.map(([platform, url]) => {
                            const info = SOCIAL_PLATFORMS[platform] || SOCIAL_PLATFORMS.other
                            return (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors"
                                title={info.label}
                              >
                                {info.icon}
                              </a>
                            )
                          })}
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
