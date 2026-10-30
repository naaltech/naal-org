import * as React from "react"

import { cn } from "@/lib/utils"

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode
  [key: string]: unknown
}

function mergeProps(slotProps: Record<string, any>, childProps: Record<string, any>) {
  const merged = { ...slotProps, ...childProps }

  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key]
    const childValue = childProps[key]

    if (/^on[A-Z]/.test(key) && typeof slotValue === "function" && typeof childValue === "function") {
      merged[key] = (...args: unknown[]) => {
        childValue(...args)
        slotValue(...args)
      }
    }
  }

  merged.className = cn(slotProps.className, childProps.className)
  if (slotProps.style || childProps.style) {
    merged.style = { ...slotProps.style, ...childProps.style }
  }

  return merged
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}

// Renders its only child with the given props, like the asChild pattern expects.
const Slot = React.forwardRef<HTMLElement, SlotProps>(({ children, ...props }, ref) => {
  if (!React.isValidElement<Record<string, any>>(children)) {
    return null
  }

  const childRef = children.props.ref as React.Ref<HTMLElement> | undefined
  const merged = mergeProps(props, children.props)

  if (ref || childRef) {
    merged.ref = (node: HTMLElement | null) => {
      assignRef(ref, node)
      assignRef(childRef, node)
    }
  }

  return React.cloneElement(children, merged)
})
Slot.displayName = "Slot"

export { Slot }
