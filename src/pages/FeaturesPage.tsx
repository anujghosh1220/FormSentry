import { Link } from "react-router-dom"
import { ArrowRight, ShieldCheck, Wand2 } from "lucide-react"
import { Button } from "../components/ui/Button"
import { HoverGlowButton } from "../components/effects/HoverGlowButton"
import { FeaturesBento } from "../components/effects/FeaturesBento"

const HIGHLIGHTS = [
  {
    title: "Live canvas",
    body: "Fields appear as soon as you pick them from the library. Select, reorder, duplicate and tune rules without leaving the page.",
  },
  {
    title: "Rules as you type",
    body: "Required, length, range, date and pattern rules are checked against the current value in the preview, so mistakes surface immediately.",
  },
  {
    title: "Nothing leaves the device",
    body: "Forms, templates and exports live in this browser's local storage. There is no backend, no account and no telemetry.",
  },
]

export function FeaturesPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
          Features
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          A form studio that behaves
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          The bento below is the interactive feature section: edits flow through the validation hub into
          generated schemas, the local toolchain syncs one tool at a time, and the forecast chart is
          scrubbable.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link to="/">
            <HoverGlowButton>
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Back to dashboard
            </HoverGlowButton>
          </Link>
          <Link to="/templates">
            <Button variant="outline">
              Browse templates
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </header>

      <FeaturesBento />

      <ul className="grid gap-3 sm:grid-cols-3">
        {HIGHLIGHTS.map((item) => (
          <li
            key={item.title}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <h2 className="text-sm font-semibold text-foreground">{item.title}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FeaturesPage
