import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'
import App from './App.vue'
import router from './router'
import i18n from './locales'
import './assets/styles/main.css'
import { useUserStore } from '@/store/user'
import { useUiStore } from '@/store/ui'

console.info('>>> HEFLOS-HUB CORE BOOTING...')

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Sentry 初始化
Sentry.init({
  app,
  dsn: "", // 留空则不初始化，避免报错
  integrations: [
    Sentry.browserTracingIntegration({ router }),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

// 注册全局错误处理钩子
const uiStore = useUiStore(pinia)
app.config.errorHandler = (err, instance, info) => {
  uiStore.reportIntegrityViolation(err)
  Sentry.captureException(err)
}

// 核心初始化链路：使用聚合接口进行全局同步
const userStore = useUserStore(pinia)
userStore.initializeApp()

app.mount('#app')
