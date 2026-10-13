import { forwardRef, LabelHTMLAttributes } from "react"

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`block text-sm font-medium text-[--color-text] ${className}`}
        {...props}
      >
        {children}
      </label>
    )
  }
)

Label.displayName = "Label"

