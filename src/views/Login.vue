<template>
  <div class="login-container">
    <div class="login-wrapper">
      <!-- Background Decoration -->
      <div class="bg-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>

      <!-- Login Card -->
      <el-card class="login-card" shadow="always">
        <!-- Header -->
        <div class="login-header">
          <div class="logo">
            <el-icon :size="40" color="#409EFF">
              <Platform />
            </el-icon>
          </div>
          <h2 class="title">欢迎回来</h2>
          <p class="subtitle">登录您的 CodeArena 账户</p>
        </div>

        <!-- Login Form -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          size="large"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              clearable
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              clearable
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item>
            <div class="form-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="login-button"
              :loading="loading"
              @click="handleLogin"
            >
              <span v-if="!loading">登录</span>
              <span v-else>登录中...</span>
            </el-button>
          </el-form-item>
        </el-form>

        <!-- Footer -->
        <div class="login-footer">
          <el-divider>
            <span class="divider-text">还没有账户？</span>
          </el-divider>
          <el-button
            type="info"
            plain
            class="register-button"
            @click="$router.push('/register')"
          >
            <el-icon><UserFilled /></el-icon>
            立即注册
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, UserFilled, Platform } from '@element-plus/icons-vue'
import apiClient from '../api/apiClient'

export default {
  name: 'Login',
  components: {
    User,
    Lock,
    UserFilled,
    Platform
  },
  setup() {
    const router = useRouter()
    const loginFormRef = ref()
    const loading = ref(false)
    const rememberMe = ref(false)

    // Form data
    const loginForm = reactive({
      username: '',
      password: ''
    })

    // Form validation rules
    const loginRules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线或中文', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 50, message: '密码长度在 6 到 50 个字符', trigger: 'blur' }
      ]
    }

    // Methods
    const handleLogin = async () => {
      console.log('Login button clicked!', loginForm)
      if (!loginFormRef.value) {
        console.log('Form ref not found')
        return
      }

      try {
        const isValid = await loginFormRef.value.validate()
        if (!isValid) {
          console.log('Form validation failed')
          return
        }
        
        loading.value = true

        // Call login API
        const response = await apiClient.loginUser(loginForm)
        
        // Check response structure
        if (response && (response.satoken || response.data?.satoken)) {
          const token = response.satoken || response.data.satoken
          localStorage.setItem('satoken', token)
          
          // Save user info if available
          if (response.data?.user || response.user) {
            localStorage.setItem('user', JSON.stringify(response.data?.user || response.user))
          }
          
          // Save remember me preference
          if (rememberMe.value) {
            localStorage.setItem('rememberMe', 'true')
            localStorage.setItem('username', loginForm.username)
          } else {
            localStorage.removeItem('rememberMe')
            localStorage.removeItem('username')
          }

          ElMessage.success('登录成功！')
          
          // Redirect to home page
          setTimeout(() => {
            router.push('/')
          }, 1000)
        } else {
          ElMessage.error('登录失败：服务器响应异常')
        }
      } catch (error) {
        console.error('登录失败:', error)
        let errorMessage = '登录失败，请稍后重试'
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response?.data?.msg) {
          errorMessage = error.response.data.msg
        } else if (error.message) {
          errorMessage = error.message
        }
        
        ElMessage.error(errorMessage)
      } finally {
        loading.value = false
      }
    }

    // Load remembered username
    const loadRememberedData = () => {
      if (localStorage.getItem('rememberMe') === 'true') {
        rememberMe.value = true
        loginForm.username = localStorage.getItem('username') || ''
      }
    }

    // Initialize
    loadRememberedData()

    return {
      loginFormRef,
      loginForm,
      loginRules,
      loading,
      rememberMe,
      handleLogin,
      User,
      Lock,
      UserFilled,
      Platform
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 600px;
}

/* Background Decoration */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Login Card */
.login-card {
  width: 100%;
  max-width: 600px;
  border-radius: 24px;
  backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.login-card :deep(.el-card__body) {
  padding: 40px;
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  margin-bottom: 16px;
}

.title {
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 12px 0;
  background: linear-gradient(45deg, #409EFF, #67C23A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #666;
  font-size: 18px;
  margin: 0;
  font-weight: 400;
}

/* Form */
.login-form {
  margin-bottom: 24px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 24px;
}

.login-form :deep(.el-input) {
  height: 56px;
}

.login-form :deep(.el-input__wrapper) {
  padding: 0 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.login-button {
  width: 100%;
  height: 56px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(45deg, #409EFF, #67C23A);
  border: none;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.3);
}

/* Footer */
.login-footer {
  text-align: center;
}

.divider-text {
  color: #999;
  font-size: 14px;
}

.register-button {
  width: 100%;
  height: 56px;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;
}

.register-button:hover {
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .login-card {
    width: 95%;
  }
  
  .login-card :deep(.el-card__body) {
    padding: 30px;
  }
  
  .title {
    font-size: 28px;
  }
  
  .subtitle {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .login-card {
    width: 100%;
  }
  
  .login-card :deep(.el-card__body) {
    padding: 20px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 14px;
  }
}
</style>