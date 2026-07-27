import type {
  NavigationGuard,
  RouteLocationRaw
} from 'vue-router'

import {
  useCheckoutStore
} from '@/core/store/checkoutStore'

export const checkoutGuard: NavigationGuard = (
  to
): true | RouteLocationRaw => {
  const checkoutStore = useCheckoutStore()

  checkoutStore.initialize()

  const routeName = String(to.name ?? '')

  if (
    routeName === 'checkout-address' &&
    !checkoutStore.hasCustomerInformation
  ) {
    return {
      name: 'checkout-customer'
    }
  }

  if (
    routeName === 'checkout-shipping'
  ) {
    if (
      !checkoutStore.hasCustomerInformation
    ) {
      return {
        name: 'checkout-customer'
      }
    }

    if (
      !checkoutStore.hasAddressInformation
    ) {
      return {
        name: 'checkout-address'
      }
    }
  }

  if (
    routeName === 'checkout-review'
  ) {
    if (
      !checkoutStore.hasCustomerInformation
    ) {
      return {
        name: 'checkout-customer'
      }
    }

    if (
      !checkoutStore.hasAddressInformation
    ) {
      return {
        name: 'checkout-address'
      }
    }

    if (
      !checkoutStore.hasShippingMethod
    ) {
      return {
        name: 'checkout-shipping'
      }
    }
  }

  return true
}
