import { useEffect, useState, type ReactNode } from "react"
import { GlassFold as GlassFoldShader } from "../ui/glass-fold"
import { cn } from "../../lib/utils"

export interface GlassFoldBackgroundProps {
  className?: string
  children?: ReactNode
  /** Colour of the glass panes. */
  color1?: string
  /** Colour of the background behind the panes. */
  color2?: string
  /** Colour of the lit folded edges. */
  color3?: string
  speed?: number
  scale?: number
  noise?: number
}

/** Crimson Sentinel glass-fold palette. */
const GLASS_FOLD_DEFAULTS = {
  color1: "#F04452",
  color2: "#0A0A0C",
  color3: "#FFC9CF",
  speed: 0.5,
  scale: 1.1,
  noise: 0.14,
}

function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl")
      setSupported(Boolean(gl))
    } catch {
      setSupported(false)
    }
  }, [])

  return supported
}

/**
 * Animated folded-glass WebGL background. When WebGL is unavailable the same
 * three colours are reproduced with CSS so the hero never degrades to a flat
 * block; with reduced motion the shader paints a single still frame.
 */
export function GlassFold({
  className,
  children,
  color1 = GLASS_FOLD_DEFAULTS.color1,
  color2 = GLASS_FOLD_DEFAULTS.color2,
  color3 = GLASS_FOLD_DEFAULTS.color3,
  speed = GLASS_FOLD_DEFAULTS.speed,
  scale = GLASS_FOLD_DEFAULTS.scale,
  noise = GLASS_FOLD_DEFAULTS.noise,
}: GlassFoldBackgroundProps) {
  const webgl = useWebGLSupport()

  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      {webgl ? (
        <GlassFoldShader
          className="absolute inset-0 -z-10 h-full w-full"
          color1={color1}
          color2={color2}
          color3={color3}
          speed={speed}
          scale={scale}
          noise={noise}
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background: `
              radial-gradient(120% 90% at 18% 8%, ${hexToRgba(color1, 0.55)} 0%, transparent 55%),
              radial-gradient(100% 80% at 85% 20%, ${hexToRgba(color3, 0.35)} 0%, transparent 60%),
              repeating-linear-gradient(115deg, ${hexToRgba(color3, 0.1)} 0 1px, transparent 1px 14px),
              linear-gradient(180deg, ${color2} 0%, #05050a 100%)
            `,
          }}
        />
      )}

      {webgl && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/45 via-background/65 to-background/95"
        />
      )}

      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}

function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace("#", "")
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value
  const n = parseInt(full, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default GlassFold
