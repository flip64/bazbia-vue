export interface ContactMessagePayload {
  name: string
  phone: string
  email?: string
  subject: string
  order_number?: number | null
  message: string
}

export interface ContactMessageResponse {
  success: boolean
  message: string
  data: {
    id: number
    created_at: string
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://backend.bazbia.ir'

export const contactService = {
  async sendMessage(
    payload: ContactMessagePayload
  ): Promise<ContactMessageResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/contact/messages/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(
        data?.detail ||
        data?.message ||
        'ارسال پیام با خطا مواجه شد.'
      )

      ;(
        error as Error & {
          responseData?: unknown
        }
      ).responseData = data

      throw error
    }

    return data as ContactMessageResponse
  }
}
