import { useState, useEffect } from "react"
import { BentoCard } from "../components/ui/BentoCard"
import { Button } from "../components/ui/Button"
import { PageHeader } from "../components/layout/PageHeader"
import { Link } from "react-router-dom"
import { SEO } from "../components/SEO"
import { getPageContent, getServices } from "../lib/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

export function Services() {
  const [pageData, setPageData] = useState<AnyData | null>(null)
  const [services, setServices] = useState<AnyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [page, servicesRes] = await Promise.all([
          getPageContent("services"),
          getServices(),
        ])
        setPageData(page)
        setServices(servicesRes.data || [])
      } catch (err) {
        console.error("Failed to load services data:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto flex items-center justify-center min-h-screen">
        <div className="text-on-surface-variant text-sm uppercase tracking-widest animate-pulse">Loading...</div>
      </main>
    )
  }

  const hero = pageData?.hero || {}
  const cta = pageData?.cta || {}

  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <SEO title="Platform Services" description="High performance compute and application architectures." />
      <PageHeader
        label={hero.label}
        headline={hero.headline}
      >
        <div className="flex flex-col md:items-end w-full">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {hero.status?.text}
            </span>
          </div>
        </div>
      </PageHeader>

      <div className="space-y-6">
        {services.map((service, index) => {
          const isEven = index % 2 === 0
          const metrics = service.metrics || []
          const tooling = service.tooling || []

          const mainCard = (
            <Link
              to={`/services/${service.slug}`}
              className="md:col-span-8 group"
            >
              <BentoCard className="p-5 md:p-10 lg:p-14 min-h-[400px] h-full hover:border-primary/30 transition-colors">
                <div className="h-full flex flex-col relative z-10">
                  <div className="flex items-start justify-between mb-12">
                    <div>
                      {service.icon && (
                        <span className="material-symbols-outlined text-2xl md:text-4xl text-primary mb-4">{service.icon}</span>
                      )}
                      <h2 className="text-xl md:text-3xl font-bold tracking-tight text-primary">{service.title}</h2>
                    </div>
                    {service.number && (
                      <div className="text-right">
                        <span className="text-xl md:text-5xl font-black text-on-surface-variant/20 tracking-tighter">{service.number}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-on-surface-variant max-w-lg mb-12 leading-relaxed text-lg">
                    {service.short_description || service.description}
                  </p>
                  {metrics.length > 0 && (
                    <div className="mt-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {metrics.map((metric: AnyData) => (
                        <div key={metric.label} className="p-5 rounded-2xl bg-surface-container-low flex flex-col gap-1">
                          <span className="label-sm text-outline uppercase tracking-widest text-[10px]">{metric.label}</span>
                          <span className="text-xl font-bold text-primary tracking-tight">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {!metrics.length && tooling.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-3">
                      {tooling.map((tech: string | AnyData) => {
                        const name = typeof tech === "string" ? tech : tech.name
                        return (
                          <span key={name} className="px-5 py-2.5 rounded-xl border border-outline-variant/30 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            {name}
                          </span>
                        )
                      })}
                    </div>
                  )}
                  {!metrics.length && !tooling.length && (
                    <div className="mt-auto flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                      Learn More
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            </Link>
          )

          const sideCard = (
            <Link
              to={`/services/${service.slug}`}
              className="md:col-span-4 group"
            >
              <BentoCard className="p-5 md:p-8 lg:p-10 min-h-[400px] h-full bg-surface-container-high hover:border-primary/30 transition-colors overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  {service.icon && (
                    <span className="material-symbols-outlined text-[8rem]">{service.icon}</span>
                  )}
                </div>
                <div className="h-full flex flex-col justify-between relative z-10">
                  <div>
                    {service.image_url && (
                      <div className="w-full h-40 rounded-xl overflow-hidden mb-6">
                        <img src={service.image_url} alt={service.title} className="w-full h-full object-cover opacity-60 mix-blend-luminosity" />
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-primary mb-3">{service.title}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-4">
                      {service.short_description || service.description}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                    Explore
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </div>
                </div>
              </BentoCard>
            </Link>
          )

          return (
            <div key={service.id || service.slug} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {isEven ? <>{mainCard}{sideCard}</> : <>{sideCard}{mainCard}</>}
            </div>
          )
        })}

        {/* Call to Action */}
        {cta.title && (
          <BentoCard className="flex flex-col md:flex-row items-center justify-between gap-12 bg-surface-container p-6 md:p-12 lg:p-16">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-2xl md:text-4xl md:text-5xl font-extrabold tracking-tighter text-primary mb-4">{cta.title}</h2>
              <p className="text-on-surface-variant text-lg font-medium">{cta.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {cta.buttons?.map((btn: AnyData, i: number) => {
                const url = btn.url || "/services"
                const isExternal = url.startsWith("http")
                if (isExternal) {
                  return (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                      <Button variant={btn.variant as "primary" | "secondary"} className="px-10 py-4 font-bold tracking-widest text-sm w-full sm:w-auto">
                        {btn.text}
                      </Button>
                    </a>
                  )
                }
                return (
                  <Link key={i} to={url}>
                    <Button variant={btn.variant as "primary" | "secondary"} className="px-10 py-4 font-bold tracking-widest text-sm w-full sm:w-auto">
                      {btn.text}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </BentoCard>
        )}
      </div>
    </main>
  )
}
