import { forwardRef, ButtonHTMLAttributes } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success"
  size?: "sm" | "md" | "lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

    const variants: Record<string, string> = {
      primary: "bg-[--color-primary] text-white hover:bg-[--color-primary-hover] focus:ring-[--color-primary]",
      secondary: "bg-white text-[--color-text] border border-[--color-border] hover:bg-[--color-bg-alt] focus:ring-[--color-primary]",
      ghost: "bg-transparent text-[--color-text-muted] hover:text-[--color-text] hover:bg-[--color-bg-alt]",
      danger: "bg-[--color-danger] text-white hover:bg-red-700 focus:ring-red-500",
      success: "bg-[--color-success] text-white hover:bg-green-700 focus:ring-green-500",
    }

    const sizes: Record<string, string> = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

