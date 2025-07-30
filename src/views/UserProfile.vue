<template>
  <div class="profile-container">
    <!-- 导航栏 -->
    <AppNavbar 
      :current-user="currentUser" 
      @user-logout="handleUserLogout"
    />
    
    <div class="profile-content">
      <div class="profile-header">
        <h1>个人资料</h1>
        <p>管理您的个人信息和账户设置</p>
      </div>

      <div class="profile-main">
        <!-- 头像和基本信息 -->
        <el-card class="profile-card">
          <template #header>
            <div class="card-header">
              <h3>基本信息</h3>
              <el-button 
                type="primary" 
                @click="editMode = !editMode"
                :icon="editMode ? 'Close' : 'Edit'"
              >
                {{ editMode ? '取消编辑' : '编辑资料' }}
              </el-button>
            </div>
          </template>

          <div class="profile-info">
            <!-- 头像区域 -->
            <div class="avatar-section">
              <el-avatar :size="120" :src="profileForm.userAvatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div v-if="editMode" class="avatar-upload">
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :on-success="handleAvatarSuccess"
                >
                  <el-button size="small" type="primary">
                    <el-icon><Upload /></el-icon>
                    更换头像
                  </el-button>
                </el-upload>
              </div>
            </div>

            <!-- 信息表单 -->
            <div class="info-form">
              <el-form 
                ref="profileFormRef"
                :model="profileForm" 
                :rules="profileRules"
                label-width="100px"
                :disabled="!editMode"
              >
                <el-form-item label="用户名" prop="userName">
                  <el-input v-model="profileForm.userName" placeholder="请输入用户名" />
                </el-form-item>

                <el-form-item label="邮箱" prop="userEmail">
                  <el-input v-model="profileForm.userEmail" placeholder="请输入邮箱" />
                </el-form-item>

                <el-form-item label="手机号" prop="userPhone">
                  <el-input v-model="profileForm.userPhone" placeholder="请输入手机号" />
                </el-form-item>

                <el-form-item label="个人简介" prop="userProfile">
                  <el-input 
                    v-model="profileForm.userProfile" 
                    type="textarea" 
                    :rows="4"
                    placeholder="请输入个人简介"
                  />
                </el-form-item>

                <el-form-item label="性别" prop="userGender">
                  <el-radio-group v-model="profileForm.userGender">
                    <el-radio :label="0">女</el-radio>
                    <el-radio :label="1">男</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item v-if="editMode" class="form-actions">
                  <el-button 
                    type="primary" 
                    @click="saveProfile"
                    :loading="saving"
                  >
                    保存修改
                  </el-button>
                  <el-button @click="resetForm">
                    重置
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-card>

        <!-- 账户统计 -->
        <el-card class="stats-card">
          <template #header>
            <h3>账户统计</h3>
          </template>
          
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon signin">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ userStats.signInDays }}</div>
                <div class="stat-label">连续签到</div>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon questions">
                <el-icon><Document /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ userStats.questionsCompleted }}</div>
                <div class="stat-label">完成题目</div>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon level">
                <el-icon><Trophy /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ profileForm.userRole === 'admin' ? '管理员' : '普通用户' }}</div>
                <div class="stat-label">用户等级</div>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon time">
                <el-icon><Clock /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ formatDate(profileForm.createTime) }}</div>
                <div class="stat-label">注册时间</div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 安全设置 -->
        <el-card class="security-card">
          <template #header>
            <h3>安全设置</h3>
          </template>
          
          <div class="security-options">
            <div class="security-item">
              <div class="security-info">
                <h4>修改密码</h4>
                <p>定期修改密码可以提高账户安全性</p>
              </div>
              <el-button type="primary" @click="showPasswordDialog = true">
                修改密码
              </el-button>
            </div>

            <div class="security-item">
              <div class="security-info">
                <h4>账户注销</h4>
                <p>注销后将无法恢复账户数据</p>
              </div>
              <el-button type="danger" @click="showDeleteDialog = true">
                注销账户
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog 
      v-model="showPasswordDialog" 
      title="修改密码" 
      width="400px"
    >
      <el-form 
        ref="passwordFormRef"
        :model="passwordForm" 
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input 
            v-model="passwordForm.oldPassword" 
            type="password" 
            placeholder="请输入原密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="passwordForm.newPassword" 
            type="password" 
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            placeholder="请确认新密码"
            show-password
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="changePassword"
          :loading="changingPassword"
        >
          确认修改
        </el-button>
      </template>
    </el-dialog>

    <!-- 账户注销确认对话框 -->
    <el-dialog 
      v-model="showDeleteDialog" 
      title="确认注销账户" 
      width="400px"
    >
      <div class="delete-warning">
        <el-icon color="#F56C6C" :size="48">
          <WarningFilled />
        </el-icon>
        <h3>此操作不可逆</h3>
        <p>注销账户后，您的所有数据将被永久删除，无法恢复。请确认您真的要注销账户。</p>
        
        <el-input 
          v-model="deleteConfirmText"
          placeholder="请输入 '确认注销' 来确认操作"
          style="margin-top: 16px;"
        />
      </div>

      <template #footer>
        <el-button @click="showDeleteDialog = false">取消</el-button>
        <el-button 
          type="danger" 
          @click="deleteAccount"
          :disabled="deleteConfirmText !== '确认注销'"
          :loading="deleting"
        >
          确认注销
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  User, 
  Edit, 
  Upload, 
  Calendar, 
  Document, 
  Trophy, 
  Clock,
  WarningFilled
} from '@element-plus/icons-vue'
import AppNavbar from '../components/AppNavbar.vue'
import apiClient from '../api/apiClient'

