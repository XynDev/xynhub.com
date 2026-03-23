import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-bold transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 uppercase tracking-wide",
          {
            "bg-primary text-on-primary hover:opacity-90 shadow-xl shadow-white/5": variant === "primary",
            "bg-surface-container-highest text-primary border border-outline-variant/20 hover:bg-surface-container-high": variant === "secondary",
            "bg-transparent text-primary border border-outline-variant/20 hover:bg-surface-container-highest": variant === "outline",
            "bg-transparent hover:bg-surface-container-high text-primary": variant === "ghost",
          },
          {
            "px-6 py-2.5 text-xs": size === "sm",
            "px-8 py-3.5 text-sm": size === "md",
            "px-10 py-4 text-sm": size === "lg",
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
