import { useState, useEffect } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import { cn } from "../lib/utils"
import { BentoCard } from "../components/ui/BentoCard"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { SEO } from "../components/SEO"
import { getPageContent, getTestimonials, getFaqs, getServices, getPortfolios, submitContact } from "../lib/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

export function Home() {
  const [pageData, setPageData] = useState<AnyData | null>(null)
  const [testimonials, setTestimonials] = useState<AnyData[]>([])
  const [faqs, setFaqs] = useState<AnyData[]>([])
  const [services, setServices] = useState<AnyData[]>([])
  const [portfolios, setPortfolios] = useState<AnyData[]>([])
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [contactSending, setContactSending] = useState(false)
  const [contactSent, setContactSent] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [page, testimonialsRes, faqsRes, servicesRes, portfoliosRes] = await Promise.all([
          getPageContent("home"),
          getTestimonials(),
          getFaqs("home"),
          getServices({ featured: "true" }),
          getPortfolios(),
        ])
        setPageData(page)
        setTestimonials(testimonialsRes.data)
        setFaqs(faqsRes.data)
        setServices(servicesRes.data?.slice(0, 3) || [])
        // Filter featured portfolios
        const featured = (portfoliosRes.data || []).filter((p: AnyData) => p.is_featured)
        setPortfolios(featured.slice(0, 4))
      } catch (err) {
        console.error("Failed to load home data:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!contactForm.name || !contactForm.email || !contactForm.message) return
    setContactSending(true)
    try {
      await submitContact(contactForm)
      setContactSent(true)
      setContactForm({ name: "", email: "", message: "" })
    } catch (err) {
      console.error("Failed to send:", err)
      alert("Failed to send message. Please try again.")
    } finally {
      setContactSending(false)
    }
  }

  if (loading || !pageData) {
    return (
      <main className="pt-32 md:pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto flex items-center justify-center min-h-screen">
        <div className="text-on-surface-variant text-sm uppercase tracking-widest animate-pulse">Loading...</div>
      </main>
    )
  }

  const hero = pageData.hero || {}
  const trust = pageData.trust || {}
  const stats = pageData.stats || {}
  const servicesSection = pageData.services || {}
  const works = pageData.works || {}
  const testimonialsSection = pageData.testimonials || {}
  const whyUs = pageData.whyUs || {}
  const cta = pageData.cta || {}
  const contactInfo = pageData.contactInfo || {}

  return (
    <main className="pt-32 md:pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <SEO title="Extended Synaptic" />

        {/* Hero Section */}
        <section className="mb-32 flex flex-col items-center text-center">
          <Badge dot>{hero.version}</Badge>
          <h1 className="text-[3.5rem] md:text-[5.5rem] font-extrabold tracking-tighter leading-[0.9] text-primary mb-8 max-w-4xl">
            {hero.headline}
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mb-12 font-medium">
            {hero.description}
          </p>
          <div className="flex gap-4">
            <Button variant="primary" className="px-10 py-4">Start Building</Button>
            <Button variant="secondary" className="px-10 py-4">Documentation</Button>
          </div>
        </section>

        {/* Trust Section - Company Logos with Infinite Scroll */}
        <section className="mb-32">
          <p className="text-center label-sm font-bold uppercase tracking-[0.2em] text-outline mb-10 text-[0.7rem]">
            {trust.title}
          </p>
          {(() => {
            // Support both trust.logos (CMS editor) and trust.clients (seed data)
            // Each item can be a string ("VERTEX") or object ({name, logo})
            const items = trust.logos || trust.clients || []
            const normalized = items.map((item: string | AnyData) =>
              typeof item === "string" ? { name: item, logo: "" } : item
            )
            if (normalized.length === 0) return null
            return (
              <div className="overflow-hidden relative">
                <div className="flex gap-16 animate-scroll-x">
                  {[...normalized, ...normalized, ...normalized].map((item: AnyData, idx: number) => (
                    <div key={idx} className="flex-shrink-0 flex items-center justify-center h-12 opacity-40 grayscale hover:opacity-70 hover:grayscale-0 transition-all">
                      {item.logo ? (
                        <img src={item.logo} alt={item.name || ""} className="h-10 w-auto max-w-[140px] object-contain" />
                      ) : (
                        <div className="text-2xl font-black tracking-tighter text-primary whitespace-nowrap">{item.name}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </section>

        {/* High Density Bento Grid */}
        <div className="grid grid-cols-12 gap-6 mb-32">
          <BentoCard className="col-span-12 lg:col-span-8 p-6 md:p-12 min-h-[500px] group">
            <div className="relative z-10 flex flex-col h-full">
              <span className="label-sm text-outline mb-4 block tracking-widest uppercase text-[0.7rem]">Network Infrastructure</span>
              <h2 className="text-xl md:text-3xl font-bold tracking-tight text-primary mb-6">Ecosystem Topology</h2>
              <p className="text-on-surface-variant max-w-xs mb-auto">
                Visualizing the multi-layered nodal connections across our distributed engineering environment.
              </p>
              <div className="mt-8 flex gap-3">
                <div className="px-4 py-2 rounded-full bg-surface-container-high text-[0.65rem] font-bold border border-outline-variant/20 uppercase tracking-widest">Active Nodal Map</div>
                <div className="px-4 py-2 rounded-full bg-surface-container-high text-[0.65rem] font-bold border border-outline-variant/20 uppercase tracking-widest">Latency: 0.4ms</div>
              </div>
            </div>
            <div className="absolute inset-0 top-0 left-0 flex items-center justify-center opacity-20 pointer-events-none scale-110">
              <svg fill="none" height="800" viewBox="0 0 800 800" width="800" xmlns="http://www.w3.org/2000/svg">
                <circle cx="400" cy="400" r="150" stroke="white" strokeDasharray="10 10" strokeWidth="0.5"></circle>
                <circle cx="400" cy="400" r="250" stroke="white" strokeWidth="0.5"></circle>
                <circle cx="400" cy="400" r="350" stroke="white" strokeDasharray="2 4" strokeWidth="0.5"></circle>
                <path d="M400 50L400 750M50 400L750 400" stroke="white" strokeWidth="0.5"></path>
                <circle cx="400" cy="400" fill="white" r="5"></circle>
                <circle cx="150" cy="150" fill="white" r="8"></circle>
                <circle cx="650" cy="650" fill="white" r="8"></circle>
                <circle cx="150" cy="650" fill="white" r="8"></circle>
                <circle cx="650" cy="150" fill="white" r="8"></circle>
              </svg>
            </div>
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-6 lg:col-span-4 p-5 md:p-10 flex flex-col justify-between">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-xl md:text-3xl mb-8">cloud_done</span>
              <div className="text-[5rem] font-black tracking-tighter leading-none mb-4">{stats.deployments?.value}</div>
              <div className="label-sm text-outline uppercase tracking-[0.2em] text-[0.65rem] mb-4">{stats.deployments?.label}</div>
              <p className="text-xs text-on-surface-variant leading-relaxed max-w-[200px]">{stats.deployments?.description}</p>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mb-10 -mr-10"></div>
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-6 lg:col-span-4 p-5 md:p-10 flex flex-col justify-between">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-xl md:text-3xl mb-8">groups</span>
              <div className="text-[5rem] font-black tracking-tighter leading-none mb-4">{stats.clients?.value}</div>
              <div className="label-sm text-outline uppercase tracking-[0.2em] text-[0.65rem] mb-4">{stats.clients?.label}</div>
              <p className="text-xs text-on-surface-variant leading-relaxed max-w-[200px]">{stats.clients?.description}</p>
            </div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          </BentoCard>

          <BentoCard className="col-span-12 lg:col-span-8 p-6 md:p-12">
            <div className="flex justify-between items-start mb-12">
              <div>
                <span className="label-sm text-outline mb-2 block tracking-widest uppercase text-[0.7rem]">System Load</span>
                <h3 className="text-2xl font-bold tracking-tight">Throughput Velocity</h3>
              </div>
              <div className="flex gap-2">
                <div className="w-12 h-1 bg-primary rounded-full"></div>
                <div className="w-12 h-1 bg-surface-container-highest rounded-full"></div>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-4 items-end h-48">
              <div className="bg-surface-container-high h-[40%] rounded-md"></div>
              <div className="bg-surface-container-high h-[65%] rounded-md"></div>
              <div className="bg-primary h-[90%] rounded-md"></div>
              <div className="bg-surface-container-high h-[55%] rounded-md"></div>
              <div className="bg-surface-container-high h-[80%] rounded-md"></div>
              <div className="bg-surface-container-high h-[45%] rounded-md"></div>
            </div>
            <div className="grid grid-cols-6 gap-4 mt-6">
              {["M1", "M2", "Now", "M4", "M5", "M6"].map((m) => (
                <div key={m} className={cn("text-[0.65rem] font-bold text-center uppercase tracking-widest", m === "Now" ? "text-primary text-outline" : "text-outline/50")}>
                  {m}
                </div>
              ))}
            </div>
          </BentoCard>
        </div>

        {/* Core Services - from services API */}
        <section className="mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="max-w-xl">
              <span className="label-sm text-outline mb-4 block tracking-widest uppercase text-[0.7rem]">Core Services</span>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tighter text-primary">{servicesSection.tagline}</h2>
            </div>
            <Link to="/services" className="text-xs font-bold uppercase tracking-widest border-b-2 border-primary pb-1">View Full Catalog</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service: AnyData) => (
              <Link key={service.id} to={`/services/${service.slug}`}>
                <BentoCard className="flex flex-col h-full hover:border-outline-variant/30 transition-all">
                  <div className="h-64 bg-surface-container-low overflow-hidden relative">
                    {service.image_url && <img alt={service.title} className="w-full h-full object-cover opacity-60 grayscale" src={service.image_url}/>}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#201f22] to-transparent"></div>
                    <div className="absolute bottom-6 left-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-outline-variant/50">
                      <span className="material-symbols-outlined text-primary">{service.icon}</span>
                    </div>
                  </div>
                  <div className="p-5 md:p-8 pt-2">
                    <h4 className="text-xl font-bold mb-3">{service.title}</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{service.short_description || service.description?.slice(0, 120)}</p>
                  </div>
                </BentoCard>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Works - from portfolios API */}
        <section className="mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div>
              <span className="label-sm text-outline mb-4 block tracking-widest uppercase text-[0.7rem]">Featured Works</span>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tighter text-primary">{works.title}</h2>
            </div>
            <Link to="/portofolio" className="text-xs font-bold uppercase tracking-widest border-b-2 border-primary pb-1">View All Portfolio</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolios.map((project: AnyData) => (
              <Link key={project.id} to={`/portofolio/${project.slug}`}>
                <BentoCard className="h-[500px] hover:border-outline-variant/30 transition-all flex flex-col justify-end p-5 md:p-10 group">
                  {project.image_url && <img alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:scale-105 transition-transform duration-700" src={project.image_url}/>}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/60 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="text-xs font-bold text-outline uppercase tracking-[0.2em] mb-4">{project.tag}</div>
                    <h3 className="text-xl md:text-3xl font-bold mb-4">{project.title}</h3>
                    <p className="text-on-surface-variant text-sm max-w-sm mb-6">{project.short_description || project.description?.slice(0, 150)}</p>
                    <span className="material-symbols-outlined text-primary text-xl md:text-3xl block">arrow_forward</span>
                  </div>
                </BentoCard>
              </Link>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <span className="label-sm text-outline mb-4 block tracking-widest uppercase text-[0.7rem]">Recognition</span>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tighter text-primary">{testimonialsSection.title}</h2>
          </div>
          <div className="grid grid-cols-12 gap-6">
            {testimonials.map((testimonial: AnyData) => (
              <BentoCard key={testimonial.id} className={cn(testimonial.span_class || "col-span-12 md:col-span-6", "p-5 md:p-10 flex flex-col justify-between")}>
                <p className="text-xl lg:text-2xl font-medium text-primary mb-10 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center font-bold text-xs overflow-hidden">
                    {testimonial.author_image ? (
                      <img src={testimonial.author_image} alt={testimonial.author_name} className="w-full h-full object-cover" />
                    ) : (
                      testimonial.author_initials
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary">{testimonial.author_name}</div>
                    <div className="text-[0.65rem] text-outline uppercase tracking-wider">{testimonial.author_role}</div>
                  </div>
                </div>
              </BentoCard>
            ))}
          </div>
        </section>

        {/* Why Us Section */}
        <section className="mb-32 bg-surface-container-low rounded-lg p-16 md:p-24 flex flex-col md:flex-row gap-16 items-center border border-outline-variant/5">
          <div className="md:w-1/2">
            <h2 className="text-xl md:text-3xl md:text-5xl font-black tracking-tighter leading-none mb-8 text-primary">{whyUs.title}</h2>
            <p className="text-on-surface-variant font-medium text-lg leading-relaxed">{whyUs.description}</p>
          </div>
          <div className="md:w-1/2 grid grid-cols-1 gap-12">
            {whyUs.features?.map((feature: AnyData) => (
              <div key={feature.id} className="flex gap-6">
                <div className="text-xl md:text-3xl font-black text-primary/10">{feature.id}</div>
                <div>
                  <h5 className="font-bold text-lg mb-2 text-primary">{feature.title}</h5>
                  <p className="text-sm text-on-surface-variant">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced CTA Section - Dynamic buttons */}
        <section className="mb-12 text-center py-24 bg-surface-container rounded-[3rem] border border-outline-variant/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <span className="label-sm text-primary mb-6 block tracking-widest uppercase text-[0.7rem] font-bold">{cta.label}</span>
            <h2 className="text-[3.5rem] md:text-[5.5rem] font-extrabold tracking-tighter leading-none mb-8 text-primary">
              {cta.headline}
            </h2>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-12">
              {cta.description}
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              {cta.buttons && cta.buttons.length > 0 ? (
                cta.buttons.map((btn: AnyData, i: number) => {
                  const isExternal = btn.url?.startsWith("http")
                  if (isExternal) {
                    return (
                      <a key={i} href={btn.url} target="_blank" rel="noopener noreferrer">
                        <Button variant={btn.variant || "primary"} className="px-12 py-5 text-lg">{btn.text}</Button>
                      </a>
                    )
                  }
                  return (
                    <Link key={i} to={btn.url || "/services"}>
                      <Button variant={btn.variant || "primary"} className="px-12 py-5 text-lg">{btn.text}</Button>
                    </Link>
                  )
                })
              ) : (
                <>
                  <Button variant="primary" className="px-12 py-5 text-lg shadow-outline-variant/10">Get Started Now</Button>
                  <Button variant="secondary" className="px-12 py-5 text-lg">Talk to Engineering</Button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section - with collapse/expand */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <span className="label-sm text-outline mb-4 block tracking-widest uppercase text-[0.7rem]">Technical Briefing</span>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tighter text-primary">Frequently Asked Questions.</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((item: AnyData, idx: number) => {
              const isOpen = openFaq === idx
              return (
                <BentoCard key={idx} className="overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4"
                  >
                    <h4 className="text-primary font-bold">{item.question}</h4>
                    <span className={cn(
                      "material-symbols-outlined text-outline text-sm transition-transform duration-200 shrink-0",
                      isOpen && "rotate-180"
                    )}>expand_more</span>
                  </button>
                  <div className={cn(
                    "overflow-hidden transition-all duration-200",
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <p className="text-on-surface-variant text-sm leading-relaxed px-6 pb-6">{item.answer}</p>
                  </div>
                </BentoCard>
              )
            })}
          </div>
        </section>

        {/* Contact Us Bento */}
        <section className="grid grid-cols-12 gap-6 mb-32">
          <BentoCard className="col-span-12 lg:col-span-8 p-6 md:p-12">
            <div className="mb-10">
              <h3 className="text-2xl font-bold tracking-tight text-primary mb-2">Initialize Transmission</h3>
              <p className="text-sm text-on-surface-variant">Secure uplink to our architecture advisory board.</p>
            </div>

            {contactSent ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-primary text-5xl mb-4">check_circle</span>
                <h4 className="text-xl font-bold text-primary mb-2">Message Sent</h4>
                <p className="text-on-surface-variant text-sm">We'll get back to you shortly.</p>
                <button onClick={() => setContactSent(false)} className="mt-4 text-sm text-primary underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase tracking-widest font-bold text-outline">Identity</label>
                  <input
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-surface-container-high border-none outline-none rounded-lg p-4 text-sm focus:ring-1 focus:ring-primary/30 transition-all text-primary"
                    placeholder="Full Name or Alias"
                    type="text"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase tracking-widest font-bold text-outline">Uplink Address</label>
                  <input
                    required
                    type="email"
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-surface-container-high border-none outline-none rounded-lg p-4 text-sm focus:ring-1 focus:ring-primary/30 transition-all text-primary"
                    placeholder="Email Address"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-[0.65rem] uppercase tracking-widest font-bold text-outline">Details</label>
                  <textarea
                    required
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-surface-container-high border-none outline-none rounded-lg p-4 text-sm focus:ring-1 focus:ring-primary/30 transition-all text-primary min-h-[120px]"
                    placeholder="Project scope, technical requirements, or inquiry details..."
                  ></textarea>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Button type="submit" disabled={contactSending} className="w-full py-4 rounded-lg bg-primary text-on-primary disabled:opacity-50">
                    {contactSending ? "Sending..." : "Send Transmission"}
                  </Button>
                </div>
              </form>
            )}
          </BentoCard>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <BentoCard className="p-5 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-primary mb-6">call</span>
                <h4 className="font-bold text-primary mb-2">{contactInfo.phone_title || "Direct Terminal"}</h4>
                <p className="text-sm text-on-surface-variant">{contactInfo.phone}</p>
              </div>
              <div className="mt-8">
                <p className="text-[0.6rem] text-outline uppercase tracking-widest">{contactInfo.availability}</p>
              </div>
            </BentoCard>

            <BentoCard className="p-5 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-primary mb-6">location_on</span>
                <h4 className="font-bold text-primary mb-2">{contactInfo.address_title || "Nexus Core HQ"}</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{contactInfo.address}</p>
              </div>
              <div className="mt-8 flex gap-4">
                {contactInfo.maps_link ? (
                  <a href={contactInfo.maps_link} target="_blank" rel="noopener noreferrer" className="text-[0.6rem] text-primary uppercase tracking-widest font-bold border-b border-primary/20">
                    {contactInfo.maps_text || "View Maps"}
                  </a>
                ) : (
                  <span className="text-[0.6rem] text-primary uppercase tracking-widest font-bold border-b border-primary/20">View Maps</span>
                )}
              </div>
            </BentoCard>
          </div>
        </section>

      </main>
  )
}
