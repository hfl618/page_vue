import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import { useUserStore } from '@/store/user'

console.info('>>> HEFLOS-HUB CORE BOOTING...')

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 核心初始化链路：使用聚合接口进行全局同步
const userStore = useUserStore(pinia)
userStore.initializeApp()

app.mount('#app')
