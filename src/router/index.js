import { createRouter, createWebHistory } from 'vue-router'
import Discover from '../views/portal/Discover.vue'
import KnowledgeList from '../views/knowledge/KnowledgeList.vue'
import DriveView from '../views/tools/drive/DriveView.vue'
import { storage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'

const routes = [
  { path: '/', redirect: '/discover' },
  { 
    path: '/discover', 
    name: 'discover', 
    component: Discover, 
    meta: { layout: 'main', title: 'DISCOVERY' } 
  },
  { 
    path: '/knowledge', 
    name: 'knowledge', 
    component: KnowledgeList, 
    meta: { layout: 'main', title: 'REGISTRY', requiresAuth: true } 
  },
  {
    path: '/tools/drive',
    name: 'drive',
    component: DriveView,
    meta: { layout: 'main', title: 'CLOUD DRIVE', parent: 'DISCOVERY', requiresAuth: true }
  },
  {
    path: '/tools/inventory',
    name: 'inventory',
    component: () => import('../views/tools/inventory/InventoryView.vue'),
    meta: { layout: 'main', title: 'INVENTORY_MANAGER', parent: 'DISCOVERY', requiresAuth: true }
  },
  {
    path: '/knowledge/read/:id',    name: 'knowledge-reader', 
    component: () => import('../views/knowledge/KnowledgeReader.vue'), 
    meta: { layout: 'main', title: 'READER', parent: 'REGISTRY' } 
  },
  { 
    path: '/knowledge/editor/:id', 
    name: 'knowledge-editor', 
    component: () => import('../views/knowledge/KnowledgeEditor.vue'), 
    meta: { layout: 'main', title: 'EDITOR', parent: 'REGISTRY', requiresAuth: true } 
  },
  { 
    path: '/knowledge/editor/new', 
    name: 'knowledge-editor-new', 
    component: () => import('../views/knowledge/KnowledgeEditor.vue'), 
    meta: { layout: 'main', title: 'NEW_MODULE', parent: 'REGISTRY', requiresAuth: true } 
  },
  {
    path: '/tools/publish',
    name: 'tools-publish',
    component: () => import('../views/tools/PublishView.vue'),
    meta: { layout: 'main', title: 'DEPLOY', parent: 'DISCOVERY', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/user/UserProfile.vue'),
    meta: { layout: 'main', title: 'IDENTITY', requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/user/SettingsView.vue'),
    meta: { layout: 'main', title: 'PROTOCOL_CONFIG', requiresAuth: true }
  },
  { 
    path: '/login', 
    name: 'login', 
    component: () => import('../views/auth/LoginView.vue'), 
    meta: { layout: 'auth', title: 'LOGIN' } 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：拦截未授权访问
router.beforeEach((to, from, next) => {
  const token = storage.get(STORAGE_KEYS.TOKEN)
  
  if (to.meta.requiresAuth && !token) {
    // 如果目标路由需要认证且没有 Token，强制跳转登录页
    next({ 
      name: 'login', 
      query: { redirect: to.fullPath } 
    })
  } else if (to.name === 'login' && token) {
    // 如果已登录还想去登录页，直接送回首页
    next({ name: 'discover' })
  } else {
    next()
  }
})

export default router
