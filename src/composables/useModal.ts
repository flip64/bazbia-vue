import { reactive } from "vue"

export type ModalAction = "confirm" | "cancel" | null

export interface ModalState {
  show: boolean
  title: string
  content: string
  action: ModalAction
}

const modal = reactive<ModalState>({
  show: false,
  title: "",
  content: "",
  action: null,
})

function openModal(
  title: string,
  content: string,
  action: ModalAction = null
) {
  modal.title = title
  modal.content = content
  modal.action = action
  modal.show = true
}

function closeModal() {
  modal.show = false
  modal.title = ""
  modal.content = ""
  modal.action = null
}

function confirm() {
  modal.action = "confirm"
  closeModal()
}

function cancel() {
  modal.action = "cancel"
  closeModal()
}

export function useModal() {
  return {
    modal,
    openModal,
    closeModal,
    confirm,
    cancel,
  }
}
