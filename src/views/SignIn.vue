<template>
  <div class="signin-container">
    <!-- 导航栏 -->
    <AppNavbar 
      :current-user="currentUser" 
      @user-logout="handleUserLogout"
    />
    
    <div class="signin-content">
      <div class="signin-header">
        <h1>每日签到</h1>
        <p>坚持每日签到，获得更多奖励</p>
      </div>

      <!-- 签到状态卡片 -->
      <div class="signin-status-card">
        <div class="status-info">
          <div class="status-icon">
            <el-icon :size="60" :color="todaySignedIn ? '#67C23A' : '#909399'">
              <Calendar />
            </el-icon>
          </div>
          <div class="status-text">
            <h2>{{ todaySignedIn ? '今日已签到' : '今日未签到' }}</h2>
            <p>连续签到 {{ consecutiveDays }} 天</p>
            <p class="total-days">累计签到 {{ totalSignInDays }} 天</p>
          </div>
        </div>
        
        <div class="signin-action">
          <el-button 
            v-if="!todaySignedIn"
            type="success" 
            size="large"
            @click="handleSignIn"
            :loading="signingIn"
          >
            <el-icon><Check /></el-icon>
            立即签到
          </el-button>
          <el-tag v-else type="success" size="large">
            <el-icon><CircleCheck /></el-icon>
            已完成签到
          </el-tag>
        </div>
      </div>

      <!-- 签到日历 -->
      <div class="calendar-section">
        <el-card class="calendar-card">
          <template #header>
            <div class="calendar-header">
              <h3>{{ currentYear }}年{{ currentMonth }}月签到记录</h3>
              <div class="calendar-controls">
                <el-button 
                  size="small" 
                  @click="changeMonth(-1)"
                  :disabled="isCurrentMonth && currentMonth === 1"
                >
                  <el-icon><ArrowLeft /></el-icon>
                  上月
                </el-button>
                <el-button 
                  size="small" 
                  @click="changeMonth(1)"
                  :disabled="isCurrentMonth"
                >
                  下月
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
          </template>

          <div class="calendar-grid">
            <!-- 星期标题 -->
            <div class="weekdays">
              <div v-for="day in weekdays" :key="day" class="weekday">
                {{ day }}
              </div>
            </div>

            <!-- 日期网格 -->
            <div class="days-grid">
              <!-- 上月的日期 -->
              <div 
                v-for="day in prevMonthDays" 
                :key="`prev-${day}`"
                class="day-cell prev-month"
              >
                {{ day }}
              </div>

              <!-- 当月的日期 -->
              <div 
                v-for="day in currentMonthDays" 
                :key="`current-${day}`"
                class="day-cell current-month"
                :class="{
                  'signed-in': isSignedInDay(day),
                  'today': isToday(day),
                  'future': isFutureDay(day)
                }"
              >
                <span class="day-number">{{ day }}</span>
                <div v-if="isSignedInDay(day)" class="signin-mark">
                  <el-icon color="#67C23A" :size="16">
                    <Check />
                  </el-icon>
                </div>
              </div>

              <!-- 下月的日期 -->
              <div 
                v-for="day in nextMonthDays" 
                :key="`next-${day}`"
                class="day-cell next-month"
              >
                {{ day }}
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 签到统计 -->
      <div class="stats-section">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon consecutive">
                  <el-icon><Trophy /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ consecutiveDays }}</div>
                  <div class="stat-label">连续签到</div>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="8">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon total">
                  <el-icon><Calendar /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ totalSignInDays }}</div>
                  <div class="stat-label">累计签到</div>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="8">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon rate">
                  <el-icon><DataAnalysis /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ signInRate }}%</div>
                  <div class="stat-label">签到率</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 签到奖励说明 -->
      <div class="rewards-section">
        <el-card class="rewards-card">
          <template #header>
            <h3>签到奖励</h3>
          </template>
          
          <div class="rewards-list">
            <div class="reward-item">
              <div class="reward-icon">
                <el-icon color="#67C23A"><Medal /></el-icon>
              </div>
              <div class="reward-info">
                <h4>连续签到7天</h4>
                <p>获得初级徽章</p>
              </div>
              <div class="reward-status">
                <el-tag :type="consecutiveDays >= 7 ? 'success' : 'info'">
                  {{ consecutiveDays >= 7 ? '已获得' : `${7 - consecutiveDays}天后获得` }}
                </el-tag>
              </div>
            </div>

            <div class="reward-item">
              <div class="reward-icon">
                <el-icon color="#E6A23C"><Medal /></el-icon>
              </div>
              <div class="reward-info">
                <h4>连续签到30天</h4>
                <p>获得中级徽章</p>
              </div>
              <div class="reward-status">
                <el-tag :type="consecutiveDays >= 30 ? 'success' : 'info'">
                  {{ consecutiveDays >= 30 ? '已获得' : `${30 - consecutiveDays}天后获得` }}
                </el-tag>
              </div>
            </div>

            <div class="reward-item">
              <div class="reward-icon">
                <el-icon color="#F56C6C"><Medal /></el-icon>
              </div>
              <div class="reward-info">
                <h4>连续签到100天</h4>
                <p>获得高级徽章</p>
              </div>
              <div class="reward-status">
                <el-tag :type="consecutiveDays >= 100 ? 'success' : 'info'">
                  {{ consecutiveDays >= 100 ? '已获得' : `${100 - consecutiveDays}天后获得` }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Calendar,
  Check,
  CircleCheck,
  Trophy,
  ArrowLeft,
  ArrowRight,
  DataAnalysis,
  Medal
} from '@element-plus/icons-vue'
import AppNavbar from '../components/AppNavbar.vue'
import apiClient from '../api/apiClient'

