"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { XMarkIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils"

const TOAST_DURATION = 5000

const ToastContext = React.createContext<{ dismiss: () => void } | null>(null)

const ToastViewport = React.forwardRef<
  HTMLOListElement,
  React.OlHTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    aria-live="polite"
    className={cn(
      "pointer-events-none fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = "ToastViewport"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all animate-in slide-in-from-top-full sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement> &
    VariantProps<typeof toastVariants> & {
      open?: boolean
      onOpenChange?: (open: boolean) => void
    }
>(({ className, variant, open = true, onOpenChange, ...props }, ref) => {
  const dismiss = React.useCallback(() => onOpenChange?.(false), [onOpenChange])

  React.useEffect(() => {
    if (!open) return

    const timeout = setTimeout(dismiss, TOAST_DURATION)
    return () => clearTimeout(timeout)
  }, [open, dismiss])

  if (!open) return null

  return (
    <ToastContext.Provider value={{ dismiss }}>
      <li
        ref={ref}
        role={variant === "destructive" ? "alert" : "status"}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      />
    </ToastContext.Provider>
  )
})
Toast.displayName = "Toast"

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const context = React.useContext(ToastContext)

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        context?.dismiss()
      }}
      {...props}
    >
      <XMarkIcon className="h-4 w-4" />
    </button>
  )
})
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = "ToastDescription"

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement

export {
  type ToastProps,
  type ToastActionElement,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
}
