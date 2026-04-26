import { createRouter, createWebHistory } from 'vue-router'
import { useUiStore } from '@/store/ui'

const routes = [
  { path: '/', redirect: '/discover' },
  { 
    path: '/login', 
    name: 'login', 
    component: () => import('../views/auth/LoginView.vue'), 
    meta: { layout: 'auth', title: 'LOGIN' } 
  },
  { 
    path: '/signup', 
    name: 'signup', 
    component: () => import('../views/auth/SignupView.vue'), 
    meta: { layout: 'auth', title: 'SIGNUP' } 
  },
  { 
    path: '/discover', 
    name: 'discover', 
    component: () => import('../views/portal/Discover.vue'), 
    meta: { layout: 'main', title: 'DISCOVERY' } 
  },
  { 
    path: '/knowledge', 
    name: 'knowledge', 
    component: () => import('../views/knowledge/KnowledgeList.vue'), 
    meta: { layout: 'main', title: 'REGISTRY' } 
  },
  { 
    path: '/knowledge/read/:id', 
    name: 'knowledge-reader', 
    component: () => import('../views/knowledge/KnowledgeReader.vue'), 
    meta: { layout: 'main', title: 'READER', parent: 'REGISTRY' } 
  },
  { 
    path: '/knowledge/editor/:id', 
    name: 'knowledge-editor', 
    component: () => import('../views/knowledge/KnowledgeEditor.vue'), 
    meta: { layout: 'main', title: 'EDITOR', parent: 'REGISTRY' } 
  },
  { 
    path: '/knowledge/editor/new', 
    name: 'knowledge-editor-new', 
    component: () => import('../views/knowledge/KnowledgeEditor.vue'), 
    meta: { layout: 'main', title: 'NEW_MODULE', parent: 'REGISTRY' } 
  },
  { 
    path: '/profile', 
    name: 'profile', 
    component: () => import('../views/user/UserProfile.vue'), 
    meta: { layout: 'main', title: 'PROFILE' } 
  },
  { 
    path: '/settings', 
    name: 'settings', 
    component: () => import('../views/user/SettingsView.vue'), 
    meta: { layout: 'main', title: 'SETTINGS' } 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const uiStore = useUiStore()
  if (to.path !== from.path) {
    uiStore.showLoading('SYNCHRONIZING', `Routing to ${to.meta.title || to.name}...`)
  }
  next()
})

export default router
