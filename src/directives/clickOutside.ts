// src/directives/clickOutside.ts
export const vClickOutside = {
  // وقتی المان به DOM اضافه میشه
  mounted(el: HTMLElement, binding: any) {
    // تابعی که کلیک بیرون رو چک می‌کنه
    el._clickOutside = (event: Event) => {
      // اگه کلیک روی خود المان یا داخل اون نبود
      if (!(el === event.target || el.contains(event.target as Node))) {
        // تابع مورد نظر رو اجرا کن
        binding.value(event)
      }
    }
    // اضافه کردن event listener
    document.addEventListener('click', el._clickOutside)
  },
  
  // وقتی المان از DOM حذف میشه
  unmounted(el: HTMLElement) {
    // پاکسازی event listener
    document.removeEventListener('click', el._clickOutside)
    delete el._clickOutside
  }
}
