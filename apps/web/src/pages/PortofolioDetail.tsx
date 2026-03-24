import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { BentoCard } from "../components/ui/BentoCard"
import { Button } from "../components/ui/Button"
import { PageHeader } from "../components/layout/PageHeader"
import { SEO } from "../components/SEO"
import { getPortfolioBySlug } from "../lib/api"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

export function PortofolioDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [portfolio, setPortfolio] = useState<AnyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!slug) return
      try {
        const res = await getPortfolioBySlug(slug)
        setPortfolio(res.data)
      } catch (err) {
        console.error("Failed to load portfolio detail:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading || !portfolio) {
    return (
      <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto flex items-center justify-center min-h-screen">
        <div className="text-on-surface-variant text-sm uppercase tracking-widest animate-pulse">Loading...</div>
      </main>
    )
  }

  // Portfolio detail data from the joined portfolio_details table
  const detail = portfolio.detail || {}

  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <SEO title="Case Study Deep Dive" description="Exploring the metrics and infrastructure of our deployed nodes." />
      <PageHeader
        label="PORTFOLIO / DETAIL"
        headline="Case Study"
      >
        <div className="flex md:justify-end w-full mt-8 md:mt-0">
          <Link to="/portofolio">
            <Button variant="secondary" size="sm">
              <span className="material-symbols-outlined mr-2 text-[1.125rem]">arrow_back</span>
              BACK TO PORTFOLIO
            </Button>
          </Link>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Section 1: Hero Area */}
        <BentoCard className="md:col-span-12 lg:col-span-8 min-h-[500px] p-5 md:p-10 md:p-14 flex flex-col justify-end relative">
          <div className="absolute inset-0 z-0">
            <img alt="Hero Cover" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" src={detail.hero?.image || portfolio.image} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#201f22] via-[#201f22]/50 to-transparent"></div>
          </div>
          <div className="relative z-10 flex flex-col gap-4">
            <span className="label-sm font-bold tracking-widest text-primary uppercase opacity-60">{detail.hero?.label || portfolio.tag}</span>
            <h1 className="text-[3.5rem] md:text-[5.5rem] font-extrabold tracking-tighter leading-[0.9] text-primary">
              {detail.hero?.title || portfolio.title}
            </h1>
            <p className="text-xl text-on-surface-variant max-w-xl font-medium mt-2">{detail.hero?.description || portfolio.description}</p>
          </div>
        </BentoCard>

        {/* Stats Block */}
        <BentoCard className="md:col-span-12 lg:col-span-4 bg-surface-container-low p-5 md:p-10 md:p-14 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary text-2xl md:text-4xl">{detail.stats?.icon}</span>
            <span className="label-sm font-bold text-outline uppercase tracking-widest">{detail.stats?.label}</span>
          </div>
          <div className="mt-16 md:mt-auto">
            <div className="text-xl md:text-3xl md:text-5xl font-extrabold tracking-tighter text-primary">{detail.stats?.value}</div>
            <div className="label-sm font-bold text-on-surface-variant uppercase mt-2">{detail.stats?.valueLabel}</div>
          </div>
          <div className="mt-8 pt-8 border-t border-outline-variant/30 flex gap-4 overflow-hidden">
            <div className="bg-surface-container-high rounded-2xl h-16 w-full flex items-center justify-center">
              <span className="label-sm text-on-surface-variant">{detail.stats?.tags?.[0]}</span>
            </div>
            <div className="bg-surface-container-high rounded-2xl h-16 w-full flex items-center justify-center bg-white/5">
              <span className="label-sm text-primary">{detail.stats?.tags?.[1]}</span>
            </div>
          </div>
        </BentoCard>

        {/* Narrative */}
        <BentoCard className="md:col-span-12 lg:col-span-7 bg-surface-container-lowest p-5 md:p-10 lg:p-14 flex flex-col justify-center">
          <h2 className="text-xl md:text-3xl font-bold tracking-tight text-primary mb-8">{detail.narrative?.title}</h2>
          {typeof detail.narrative?.body === "string" ? (
            <article className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:text-primary prose-headings:tracking-tight prose-headings:font-bold
              prose-p:text-on-surface-variant prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-primary prose-blockquote:text-primary prose-blockquote:italic
              prose-code:text-primary prose-code:bg-surface-container-high prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-surface-container prose-pre:border prose-pre:border-outline-variant/30
              prose-img:rounded-xl prose-strong:text-primary prose-li:text-on-surface-variant
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {detail.narrative.body}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="flex flex-col gap-6 text-on-surface-variant leading-relaxed text-lg">
              {detail.narrative?.paragraphs?.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
          {detail.narrative?.buttons && (
            <div className="mt-12 flex flex-wrap gap-4">
              {detail.narrative.buttons.map((btn: AnyData, i: number) => (
                <Button key={i} variant={btn.variant as "primary" | "secondary"} size="md">
                  {btn.text}
                </Button>
              ))}
            </div>
          )}
        </BentoCard>

        {/* Features */}
        <BentoCard className="md:col-span-12 lg:col-span-5 flex flex-col justify-center p-5 md:p-8 gap-4 bg-surface-container">
          {detail.features?.map((feat: AnyData) => (
            <div key={feat.id} className="bg-surface-container-high rounded-2xl p-6 flex items-center gap-6 group hover:bg-surface-container-highest transition-colors">
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">{feat.icon}</span>
              </div>
              <div>
                <div className="font-bold text-primary">{feat.title}</div>
                <div className="text-sm text-on-surface-variant">{feat.description}</div>
              </div>
            </div>
          ))}
        </BentoCard>

        {/* Gallery */}
        {detail.gallery?.map((item: AnyData) => (
          <BentoCard key={item.id} className="md:col-span-12 lg:col-span-4 p-0 relative group h-[400px]">
            <img alt={item.label} className="w-full h-full object-cover opacity-80" src={item.image} />
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="label-sm font-bold text-primary tracking-widest">{item.label}</span>
            </div>
          </BentoCard>
        ))}

        {/* CTA */}
        <BentoCard className="md:col-span-12 bg-surface-container-lowest items-center text-center py-24 px-10 border border-outline-variant/30">
          <div className="max-w-2xl w-full mx-auto flex flex-col items-center">
            <span className="label-sm font-black text-on-surface-variant tracking-widest uppercase mb-4">{detail.cta?.label}</span>
            <h2 className="text-xl md:text-3xl md:text-5xl md:text-7xl font-extrabold tracking-tighter text-primary mb-8 leading-none">{detail.cta?.title}</h2>
            <p className="text-center text-on-surface-variant text-lg font-medium mb-12 whitespace-pre-line">
              {detail.cta?.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {detail.cta?.buttons?.map((btn: AnyData, i: number) => (
                <Button key={i} variant={btn.variant as "primary" | "outline"} size="lg">
                  {btn.text}
                </Button>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* Tags */}
        {detail.tags && (
          <BentoCard className="md:col-span-12 flex flex-row flex-wrap gap-3 items-center justify-center bg-transparent border border-outline-variant/30 py-8 px-6">
            {detail.tags.map((tag: string) => (
              <span key={tag} className="label-sm px-4 py-1.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/20">
                {tag}
              </span>
            ))}
          </BentoCard>
        )}
      </div>
    </main>
  )
}
