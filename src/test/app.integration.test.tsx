// @vitest-environment jsdom
import { describe, expect, it, beforeAll } from "vitest"
import { render, screen, within, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "../App"

/* jsdom has no WebGL, no SMIL, no matchMedia by default — stub just enough to
   let the effects render and assert they are wired, not that they animate. */
beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia
  }
  if (!window.IntersectionObserver) {
    const createObserver = () => {
      const callbackHolder: { callback?: (entries: unknown[], observer: unknown) => void } = {}
      const Observer = class {
        constructor(callback: (entries: unknown[], observer: unknown) => void) {
          callbackHolder.callback = callback
        }
        observe(target: Element) {
          callbackHolder.callback?.([{ isIntersecting: true, target }], this)
        }
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return []
        }
      }
      return Observer
    }
    window.IntersectionObserver = createObserver() as unknown as typeof IntersectionObserver
  }
  if (!window.ResizeObserver) {
    const Observer = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    window.ResizeObserver = Observer as unknown as typeof window.ResizeObserver
  }
  HTMLCanvasElement.prototype.getContext = (() => null) as unknown as HTMLCanvasElement["getContext"]
})

describe("FormSentry app integration", () => {
  it("renders the shell, hero, bento and gallery together", () => {
    localStorage.clear()
    cleanup()
    render(<App />)

    /* app shell: brand + real routing nav */
    expect(screen.getAllByRole("link", { name: /FormSentry/ }).length).toBeGreaterThan(0)
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeTruthy()
    expect(screen.getAllByRole("link", { name: "Templates" }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole("link", { name: "Features" }).length).toBeGreaterThan(0)

    /* command menu trigger is present in the shell */
    expect(screen.getByRole("button", { name: /Search or jump to/ })).toBeTruthy()

    /* hero copy from the GlassFold surface */
    expect(screen.getByRole("heading", { level: 1, name: /validate themselves/ })).toBeTruthy()
    expect(screen.getAllByRole("button", { name: /Author a form/ }).length).toBeGreaterThan(0)

    /* ink orbit bento: three live diagrams + copy */
    expect(screen.getByRole("img", { name: /edits flow through FormSentry/ })).toBeTruthy()
    expect(screen.getByRole("group", { name: "Integrations" })).toBeTruthy()
    expect(screen.getByRole("img", { name: /Validation forecast chart/ })).toBeTruthy()
    expect(screen.getByText("Live form editing")).toBeTruthy()
    expect(screen.getByText("Generated form schemas")).toBeTruthy()
    expect(screen.getByText("Local toolchain")).toBeTruthy()
    expect(screen.getByText(/syncing ·/)).toBeTruthy()
    expect(screen.getAllByText(/Templates|Rules|Import|Export/).length).toBeGreaterThan(0)

    /* template gallery: real rows with hover reveal images */
    const gallery = screen.getByRole("region", { name: "Template gallery" })
    expect(within(gallery).getAllByText("Contact Us").length).toBeGreaterThan(0)
    expect(within(gallery).getAllByText("Event RSVP").length).toBeGreaterThan(0)
    const previewImages = gallery.querySelectorAll('img[src^="data:image/svg+xml"]')
    expect(previewImages.length).toBe(6)

    /* empty state + stats */
    expect(screen.getByText("No forms yet")).toBeTruthy()
    expect(screen.getByText("Fields", { selector: "dt" })).toBeTruthy()
  })

  it("opens the author dialog and creates a form in storage", async () => {
    localStorage.clear()
    cleanup()
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getAllByRole("button", { name: /Author a form/ })[0])

    const nameField = await screen.findByLabelText(/Form name/)
    const descriptionField = screen.getByLabelText("Description")

    await user.type(nameField, "Support intake")
    await user.type(descriptionField, "Triage requests")

    /* icon picker is a real control */
    await user.click(screen.getByRole("button", { name: "Choose form icon" }))
    await user.click(screen.getByRole("button", { name: /Use mail icon/ }))

    await user.click(screen.getByRole("button", { name: "Create form" }))

    const stored = JSON.parse(localStorage.getItem("formsentry_forms") || "{}")
    expect(Array.isArray(stored.forms)).toBe(true)
    expect(stored.forms).toHaveLength(1)
    expect(stored.forms[0].title).toBe("Support intake")
    expect(stored.forms[0].description).toBe("Triage requests")
    expect(stored.forms[0].icon).toBe("mail")
  })
})
