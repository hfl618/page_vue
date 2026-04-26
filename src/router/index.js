import { createRouter, createWebHistory } from 'vue-router'
import Discover from '../views/portal/Discover.vue'
import KnowledgeList from '../views/knowledge/KnowledgeList.vue'
import DriveView from '../views/tools/drive/DriveView.vue'

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
    meta: { layout: 'main', title: 'REGISTRY' } 
  },
  { 
    path: '/tools/drive', 
    name: 'drive', 
    component: DriveView, 
    meta: { layout: 'main', title: 'CLOUD DRIVE', parent: 'DISCOVERY' } 
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
    path: '/tools/publish',
    name: 'tools-publish',
    component: () => import('../views/tools/PublishView.vue'),
    meta: { layout: 'main', title: 'DEPLOY', parent: 'DISCOVERY' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/user/UserProfile.vue'),
    meta: { layout: 'main', title: 'IDENTITY' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/user/SettingsView.vue'),
    meta: { layout: 'main', title: 'PROTOCOL_CONFIG' }
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

router.beforeEach((to, from, next) => {
  next()
})

export default router
