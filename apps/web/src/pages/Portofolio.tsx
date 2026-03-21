import { useState, useEffect } from "react"
import { BentoCard } from "../components/ui/BentoCard"
import { Button } from "../components/ui/Button"
import { PageHeader } from "../components/layout/PageHeader"
import { SEO } from "../components/SEO"
import { Link } from "react-router-dom"
import { getPageContent, getPortfolios } from "../lib/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

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
        setProjects(portfoliosRes.data)
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

  // features may be an object with items array
  const featureItems = Array.isArray(features) ? features : (features.items || [])

  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <SEO title="Engineering Portfolio" description="Showcasing high-density technical solutions deployed globally." />
      {/* Technical Identity Header */}
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

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Featured Project: Large Bento */}
        {projects[0] && (
          <BentoCard className="md:col-span-8 bg-surface-container p-5 md:p-8 md:p-12 flex flex-col justify-between min-h-[500px] group">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,255,255,0.5)]"></span>
                  <span className="label-sm text-primary tracking-widest uppercase font-bold text-[10px]">{projects[0].tag}</span>
                </div>
                <h2 className="text-2xl md:text-4xl md:text-5xl font-bold tracking-tight text-primary">{projects[0].title}</h2>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-primary font-bold text-2xl">{projects[0].metric?.value}</span>
                  <span className="text-outline text-[10px] uppercase font-bold tracking-widest">{projects[0].metric?.label}</span>
                </div>
              </div>
            </div>
            <div className="my-12 overflow-hidden rounded-lg bg-surface-container-low aspect-video relative">
              <img alt="Project visualization" className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" src={projects[0].image} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent opacity-60"></div>
            </div>
            <div className="flex flex-wrap justify-between items-end gap-6">
              <div className="flex gap-4">
                <div className="flex flex-col bg-surface-container-high rounded-lg p-4 min-w-[120px]">
                  <span className="material-symbols-outlined text-primary mb-2">{projects[0].tech1?.icon}</span>
                  <span className="text-primary font-bold">{projects[0].tech1?.lang}</span>
                  <span className="text-outline text-[10px] uppercase font-bold">{projects[0].tech1?.role}</span>
                </div>
                <div className="flex flex-col bg-surface-container-high rounded-lg p-4 min-w-[120px]">
                  <span className="material-symbols-outlined text-primary mb-2">{projects[0].tech2?.icon}</span>
                  <span className="text-primary font-bold">{projects[0].tech2?.lang}</span>
                  <span className="text-outline text-[10px] uppercase font-bold">{projects[0].tech2?.role}</span>
                </div>
              </div>
              <Link to={`/portofolio/${projects[0].slug}`}>
                <Button className="bg-primary text-on-primary rounded-full px-8 py-4 font-bold text-sm tracking-tight flex items-center gap-3 transition-opacity hover:opacity-90">
                  {projects[0].action || "Deep Dive"} <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </Button>
              </Link>
            </div>
          </BentoCard>
        )}

        {/* Stats Card: Medium Bento */}
        <BentoCard className="md:col-span-4 bg-surface-container p-5 md:p-8 flex flex-col gap-8">
          <div className="space-y-1">
            <span className="label-sm text-outline tracking-widest uppercase font-bold text-[10px]">{proficiency.label}</span>
            <h3 className="text-2xl font-bold text-primary">{proficiency.title}</h3>
          </div>
          <div className="space-y-6">
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
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-outline uppercase tracking-widest">Network Topology</span><span className="text-[10px] font-bold text-primary uppercase">Optimized</span></div>
            <div className="grid grid-cols-6 gap-1 h-12">
              <div className="bg-primary/20 rounded-sm h-4 self-end"></div>
              <div className="bg-primary/40 rounded-sm h-8 self-end"></div>
              <div className="bg-primary rounded-sm h-12 self-end"></div>
              <div className="bg-primary/60 rounded-sm h-10 self-end"></div>
              <div className="bg-primary/30 rounded-sm h-6 self-end"></div>
              <div className="bg-primary/50 rounded-sm h-9 self-end"></div>
            </div>
            <p className="text-[10px] text-outline leading-tight italic">{proficiency.topology?.desc}</p>
          </div>
          <div className="mt-auto bg-surface-container-low rounded-lg p-6 flex flex-col gap-4 border border-outline-variant/10">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{proficiency.footer?.icon}</span>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              {proficiency.footer?.text}<span className="text-primary font-bold">{proficiency.footer?.highlight}</span>{proficiency.footer?.text2}
            </p>
          </div>
        </BentoCard>

        {/* Project 2: Square Bento */}
        {projects[1] && (
          <BentoCard className="md:col-span-6 lg:col-span-4 bg-surface-container p-5 md:p-8 flex flex-col justify-between min-h-[400px]">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="material-symbols-outlined text-outline">hub</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase">{projects[1].tag}</span>
              </div>
              <h3 className="text-xl md:text-3xl font-bold tracking-tight text-primary leading-none">{projects[1].title}</h3>
              <p className="text-on-surface-variant text-sm">{projects[1].description}</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 py-3 border-b border-outline-variant/10">
                <span className="text-xs font-bold text-outline w-16">STACK</span>
                <div className="flex gap-2">
                  {projects[1].stack?.map((s: string) => (
                    <span key={s} className="text-[10px] bg-surface-container-high px-2 py-0.5 rounded text-primary">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 py-3">
                <span className="text-xs font-bold text-outline w-16">MEMORY</span>
                <span className="text-xs font-bold text-primary">{projects[1].memory}</span>
              </div>
            </div>
          </BentoCard>
        )}

        {/* Project 3: Wide Bento */}
        {projects[2] && (
          <BentoCard className="md:col-span-6 lg:col-span-8 bg-surface-container p-5 md:p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 space-y-6">
              <div className="space-y-2">
                <span className="label-sm text-outline tracking-widest uppercase font-bold text-[10px]">{projects[2].tag}</span>
                <h3 className="text-xl md:text-3xl font-bold tracking-tight text-primary leading-none">{projects[2].title}</h3>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {projects[2].description}
              </p>
              <div className="flex gap-6">
                {projects[2].metrics?.map((m: AnyData) => (
                  <div key={m.label} className="flex flex-col">
                    <span className="text-xl font-bold text-primary">{m.value}</span>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-widest">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 h-full min-h-[250px] bg-surface-container-low rounded-lg overflow-hidden relative">
              <img alt="Visualization Dashboard" className="w-full h-full object-cover grayscale" src={projects[2].image} />
              <div className="absolute inset-0 bg-primary/5 hover:bg-transparent transition-colors"></div>
            </div>
          </BentoCard>
        )}

        {/* Detail Grid */}
        {featureItems.map((f: AnyData) => (
          <BentoCard key={f.id} className="md:col-span-4 bg-surface-container p-6 flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">{f.icon}</span>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-primary leading-tight">{f.title}</h4>
              <p className="text-xs text-outline font-medium">{f.description}</p>
            </div>
          </BentoCard>
        ))}

        {/* Contact Section */}
        <BentoCard className="md:col-span-12 mt-20 mb-20 bg-surface-container p-6 md:p-12 md:p-20 text-center border border-outline-variant/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-5 md:p-8 opacity-10">
            <span className="material-symbols-outlined text-9xl">deployed_code</span>
          </div>
          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <div className="space-y-4">
              <span className="label-sm text-outline tracking-[0.4em] uppercase font-bold text-[10px]">{contact.label}</span>
              <h2 className="text-2xl md:text-4xl md:text-6xl font-extrabold tracking-tighter text-primary">{contact.title}</h2>
              <p className="text-on-surface-variant text-lg">{contact.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <a className="w-full sm:w-auto bg-primary text-on-primary rounded-full px-10 py-5 font-bold text-sm tracking-tight flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-xl shadow-primary/10" href="mailto:hello@xyn.system">
                {contact.actionPrimary} <span className="material-symbols-outlined">terminal</span>
              </a>
              <div className="flex gap-2 w-full sm:w-auto">
                {contact.links?.map((link: string) => (
                  <a key={link} className="flex-1 sm:flex-none px-8 py-5 bg-surface-container-high rounded-full text-[10px] font-bold text-primary uppercase tracking-widest border border-outline-variant/10 hover:bg-surface-bright transition-colors" href="#">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </BentoCard>

      </div>
    </main>
  )
}
