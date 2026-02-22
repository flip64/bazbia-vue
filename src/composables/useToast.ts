import { ref } from "vue"

export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
}

const toasts = ref<Toast[]>([])
let seed = 0

function remove(id: number) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

function show(
  message: string,
  type: ToastType = "info",
  duration = 3000
) {
  const id = seed++

  const toast: Toast = { id, message, type, duration }
  toasts.value.push(toast)

  setTimeout(() => remove(id), duration)
}

export function useToast() {
  return {
    toasts,
    show,
    remove,

    success: (msg: string, d?: number) => show(msg, "success", d),
    error: (msg: string, d?: number) => show(msg, "error", d),
    info: (msg: string, d?: number) => show(msg, "info", d),
    warning: (msg: string, d?: number) => show(msg, "warning", d),
  }
}