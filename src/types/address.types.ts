export interface CustomerAddress {
  id: number
  title: string
  recipient_name: string
  recipient_phone: string
  province: string
  city: string
  address: string
  postal_code: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface CreateCustomerAddressPayload {
  title?: string
  recipient_name: string
  recipient_phone: string
  province: string
  city: string
  address: string
  postal_code: string
  is_default?: boolean
}

export type UpdateCustomerAddressPayload =
  Partial<CreateCustomerAddressPayload>
