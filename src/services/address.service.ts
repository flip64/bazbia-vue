import api from '@/core/api'

import type {
  CustomerAddress,
  CreateCustomerAddressPayload,
  UpdateCustomerAddressPayload
} from '@/types/address.types'

const BASE_URL = '/customers/addresses/'

export const addressService = {
  async getAddresses(): Promise<CustomerAddress[]> {
    const response = await api.get<CustomerAddress[]>(
      BASE_URL
    )

    return response.data
  },

  async getAddress(
    id: number
  ): Promise<CustomerAddress> {
    const response = await api.get<CustomerAddress>(
      `${BASE_URL}${id}/`
    )

    return response.data
  },

  async createAddress(
    payload: CreateCustomerAddressPayload
  ): Promise<CustomerAddress> {
    const response = await api.post<CustomerAddress>(
      BASE_URL,
      payload
    )

    return response.data
  },

  async updateAddress(
    id: number,
    payload: UpdateCustomerAddressPayload
  ): Promise<CustomerAddress> {
    const response = await api.patch<CustomerAddress>(
      `${BASE_URL}${id}/`,
      payload
    )

    return response.data
  },

  async deleteAddress(
    id: number
  ): Promise<void> {
    await api.delete(
      `${BASE_URL}${id}/`
    )
  }
}
