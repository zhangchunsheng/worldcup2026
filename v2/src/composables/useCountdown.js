import { ref, onMounted, onUnmounted } from 'vue'

export function useCountdown(targetDate) {
  const days = ref(0)
  const hours = ref(0)
  const mins = ref(0)
  const secs = ref(0)

  function update() {
    const now = new Date()
    const diff = targetDate - now

    if (diff <= 0) {
      days.value = 0
      hours.value = 0
      mins.value = 0
      secs.value = 0
      return
    }

    days.value = Math.floor(diff / (1000 * 60 * 60 * 24))
    hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    mins.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    secs.value = Math.floor((diff % (1000 * 60)) / 1000)
  }

  let interval = null

  onMounted(() => {
    update()
    interval = setInterval(update, 1000)
  })

  onUnmounted(() => {
    if (interval) clearInterval(interval)
  })

  return { days, hours, mins, secs }
}
