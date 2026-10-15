import InkOrbitFeatures from "../ui/ink-orbit-features"

/**
 * FormSentry-flavoured bento of three live diagrams: field edits flowing
 * through the validation hub into generated schemas, the local toolchain
 * (templates / rules / import / export) syncing one at a time, and a
 * forecast-style chart of validation outcomes.
 */
export function FeaturesBento({ className }: { className?: string }) {
  return (
    <InkOrbitFeatures
      className={className}
      theme="dark"
      brand="FormSentry"
      revealThreshold={0.01}
      tag="How FormSentry behaves"
      title="Every field, *validated* as you build"
      collaboration={{
        title: "Live form editing",
        description:
          "Add, reorder and tune fields in real time — every change is reflected in the canvas, the rules panel and the preview at once, without switching screens.",
      }}
      reports={{
        title: "Generated form schemas",
        description:
          "Clean, structured form definitions are produced from your layout — no boilerplate, no hand-written JSON, ready to export the moment you are done.",
      }}
      integrations={{
        title: "Local toolchain",
        description:
          "Templates, validation rules, JSON import and export all run inside one offline system — nothing ever leaves your browser.",
        tools: ["Templates", "Rules", "Import", "Export"],
      }}
      insights={{
        title: "Validation forecast",
        description:
          "Rules are checked against your data as you type, so you can see which submissions pass before anyone fills the form in.",
        values: [22, 26, 24, 31, 29, 36, 34, 41, 39, 47, 52, 58],
        forecastFrom: 8,
      }}
    />
  )
}

export default FeaturesBento
