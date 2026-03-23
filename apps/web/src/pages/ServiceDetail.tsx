import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { BentoCard } from "../components/ui/BentoCard"
import { Button } from "../components/ui/Button"
import { Link } from "react-router-dom"
import { SEO } from "../components/SEO"
import { getServiceBySlug } from "../lib/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

export function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [service, setService] = useState<AnyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!slug) return
      try {
        const res = await getServiceBySlug(slug)
        setService(res.data)
      } catch (err) {
        console.error("Failed to load service detail:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto flex items-center justify-center min-h-screen">
        <div className="text-on-surface-variant text-sm uppercase tracking-widest animate-pulse">Loading...</div>
      </main>
    )
  }

  if (!service) {
    return (
      <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Service Not Found</h1>
          <Link to="/services" className="text-sm text-primary underline">Back to Services</Link>
        </div>
      </main>
    )
  }

  const metrics = service.metrics || []
  const tooling = service.tooling || []
  const features = service.features || []

  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <SEO title={service.title} description={service.short_description || service.description} />

      {/* Hero */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        <BentoCard className="md:col-span-12 p-5 md:p-10 md:p-14 min-h-[400px] relative overflow-hidden flex flex-col justify-end">
          {service.image_url && (
            <>
              <div className="absolute inset-0 z-0">
                <img alt={service.title} className="w-full h-full object-cover opacity-40 mix-blend-luminosity" src={service.image_url} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/60 to-transparent"></div>
              </div>
            </>
          )}
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <Link to="/services" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to Services
              </Link>
              {service.number && (
                <span className="text-3xl md:text-5xl font-black text-on-surface-variant/20 tracking-tighter">{service.number}</span>
              )}
            </div>
            <div className="flex items-start gap-6 mb-6">
              {service.icon && (
                <span className="material-symbols-outlined text-3xl md:text-5xl text-primary">{service.icon}</span>
              )}
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-primary leading-tight">{service.title}</h1>
                {service.short_description && (
                  <p className="text-on-surface-variant text-lg mt-4 max-w-2xl font-medium">{service.short_description}</p>
                )}
              </div>
            </div>
          </div>
        </BentoCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Description */}
        {service.description && (
          <BentoCard className="md:col-span-8 p-5 md:p-10 md:p-14 flex flex-col justify-center">
            <h2 className="text-xl md:text-3xl font-bold tracking-tight text-primary mb-8">Overview</h2>
            <p className="text-on-surface-variant leading-relaxed text-lg">{service.description}</p>
          </BentoCard>
        )}

        {/* Metrics */}
        {metrics.length > 0 && (
          <BentoCard className={`${service.description ? "md:col-span-4" : "md:col-span-12"} p-5 md:p-10 flex flex-col justify-between`}>
            <h3 className="label-sm text-on-surface-variant font-bold uppercase tracking-widest mb-8">Key Metrics</h3>
            <div className={`grid ${service.description ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"} gap-4`}>
              {metrics.map((metric: AnyData, i: number) => (
                <div key={i} className="p-5 rounded-2xl bg-surface-container-low flex flex-col gap-1">
                  <span className="label-sm text-outline uppercase tracking-widest text-[10px]">{metric.label}</span>
                  <span className="text-xl font-bold text-primary tracking-tight">{metric.value}</span>
                </div>
              ))}
            </div>
          </BentoCard>
        )}

        {/* Tooling / Tech Stack */}
        {tooling.length > 0 && (
          <BentoCard className="md:col-span-5 bg-surface-container-high p-5 md:p-10">
            <h3 className="label-sm text-on-surface-variant font-bold uppercase tracking-widest mb-8">Tech Stack</h3>
            <ul className="space-y-4">
              {tooling.map((tech: string | AnyData, i: number) => {
                const name = typeof tech === "string" ? tech : tech.name
                return (
                  <li key={i} className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/10">
                    <span className="font-bold text-sm tracking-tight">{name}</span>
                    <span className="material-symbols-outlined text-outline">check_circle</span>
                  </li>
                )
              })}
            </ul>
          </BentoCard>
        )}

        {/* Features */}
        {features.length > 0 && (
          <BentoCard className={`${tooling.length > 0 ? "md:col-span-7" : "md:col-span-12"} p-5 md:p-10 md:p-14`}>
            <h3 className="label-sm text-on-surface-variant font-bold uppercase tracking-widest mb-8">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feat: AnyData, i: number) => (
                <div key={i}>
                  <h4 className="font-bold text-primary mb-2">{feat.title}</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </BentoCard>
        )}

        {/* CTA */}
        <BentoCard className="md:col-span-12 mt-12 bg-surface-container p-5 md:p-10 md:p-14 border border-outline-variant/10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
            <div className="max-w-xl">
              <h2 className="text-xl md:text-3xl md:text-5xl font-bold tracking-tighter text-primary mb-4">Ready to get started?</h2>
              <p className="text-on-surface-variant text-lg">
                Let us help you build with {service.title}. Get in touch with our engineering team.
              </p>
            </div>
            <Link to="/">
              <Button size="lg" className="font-bold flex items-center gap-3 shrink-0">
                Contact Us
                <span className="material-symbols-outlined">arrow_forward</span>
              </Button>
            </Link>
          </div>
        </BentoCard>
      </div>
    </main>
  )
}
