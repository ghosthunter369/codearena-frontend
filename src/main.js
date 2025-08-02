import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

import './style.css'

const app = createApp(App)

// Register Element Plus
app.use(ElementPlus)

// Register all Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)

// Global error handler to prevent unhandled DOM errors
app.config.errorHandler = (err, vm, info) => {
  // Ignore common DOM manipulation errors during navigation
  if (err.message && (
    err.message.includes('parentNode') ||
    err.message.includes('subTree') ||
    err.message.includes('Cannot read properties of null')
  )) {
    console.warn('DOM manipulation error ignored:', err.message)
    return
  }
  
  // Log other errors
  console.error('Vue error:', err, info)
}

// Global warning handler
app.config.warnHandler = (msg, vm, trace) => {
  // Ignore Element Plus deprecation warnings
  if (msg.includes('label act as value is about to be deprecated')) {
    return
  }
  
  // Ignore property access warnings during navigation
  if (msg.includes('Property') && msg.includes('was accessed during render but is not defined')) {
    return
  }
  
  console.warn('Vue warning:', msg)
}

app.mount('#app')
