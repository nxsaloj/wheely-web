import { createApp } from 'vue'
import App from '../App.vue'
import router from './router'
import { createAppStore } from './store'

import '../style.css'

const app = createApp(App)
const pinia = createAppStore()

app.use(pinia)
app.use(router)

app.mount('#app')
