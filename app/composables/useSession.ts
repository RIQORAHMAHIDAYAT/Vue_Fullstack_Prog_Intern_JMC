export function useSession() {
  const { logout } = useAuth()
  const SESSION_DURATION = 3 * 60 * 1000
  const timer = ref<ReturnType<typeof setTimeout> | null>(null)
  const isRemembered = computed(() => !!localStorage.getItem("token"))

  function resetTimer() {
    if (isRemembered.value) return
    if (timer.value) clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      logout()
      navigateTo("/login")
    }, SESSION_DURATION)
  }

  function startSession() {
    if (isRemembered.value) return
    resetTimer()
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"]
    events.forEach((e) => window.addEventListener(e, resetTimer))
  }

  function stopSession() {
    if (timer.value) clearTimeout(timer.value)
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"]
    events.forEach((e) => window.removeEventListener(e, resetTimer))
  }

  onMounted(() => startSession())
  onUnmounted(() => stopSession())

  return { startSession, stopSession, resetTimer }
}
