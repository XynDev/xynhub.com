import { useState, useEffect } from "react"
import { BentoCard } from "../components/ui/BentoCard"
import { PageHeader } from "../components/layout/PageHeader"
import { Link } from "react-router-dom"
import { SEO } from "../components/SEO"
import { getPageContent, getBlogs } from "../lib/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

export function Blogs() {
  const [pageData, setPageData] = useState<AnyData | null>(null)
  const [blogs, setBlogs] = useState<AnyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [page, blogsRes] = await Promise.all([
          getPageContent("blogs"),
          getBlogs({ per_page: 50 }),
        ])
        setPageData(page)
        setBlogs(blogsRes.data)
      } catch (err) {
        console.error("Failed to load blogs data:", err)
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
  const latestSection = pageData.latest || {}
  const researchSection = pageData.research || {}
  const infrastructureSection = pageData.infrastructure || {}

  // Categorize blogs
  const latestBlogs = blogs.filter(b => b.category === "Latest")
  const researchBlogs = blogs.filter(b => b.category === "Research")
  const infraBlogs = blogs.filter(b => b.category === "Infrastructure")

  // Featured is the first "featured" blog or first latest blog
  const featuredBlog = blogs.find(b => b.is_featured) || latestBlogs[0]
  const secondaryLatest = latestBlogs.filter(b => b.id !== featuredBlog?.id).slice(0, 2)

  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <SEO title="Intel & Technical Monographs" description="Deep dives into system patterns, code architecture, and engineering principles." />
      <PageHeader
        label={hero.label}
        headline={hero.title}
        description={hero.description}
      />

      {/* Latest Section */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <span className="w-12 h-[1px] bg-outline-variant"></span>
          <h2 className="text-xl md:text-3xl font-bold tracking-tight text-primary">{latestSection.title}</h2>
          <span className="text-on-surface-variant font-mono text-sm">{latestSection.meta}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Featured Post */}
          {featuredBlog && (
            <Link to={`/blogs/${featuredBlog.slug}`} className="md:col-span-8 group block">
              <BentoCard className="p-0 overflow-hidden h-full">
                <div className="h-96 w-full relative">
                  <img
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    src={featuredBlog.image_url}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
                </div>
                <div className="p-6 md:p-12 -mt-24 relative z-10">
                  <span className="inline-block px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold tracking-widest text-primary mb-6 uppercase">
                    {featuredBlog.category}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-bold text-primary mb-4 tracking-tight leading-tight group-hover:text-primary transition-colors">
                    {featuredBlog.title}
                  </h3>
                  <p className="text-on-surface-variant mb-8 line-clamp-2 max-w-2xl">
                    {featuredBlog.excerpt}
                  </p>
                  <div className="flex items-center gap-6">
                    <span className="label-sm text-on-surface-variant">
                      {featuredBlog.published_at ? new Date(featuredBlog.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
                    </span>
                    <span className="label-sm text-on-surface-variant">&bull;</span>
                    <span className="label-sm text-on-surface-variant">{featuredBlog.read_time}</span>
                  </div>
                </div>
              </BentoCard>
            </Link>
          )}

          {/* Secondary Posts */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {secondaryLatest.map((post) => (
              <Link key={post.id} to={`/blogs/${post.slug}`} className="h-full block group">
                <BentoCard className="bg-surface-container-low p-5 md:p-8 h-full flex flex-col justify-between cursor-pointer group-hover:bg-surface-container-high transition-colors">
                  <div>
                    <span className="label-sm text-outline mb-4 block">{post.category}</span>
                    <h4 className="text-xl font-bold text-primary leading-snug">{post.title}</h4>
                  </div>
                  <div className="flex justify-between items-end mt-12">
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">article</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Read More</span>
                  </div>
                </BentoCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Research Section */}
      {researchBlogs.length > 0 && (
        <section className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <span className="w-12 h-[1px] bg-outline-variant"></span>
              <h2 className="text-xl md:text-3xl font-bold tracking-tight text-primary">{researchSection.title}</h2>
              <span className="text-on-surface-variant font-mono text-sm uppercase tracking-wider hidden sm:inline-block">{researchSection.meta}</span>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-outline hover:text-primary hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-outline hover:text-primary hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {researchBlogs.map((post) => (
              <Link key={post.id} to={`/blogs/${post.slug}`} className="block group cursor-pointer">
                <BentoCard className="p-2 border border-transparent hover:border-outline-variant/30 transition-all bg-surface-container h-full">
                  <div className="bg-surface-container-low rounded-xl p-5 md:p-10 h-full flex flex-col justify-between border border-transparent group-hover:border-outline-variant transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-12">
                        <span className="material-symbols-outlined text-2xl md:text-4xl text-on-surface-variant">science</span>
                        <span className="label-sm text-outline">{post.category}</span>
                      </div>
                      <h3 className="text-xl md:text-3xl font-bold text-primary mb-4 leading-tight">{post.title}</h3>
                      <p className="text-on-surface-variant leading-relaxed">{post.excerpt}</p>
                    </div>
                    <div className="mt-16 pt-8 border-t border-outline-variant/20 flex justify-between items-center">
                      <div className="flex -space-x-3">
                        <div className="w-8 h-8 rounded-full border-2 border-surface-container-low bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-primary">
                          {post.author_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
                    </div>
                  </div>
                </BentoCard>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Infrastructure Section */}
      {infraBlogs.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <span className="w-12 h-[1px] bg-outline-variant"></span>
              <h2 className="text-xl md:text-3xl font-bold tracking-tight text-primary">{infrastructureSection.title}</h2>
              <span className="text-on-surface-variant font-mono text-sm uppercase tracking-wider hidden sm:inline-block">{infrastructureSection.meta}</span>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-outline hover:text-primary hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-outline hover:text-primary hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {infraBlogs.map((post) => (
              <Link key={post.id} to={`/blogs/${post.slug}`} className="block group">
                <BentoCard className="p-5 md:p-10 h-full hover:bg-surface-container-high transition-colors">
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-8">
                    <span className="material-symbols-outlined text-primary">storage</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{post.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{post.excerpt}</p>
                  <span className="label-sm text-outline">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
                  </span>
                </BentoCard>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}
