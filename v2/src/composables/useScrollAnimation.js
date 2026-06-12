import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useScrollAnimation() {
  const el = ref(null)
  const isVisible = ref(false)
  let observer = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    if (el.value) {
      observer.observe(el.value)
    }
  })

  onBeforeUnmount(() => {
    if (observer) observer.disconnect()
  })

  return { el, isVisible }
}
