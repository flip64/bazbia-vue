import { defineStore } from 'pinia'

import type {
  CheckoutAddress,
  CheckoutCustomer,
  CheckoutPaymentMethod,
  CheckoutShipping
} from '@/types/checkout.types'

const STORAGE_KEY = 'bazbia_checkout'

export const useCheckoutStore = defineStore(
  'checkout',
  {
    state: () => ({
      customer: {
        fullName: '',
        phone: ''
      } as CheckoutCustomer,

      address: {
        addressId: null,
        province: '',
        city: '',
        address: '',
        postalCode: ''
      } as CheckoutAddress,

      shipping: {
        quoteId: null,
        methodCode: '',
        methodTitle: '',
        cost: 0
      } as CheckoutShipping,

      paymentMethod:
        'online' as CheckoutPaymentMethod,

      initialized: false
    }),

    getters: {
      hasCustomerInformation: state => {
        return Boolean(
          state.customer.fullName.trim() &&
          state.customer.phone.trim()
        )
      },

      hasAddressInformation: state => {
        return Boolean(
          state.address.province.trim() &&
          state.address.city.trim() &&
          state.address.address.trim() &&
          state.address.postalCode.trim()
        )
      },

      hasShippingMethod: state => {
        return Boolean(
          state.shipping.methodCode
        )
      }
    },

    actions: {
      setCustomer(
        customer: CheckoutCustomer
      ): void {
        this.customer = {
          ...customer
        }

        this.persist()
      },

      setAddress(
        address: CheckoutAddress
      ): void {
        this.address = {
          ...address
        }

        this.persist()
      },

      setShipping(
        shipping: CheckoutShipping
      ): void {
        this.shipping = {
          ...shipping
        }

        this.persist()
      },

      setPaymentMethod(
        method: CheckoutPaymentMethod
      ): void {
        this.paymentMethod = method

        this.persist()
      },

      initialize(): void {
        if (this.initialized) {
          return
        }

        const savedState =
          sessionStorage.getItem(
            STORAGE_KEY
          )

        if (savedState) {
          try {
            const parsedState =
              JSON.parse(savedState)

            if (parsedState.customer) {
              this.customer = {
                ...this.customer,
                ...parsedState.customer
              }
            }

            if (parsedState.address) {
              this.address = {
                ...this.address,
                ...parsedState.address
              }
            }

            if (parsedState.shipping) {
              this.shipping = {
                ...this.shipping,
                ...parsedState.shipping
              }
            }

            if (parsedState.paymentMethod) {
              this.paymentMethod =
                parsedState.paymentMethod
            }
          } catch (error) {
            console.error(
              'Checkout storage error:',
              error
            )

            sessionStorage.removeItem(
              STORAGE_KEY
            )
          }
        }

        this.initialized = true
      },

      persist(): void {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            customer: this.customer,
            address: this.address,
            shipping: this.shipping,
            paymentMethod:
              this.paymentMethod
          })
        )
      },

      reset(): void {
        this.customer = {
          fullName: '',
          phone: ''
        }

        this.address = {
          addressId: null,
          province: '',
          city: '',
          address: '',
          postalCode: ''
        }

        this.shipping = {
          quoteId: null,
          methodCode: '',
          methodTitle: '',
          cost: 0
        }

        this.paymentMethod = 'online'

        sessionStorage.removeItem(
          STORAGE_KEY
        )
      }
    }
  }
)
