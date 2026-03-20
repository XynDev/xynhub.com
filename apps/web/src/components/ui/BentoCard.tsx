import * as React from "react"
import { cn } from "../../lib/utils"

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bento-card rounded-xl overflow-hidden relative",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
BentoCard.displayName = "BentoCard"

export { BentoCard }
