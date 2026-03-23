import { useState, useEffect } from "react"
import { BentoCard } from "../components/ui/BentoCard"
import { Button } from "../components/ui/Button"
import { PageHeader } from "../components/layout/PageHeader"
import { SEO } from "../components/SEO"
import { Link } from "react-router-dom"
import { getPageContent, getPortfolios } from "../lib/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

// Smart bento layout that adapts to total project count
// Handles remainder items gracefully (no empty gaps)
function buildBentoRows(projects: AnyData[]) {
  const PATTERNS = [
    [7, 5],
    [5, 7],
    [6, 6],
  ]
  const rows: { projects: AnyData[]; spans: number[] }[] = []
  let idx = 0
  let patternIdx = 0

  while (idx < projects.length) {
    const remaining = projects.length - idx
    if (remaining === 1) {
      // Last item alone → full width
      rows.push({ projects: [projects[idx]], spans: [12] })
      idx++
    } else if (remaining === 3) {
      // 3 remaining → 4+4+4 even split
      rows.push({ projects: projects.slice(idx, idx + 3), spans: [4, 4, 4] })
      idx += 3
    } else {
      // Normal 2-col pattern
      const pattern = PATTERNS[patternIdx % PATTERNS.length]
      rows.push({ projects: projects.slice(idx, idx + 2), spans: pattern })
      idx += 2
      patternIdx++
    }
  }
  return rows
}

