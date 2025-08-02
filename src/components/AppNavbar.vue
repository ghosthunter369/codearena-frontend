<template>
  <div class="app-navbar">
    <!-- Left side - Logo -->
    <div class="navbar-left">
      <div class="logo-container" @click="$router.push('/')">
        <div class="logo-icon">CA</div>
        <h1 class="site-title">CodeArena</h1>
      </div>
    </div>

    <!-- Center - Navigation Tabs -->
    <div class="navbar-center">
      <div class="nav-tabs">
        <div 
          class="nav-tab" 
          :class="{ active: activeTab === 'study' }"
          @click="navigateToTab('study')"
        >
          <el-icon><Reading /></el-icon>
          <span>学习</span>
        </div>
        <div 
          class="nav-tab" 
          :class="{ active: activeTab === 'questions' }"
          @click="navigateToTab('questions')"
        >
          <el-icon><Document /></el-icon>
          <span>题库</span>
        </div>
        <div 
          class="nav-tab" 
          :class="{ active: activeTab === 'contest' }"
          @click="navigateToTab('contest')"
        >
          <el-icon><Trophy /></el-icon>
          <span>竞赛</span>
        </div>
        <div 
          class="nav-tab" 
          :class="{ active: activeTab === 'discuss' }"
          @click="navigateToTab('discuss')"
        >
          <el-icon><ChatDotRound /></el-icon>
          <span>讨论</span>
        </div>
        <div 
          class="nav-tab" 
          :class="{ active: activeTab === 'jobs' }"
          @click="navigateToTab('jobs')"
        >
          <el-icon><Suitcase /></el-icon>
          <span>求职</span>
        </div>
      </div>
    </div>

    <!-- Right side - User information -->
    <div class="navbar-right">
      <!-- Logged in state -->
      <el-dropdown 
        v-if="currentUser" 
        @command="handleCommand"
        trigger="click"
        placement="bottom-end"
      >
        <div class="user-info">
          <span class="username">{{ currentUser.userName || '用户' }}</span>
          <el-avatar 
            :size="40" 
            :src="currentUser.userAvatar"
            class="user-avatar"
          >
            <el-icon><User /></el-icon>
          </el-avatar>
          <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人资料
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              设置
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided>
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
      <!-- Not logged in state -->
      <div v-else class="login-buttons">
        <el-button 
          type="primary" 
          @click="$router.push('/login')"
          class="login-button"
          plain
        >
          登录
        </el-button>
        <el-button 
          type="primary" 
          @click="$router.push('/register')"
          class="register-button"
        >
          注册
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ArrowDown,
  User, 
  Setting,
  SwitchButton,
  Reading,
  Document,
  Trophy,
  ChatDotRound,
  Suitcase
} from '@element-plus/icons-vue'
import apiClient from '../api/apiClient'

export default {
  name: 'AppNavbar',
  components: {
    ArrowDown,
    User,
    Setting,
    SwitchButton,
    Reading,
    Document,
    Trophy,
    ChatDotRound,
    Suitcase
  },
  props: {
    currentUser: {
      type: Object,
      default: null
    }
  },
  emits: ['user-logout'],
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const activeTab = ref('study')

    // Watch route changes to update active tab
    watch(() => route.path, (newPath) => {
      if (newPath === '/' || newPath === '/dashboard') {
        activeTab.value = 'study'
      } else if (newPath.startsWith('/questions')) {
        activeTab.value = 'questions'
      } else if (newPath.startsWith('/contest')) {
        activeTab.value = 'contest'
      } else if (newPath.startsWith('/discuss')) {
        activeTab.value = 'discuss'
      } else if (newPath.startsWith('/jobs')) {
        activeTab.value = 'jobs'
      }
    }, { immediate: true })

    // Navigate to different tabs
    const navigateToTab = async (tab) => {
      try {
        const routeMap = {
          'study': '/',
          'questions': '/questions',
          'contest': '/contest',
          'discuss': '/discuss',
          'jobs': '/jobs'
        }
        
        const targetPath = routeMap[tab]
        if (targetPath && route.path !== targetPath) {
          await router.push(targetPath)
        }
      } catch (error) {
        // 忽略导航相关错误
        if (error.name !== 'NavigationDuplicated' && error.name !== 'NavigationAborted') {
          console.error('Navigation error:', error)
        }
      }
    }

    // Handle dropdown menu commands
    const handleCommand = async (command) => {
      switch (command) {
        case 'profile':
          router.push('/profile')
          break
        case 'settings':
          router.push('/settings')
          break
        case 'logout':
          await handleLogout()
          break
      }
    }

    // Handle logout
    const handleLogout = async () => {
      try {
        await ElMessageBox.confirm(
          '确定要退出登录吗？',
          '退出确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )

        // Call logout API
        await apiClient.logoutUser()
        
        // Clear local storage
        localStorage.removeItem('satoken')
        localStorage.removeItem('user')
        localStorage.removeItem('rememberMe')
        localStorage.removeItem('username')
        
        // Notify parent component that user has logged out
        emit('user-logout')
        
        ElMessage.success('退出登录成功')
        router.push('/login')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('退出登录失败:', error)
          ElMessage.error('退出登录失败')
        }
      }
    }

    return {
      activeTab,
      navigateToTab,
      handleCommand,
      ArrowDown,
      User,
      Setting,
      SwitchButton,
      Reading,
      Document,
      Trophy,
      ChatDotRound,
      Suitcase
    }
  }
}
</script>

<style scoped>
.app-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  background: #ffffff;
  border-bottom: 1px solid #ebeef5;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 70px;
  width: 95%;
  margin: 0 auto;
}

.navbar-left {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 40px;
}

.nav-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 4px;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.nav-tab:hover {
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
}

.nav-tab.active {
  background: #409eff;
  color: white;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.nav-tab .el-icon {
  font-size: 16px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-icon {
  height: 36px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #409eff, #007fff);
  color: white;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  transition: transform 0.3s ease;
}

.logo-container:hover .logo-icon {
  transform: scale(1.05);
}

.site-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.back-button {
  font-size: 15px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateX(-2px);
}

.navbar-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.user-info:hover {
  background: #f0f9ff;
  border-color: #409EFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.username {
  font-size: 15px;
  font-weight: 600;
  color: #1a202c;
}

.user-avatar {
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.user-info:hover .user-avatar {
  border-color: #409EFF;
  box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.1);
}

.dropdown-icon {
  color: #64748b;
  font-size: 12px;
  transition: transform 0.3s ease;
}

.user-info:hover .dropdown-icon {
  transform: translateY(2px);
  color: #409EFF;
}

.login-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-button, .register-button {
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.login-button:hover, .register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

/* Responsive design */
@media (max-width: 768px) {
  .app-navbar {
    padding: 0 20px;
  }
  
  .site-title {
    display: none;
  }
  
  .username {
    display: none;
  }
  
  .login-button, .register-button {
    padding: 8px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .app-navbar {
    padding: 0 12px;
  }
  
  .user-avatar {
    width: 32px !important;
    height: 32px !important;
  }
  
  .login-button, .register-button {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>