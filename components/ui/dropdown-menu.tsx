"use client"

import * as React from "react"

import { Slot } from "@/components/ui/slot"
import { cn } from "@/lib/utils"

const ENABLED_ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])'

type DropdownMenuContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  close: () => void
  triggerRef: React.RefObject<HTMLElement | null>
  contentId: string
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null)

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error("DropdownMenu components must be used within <DropdownMenu>")
  }
  return context
}

function DropdownMenu({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLElement>(null)
  const contentId = React.useId()

  const close = React.useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  React.useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, close])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, close, triggerRef, contentId }}>
      <div ref={rootRef} className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild = false, onClick, onKeyDown, ...props }, ref) => {
  const { open, setOpen, triggerRef, contentId } = useDropdownMenu()
  const Comp = asChild ? Slot : "button"

  React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement)

  return (
    <Comp
      ref={triggerRef as React.Ref<never>}
      type={asChild ? undefined : "button"}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        setOpen(!open)
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event)
        if (event.key === "ArrowDown") {
          event.preventDefault()
          setOpen(true)
        }
      }}
      {...props}
    />
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const contentAlignment = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
}

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: keyof typeof contentAlignment }
>(({ className, align = "start", onKeyDown, ...props }, ref) => {
  const { open, setOpen, contentId } = useDropdownMenu()
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useImperativeHandle(ref, () => contentRef.current as HTMLDivElement)

  React.useEffect(() => {
    if (!open) return

    const content = contentRef.current
    const firstItem = content?.querySelector<HTMLElement>(ENABLED_ITEM_SELECTOR)
    ;(firstItem ?? content)?.focus()
  }, [open])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)

    if (event.key === "Tab") {
      setOpen(false)
      return
    }

    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(ENABLED_ITEM_SELECTOR)
    )
    if (items.length === 0) return

    const currentIndex = items.indexOf(document.activeElement as HTMLElement)
    const targetIndexes: Record<string, number> = {
      ArrowDown: (currentIndex + 1) % items.length,
      ArrowUp: (currentIndex - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    }
    const nextIndex = targetIndexes[event.key]

    if (nextIndex !== undefined) {
      event.preventDefault()
      items[nextIndex].focus()
    }
  }

  if (!open) return null

  return (
    <div
      ref={contentRef}
      id={contentId}
      role="menu"
      tabIndex={-1}
      className={cn(
        "absolute top-full z-50 mt-1 max-h-[calc(100vh-8rem)] w-max min-w-[8rem] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 focus:outline-none",
        contentAlignment[align],
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { disabled?: boolean }
>(({ className, disabled = false, onClick, onKeyDown, ...props }, ref) => {
  const { close } = useDropdownMenu()

  return (
    <div
      ref={ref}
      role="menuitem"
      tabIndex={disabled ? undefined : -1}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!disabled) close()
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          const target = event.currentTarget.querySelector("a") ?? event.currentTarget
          target.click()
        }
      }}
      {...props}
    />
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
}
