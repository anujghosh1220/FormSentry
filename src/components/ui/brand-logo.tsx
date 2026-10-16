import { cn } from "../../lib/utils"

export interface BrandLogoProps {
  className?: string
  /** Pixel height; width follows the emblem's 3:2 aspect ratio. */
  height?: number
  /** Accessible label; defaults to the brand name. */
  alt?: string
}

/**
 * The FormSentry Guardian Emblem, served from Vite's `public/` directory.
 *
 * The emblem already contains the brand name, so it is used standalone — no
 * adjacent text label. `object-contain` keeps the original 3:2 proportions at
 * every size so the mark stays crisp without stretching or cropping.
 */
export function BrandLogo({
  className,
  height = 42,
  alt = "FormSentry",
}: BrandLogoProps) {
  const width = Math.round(height * (1536 / 1024))
  return (
    <img
      src="/FormSentry%20Guardian%20Emblem.png"
      alt={alt}
      width={width}
      height={height}
      className={cn("block object-contain", className)}
    />
  )
}

export default BrandLogo