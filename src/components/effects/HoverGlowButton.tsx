import { forwardRef } from "react"
import { Button, type ButtonProps } from "../ui/Button"
import { cn } from "../../lib/utils"

export interface HoverGlowButtonProps extends ButtonProps {
  /** Colour of the cursor-following glow. */
  glowColor?: string
  /** Glow radius in pixels. */
  glowSize?: number
  /** Glow opacity while hovered, 0–1. */
  glowOpacity?: number
}

/**
 * The FormSentry button with a real cursor-following glow. The glow layer is
 * a radial gradient translated to the pointer, so it tracks the cursor across
 * the whole button surface rather than sitting behind a static hover state.
 */
export const HoverGlowButton = forwardRef<HTMLButtonElement, HoverGlowButtonProps>(
  (
    {
      className,
      children,
      glowColor = "rgba(240, 68, 82, 0.55)",
      glowSize = 180,
      glowOpacity = 0.9,
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget
      const rect = target.getBoundingClientRect()
      target.style.setProperty("--glow-x", `${event.clientX - rect.left}px`)
      target.style.setProperty("--glow-y", `${event.clientY - rect.top}px`)
      target.style.setProperty("--glow-opacity", "1")
      onMouseMove?.(event)
    }

    const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget
      target.style.setProperty("--glow-opacity", "0")
      onMouseLeave?.(event)
    }

    return (
      <Button
        ref={ref}
        className={cn("group relative overflow-hidden", className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full transition-opacity duration-200"
          style={{
            left: "var(--glow-x, 50%)",
            top: "var(--glow-y, 50%)",
            width: `${glowSize}px`,
            height: `${glowSize}px`,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            opacity: `calc(${glowOpacity} * var(--glow-opacity, 0))`,
          }}
        />
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </Button>
    )
  }
)

HoverGlowButton.displayName = "HoverGlowButton"

export default HoverGlowButton
