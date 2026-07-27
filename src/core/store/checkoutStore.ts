import { defineStore } from 'pinia'

import type {
  CheckoutAddress,
  CheckoutCustomer,
  CheckoutPaymentMethod,
  CheckoutShipping
} from '@/types/checkout.types'

const STORAGE_KEY = 'bazbia_checkout'

const createEmptyShipping =
  (): CheckoutShipping => ({
    quoteId: null,
    methodCode: '',
    methodTitle: '',
    cost: 0
  })

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
        fullAddress: '',
        postalCode: ''
      } as CheckoutAddress,

      shipping:
        createEmptyShipping(),

      paymentMethod:
        'online' as CheckoutPaymentMethod,

      initialized: false
    }),

    getters: {
      hasCustomerInformation: state => {
        const fullName = String(
          state.customer?.fullName ?? ''
        ).trim()

        const phone = String(
          state.customer?.phone ?? ''
        ).trim()

        return Boolean(
          fullName.length >= 3 &&
          /^09\d{9}$/.test(phone)
        )
      },

      hasAddressInformation: state => {
        const addressId =
          state.address?.addressId ?? null

        const province = String(
          state.address?.province ?? ''
        ).trim()

        const city = String(
          state.address?.city ?? ''
        ).trim()

        const fullAddress = String(
          state.address?.fullAddress ?? ''
        ).trim()

        const postalCode = String(
          state.address?.postalCode ?? ''
        ).trim()

        return Boolean(
          addressId &&
          province &&
          city &&
          fullAddress &&
          /^\d{10}$/.test(postalCode)
        )
      },

      hasShippingMethod: state => {
        const quoteId = String(
          state.shipping?.quoteId ?? ''
        ).trim()

        const methodCode = String(
          state.shipping?.methodCode ?? ''
        ).trim()

        return Boolean(
          quoteId &&
          methodCode
        )
      }
    },

    actions: {
      setCustomer(
        customer: CheckoutCustomer
      ): void {
        this.customer = {
          fullName: String(
            customer?.fullName ?? ''
          ).trim(),

          phone: String(
            customer?.phone ?? ''
          ).trim()
        }

        this.persist()
      },

      setAddress(
        address: CheckoutAddress
      ): void {
        const newAddressId =
          address?.addressId ?? null

        const addressChanged =
          this.address.addressId !==
          newAddressId

        this.address = {
          addressId: newAddressId,

          province: String(
            address?.province ?? ''
          ).trim(),

          city: String(
            address?.city ?? ''
          ).trim(),

          fullAddress: String(
            address?.fullAddress ?? ''
          ).trim(),

          postalCode: String(
            address?.postalCode ?? ''
          ).trim()
        }

        /*
         * هزینه و روش ارسال وابسته به آدرس است.
         * با تغییر آدرس، quote قبلی دیگر معتبر نیست.
         */
        if (addressChanged) {
          this.shipping =
            createEmptyShipping()
        }

        this.persist()
      },

      clearAddress(): void {
        this.address = {
          addressId: null,
          province: '',
          city: '',
          fullAddress: '',
          postalCode: ''
        }

        this.shipping =
          createEmptyShipping()

        this.persist()
      },

      setShipping(
        shipping: CheckoutShipping
      ): void {
        this.shipping = {
          quoteId:
            shipping?.quoteId ?? null,

          methodCode: String(
            shipping?.methodCode ?? ''
          ).trim(),

          methodTitle: String(
            shipping?.methodTitle ?? ''
          ).trim(),

          cost:
            Number(shipping?.cost) || 0
        }

        this.persist()
      },

      clearShipping(): void {
        this.shipping =
          createEmptyShipping()

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

            this.customer = {
              fullName: String(
                parsedState.customer
                  ?.fullName ?? ''
              ),

              phone: String(
                parsedState.customer
                  ?.phone ?? ''
              )
            }

            this.address = {
              addressId:
                parsedState.address
                  ?.addressId ?? null,

              province: String(
                parsedState.address
                  ?.province ?? ''
              ),

              city: String(
                parsedState.address
                  ?.city ?? ''
              ),

              fullAddress: String(
                parsedState.address
                  ?.fullAddress ??
                parsedState.address
                  ?.address ??
                ''
              ),

              postalCode: String(
                parsedState.address
                  ?.postalCode ?? ''
              )
            }

            this.shipping = {
              quoteId:
                parsedState.shipping
                  ?.quoteId ?? null,

              methodCode: String(
                parsedState.shipping
                  ?.methodCode ?? ''
              ),

              methodTitle: String(
                parsedState.shipping
                  ?.methodTitle ?? ''
              ),

              cost:
                Number(
                  parsedState.shipping
                    ?.cost
                ) || 0
            }

            this.paymentMethod =
              parsedState.paymentMethod ===
              'cod'
                ? 'cod'
                : 'online'

            /*
             * اگر آدرس معتبری وجود ندارد،
             * روش ارسال قبلی نباید بازیابی شود.
             */
            if (!this.address.addressId) {
              this.shipping =
                createEmptyShipping()
            }

            /*
             * quote ناقص هم معتبر نیست.
             */
            if (
              !this.shipping.quoteId ||
              !this.shipping.methodCode
            ) {
              this.shipping =
                createEmptyShipping()
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
          fullAddress: '',
          postalCode: ''
        }

        this.shipping =
          createEmptyShipping()

        this.paymentMethod = 'online'
        this.initialized = true

        sessionStorage.removeItem(
          STORAGE_KEY
        )
      }
    }
  }
)
