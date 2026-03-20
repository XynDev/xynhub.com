import * as React from "react"
import { cn } from "../../lib/utils"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  label: string
}

export function SectionHeader({ title, label, className, ...props }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-16", className)} {...props}>
      <h2 className="text-4xl font-bold tracking-tighter text-primary">{title}</h2>
      <div className="h-px flex-grow mx-12 bg-outline-variant/30"></div>
      <span className="label-sm tracking-widest text-outline uppercase">{label}</span>
    </div>
  )
}
