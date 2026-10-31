import xMarkIcon from "heroicons/24/outline/x-mark.svg?raw"

const TOAST_DURATION = 5000

const toastVariants = {
  default: "border bg-background text-foreground",
  destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
}

let viewport: HTMLOListElement | null = null
let dismissTimeout: ReturnType<typeof setTimeout> | undefined

function getViewport() {
  if (!viewport) {
    viewport = document.createElement("ol")
    viewport.setAttribute("aria-live", "polite")
    viewport.className = "pointer-events-none fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
    document.body.append(viewport)
  }
  return viewport
}

// Aynı anda tek toast gösterilir, yenisi öncekinin yerini alır.
export function toast({
  title,
  description,
  variant = "default",
}: {
  title: string
  description: string
  variant?: keyof typeof toastVariants
}) {
  const item = document.createElement("li")
  item.setAttribute("role", variant === "destructive" ? "alert" : "status")
  item.className = `group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all animate-in slide-in-from-top-full sm:slide-in-from-bottom-full ${toastVariants[variant]}`

  const content = document.createElement("div")
  content.className = "grid gap-1"
  const titleElement = document.createElement("div")
  titleElement.className = "text-sm font-semibold"
  titleElement.textContent = title
  const descriptionElement = document.createElement("div")
  descriptionElement.className = "text-sm opacity-90"
  descriptionElement.textContent = description
  content.append(titleElement, descriptionElement)

  const closeButton = document.createElement("button")
  closeButton.type = "button"
  closeButton.setAttribute("aria-label", "Kapat")
  closeButton.className = "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 [&_svg]:size-4"
  closeButton.innerHTML = xMarkIcon
  closeButton.addEventListener("click", () => item.remove())

  item.append(content, closeButton)
  getViewport().replaceChildren(item)

  clearTimeout(dismissTimeout)
  dismissTimeout = setTimeout(() => item.remove(), TOAST_DURATION)
}
