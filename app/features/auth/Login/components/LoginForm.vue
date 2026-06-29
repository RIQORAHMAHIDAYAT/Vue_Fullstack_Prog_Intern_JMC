<template>
  <form @submit.prevent="handleLogin">
    <div class="mb-2">
      <input
        v-model="form.username"
        type="text"
        class="form-control py-3 border-0 bg-light text-dark"
        placeholder="Username / Email / No. HP"
        required
      />
    </div>

    <div class="mb-2" style="position: relative;">
      <input
        v-model="form.password"
        :type="showPassword ? 'text' : 'password'"
        class="form-control py-3 border-0 bg-light text-dark pe-5"
        placeholder="Password"
        required
      />
      <span
        class="position-absolute end-0 top-50 translate-middle-y me-3"
        style="cursor: pointer; z-index: 5;"
        @click="showPassword = !showPassword"
      >
        <IconEye v-if="!showPassword" :stroke="1.5" size="20" />
        <IconEyeOff v-else :stroke="1.5" size="20" />
      </span>
    </div>

    <div class="mb-2">
      <label class="form-check">
        <input v-model="form.remember" type="checkbox" class="form-check-input" />
        <span class="form-check-label">Remember Me</span>
      </label>
    </div>

    <div class="mb-3 p-3 bg-light rounded" v-if="captchaQuestion">
      <label class="form-label fw-semibold mb-2">Verifikasi Keamanan</label>
      <p class="mb-2 fs-5 text-center fw-bold">{{ captchaQuestion }}</p>
      <input
        v-model="captchaAnswer"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        class="form-control text-center"
        placeholder="Masukkan jawaban"
        required
      />
    </div>
    <div v-else class="mb-3 text-center text-muted small">Memuat verifikasi keamanan...</div>

    <div class="d-grid mt-4">
      <button class="btn btn-primary text-uppercase shadow py-3" type="submit" :disabled="loading">
        {{ loading ? "Memproses..." : "Masuk" }}
      </button>
    </div>

    <div v-if="error" class="alert alert-danger mt-3 mb-0">{{ error }}</div>
  </form>
</template>

<script setup>
import { IconEye, IconEyeOff } from "@tabler/icons-vue"
const { login } = useAuth()
const router = useRouter()
const tokenCookie = useCookie("auth_session", { path: "/" })

const loading = ref(false)
const error = ref("")
const showPassword = ref(false)
const submitting = ref(false)

const captchaQuestion = ref("")
const captchaToken = ref("")
const captchaAnswer = ref("")

const form = reactive({
  username: "",
  password: "",
  remember: false,
})

onMounted(async () => {
  try {
    const res = await $fetch("/api/captcha")
    captchaQuestion.value = res.question
    captchaToken.value = res.token
  } catch {
    error.value = "Gagal memuat verifikasi keamanan. Silakan refresh halaman."
  }
})

async function handleLogin() {
  if (submitting.value) return
  submitting.value = true
  loading.value = true
  error.value = ""

  try {
    if (!captchaToken.value) {
      error.value = "Verifikasi keamanan gagal dimuat. Silakan refresh halaman."
      submitting.value = false
      loading.value = false
      return
    }

    if (!captchaAnswer.value.trim()) {
      error.value = "Harap jawab pertanyaan verifikasi keamanan"
      submitting.value = false
      loading.value = false
      return
    }

    const res = await login(form.username, form.password, form.remember, undefined, captchaToken.value, captchaAnswer.value)

    if (res?.token) {
      tokenCookie.value = res.token
    }

    await router.push("/")
  } catch (err) {
    error.value = err.message || "Login gagal"
    await refreshCaptcha()
  }

  submitting.value = false
  loading.value = false
}

async function refreshCaptcha() {
  captchaAnswer.value = ""
  try {
    const res = await $fetch("/api/captcha")
    captchaQuestion.value = res.question
    captchaToken.value = res.token
  } catch {
    // ignore
  }
}
</script>
