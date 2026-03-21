import { useState, useEffect } from "react"
import { BentoCard } from "../components/ui/BentoCard"
import { Button } from "../components/ui/Button"
import { PageHeader } from "../components/layout/PageHeader"
import { Link } from "react-router-dom"
import { SEO } from "../components/SEO"
import { getPageContent } from "../lib/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

export function ServiceDetail() {
  const [pageData, setPageData] = useState<AnyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const page = await getPageContent("service-detail")
        setPageData(page)
      } catch (err) {
        console.error("Failed to load service detail data:", err)
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
  const security = pageData.security || {}
  const memory = pageData.memory || {}
  const routing = pageData.routing || {}
  const stress = pageData.stress || {}
  const habitsData = pageData.habits || {}
  const cta = pageData.cta || {}

  // habits may be wrapped in { items: [...] } from the API
  const habits = Array.isArray(habitsData) ? habitsData : (habitsData.items || [])

  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <SEO title="Service Architecture Details" />
      <PageHeader
        label={hero.label}
        headline={hero.title}
        description={hero.description}
      >
        <div className="flex justify-start md:justify-end w-full mt-6">
          <Link to="/services">
            <Button variant="secondary" className="px-6 py-3 tracking-widest text-[0.6875rem] border-outline-variant/30 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined mr-2 text-[1.125rem]">arrow_back</span>
              BACK TO SERVICES
            </Button>
          </Link>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Zero-Trust Security */}
        <BentoCard className="md:col-span-12 lg:col-span-8 bg-surface-container p-5 md:p-10 md:p-14 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
          <div className="relative z-10">
            <span className="material-symbols-outlined text-primary text-xl md:text-3xl md:text-5xl mb-8">{security.icon}</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-primary mb-6">{security.title}</h2>
            <p className="text-on-surface-variant text-lg max-w-md">
              {security.description}
            </p>
          </div>
          <div className="mt-12 space-y-4 relative z-10">
            {security.modules?.map((module: AnyData) => (
              <div key={module.name} className="bg-surface-container-high rounded-2xl p-6 flex items-center justify-between">
                <span className="font-mono text-sm tracking-tight text-on-surface">{module.name}</span>
                <div className={`h-2 w-2 rounded-full bg-primary ${module.status === 'active' ? 'shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'opacity-40'}`}></div>
              </div>
            ))}
          </div>
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAL23geyY29g3b-QhWszXseA5vj7Dh4rrf4vgHG7_EbyTNomJn6-Vs1IbtnTywSejJNtRXCKMzqTTbuQJC1z2hz3gounOLv5Wys-tHRFK3dbZpeD71afbnTi391DySbpe8eAZu_imJZ6UgU4h0je6HpUXb2xDwujbeFOiomPW8FRnV7mzgEDPwLl9LfkMWp-lmWrMGqkqrHxSpjQjWmJWyBlMM-nXJmkAFnNydW3obW7GOU0tOyLhJdn-1YQwLCYs9sbxadXMXNZWI')", backgroundSize: 'cover', maskImage: 'linear-gradient(to left, black, transparent)' }}>
          </div>
        </BentoCard>

        {/* Memory Safety */}
        <BentoCard className="md:col-span-12 lg:col-span-4 bg-surface-container p-5 md:p-10 flex flex-col justify-between">
          <div>
            <span className="material-symbols-outlined text-primary text-2xl md:text-4xl mb-6">{memory.icon}</span>
            <h3 className="text-2xl font-bold tracking-tight text-primary mb-4">{memory.title}</h3>
            <p className="text-on-surface-variant leading-relaxed">
              {memory.description}
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-outline-variant/20">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <span>{memory.metrics?.[0]?.label}</span>
                <span>{memory.metrics?.[0]?.value}</span>
              </div>
              <div className="w-full bg-surface-container-lowest h-1 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-full"></div>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Deterministic Routing */}
        <BentoCard className="md:col-span-12 lg:col-span-4 bg-surface-container p-5 md:p-10 flex flex-col border border-outline-variant/10">
          <span className="material-symbols-outlined text-primary text-2xl md:text-4xl mb-6">{routing.icon}</span>
          <h3 className="text-2xl font-bold tracking-tight text-primary mb-4">{routing.title}</h3>
          <p className="text-on-surface-variant leading-relaxed">
            {routing.description}
          </p>
        </BentoCard>

        {/* Proven by Stress */}
        <BentoCard className="md:col-span-12 lg:col-span-8 bg-surface-container p-5 md:p-10 md:p-14 flex flex-col justify-center overflow-hidden relative border border-outline-variant/10">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl md:text-6xl font-extrabold tracking-tighter text-primary leading-none">
              {stress.titlePrefix}<br/>{stress.titleHighlight}
            </h2>
            <p className="mt-8 text-on-surface-variant font-medium text-lg max-w-lg">
              {stress.description}
            </p>
          </div>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        </BentoCard>

        {/* Habits Grid */}
        {habits.map((habit: AnyData) => (
          <BentoCard key={habit.id} className="md:col-span-4 bg-surface-container p-5 md:p-8 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-on-surface-variant">{habit.label}</span>
            <p className="text-xl font-bold text-primary">{habit.title}</p>
            <p className="text-sm text-on-surface-variant">{habit.description}</p>
          </BentoCard>
        ))}

        {/* Ready for Scale CTA */}
        <BentoCard className="md:col-span-12 mt-20 bg-surface-container p-5 md:p-10 md:p-14 border border-outline-variant/10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
            <div className="max-w-xl">
              <h2 className="text-xl md:text-3xl md:text-5xl font-bold tracking-tighter text-primary mb-8">{cta.title}</h2>
              <p className="text-on-surface-variant text-lg">
                {cta.description}
              </p>
            </div>
            <Button className="px-10 py-5 font-bold text-lg hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-3 shrink-0 normal-case tracking-normal">
              {cta.buttonText}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Button>
          </div>
        </BentoCard>

      </div>
    </main>
  )
}
