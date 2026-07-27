import api from '@/core/api/client'

import type {
  ShippingQuote,
  ShippingQuoteRequest
} from '@/types/shipping.types'

const CART_QUOTE_URL =
  '/bazbia_packing/checkout/cart-quote/'



export const shippingService = {
  async getCartQuote(
    payload: ShippingQuoteRequest
  ): Promise<ShippingQuote> {
    const response =
      await api.post<ShippingQuote>(
        CART_QUOTE_URL,
        payload
      )

    return response.data
  }
}
