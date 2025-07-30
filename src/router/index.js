import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import UserProfile from '../views/UserProfile.vue'
import SignIn from '../views/SignIn.vue'
import Questions from '../views/Questions.vue'
import ApiExample from '../components/ApiExample.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: '首页',
    component: Dashboard,
    meta: { 
      requiresAuth: true,
      title: 'CodeArena - 首页'
    }
  },
  {
    path: '/login',
    name: '登录',
    component: Login,
    meta: { 
      requiresGuest: true,
      title: 'CodeArena - 登录'
    }
  },
  {
    path: '/register',
    name: '注册',
    component: Register,
    meta: { 
      requiresGuest: true,
      title: 'CodeArena - 注册'
    }
  },
  {
    path: '/profile',
    name: '个人资料',
    component: UserProfile,
    meta: { 
      requiresAuth: true,
      title: 'CodeArena - 个人资料'
    }
  },
  {
    path: '/signin',
    name: '每日签到',
    component: SignIn,
    meta: { 
      requiresAuth: true,
      title: 'CodeArena - 每日签到'
    }
  },
  {
    path: '/questions',
    name: '题目练习',
    component: Questions,
    meta: { 
      requiresAuth: true,
      title: 'CodeArena - 题目练习'
    }
  },
  {
    path: '/api-example',
    name: 'API示例',
    component: ApiExample,
    meta: { 
      requiresAuth: true,
      title: 'CodeArena - API示例'
    }
  },
  {
    path: '/about',
    name: '关于我们',
    component: About,
    meta: {
      title: 'CodeArena - 关于我们'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: '页面未找到',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫 - 身份验证
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('satoken')
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 检查是否需要登录
  if (to.meta.requiresAuth && !isAuthenticated) {
    ElMessage.warning('请先登录您的账户')
    next('/login')
    return
  }
  
  // 检查是否需要游客状态（未登录）
  if (to.meta.requiresGuest && isAuthenticated) {
    ElMessage.info('您已经登录，正在跳转到首页')
    next('/')
    return
  }
  
  next()
})

export default router
