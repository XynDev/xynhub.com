import { BentoCard } from "../components/ui/BentoCard"
import { Button } from "../components/ui/Button"
import { Link } from "react-router-dom"
import blogDetailData from "../data/detail_blog.json"

export function BlogDetail() {
  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      
      {/* Centered Blog Container */}
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
            <span className="label-sm text-primary tracking-widest font-bold bg-surface-container-high px-4 py-1.5 rounded-full border border-white/5 uppercase">
              {blogDetailData.header.tag}
            </span>
            <span className="label-sm text-on-surface-variant tracking-widest uppercase">
              {blogDetailData.header.date}
            </span>
          </div>
          
          {/* Mapping Header Title Size to UI_RULES.md (Same as About) */}
          <h1 className="text-[3.5rem] md:text-[5.5rem] font-extrabold tracking-tighter text-primary leading-[0.9] mb-12">
            {blogDetailData.header.title}
          </h1>
          
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden">
              <img alt="Author" className="w-full h-full object-cover grayscale" src={blogDetailData.header.author.image} />
            </div>
            <div>
              <p className="font-bold text-primary">{blogDetailData.header.author.name}</p>
              <p className="label-sm text-on-surface-variant tracking-wide">{blogDetailData.header.author.role}</p>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article className="space-y-12">
          <section className="prose prose-invert max-w-none">
            <p className="text-xl md:text-2xl leading-relaxed text-on-surface-variant font-medium mb-12">
              {blogDetailData.content.intro}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-primary mb-6">{blogDetailData.content.dilemma.title}</h2>
            <p className="text-on-surface leading-loose mb-8 text-lg text-on-surface-variant">
              {blogDetailData.content.dilemma.paragraph}
            </p>
          </section>

          {/* Bento High-Contrast Diagram 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BentoCard className="p-10 flex flex-col justify-between border border-white/5 bg-surface-container">
              <div className="mb-8">
                <span className="material-symbols-outlined text-primary text-4xl mb-4">cloud_off</span>
                <h3 className="text-xl font-bold text-primary">{blogDetailData.content.diagram1.centralized.title}</h3>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                  {blogDetailData.content.diagram1.centralized.description}
                </p>
              </div>
              <div className="h-32 bg-surface-container-low rounded-2xl flex items-end px-6 py-4 gap-2">
                <div className="w-full bg-error/20 h-full rounded-t-lg"></div>
                <div className="w-full bg-error/40 h-3/4 rounded-t-lg"></div>
                <div className="w-full bg-error h-1/2 rounded-t-lg"></div>
              </div>
            </BentoCard>

            <BentoCard className="p-10 flex flex-col justify-between border border-white/5 bg-surface-container-high">
              <div className="mb-8">
                <span className="material-symbols-outlined text-primary text-4xl mb-4">dynamic_form</span>
                <h3 className="text-xl font-bold text-primary">{blogDetailData.content.diagram1.edge.title}</h3>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                  {blogDetailData.content.diagram1.edge.description}
                </p>
              </div>
              <div className="h-32 bg-surface-container-low rounded-2xl flex items-end px-6 py-4 gap-2">
                <div className="w-full bg-primary/20 h-1/4 rounded-t-lg"></div>
                <div className="w-full bg-primary/40 h-1/5 rounded-t-lg"></div>
                <div className="w-full bg-primary h-1/6 rounded-t-lg"></div>
              </div>
            </BentoCard>
          </div>

          <section className="prose prose-invert max-w-none">
            <h2 className="text-3xl font-bold tracking-tight text-primary mb-6 pt-8">{blogDetailData.content.fog.title}</h2>
            <p className="text-on-surface leading-loose mb-8 text-lg text-on-surface-variant">
              {blogDetailData.content.fog.paragraph}
            </p>
            <blockquote className="border-l-4 border-primary pl-8 my-12 py-2 italic text-2xl text-primary font-medium tracking-tight">
              "{blogDetailData.content.fog.quote}"
            </blockquote>
          </section>

          {/* Bento Diagram 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BentoCard className="md:col-span-2 p-12 border border-white/5 bg-surface-container-high">
              <h3 className="label-sm text-on-surface-variant tracking-widest uppercase mb-4">{blogDetailData.content.diagram2.stack.title}</h3>
              <div className="space-y-6">
                {blogDetailData.content.diagram2.stack.items.map(item => (
                  <div key={item.label} className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
                    <span className="font-bold text-primary">{item.label}</span>
                    <span className="font-mono text-xs text-on-surface-variant opacity-70">{item.value}</span>
                  </div>
                ))}
              </div>
            </BentoCard>

            <BentoCard className="p-0 overflow-hidden relative border border-white/5 h-64 md:h-auto">
              <img alt="Hardware" className="w-full h-full object-cover opacity-50 grayscale" src={blogDetailData.content.diagram2.hardware.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent p-8 flex flex-col justify-end">
                <p className="text-primary font-bold">{blogDetailData.content.diagram2.hardware.title}</p>
                <p className="label-sm text-on-surface-variant">{blogDetailData.content.diagram2.hardware.label}</p>
              </div>
            </BentoCard>
          </div>

          <section className="prose prose-invert max-w-none pt-8">
            <p className="text-on-surface leading-loose mb-8 text-lg text-on-surface-variant">
              {blogDetailData.content.conclusion}
            </p>
          </section>
        </article>
      </div>

      {/* Footer CTA: Cleaned up grid conflict! */}
      <footer className="mt-32 w-full max-w-4xl mx-auto">
        <BentoCard className="p-10 md:p-14 overflow-hidden relative border border-white/5 flex flex-col items-center justify-center text-center bg-surface-container shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-primary mb-6 leading-tight">
              {blogDetailData.cta.title}
            </h2>
            <p className="text-on-surface-variant mb-10 leading-relaxed text-lg w-full">
              {blogDetailData.cta.description}
            </p>
            
            <form className="space-y-4 w-full" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col md:flex-row gap-3 w-full">
                <input 
                  className="flex-1 min-w-0 bg-surface-container-low border border-outline-variant/30 rounded-full px-6 py-4 text-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50 focus:outline-none" 
                  placeholder={blogDetailData.cta.placeholder} 
                  type="email" 
                  required
                />
                <Button type="submit" className="px-8 py-4 uppercase tracking-widest text-[0.6875rem] font-bold w-full md:w-auto">
                  {blogDetailData.cta.buttonText}
                </Button>
              </div>
              <p className="label-sm text-on-surface-variant/50">
                {blogDetailData.cta.disclaimer}
              </p>
            </form>
          </div>
        </BentoCard>
      </footer>

    </main>
  )
}
