import { BentoCard } from "../components/ui/BentoCard"
import { PageHeader } from "../components/layout/PageHeader"
import { Link } from "react-router-dom"
import blogsData from "../data/list_blogs.json"

export function Blogs() {
  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <PageHeader 
        label={blogsData.hero.label}
        headline={blogsData.hero.title}
        description={blogsData.hero.description}
      />

      {/* Latest Section */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <span className="w-12 h-[1px] bg-outline-variant"></span>
          <h2 className="text-3xl font-bold tracking-tight text-primary">{blogsData.latest.title}</h2>
          <span className="text-on-surface-variant font-mono text-sm">{blogsData.latest.meta}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Featured Post */}
          <Link to={`/blogs/featured`} className="md:col-span-8 group block">
            <BentoCard className="p-0 overflow-hidden h-full">
              <div className="h-96 w-full relative">
                <img 
                  alt={blogsData.latest.featured.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                  src={blogsData.latest.featured.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
              </div>
              <div className="p-12 -mt-24 relative z-10">
                <span className="inline-block px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold tracking-widest text-primary mb-6 uppercase">
                  {blogsData.latest.featured.tag}
                </span>
                <h3 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight group-hover:text-primary transition-colors">
                  {blogsData.latest.featured.title}
                </h3>
                <p className="text-on-surface-variant mb-8 line-clamp-2 max-w-2xl">
                  {blogsData.latest.featured.description}
                </p>
                <div className="flex items-center gap-6">
                  <span className="label-sm text-on-surface-variant">{blogsData.latest.featured.date}</span>
                  <span className="label-sm text-on-surface-variant">•</span>
                  <span className="label-sm text-on-surface-variant">{blogsData.latest.featured.readTime}</span>
                </div>
              </div>
            </BentoCard>
          </Link>

          {/* Secondary Posts */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {blogsData.latest.posts.map((post, i) => (
              <Link key={i} to={`/blogs/post-${i}`} className="h-full block group">
                <BentoCard className="bg-surface-container-low p-8 h-full flex flex-col justify-between cursor-pointer group-hover:bg-surface-container-high transition-colors">
                  <div>
                    <span className="label-sm text-outline mb-4 block">{post.category}</span>
                    <h4 className="text-xl font-bold text-primary leading-snug">{post.title}</h4>
                  </div>
                  <div className="flex justify-between items-end mt-12">
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">{post.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-outline">{post.action}</span>
                  </div>
                </BentoCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section className="mb-24">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <span className="w-12 h-[1px] bg-outline-variant"></span>
            <h2 className="text-3xl font-bold tracking-tight text-primary">{blogsData.research.title}</h2>
            <span className="text-on-surface-variant font-mono text-sm uppercase tracking-wider hidden sm:inline-block">{blogsData.research.meta}</span>
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
          {blogsData.research.posts.map((post, i) => (
            <Link key={i} to={`/blogs/research-${i}`} className="block group cursor-pointer">
              <BentoCard className="p-2 border border-transparent hover:border-outline-variant/30 transition-all bg-surface-container h-full">
                <div className="bg-surface-container-low rounded-xl p-10 h-full flex flex-col justify-between border border-transparent group-hover:border-outline-variant transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-12">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant">{post.icon}</span>
                      <span className="label-sm text-outline">{post.tag}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-primary mb-4 leading-tight">{post.title}</h3>
                    <p className="text-on-surface-variant leading-relaxed">{post.description}</p>
                  </div>
                  <div className="mt-16 pt-8 border-t border-outline-variant/20 flex justify-between items-center">
                    <div className="flex -space-x-3">
                      {post.authors.map(author => (
                        <div key={author} className="w-8 h-8 rounded-full border-2 border-surface-container-low bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">
                          {author}
                        </div>
                      ))}
                    </div>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
                  </div>
                </div>
              </BentoCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <span className="w-12 h-[1px] bg-outline-variant"></span>
            <h2 className="text-3xl font-bold tracking-tight text-primary">{blogsData.infrastructure.title}</h2>
            <span className="text-on-surface-variant font-mono text-sm uppercase tracking-wider hidden sm:inline-block">{blogsData.infrastructure.meta}</span>
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
          {blogsData.infrastructure.posts.map((post, i) => (
            <Link key={i} to={`/blogs/infra-${i}`} className="block group">
              <BentoCard className="p-10 h-full hover:bg-surface-container-high transition-colors">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-primary">{post.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{post.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{post.description}</p>
                <span className="label-sm text-outline">{post.date}</span>
              </BentoCard>
            </Link>
          ))}
        </div>
      </section>

    </main>
  )
}