export function Portofolio() {
  const [pageData, setPageData] = useState<AnyData | null>(null)
  const [projects, setProjects] = useState<AnyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [page, portfoliosRes] = await Promise.all([
          getPageContent("portofolio"),
          getPortfolios(),
        ])
        setPageData(page)
        const raw = Array.isArray(portfoliosRes.data) ? portfoliosRes.data : []
        setProjects(raw)
      } catch (err) {
        console.error("Failed to load portfolio data:", err)
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

  const header = pageData.header || {}
  const proficiency = pageData.proficiency || {}
  const features = pageData.features || {}
  const contact = pageData.contact || {}

  const featureItems = Array.isArray(features) ? features : (features.items || [])

  const rows = buildBentoRows(projects)

  // Map numeric span to Tailwind class (JIT can't generate dynamic `col-span-${n}`)
  const colSpanClass: Record<number, string> = {
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    7: "md:col-span-7",
    8: "md:col-span-8",
    12: "md:col-span-12",
  }

  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <SEO title="Engineering Portfolio" description="Showcasing high-density technical solutions deployed globally." />
      <PageHeader
        label={header.label}
        headline={<>{header.titlePrefix}<span className="text-outline">{header.titleSuffix}</span></>}
      >
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            {header.stats?.map((stat: string) => (
              <span key={stat} className="px-3 py-1 rounded-full bg-surface-container-high text-primary text-[10px] font-bold tracking-widest uppercase">
                {stat}
              </span>
            ))}
          </div>
          <p className="text-on-surface-variant text-sm font-medium max-w-xs text-right leading-relaxed">
            {header.description}
          </p>
        </div>
      </PageHeader>

      <div className="space-y-6">
        {/* Dynamic portfolio rows */}
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {row.projects.map((project, colIdx) => {
              const span = row.spans[colIdx] || 6
              const isWide = span >= 7
              const metrics = Array.isArray(project.metrics) ? project.metrics : (project.metrics?.items || [])
              const techStack = project.tech_stack || {}

              return (
                <Link
                  key={project.id || project.slug}
                  to={`/portofolio/${project.slug}`}
                  className={`${colSpanClass[span] || "md:col-span-6"} group block`}
                >
                  <BentoCard className="bento-card-interactive p-5 md:p-8 lg:p-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,255,255,0.3)]"></span>
                            <span className="label-sm text-primary tracking-widest uppercase font-bold text-[10px]">{project.tag}</span>
                          </div>
                          <h2 className={`font-bold tracking-tight text-primary ${isWide ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"}`}>
                            {project.title}
                          </h2>
                        </div>
                        {project.number && (
                          <span className="text-xl md:text-3xl font-black text-on-surface-variant/15 tracking-tighter">{project.number}</span>
                        )}
                      </div>

                      {project.image_url && isWide && (
                        <div className="mb-8 overflow-hidden rounded-lg bg-surface-container-low aspect-video relative">
                          <img alt={project.title} className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" src={project.image_url} />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent opacity-60"></div>
                        </div>
                      )}

                      <p className="text-on-surface-variant text-sm leading-relaxed mb-6 line-clamp-3">
                        {project.short_description || project.description}
                      </p>
                    </div>

                    <div className="mt-auto">
                      {/* Tech stack pills */}
                      {techStack.stack && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {(Array.isArray(techStack.stack) ? techStack.stack : []).map((s: string) => (
                            <span key={s} className="text-[10px] bg-surface-container-high px-3 py-1 rounded-full text-primary font-bold uppercase tracking-widest">{s}</span>
                          ))}
                        </div>
                      )}

                      {/* Metrics */}
                      {metrics.length > 0 && (
                        <div className="flex flex-wrap gap-6 mb-6">
                          {metrics.slice(0, isWide ? 4 : 3).map((m: AnyData, i: number) => (
                            <div key={i} className="flex flex-col">
                              <span className="text-lg font-bold text-primary">{m.value}</span>
                              <span className="text-[10px] font-bold text-outline uppercase tracking-widest">{m.label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                        View Case Study
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </div>
                    </div>
                  </BentoCard>
                </Link>
              )
            })}
          </div>
        ))}

        {/* Proficiency Stats */}
        {proficiency.title && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <BentoCard className="md:col-span-8 p-5 md:p-10 lg:p-12">
              <div className="space-y-1 mb-8">
                <span className="label-sm text-outline tracking-widest uppercase font-bold text-[10px]">{proficiency.label}</span>
                <h3 className="text-2xl font-bold text-primary">{proficiency.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {proficiency.skills?.map((skill: AnyData) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span>{skill.name}</span>
                      <span className="text-primary">{skill.percentage}</span>
                    </div>
                    <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: skill.percentage }}></div>
                    </div>
                  </div>
                ))}
              </div>
              {proficiency.footer && (
                <div className="mt-8 bg-surface-container-low rounded-lg p-6 flex flex-col gap-4 border border-outline-variant/10">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{proficiency.footer?.icon}</span>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    {proficiency.footer?.text}<span className="text-primary font-bold">{proficiency.footer?.highlight}</span>{proficiency.footer?.text2}
                  </p>
                </div>
              )}
            </BentoCard>

            <div className="md:col-span-4 flex flex-col gap-6">
              {featureItems.map((f: AnyData) => (
                <BentoCard key={f.id} className="p-5 md:p-6 flex items-center gap-5">
                  <div className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">{f.icon}</span>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-primary text-sm leading-tight">{f.title}</h4>
                    <p className="text-xs text-outline font-medium">{f.description}</p>
                  </div>
                </BentoCard>
              ))}
            </div>
          </div>
        )}

        {/* Contact CTA */}
        {contact.title && (
          <BentoCard className="p-6 md:p-12 lg:p-20 text-center border border-outline-variant/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-5 md:p-8 opacity-10">
              <span className="material-symbols-outlined text-9xl">deployed_code</span>
            </div>
            <div className="max-w-3xl mx-auto space-y-8 relative z-10">
              <div className="space-y-4">
                <span className="label-sm text-outline tracking-[0.4em] uppercase font-bold text-[10px]">{contact.label}</span>
                <h2 className="text-2xl md:text-4xl font-extrabold tracking-tighter text-primary">{contact.title}</h2>
                <p className="text-on-surface-variant text-lg">{contact.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                {contact.actionPrimary && (
                  <a className="w-full sm:w-auto" href="mailto:hello@xyn.system">
                    <Button size="md" className="w-full sm:w-auto flex items-center justify-center gap-3">
                      {contact.actionPrimary} <span className="material-symbols-outlined text-lg">terminal</span>
                    </Button>
                  </a>
                )}
                <div className="flex gap-2 w-full sm:w-auto">
                  {contact.links?.map((link: string) => (
                    <Button key={link} variant="secondary" size="sm" className="flex-1 sm:flex-none">
                      {link}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>
        )}
      </div>
    </main>
  )
}
