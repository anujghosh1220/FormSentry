import React, { useRef, useState, type MouseEvent, type ReactNode } from "react"
import { cn } from "../../lib/utils"

export interface HoverGlowButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  glowColor?: string
  backgroundColor?: string
  textColor?: string
  hoverTextColor?: string
}

/**
 * A button with a genuine cursor-following glow: a large radial gradient is
 * parked under the label and translated to the pointer position, scaling up
 * from nothing on enter.
 */
const HoverButton: React.FC<HoverGlowButtonProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  glowColor = "#00ffc3",
  backgroundColor = "#111827",
  textColor = "#ffffff",
  hoverTextColor = "#67e8f9",
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    setGlowPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative inline-block cursor-pointer overflow-hidden rounded-lg border-none px-8 py-4 text-xl font-sans transition-colors duration-300",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      style={{
        backgroundColor,
        color: isHovered ? hoverTextColor : textColor,
      }}
    >
      {/* Glow effect */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute size-[200px] rounded-full opacity-50 transition-transform duration-400 ease-out -translate-x-1/2 -translate-y-1/2",
          isHovered ? "scale-120" : "scale-0"
        )}
        style={{
          left: `${glowPosition.x}px`,
          top: `${glowPosition.y}px`,
          background: `radial-gradient(circle, ${glowColor} 10%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export { HoverButton }

export default HoverButton
