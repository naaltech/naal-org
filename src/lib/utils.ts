import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Sayfalar sunucuda render edildiği için tarihler okulun saat diliminde gösterilir.
export function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul", ...options })
}
