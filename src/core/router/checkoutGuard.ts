import type {
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router'

import {
  useCheckoutStore
} from '@/core/store/checkoutStore'

export const checkoutGuard = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const checkoutStore = useCheckoutStore()

  checkoutStore.initialize()

  const routeName = String(to.name ?? '')

  if (
    routeName === 'checkout-address' &&
    !checkoutStore.hasCustomerInformation
  ) {
    next({
      name: 'checkout-customer'
    })

    return
  }

  if (
    routeName === 'checkout-shipping' &&
    !checkoutStore.hasCustomerInformation
  ) {
    next({
      name: 'checkout-customer'
    })

    return
  }

  if (
    routeName === 'checkout-shipping' &&
    !checkoutStore.hasAddressInformation
  ) {
    next({
      name: 'checkout-address'
    })

    return
  }

  if (
    routeName === 'checkout-review' &&
    !checkoutStore.hasCustomerInformation
  ) {
    next({
      name: 'checkout-customer'
    })

    return
  }

  if (
    routeName === 'checkout-review' &&
    !checkoutStore.hasAddressInformation
  ) {
    next({
      name: 'checkout-address'
    })

    return
  }

  if (
    routeName === 'checkout-review' &&
    !checkoutStore.hasShippingMethod
  ) {
    next({
      name: 'checkout-shipping'
    })

    return
  }

  next()
}
