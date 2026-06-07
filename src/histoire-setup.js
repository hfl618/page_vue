import './assets/styles/main.css'
import i18n from './locales'

export const setupVue3 = ({ app }) => {
  app.use(i18n)
}
