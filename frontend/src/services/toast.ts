import { createToastInterface } from 'vue-toastification'

const options = {
  position: 'bottom-right',
  timeout: 4000,
  transition: 'Vue-Toastification__fade',
  closeOnClick: true,
  pauseOnHover: true,
  hideProgressBar: true
}

export const toast = createToastInterface(options)

export const toastOptions = options
