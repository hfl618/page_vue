import { createRouter, createWebHistory } from 'vue-router'
import { useUiStore } from '@/store/ui'

const routes = [
  { path: '/', redirect: '/discover' },
  { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue'), meta: { layout: 'auth' } },
  { path: '/signup', name: 'signup', component: () => import('../views/auth/SignupView.vue'), meta: { layout: 'auth' } },
  { path: '/discover', name: 'discover', component: () => import('../views/portal/Discover.vue'), meta: { layout: 'main' } },
  { path: '/knowledge', name: 'knowledge', component: () => import('../views/knowledge/KnowledgeList.vue'), meta: { layout: 'main' } },
  
  // 【核心修复】：补全 parent 元数据，激活 Header 返回按钮
  { 
    path: '/knowledge/read/:id', 
    name: 'knowledge-reader', 
    component: () => import('../views/knowledge/KnowledgeReader.vue'), 
    meta: { layout: 'main', parent: '/knowledge', parentName: 'KNOWLEDGE' } 
  },
  { 
    path: '/knowledge/editor/:id', 
    name: 'knowledge-editor', 
    component: () => import('../views/knowledge/KnowledgeEditor.vue'), 
    meta: { layout: 'main', parent: '/knowledge', parentName: 'KNOWLEDGE' } 
  },
  { 
    path: '/knowledge/editor/new', 
    name: 'knowledge-editor-new', 
    component: () => import('../views/knowledge/KnowledgeEditor.vue'), 
    meta: { layout: 'main', parent: '/knowledge', parentName: 'KNOWLEDGE' } 
  },
  
  { path: '/profile', name: 'profile', component: () => import('../views/user/UserProfile.vue'), meta: { layout: 'main' } },
  { path: '/settings', name: 'settings', component: () => import('../views/user/SettingsView.vue'), meta: { layout: 'main' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const uiStore = useUiStore()
  if (to.path !== from.path) {
    uiStore.showLoading('SYNCHRONIZING', `Routing to ${to.name?.toString().toUpperCase()}...`)
  }
  next()
})

router.afterEach(() => {
  const uiStore = useUiStore()
  // 仅对非异步加载页面进行保底关闭
})

export default router
