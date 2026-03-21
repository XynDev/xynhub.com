import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { BentoCard } from "../components/ui/BentoCard"
import { Button } from "../components/ui/Button"
import { Link } from "react-router-dom"
import { SEO } from "../components/SEO"
import { getBlogBySlug } from "../lib/api"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [blog, setBlog] = useState<AnyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!slug) return
      try {
        const res = await getBlogBySlug(slug)
        setBlog(res.data)
      } catch (err) {
        console.error("Failed to load blog:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading || !blog) {
    return (
      <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto flex items-center justify-center min-h-screen">
        <div className="text-on-surface-variant text-sm uppercase tracking-widest animate-pulse">Loading...</div>
      </main>
    )
  }

  const content = blog.content || {}
  const isMarkdown = typeof content.body === "string"
  const cta = content.cta || blog.cta || {}
  const formattedDate = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : ""

  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <SEO title={blog.title} description={blog.description || blog.category} />

      <div className="max-w-4xl mx-auto">
        {/* Metadata Header */}
        <header className="mb-20">
          <div className="mb-12">
            <Link to="/blogs" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/30 text-sm font-medium">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to Blogs
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="label-sm text-primary tracking-widest font-bold bg-surface-container-high px-4 py-1.5 rounded-full border border-outline-variant/30 uppercase">
              {blog.category}
            </span>
            <span className="label-sm text-on-surface-variant tracking-widest uppercase">
              {formattedDate}
            </span>
            {blog.read_time && (
              <span className="label-sm text-on-surface-variant tracking-widest uppercase">
                {blog.read_time}
              </span>
            )}
          </div>

          <h1 className="text-[3.5rem] md:text-[5.5rem] font-extrabold tracking-tighter text-primary leading-[0.9] mb-12">
            {blog.title}
          </h1>

          <div className="flex items-center gap-6">
            {blog.author_image ? (
              <div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden">
                <img alt="Author" className="w-full h-full object-cover grayscale" src={blog.author_image} />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-sm font-bold text-primary">
                {blog.author_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
            )}
            <div>
              <p className="font-bold text-primary">{blog.author_name}</p>
              <p className="label-sm text-on-surface-variant tracking-wide">{blog.author_role}</p>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {blog.image_url && (
          <div className="mb-16 rounded-2xl overflow-hidden">
            <img alt={blog.title} className="w-full h-auto object-cover" src={blog.image_url} />
          </div>
        )}

        {/* Article Body */}
        {isMarkdown ? (
          /* Markdown content */
          <article className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-primary prose-headings:tracking-tight prose-headings:font-bold
            prose-p:text-on-surface-variant prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-primary prose-blockquote:text-primary prose-blockquote:italic
            prose-code:text-primary prose-code:bg-surface-container-high prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-surface-container prose-pre:border prose-pre:border-outline-variant/30
            prose-img:rounded-xl
            prose-strong:text-primary
            prose-li:text-on-surface-variant
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content.body}
            </ReactMarkdown>
          </article>
        ) : (
          /* Legacy JSON content (backward compatible) */
          <article className="space-y-12">
            <section>
              <p className="text-xl md:text-2xl leading-relaxed text-on-surface-variant font-medium mb-12">
                {content.intro}
              </p>
              {content.dilemma && (
                <>
                  <h2 className="text-xl md:text-3xl font-bold tracking-tight text-primary mb-6">{content.dilemma?.title}</h2>
                  <p className="leading-loose mb-8 text-lg text-on-surface-variant">{content.dilemma?.paragraph}</p>
                </>
              )}
            </section>

            {content.fog && (
              <section>
                <h2 className="text-xl md:text-3xl font-bold tracking-tight text-primary mb-6 pt-8">{content.fog?.title}</h2>
                <p className="leading-loose mb-8 text-lg text-on-surface-variant">{content.fog?.paragraph}</p>
                {content.fog?.quote && (
                  <blockquote className="border-l-4 border-primary pl-8 my-12 py-2 italic text-2xl text-primary font-medium tracking-tight">
                    &ldquo;{content.fog.quote}&rdquo;
                  </blockquote>
                )}
              </section>
            )}

            {content.conclusion && (
              <section className="pt-8">
                <p className="leading-loose mb-8 text-lg text-on-surface-variant">{content.conclusion}</p>
              </section>
            )}
          </article>
        )}
      </div>

      {/* Footer CTA */}
      {cta.title && (
        <footer className="mt-32 w-full max-w-4xl mx-auto">
          <BentoCard className="p-5 md:p-10 md:p-14 overflow-hidden relative border border-outline-variant/30 flex flex-col items-center justify-center text-center bg-surface-container shadow-2xl">
            <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
              <h2 className="text-2xl md:text-4xl md:text-5xl font-extrabold tracking-tighter text-primary mb-6 leading-tight">
                {cta.title}
              </h2>
              <p className="text-on-surface-variant mb-10 leading-relaxed text-lg w-full">{cta.description}</p>
              <form className="space-y-4 w-full" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col md:flex-row gap-3 w-full">
                  <input
                    className="flex-1 min-w-0 bg-surface-container-low border border-outline-variant/30 rounded-full px-6 py-4 text-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50 focus:outline-none"
                    placeholder={cta.placeholder}
                    type="email"
                  />
                  <Button type="submit" className="px-8 py-4 uppercase tracking-widest text-[0.6875rem] font-bold w-full md:w-auto">
                    {cta.buttonText || "Subscribe"}
                  </Button>
                </div>
              </form>
            </div>
          </BentoCard>
        </footer>
      )}
    </main>
  )
}
