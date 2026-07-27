export interface CheckoutCustomer {
  fullName: string
  phone: string
}

export interface CheckoutAddress {
  addressId: number | null
  province: string
  city: string
  address: string
  postalCode: string
}

export interface CheckoutShipping {
  quoteId: string | null
  methodCode: string
  methodTitle: string
  cost: number
}

export type CheckoutPaymentMethod =
  | 'online'
  | 'cod'
