import { useState, useEffect } from "react"
import { SEO } from "../components/SEO"
import { getPageContent } from "../lib/api"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

export function PrivacyPolicy() {
  const [data, setData] = useState<AnyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const page = await getPageContent("privacy-policy")
        setData(page?.content || null)
      } catch (err) {
        console.error("Failed to load privacy policy:", err)
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

  const title = data?.title || "Privacy Policy"
  const body = data?.body || ""

  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[900px] w-full mx-auto">
      <SEO title={title} />
      <div className="bento-card rounded-xl p-8 md:p-16">
        <div className="prose prose-invert max-w-none prose-headings:text-primary prose-p:text-on-surface-variant prose-a:text-primary prose-strong:text-primary prose-li:text-on-surface-variant">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>
      </div>
    </main>
  )
}
