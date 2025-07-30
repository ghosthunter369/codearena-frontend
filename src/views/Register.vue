<template>
  <div class="register-container">
    <div class="register-wrapper">
      <!-- Background Decoration -->
      <div class="bg-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>

      <!-- Register Card -->
      <el-card class="register-card" shadow="always">
        <!-- Header -->
        <div class="register-header">
          <div class="logo">
            <el-icon :size="40" color="#67C23A">
              <UserFilled />
            </el-icon>
          </div>
          <h2 class="title">创建账户</h2>
          <p class="subtitle">加入 CodeArena 开始您的编程之旅</p>
        </div>

        <!-- Register Form -->
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="register-form"
          size="large"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              clearable
            />
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱地址"
              :prefix-icon="Message"
              clearable
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              clearable
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              :prefix-icon="Lock"
              show-password
              clearable
              @keyup.enter="handleRegister"
            />
          </el-form-item>

          <el-form-item prop="agreement">
            <el-checkbox v-model="registerForm.agreement">
              我已阅读并同意
              <el-link type="primary" :underline="false">《用户协议》</el-link>
              和
              <el-link type="primary" :underline="false">《隐私政策》</el-link>
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="register-button"
              :loading="loading"
              @click="handleRegister"
            >
              <span v-if="!loading">立即注册</span>
              <span v-else>注册中...</span>
            </el-button>
          </el-form-item>
        </el-form>

        <!-- Footer -->
        <div class="register-footer">
          <el-divider>
            <span class="divider-text">已有账户？</span>
          </el-divider>
          <el-button
            type="info"
            plain
            class="login-button"
            @click="$router.push('/login')"
          >
            <el-icon><User /></el-icon>
            立即登录
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
import { User, Lock, Message, UserFilled } from '@element-plus/icons-vue'
import apiClient from '../api/apiClient'

export default {
  name: 'Register',
  components: {
    User,
    Lock,
    Message,
    UserFilled
  },
  setup() {
    const router = useRouter()
    const registerFormRef = ref()
    const loading = ref(false)

    // Form data
    const registerForm = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreement: false
    })

    // Custom validators
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== registerForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }

    const validateAgreement = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请阅读并同意用户协议'))
      } else {
        callback()
      }
    }

    // Form validation rules
    const registerRules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 50, message: '密码长度在 6 到 50 个字符', trigger: 'blur' },
        { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字', trigger: 'blur' }
      ],
      confirmPassword: [
        { validator: validateConfirmPassword, trigger: 'blur' }
      ],
      agreement: [
        { validator: validateAgreement, trigger: 'change' }
      ]
    }

    // Methods
    const handleRegister = async () => {
      if (!registerFormRef.value) return

      try {
        const isValid = await registerFormRef.value.validate()
        if (!isValid) return
        
        loading.value = true

        // Prepare registration data
        const registrationData = {
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password
        }

        // Call register API
        const response = await apiClient.registerUser(registrationData)
        
        if (response && (response.code === 0 || response.success || response.data)) {
          ElMessage.success('注册成功！请登录您的账户')
          
          // Clear form
          registerForm.username = ''
          registerForm.email = ''
          registerForm.password = ''
          registerForm.confirmPassword = ''
          registerForm.agreement = false
          
          // Redirect to login page
          setTimeout(() => {
            router.push('/login')
          }, 1500)
        } else {
          ElMessage.error('注册失败：服务器响应异常')
        }
        
      } catch (error) {
        console.error('注册失败:', error)
        let errorMessage = '注册失败，请稍后重试'
        
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

    return {
      registerFormRef,
      registerForm,
      registerRules,
      loading,
      handleRegister,
      User,
      Lock,
      Message,
      UserFilled
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #67C23A 0%, #85CE61 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.register-wrapper {
  position: relative;
  z-index: 10;
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
  width: 180px;
  height: 180px;
  top: 15%;
  right: 15%;
  animation-delay: 0s;
}

.circle-2 {
  width: 120px;
  height: 120px;
  bottom: 20%;
  left: 15%;
  animation-delay: 2s;
}

.circle-3 {
  width: 80px;
  height: 80px;
  top: 50%;
  left: 5%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(180deg);
  }
}

/* Register Card */
.register-card {
  width: 600px;
  max-width: 90vw;
  min-height: 700px;
  border-radius: 24px;
  backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.register-card :deep(.el-card__body) {
  padding: 60px 80px;
}

/* Header */
.register-header {
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
  background: linear-gradient(45deg, #67C23A, #85CE61);
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
.register-form {
  margin-bottom: 24px;
}

.register-form :deep(.el-form-item) {
  margin-bottom: 24px;
  position: relative;
  z-index: 1000;
}

.register-form :deep(.el-form-item__content) {
  line-height: normal;
}

.register-form :deep(.el-input) {
  height: 56px;
  font-size: 16px;
}

.register-form :deep(.el-input__wrapper) {
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-height: 56px;
  pointer-events: auto !important;
  cursor: text !important;
  position: relative;
  z-index: 100;
}

.register-form :deep(.el-input__inner) {
  cursor: text !important;
  pointer-events: auto !important;
  position: relative;
  z-index: 101;
  background: transparent !important;
}

.register-form :deep(.el-input) {
  position: relative;
  z-index: 100;
}

.register-form :deep(.el-checkbox) {
  cursor: pointer !important;
  pointer-events: auto !important;
}

.register-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.2);
}

.register-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

.register-button {
  width: 100%;
  height: 60px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(45deg, #67C23A, #85CE61) !important;
  border: none !important;
  transition: all 0.3s ease;
  cursor: pointer !important;
  z-index: 999 !important;
  position: relative !important;
  pointer-events: auto !important;
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(103, 194, 58, 0.3);
}

/* Footer */
.register-footer {
  text-align: center;
}

.divider-text {
  color: #999;
  font-size: 14px;
}

.login-button {
  width: 100%;
  height: 56px;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer !important;
  z-index: 999 !important;
  position: relative !important;
  pointer-events: auto !important;
}

.login-button:hover {
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .register-card {
    width: 95vw;
    margin: 0 auto;
    min-height: 600px;
  }
  
  .register-card :deep(.el-card__body) {
    padding: 40px 30px;
  }
  
  .title {
    font-size: 28px;
  }
  
  .subtitle {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .register-card {
    width: 100%;
    margin: 0 10px;
    min-height: 550px;
  }
  
  .register-card :deep(.el-card__body) {
    padding: 30px 20px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 14px;
  }
}
</style>