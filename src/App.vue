<template>
  <div id="app">
    <!-- 导航栏 -->
    <AppNavbar 
      :current-user="currentUser" 
      @user-logout="handleUserLogout"
    />

    <!-- 主内容：贴左边、全宽 -->
    <div class="app-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'
import apiClient from './api/apiClient'

export default {
  name: 'App',
  components: {
    AppNavbar
  },
  setup() {
    const router = useRouter()
    const currentUser = ref(null)

    const fetchCurrentUser = async () => {
      try {
        const satoken = localStorage.getItem('satoken')
        if (satoken) {
          const response = await apiClient.getCurrentUser()
          if (response && response.data) {
            currentUser.value = response.data
            localStorage.setItem('user', JSON.stringify(response.data))
          }
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        localStorage.removeItem('satoken')
        localStorage.removeItem('user')
        currentUser.value = null
      }
    }

    const handleUserLogout = () => {
      currentUser.value = null
    }

    onMounted(() => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          currentUser.value = JSON.parse(storedUser)
        } catch (error) {
          console.error('解析本地用户信息失败:', error)
        }
      }
      fetchCurrentUser()
    })

    return {
      currentUser,
      handleUserLogout
    }
  }
}
</script>

<style>
/* 全局基础设置：防止横向滚动 + 占满全屏 */
html, body {
  margin: 0;
  padding: 0;
  width: 100vw;
  overflow-x: hidden;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  background-color: #f5f7fa;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
}

/* 主内容区域：贴左边、铺满、不可横向滚动 */
.app-content {
  flex: 1;
  width: 100vw;
  min-height: calc(100vh - 65px); /* 减去导航栏高度 */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* 清除所有元素默认 margin/padding */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 自定义滚动条样式（可选） */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Element Plus UI 微调 */
.el-button {
  border-radius: 8px;
}

.el-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.el-input__wrapper {
  border-radius: 8px;
}

.el-select .el-input__wrapper {
  border-radius: 8px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .app-content {
    min-height: calc(100vh - 57px);
  }
}
</style>
