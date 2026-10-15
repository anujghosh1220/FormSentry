import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "outline"
  size?: "sm" | "md" | "lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111113] disabled:opacity-50 disabled:cursor-not-allowed"

    const variants: Record<string, string> = {
      primary: "bg-[--color-primary] text-white hover:bg-[--color-primary-hover] focus:ring-[--color-ring]",
      secondary: "bg-[--color-bg-secondary] text-[--color-text] border border-[--color-border] hover:bg-[--color-bg-surface] focus:ring-[--color-ring]",
      outline: "bg-transparent text-[--color-text] border border-[--color-border] hover:bg-[--color-bg-secondary] focus:ring-[--color-ring]",
      ghost: "bg-transparent text-[--color-text-muted] hover:text-[--color-text] hover:bg-[--color-bg-secondary]",
      danger: "bg-[--color-danger] text-white hover:bg-red-600 focus:ring-red-500",
      success: "bg-[--color-success] text-white hover:bg-green-600 focus:ring-green-500",
    }

    const sizes: Record<string, string> = {
      sm: "px-3 py-1.5 text-sm h-8",
      md: "px-4 py-2 text-sm h-9",
      lg: "px-6 py-3 text-base h-10",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

