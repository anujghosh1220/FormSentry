import { forwardRef, TextareaHTMLAttributes } from "react"

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helpText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, helpText, id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).slice(2)

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[--color-text]">
            {label}
            {props.required && <span className="text-[--color-danger] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`w-full px-3 py-2 border rounded-lg bg-white text-[--color-text] placeholder-[--color-text-muted] focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-transparent transition-colors ${error ? "border-[--color-danger]" : "border-[--color-border]"} ${className}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? inputId + "-error" : helpText ? inputId + "-help" : undefined}
          {...props}
        />
        {helpText && !error && (
          <p id={inputId + "-help"} className="text-xs text-[--color-text-muted]">
            {helpText}
          </p>
        )}
        {error && (
          <p id={inputId + "-error"} className="text-xs text-[--color-danger]">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

