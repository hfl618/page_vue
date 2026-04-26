import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    loading: {
      show: false,
      title: 'LOADING',
      subtitle: 'ACCESSING ARCHIVE',
      percent: 0
    },
    notices: []
  }),
  actions: {
    showLoading(title = 'LOADING', subtitle = 'ACCESSING ARCHIVE') {
      this.loading.show = true
      this.loading.title = title
      this.loading.subtitle = subtitle
      this.loading.percent = 5
      
      if (this._timer) clearInterval(this._timer)
      if (this._safetyTimer) clearTimeout(this._safetyTimer)
      
      this._timer = setInterval(() => {
        if (this.loading.percent < 95) {
          // 物理模拟：越接近 95 速度越慢
          const step = (96 - this.loading.percent) * 0.05
          this.loading.percent += step
        }
      }, 100)

      // 【物理保底】：如果 8 秒还没收场，强制初始化 UI，根治“卡在 95”
      this._safetyTimer = setTimeout(() => {
        if (this.loading.show) {
            console.warn('>>> [UI_SAFETY] Loading timeout. Protocol forced close.')
            this.hideLoading()
        }
      }, 8000)
    },
    hideLoading() {
      if (this._timer) clearInterval(this._timer)
      if (this._safetyTimer) clearTimeout(this._safetyTimer)
      
      this.loading.percent = 100
      setTimeout(() => {
        this.loading.show = false
        setTimeout(() => { this.loading.percent = 0 }, 300)
      }, 300)
    },
    addNotice({ title, message, type = 'info', duration = 3000, tag = null }) {
      if (tag) { this.notices = this.notices.filter(n => n.tag !== tag) }
      const id = Date.now()
      this.notices.push({ id, title, message, type, tag, visible: true })
      if (duration > 0) {
        setTimeout(() => this.removeNotice(id), duration)
      }
    },
    removeNotice(id) {
      const idx = this.notices.findIndex(n => n.id === id)
      if (idx !== -1) {
        this.notices[idx].visible = false
        setTimeout(() => {
          this.notices = this.notices.filter(n => n.id !== id)
        }, 300)
      }
    }
  }
})
