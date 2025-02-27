import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'katex/dist/katex.min.css'
import katex from 'katex'
import { setupInterceptors } from '@/services/axiosInterceptor'

window.katex = katex // Make KaTeX globally available


setupInterceptors()

const app = createApp(App)


app.use(store)

await store.dispatch('initializeStore')

app.use(router)

// Finally mount the app
app.mount('#app')
