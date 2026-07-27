export interface ShippingQuoteRequest {
  address_id: number
}

export interface ShippingEstimatedDays {
  min: number
  max: number
}

export interface ShippingMethod {
  code: string
  title: string
  description: string
  cost: number
  currency: 'TOMAN'
  estimated_days: ShippingEstimatedDays
}

export interface ShippingPackingSummary {
  status: string
  package_count: number
  total_items_weight: number | null
  total_carton_weight: number | null
  chargeable_weight: number | null
}

export interface ShippingQuoteAddress {
  id: number
  province: string
  city: string
}

export interface ShippingQuote {
  quote_id: string
  address: ShippingQuoteAddress
  packing: ShippingPackingSummary
  methods: ShippingMethod[]
  expires_at: string
}
