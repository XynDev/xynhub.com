import { BentoCard } from "../components/ui/BentoCard"
import { Button } from "../components/ui/Button"
import { PageHeader } from "../components/layout/PageHeader"
import { Link } from "react-router-dom"
import detailData from "../data/portofolio_detail.json"

export function PortofolioDetail() {
  
  // In a real app we'd fetch data based on ID, but here we just use the mocked subset
  
  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <PageHeader 
        label="PORTFOLIO / DETAIL"
        headline="Case Study"
      >
        <div className="flex md:justify-end w-full mt-8 md:mt-0">
          <Link to="/portofolio">
            <Button variant="secondary" className="px-6 py-3 tracking-widest text-[0.6875rem] border-outline-variant/30 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined mr-2 text-[1.125rem]">arrow_back</span>
              BACK TO PORTFOLIO
            </Button>
          </Link>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Section 1: Hero Area */}
        <BentoCard className="md:col-span-12 lg:col-span-8 min-h-[500px] p-10 md:p-14 flex flex-col justify-end relative">
          <div className="absolute inset-0 z-0">
            <img alt="Hero Cover" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" src={detailData.hero.image} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#201f22] via-[#201f22]/50 to-transparent"></div>
          </div>
          <div className="relative z-10 flex flex-col gap-4">
            <span className="label-sm font-bold tracking-widest text-primary uppercase opacity-60">{detailData.hero.label}</span>
            {/* Title size aligned with About & UI_RULES.md standard */}
            <h1 className="text-[3.5rem] md:text-[5.5rem] font-extrabold tracking-tighter leading-[0.9] text-primary">
              {detailData.hero.title}
            </h1>
            <p className="text-xl text-on-surface-variant max-w-xl font-medium mt-2">{detailData.hero.description}</p>
          </div>
        </BentoCard>

        {/* Stats Block (Hero Secondary) */}
        <BentoCard className="md:col-span-12 lg:col-span-4 bg-surface-container-low p-10 md:p-14 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary text-4xl">{detailData.stats.icon}</span>
            <span className="label-sm font-bold text-outline uppercase tracking-widest">{detailData.stats.label}</span>
          </div>
          <div className="mt-16 md:mt-auto">
            <div className="text-5xl font-extrabold tracking-tighter text-primary">{detailData.stats.value}</div>
            <div className="label-sm font-bold text-on-surface-variant uppercase mt-2">{detailData.stats.valueLabel}</div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 flex gap-4 overflow-hidden">
            <div className="bg-surface-container-high rounded-2xl h-16 w-full flex items-center justify-center">
              <span className="label-sm text-on-surface-variant">{detailData.stats.tags[0]}</span>
            </div>
            <div className="bg-surface-container-high rounded-2xl h-16 w-full flex items-center justify-center bg-white/5">
              <span className="label-sm text-primary">{detailData.stats.tags[1]}</span>
            </div>
          </div>
        </BentoCard>

        {/* Section 2: Narrative Description */}
        <BentoCard className="md:col-span-12 lg:col-span-7 bg-surface-container-lowest p-10 md:p-14 flex flex-col justify-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary mb-8">{detailData.narrative.title}</h2>
          <div className="flex flex-col gap-6 text-on-surface-variant leading-relaxed text-lg">
            {detailData.narrative.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            {detailData.narrative.buttons.map((btn, i) => (
              <Button key={i} variant={btn.variant as "primary" | "secondary"} className="px-8 py-3 tracking-widest text-[0.6875rem]">
                {btn.text}
              </Button>
            ))}
          </div>
        </BentoCard>

        {/* Section 3: Core Features */}
        <BentoCard className="md:col-span-12 lg:col-span-5 flex flex-col justify-center p-8 gap-4 bg-surface-container">
          {detailData.features.map(feat => (
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

        {/* Section 4: Visual Gallery */}
        {detailData.gallery.map(item => (
          <BentoCard key={item.id} className="md:col-span-12 lg:col-span-4 p-0 relative group h-[400px]">
            <img alt={item.label} className="w-full h-full object-cover opacity-80" src={item.image} />
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="label-sm font-bold text-primary tracking-widest">{item.label}</span>
            </div>
          </BentoCard>
        ))}

        {/* Section 5: Ready to Deploy CTA */}
        <BentoCard className="md:col-span-12 bg-surface-container-lowest items-center text-center py-24 px-10 border border-white/5">
          <div className="max-w-2xl w-full mx-auto flex flex-col items-center">
            <span className="label-sm font-black text-on-surface-variant tracking-widest uppercase mb-4">{detailData.cta.label}</span>
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-primary mb-8 leading-none">{detailData.cta.title}</h2>
            <p className="text-center text-on-surface-variant text-lg font-medium mb-12 whitespace-pre-line">
              {detailData.cta.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {detailData.cta.buttons.map((btn, i) => (
                <Button key={i} variant={btn.variant as "primary" | "outline"} className="px-12 py-4 tracking-widest text-[0.6875rem]">
                  {btn.text}
                </Button>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* Aesthetic Filler / Tag Cloud */}
        <BentoCard className="md:col-span-12 flex flex-row flex-wrap gap-3 items-center justify-center bg-transparent border border-white/5 py-8 px-6">
          {detailData.tags.map(tag => (
            <span key={tag} className="label-sm px-4 py-1.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/20">
              {tag}
            </span>
          ))}
        </BentoCard>
      </div>
    </main>
  )
}
