import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline"
  dot?: boolean
}

function Badge({ className, variant = "default", dot = false, children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 label-sm font-bold uppercase tracking-widest text-[0.6875rem]",
        {
          "bg-surface-container-high border border-outline-variant/15": variant === "default",
          "bg-transparent border border-outline-variant/20": variant === "outline",
        },
        className
      )}
      {...props}
    >
      {dot && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
      {children}
    </div>
  )
}

export { Badge }
