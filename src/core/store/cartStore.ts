// core/store/cartStore.ts

const getSessionKey = (): string => {
  // اول ببین توی state هست
  if (sessionKey.value) {
    console.log('🔑 Using existing session key:', sessionKey.value)
    return sessionKey.value
  }
  
  // بعد ببین توی localStorage هست
  const storedKey = localStorage.getItem('session_key')
  if (storedKey) {
    console.log('🔑 Restoring session key from localStorage:', storedKey)
    sessionKey.value = storedKey
    return storedKey
  }
  
  // آخرش اگه هیچی نبود، جدید بساز
  const newKey = generateSessionKey()
  console.log('🔑 Generated new session key:', newKey)
  sessionKey.value = newKey
  localStorage.setItem('session_key', newKey)
  return newKey
}

const fetchCart = async () => {
  console.log('📡 fetchCart STARTED')
  console.log('🔑 sessionKey before:', sessionKey.value)
  
  loading.value = true
  error.value = null
  
  try {
    const auth = useAuthStore()
    
    // ✅ مهم: از sessionKey.value استفاده کن، نه getSessionKey()
    const currentKey = sessionKey.value
    
    console.log('🔐 Using session key:', currentKey)
    
    const response = await cartService.getCart(
      auth.isAuthenticated ? undefined : currentKey
    )
    
    console.log('✅ fetchCart response:', response)
    
    // ✅ مهم: session_key رو از response بگیر و ذخیره کن
    if (response.session_key && response.session_key !== sessionKey.value) {
      console.log('🔄 Updating session key from:', sessionKey.value, 'to:', response.session_key)
      sessionKey.value = response.session_key
      localStorage.setItem('session_key', response.session_key)
    }
    
    cart.value = response
    console.log('📦 cart.value set to:', cart.value)
    console.log('🛒 items in cart:', cart.value?.items)
    
    syncSelectedItems()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'خطا در دریافت سبد خرید'
    console.error('❌ Fetch cart error:', err)
  } finally {
    loading.value = false
    console.log('🏁 fetchCart completed, sessionKey now:', sessionKey.value)
  }
}

const addItem = async (payload: AddToCartPayload) => {
  console.log('🛒 addItem STARTED with payload:', payload)
  
  loading.value = true
  error.value = null
  
  try {
    const auth = useAuthStore()
    
    // ✅ از همون sessionKey.value استفاده کن
    const currentKey = sessionKey.value
    console.log('🔐 Using session key:', currentKey)
    
    const response = await cartService.addToCart({
      variant_id: payload.variant_id,
      quantity: payload.quantity,
      session_key: auth.isAuthenticated ? undefined : currentKey
    })
    
    console.log('✅ addItem response:', response)
    
    // ✅ اگه session_key جدید اومد، ذخیره کن
    if (response.session_key && response.session_key !== sessionKey.value) {
      console.log('🔄 Updating session key from response:', response.session_key)
      sessionKey.value = response.session_key
      localStorage.setItem('session_key', response.session_key)
    }
    
    // دوباره سبد رو بگیر
    await fetchCart()
    
    return response
  } catch (err: any) {
    error.value = err.response?.data?.message || 'خطا در افزودن به سبد خرید'
    console.error('❌ Add item error:', err)
    throw err
  } finally {
    loading.value = false
  }
}
