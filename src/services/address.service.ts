import api from '@/core/api/client'
import { API_ENDPOINTS } from '@/core/api/endpoints'

import type {
  CustomerAddress,
  CreateCustomerAddressPayload,
  UpdateCustomerAddressPayload
} from '@/types/address.types'

export const addressService = {
  async getAddresses(): Promise<CustomerAddress[]> {
    const response = await api.get<CustomerAddress[]>(
      API_ENDPOINTS.USER.ADDRESSES
    )

    return response.data
  },

  async getAddress(
    id: number
  ): Promise<CustomerAddress> {
    const response = await api.get<CustomerAddress>(
      API_ENDPOINTS.USER.ADDRESS(id)
    )

    return response.data
  },

  async createAddress(
    payload: CreateCustomerAddressPayload
  ): Promise<CustomerAddress> {
    const response = await api.post<CustomerAddress>(
      API_ENDPOINTS.USER.ADDRESSES,
      payload
    )

    return response.data
  },

  async updateAddress(
    id: number,
    payload: UpdateCustomerAddressPayload
  ): Promise<CustomerAddress> {
    const response = await api.patch<CustomerAddress>(
      API_ENDPOINTS.USER.ADDRESS(id),
      payload
    )

    return response.data
  },

  async deleteAddress(
    id: number
  ): Promise<void> {
    await api.delete(
      API_ENDPOINTS.USER.ADDRESS(id)
    )
  }
}