export default {
  name: 'SignIn',
  components: {
    Calendar,
    Check,
    CircleCheck,
    Trophy,
    ArrowLeft,
    ArrowRight,
    DataAnalysis,
    Medal,
    AppNavbar
  },
  setup() {
    const currentUser = ref(null)
    const todaySignedIn = ref(false)
    const signingIn = ref(false)
    const consecutiveDays = ref(0)
    const totalSignInDays = ref(0)
    const signInRecords = ref([])
    
    const currentDate = new Date()
    const currentYear = ref(currentDate.getFullYear())
    const currentMonth = ref(currentDate.getMonth() + 1)
    
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']

    // 计算属性
    const isCurrentMonth = computed(() => {
      const now = new Date()
      return currentYear.value === now.getFullYear() && 
             currentMonth.value === now.getMonth() + 1
    })

    const signInRate = computed(() => {
      const daysInMonth = new Date(currentYear.value, currentMonth.value, 0).getDate()
      const signedDaysInMonth = signInRecords.value.filter(day => 
        day >= 1 && day <= daysInMonth
      ).length
      return Math.round((signedDaysInMonth / daysInMonth) * 100)
    })

    // 获取当月日历数据
    const getCalendarData = () => {
      const year = currentYear.value
      const month = currentMonth.value
      
      // 当月第一天是星期几
      const firstDay = new Date(year, month - 1, 1).getDay()
      // 当月有多少天
      const daysInMonth = new Date(year, month, 0).getDate()
      // 上月有多少天
      const daysInPrevMonth = new Date(year, month - 1, 0).getDate()
      
      return {
        firstDay,
        daysInMonth,
        daysInPrevMonth
      }
    }

    const { firstDay, daysInMonth, daysInPrevMonth } = getCalendarData()

    // 上月显示的日期
    const prevMonthDays = computed(() => {
      const days = []
      for (let i = firstDay - 1; i >= 0; i--) {
        days.push(daysInPrevMonth - i)
      }
      return days
    })

    // 当月日期
    const currentMonthDays = computed(() => {
      const days = []
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i)
      }
      return days
    })

    // 下月显示的日期
    const nextMonthDays = computed(() => {
      const totalCells = 42 // 6行 × 7列
      const usedCells = prevMonthDays.value.length + currentMonthDays.value.length
      const remainingCells = totalCells - usedCells
      
      const days = []
      for (let i = 1; i <= remainingCells; i++) {
        days.push(i)
      }
      return days
    })

    // 获取当前用户信息
    const getCurrentUser = async () => {
      try {
        const response = await apiClient.getCurrentUser()
        if (response && response.data) {
          currentUser.value = response.data
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    }

    // 获取签到记录
    const getSignInRecords = async () => {
      try {
        const response = await apiClient.getUserSignInRecord(currentYear.value)
        if (response && response.data) {
          signInRecords.value = response.data
          
          // 检查今天是否已签到
          const today = new Date().getDate()
          todaySignedIn.value = signInRecords.value.includes(today)
          
          // 计算连续签到天数
          calculateConsecutiveDays()
          
          // 计算总签到天数
          totalSignInDays.value = signInRecords.value.length
        }
      } catch (error) {
        console.error('获取签到记录失败:', error)
      }
    }

    // 计算连续签到天数
    const calculateConsecutiveDays = () => {
      const today = new Date().getDate()
      let consecutive = 0
      
      // 从今天开始往前计算
      for (let i = today; i >= 1; i--) {
        if (signInRecords.value.includes(i)) {
          consecutive++
        } else {
          break
        }
      }
      
      consecutiveDays.value = consecutive
    }

    // 处理签到
    const handleSignIn = async () => {
      signingIn.value = true
      try {
        const response = await apiClient.addUserSignIn()
        if (response && (response.code === 0 || response.data === true)) {
          todaySignedIn.value = true
          consecutiveDays.value++
          totalSignInDays.value++
          
          // 更新签到记录
          const today = new Date().getDate()
          signInRecords.value.push(today)
          
          ElMessage.success('签到成功！')
        } else {
          ElMessage.error('签到失败，请稍后重试')
        }
      } catch (error) {
        console.error('签到失败:', error)
        ElMessage.error('签到失败，请稍后重试')
      } finally {
        signingIn.value = false
      }
    }

    // 处理用户退出登录
    const handleUserLogout = () => {
      currentUser.value = null
    }

    // 切换月份
    const changeMonth = (delta) => {
      const newMonth = currentMonth.value + delta
      if (newMonth < 1) {
        currentMonth.value = 12
        currentYear.value--
      } else if (newMonth > 12) {
        currentMonth.value = 1
        currentYear.value++
      } else {
        currentMonth.value = newMonth
      }
      
      // 重新获取签到记录
      getSignInRecords()
    }

    // 判断是否为签到日
    const isSignedInDay = (day) => {
      return signInRecords.value.includes(day)
    }

    // 判断是否为今天
    const isToday = (day) => {
      const now = new Date()
      return isCurrentMonth.value && 
             day === now.getDate()
    }

    // 判断是否为未来日期
    const isFutureDay = (day) => {
      if (!isCurrentMonth.value) return false
      const now = new Date()
      return day > now.getDate()
    }

    // 初始化
    onMounted(() => {
      getCurrentUser()
      getSignInRecords()
    })

    return {
      currentUser,
      todaySignedIn,
      signingIn,
      consecutiveDays,
      totalSignInDays,
      signInRecords,
      currentYear,
      currentMonth,
      weekdays,
      isCurrentMonth,
      signInRate,
      prevMonthDays,
      currentMonthDays,
      nextMonthDays,
      handleSignIn,
      handleUserLogout,
      changeMonth,
      isSignedInDay,
      isToday,
      isFutureDay
    }
  }
}
</script>

