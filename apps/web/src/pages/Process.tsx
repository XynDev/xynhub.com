import { BentoCard } from "../components/ui/BentoCard"
import { PageHeader } from "../components/layout/PageHeader"
import processData from "../data/process.json"

export function Process() {
  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <PageHeader 
        label={processData.hero.label}
        headline={processData.hero.headline}
      >
        <p className="text-on-surface-variant text-lg leading-relaxed font-medium text-left md:text-right">
          {processData.hero.description}
        </p>
      </PageHeader>

      {/* Bento Grid Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Phase 01: Strategic Inquiry */}
        <BentoCard className="md:col-span-3 bg-surface-container rounded-xl p-10 flex flex-col justify-between min-h-[400px] group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <span className="label-sm text-primary tracking-widest font-bold uppercase">{processData.phases[0].phase}</span>
              <h2 className="text-4xl font-bold tracking-tight text-primary">{processData.phases[0].title}</h2>
            </div>
            <span className="material-symbols-outlined text-4xl text-primary opacity-20 group-hover:opacity-100 transition-opacity duration-300">{processData.phases[0].icon}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <p className="text-on-surface-variant leading-relaxed font-medium">
              {processData.phases[0].description}
            </p>
            <div className="bg-surface-container-low rounded-lg p-6 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">{processData.phases[0].metric?.label}</span>
              <div className="text-3xl font-black text-primary tracking-tighter">{processData.phases[0].metric?.value}</div>
            </div>
          </div>
        </BentoCard>

        {/* Side Card 01 */}
        <BentoCard className="md:col-span-1 bg-surface-container-high rounded-xl p-8 flex flex-col justify-end gap-4 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <span className="material-symbols-outlined text-[8rem]">{processData.phases[1].icon}</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-primary">{processData.phases[1].title}</h3>
            <p className="text-sm text-on-surface-variant mt-2">{processData.phases[1].description}</p>
          </div>
        </BentoCard>

        {/* Phase 02: Architecture & Design */}
        <BentoCard className="md:col-span-2 bg-surface-container rounded-xl p-10 flex flex-col justify-between min-h-[450px] group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <span className="label-sm text-primary tracking-widest font-bold uppercase">{processData.phases[2].phase}</span>
              <h2 className="text-4xl font-bold tracking-tight text-primary leading-tight whitespace-pre-line">{processData.phases[2].title}</h2>
            </div>
            <span className="material-symbols-outlined text-4xl text-primary opacity-20 group-hover:opacity-100 transition-opacity duration-300">{processData.phases[2].icon}</span>
          </div>
          <div className="mt-8">
            <p className="text-on-surface-variant leading-relaxed font-medium mb-8">
              {processData.phases[2].description}
            </p>
            <div className="flex flex-wrap gap-2">
              {processData.phases[2].tags?.map(tag => (
                <span key={tag} className="px-4 py-2 bg-surface-container-highest rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* Phase 03: Iterative Development */}
        <BentoCard className="md:col-span-2 bg-surface-container rounded-xl p-10 flex flex-col justify-between min-h-[450px] group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <span className="label-sm text-primary tracking-widest font-bold uppercase opacity-60">{processData.phases[3].phase}</span>
              <h2 className="text-4xl font-bold tracking-tight text-primary leading-tight whitespace-pre-line">{processData.phases[3].title}</h2>
            </div>
            <span className="material-symbols-outlined text-4xl text-primary opacity-30 group-hover:opacity-100 transition-opacity duration-300">{processData.phases[3].icon}</span>
          </div>
          <div className="mt-8">
            <p className="text-on-surface-variant leading-relaxed font-medium mb-8">
              {processData.phases[3].description}
            </p>
            <div className="bg-surface-container-low rounded-lg p-6 backdrop-blur-sm">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">{processData.phases[3].metric?.label}</span>
              <div className="text-3xl font-black text-primary tracking-tighter">{processData.phases[3].metric?.value}</div>
            </div>
          </div>
        </BentoCard>

        {/* Phase 04: Synaptic Deployment */}
        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          <BentoCard className="md:col-span-1 bg-surface-container-low rounded-xl p-8 flex flex-col gap-6">
            <span className="material-symbols-outlined text-primary text-3xl">{processData.phase4.sideCard.icon}</span>
            <div>
              <h4 className="font-bold text-primary mb-2">{processData.phase4.sideCard.title}</h4>
              <p className="text-xs text-on-surface-variant">{processData.phase4.sideCard.description}</p>
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-3 bg-surface-container rounded-xl p-10 flex flex-col md:flex-row justify-between items-center group">
            <div className="flex flex-col gap-2">
              <span className="label-sm text-primary tracking-widest font-bold uppercase">{processData.phase4.mainCard.phase}</span>
              <h2 className="text-4xl font-bold tracking-tight text-primary">{processData.phase4.mainCard.title}</h2>
            </div>
            <div className="mt-6 md:mt-0 flex gap-8 items-center">
              <div className="text-right">
                <span className="block text-[0.6rem] font-black uppercase tracking-widest text-on-surface-variant">{processData.phase4.mainCard.metrics[0].label}</span>
                <span className="text-2xl font-bold text-primary tracking-tighter">{processData.phase4.mainCard.metrics[0].value}</span>
              </div>
              <div className="h-12 w-[1px] bg-outline-variant opacity-20"></div>
              <div className="text-right">
                <span className="block text-[0.6rem] font-black uppercase tracking-widest text-on-surface-variant">{processData.phase4.mainCard.metrics[1].label}</span>
                <span className="text-2xl font-bold text-primary tracking-tighter">{processData.phase4.mainCard.metrics[1].value}</span>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* Phase 05: Continuous Optimization */}
        <BentoCard className="md:col-span-4 bg-surface-container-lowest rounded-xl p-10 border border-outline-variant/10 flex flex-col md:flex-row gap-12 group">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="label-sm text-primary tracking-widest font-bold uppercase">{processData.phase5.phase}</span>
              <h2 className="text-5xl font-extrabold tracking-tighter text-primary mt-4 whitespace-pre-line">{processData.phase5.title}</h2>
            </div>
            <p className="text-on-surface-variant mt-8 max-w-md font-medium">
              {processData.phase5.description}
            </p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {processData.phase5.features.map(feature => (
              <div key={feature.title} className="bg-surface-container-high rounded-lg p-6 flex flex-col justify-center gap-2">
                <span className="material-symbols-outlined text-primary">{feature.icon}</span>
                <div className="text-xl font-bold text-primary">{feature.title}</div>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>

    </main>
  )
}