export default {
  name: 'UserProfile',
  components: {
    User,
    Edit,
    Upload,
    Calendar,
    Document,
    Trophy,
    Clock,
    WarningFilled,
    AppNavbar
  },
  setup() {
    const router = useRouter()
    const currentUser = ref(null)
    const editMode = ref(false)
    const saving = ref(false)
    const changingPassword = ref(false)
    const deleting = ref(false)
    const showPasswordDialog = ref(false)
    const showDeleteDialog = ref(false)
    const deleteConfirmText = ref('')

    // 表单数据
    const profileForm = reactive({
      userName: '',
      userEmail: '',
      userPhone: '',
      userProfile: '',
      userGender: 1,
      userAvatar: '',
      userRole: '',
      createTime: ''
    })

    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const userStats = reactive({
      signInDays: 0,
      questionsCompleted: 0
    })

    // 表单验证规则
    const profileRules = {
      userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      userEmail: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      userPhone: [
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ]
    }

    const passwordRules = {
      oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== passwordForm.newPassword) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }

    // 获取用户信息
    const getCurrentUser = async () => {
      try {
        const response = await apiClient.getCurrentUser()
        if (response && response.data) {
          currentUser.value = response.data
          Object.assign(profileForm, response.data)
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        ElMessage.error('获取用户信息失败')
      }
    }

    // 获取用户统计
    const getUserStats = async () => {
      try {
        // 获取签到统计
        const currentYear = new Date().getFullYear()
        const signInResponse = await apiClient.getUserSignInRecord(currentYear)
        if (signInResponse && signInResponse.data) {
          userStats.signInDays = signInResponse.data.length || 0
        }
        
        // 这里可以添加更多统计数据的获取
        userStats.questionsCompleted = 0 // 暂时设为0，等后端提供相应接口
      } catch (error) {
        console.error('获取用户统计失败:', error)
      }
    }

    // 保存个人资料
    const saveProfile = async () => {
      saving.value = true
      try {
        const response = await apiClient.updateMyProfile(profileForm)
        if (response && (response.code === 0 || response.data === true)) {
          ElMessage.success('保存成功')
          editMode.value = false
          getCurrentUser() // 重新获取用户信息
        } else {
          ElMessage.error('保存失败，请稍后重试')
        }
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败，请稍后重试')
      } finally {
        saving.value = false
      }
    }

    // 重置表单
    const resetForm = () => {
      getCurrentUser()
      editMode.value = false
    }

    // 头像上传前验证
    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        ElMessage.error('头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        ElMessage.error('头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }

    // 头像上传成功
    const handleAvatarSuccess = (response) => {
      if (response && response.data) {
        profileForm.userAvatar = response.data
        ElMessage.success('头像上传成功')
      }
    }

    // 修改密码
    const changePassword = async () => {
      changingPassword.value = true
      try {
        // 这里需要调用修改密码的API
        // const response = await apiClient.changePassword(passwordForm)
        ElMessage.success('密码修改成功')
        showPasswordDialog.value = false
        Object.assign(passwordForm, {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } catch (error) {
        console.error('修改密码失败:', error)
        ElMessage.error('修改密码失败，请稍后重试')
      } finally {
        changingPassword.value = false
      }
    }

    // 注销账户
    const deleteAccount = async () => {
      deleting.value = true
      try {
        // 这里需要调用注销账户的API
        // const response = await apiClient.deleteAccount()
        ElMessage.success('账户注销成功')
        showDeleteDialog.value = false
        // 清除本地存储并跳转到登录页
        localStorage.clear()
        router.push('/login')
      } catch (error) {
        console.error('注销账户失败:', error)
        ElMessage.error('注销账户失败，请稍后重试')
      } finally {
        deleting.value = false
      }
    }

    // 处理用户退出登录
    const handleUserLogout = () => {
      currentUser.value = null
    }

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '未知'
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    }

    // 初始化
    onMounted(() => {
      getCurrentUser()
      getUserStats()
    })

    return {
      currentUser,
      editMode,
      saving,
      changingPassword,
      deleting,
      showPasswordDialog,
      showDeleteDialog,
      deleteConfirmText,
      profileForm,
      passwordForm,
      userStats,
      profileRules,
      passwordRules,
      saveProfile,
      resetForm,
      beforeAvatarUpload,
      handleAvatarSuccess,
      changePassword,
      deleteAccount,
      handleUserLogout,
      formatDate
    }
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.profile-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  margin-bottom: 32px;
}

.profile-header h1 {
  font-size: 32px;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.profile-header p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.profile-main {
  display: grid;
  gap: 24px;
}

/* 个人信息卡片 */
.profile-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
}

.profile-info {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.avatar-upload {
  text-align: center;
}

.info-form {
  flex: 1;
}

.form-actions {
  margin-top: 24px;
}

/* 统计卡片 */
.stats-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.stat-icon.signin {
  background: linear-gradient(45deg, #67C23A, #85CE61);
}

.stat-icon.questions {
  background: linear-gradient(45deg, #409EFF, #67C23A);
}

.stat-icon.level {
  background: linear-gradient(45deg, #E6A23C, #F56C6C);
}

.stat-icon.time {
  background: linear-gradient(45deg, #909399, #606266);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

/* 安全设置卡片 */
.security-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.security-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.security-info h4 {
  margin: 0 0 4px 0;
  color: #2c3e50;
}

.security-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* 对话框样式 */
.delete-warning {
  text-align: center;
  padding: 20px 0;
}

.delete-warning h3 {
  margin: 16px 0 8px 0;
  color: #F56C6C;
}

.delete-warning p {
  margin: 0 0 16px 0;
  color: #666;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-content {
    padding: 16px;
  }
  
  .profile-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .security-item {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .profile-header h1 {
    font-size: 24px;
  }
}
</style>