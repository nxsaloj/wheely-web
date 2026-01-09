import App from '../App.vue'
import '../style.css'
import { createApp } from 'vue'
import router from './router'
import { createAppStore } from './store'

const app = createApp(App)
const pinia = createAppStore()

app.use(pinia)
app.use(router)

app.mount('#app')
