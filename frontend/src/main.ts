import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './style.css'
import router from './router'
import i18n from './i18n'
import App from './App.vue'
import { toastOptions } from './services/toast'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)
app.use(Toast, toastOptions)

app.mount('#app')
