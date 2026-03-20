import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-bold transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 uppercase tracking-wide",
          {
            "bg-primary text-on-primary hover:opacity-90 shadow-xl shadow-white/5": variant === "primary",
            "bg-surface-container-highest text-primary border border-outline-variant/20 hover:bg-surface-container-high": variant === "secondary",
            "bg-transparent text-primary border border-outline-variant/20 hover:bg-surface-container-highest": variant === "outline",
            "bg-transparent hover:bg-zinc-800 text-primary": variant === "ghost",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
