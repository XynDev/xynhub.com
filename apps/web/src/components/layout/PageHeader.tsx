import * as React from "react"
import { cn } from "../../lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  label: string
  headline: React.ReactNode
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ label, headline, description, children, className, ...props }: PageHeaderProps) {
  return (
    <header className={cn("mb-20 md:mb-32 flex flex-col md:flex-row items-end justify-between gap-8", className)} {...props}>
      <div className="max-w-4xl space-y-4 md:space-y-6">
        <span className="label-sm text-[0.6875rem] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-outline block">
          {label}
        </span>
        <h1 className="text-[3.5rem] md:text-[5.5rem] font-extrabold tracking-tighter leading-[0.9] text-primary whitespace-pre-line">
          {headline}
        </h1>
      </div>
      <div className="max-w-md pb-4 w-full md:w-auto">
        {description && (
          <p className="text-on-surface-variant text-lg leading-relaxed font-medium">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  )
}