<style scoped>
.signin-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.signin-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.signin-header {
  text-align: center;
  margin-bottom: 32px;
}

.signin-header h1 {
  font-size: 32px;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.signin-header p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* 签到状态卡片 */
.signin-status-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 32px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.status-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.status-icon {
  flex-shrink: 0;
}

.status-text h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
}

.status-text p {
  margin: 4px 0;
  font-size: 16px;
  opacity: 0.9;
}

.total-days {
  font-size: 14px !important;
  opacity: 0.7 !important;
}

.signin-action {
  flex-shrink: 0;
}

.signin-action .el-button {
  height: 50px;
  padding: 0 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 25px;
}

.signin-action .el-tag {
  height: 50px;
  padding: 0 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 日历部分 */
.calendar-section {
  margin-bottom: 32px;
}

.calendar-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-header h3 {
  margin: 0;
  color: #2c3e50;
}

.calendar-controls {
  display: flex;
  gap: 8px;
}

.calendar-grid {
  padding: 16px 0;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  padding: 12px 0;
  font-weight: 600;
  color: #666;
  background: #f8f9fa;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.day-cell {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #ebeef5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.day-cell.prev-month,
.day-cell.next-month {
  color: #c0c4cc;
  background: #f8f9fa;
}

.day-cell.current-month:hover {
  background: #f0f9ff;
}

.day-cell.today {
  background: #409EFF;
  color: white;
  font-weight: 700;
}

.day-cell.signed-in {
  background: #f0f9ff;
  border-color: #67C23A;
}

.day-cell.signed-in.today {
  background: #67C23A;
}

.day-cell.future {
  color: #c0c4cc;
  cursor: not-allowed;
}

.day-number {
  font-size: 14px;
  font-weight: 600;
}

.signin-mark {
  position: absolute;
  top: 2px;
  right: 2px;
}

/* 统计部分 */
.stats-section {
  margin-bottom: 32px;
}

.stat-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.stat-icon.consecutive {
  background: linear-gradient(45deg, #E6A23C, #F56C6C);
}

.stat-icon.total {
  background: linear-gradient(45deg, #409EFF, #67C23A);
}

.stat-icon.rate {
  background: linear-gradient(45deg, #67C23A, #85CE61);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

/* 奖励部分 */
.rewards-section {
  margin-bottom: 32px;
}

.rewards-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rewards-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.reward-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.reward-info {
  flex: 1;
}

.reward-info h4 {
  margin: 0 0 4px 0;
  color: #2c3e50;
  font-size: 16px;
}

.reward-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.reward-status {
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .signin-content {
    padding: 16px;
  }
  
  .signin-status-card {
    flex-direction: column;
    gap: 24px;
    text-align: center;
    padding: 32px 20px;
  }
  
  .status-info {
    flex-direction: column;
    gap: 16px;
  }
  
  .calendar-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .day-cell {
    font-size: 12px;
  }
  
  .reward-item {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .signin-header h1 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .weekday,
  .day-cell {
    font-size: 11px;
    padding: 8px 4px;
  }
  
  .stat-content {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
}
</style>