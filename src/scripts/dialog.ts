import xMarkIcon from "heroicons/24/outline/x-mark.svg?raw"

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

let dialogCount = 0

// <template> içeriğini body altında modal olarak açar. Native <dialog> kullanılmıyor,
// çünkü top layer dialog içindeki butonların açtığı toast'ları gizler.
export function openDialog(template: HTMLTemplateElement) {
  const previouslyFocused = document.activeElement as HTMLElement | null
  // html'de overflow-x tanımlı olduğu için sayfa kaydırması body'den kilitlenemez.
  const root = document.documentElement
  const { overflow } = root.style
  const { paddingRight } = document.body.style
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

  const overlay = document.createElement("div")
  overlay.setAttribute("aria-hidden", "true")
  overlay.className = "fixed inset-0 z-50 bg-black/80 animate-in fade-in-0"

  const panel = document.createElement("div")
  panel.setAttribute("role", "dialog")
  panel.setAttribute("aria-modal", "true")
  panel.tabIndex = -1
  panel.className = `fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] focus:outline-none sm:rounded-lg ${template.dataset.dialogClass ?? "max-w-lg p-6"}`
  panel.append(template.content.cloneNode(true))

  const title = panel.querySelector("[data-dialog-title]")
  if (title) {
    title.id = `dialog-title-${++dialogCount}`
    panel.setAttribute("aria-labelledby", title.id)
  }

  const closeButton = document.createElement("button")
  closeButton.type = "button"
  closeButton.className = "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none [&_svg]:size-4"
  closeButton.innerHTML = `${xMarkIcon}<span class="sr-only">Kapat</span>`
  panel.append(closeButton)

  const close = () => {
    overlay.remove()
    panel.remove()
    document.removeEventListener("keydown", handleKeyDown)
    root.style.overflow = overflow
    document.body.style.paddingRight = paddingRight
    previouslyFocused?.focus()
  }

  // Escape ile kapat ve Tab'ı dialog içinde tut.
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      close()
      return
    }
    if (event.key !== "Tab") return

    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (!panel.contains(active)) {
      event.preventDefault()
      first.focus()
    } else if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  overlay.addEventListener("click", close)
  closeButton.addEventListener("click", close)
  document.addEventListener("keydown", handleKeyDown)

  root.style.overflow = "hidden"
  document.body.style.paddingRight = `${scrollbarWidth}px`
  document.body.append(overlay, panel)
  panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus()

  return panel
}
