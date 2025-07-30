<template>
  <div class="home-container">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <el-card class="welcome-card" shadow="hover">
        <div class="welcome-content">
          <div class="welcome-text">
            <h1 class="welcome-title">
              <el-icon class="title-icon"><Star /></el-icon>
              欢迎来到 CodeArena
            </h1>
            <p class="welcome-subtitle">
              专业的编程题目管理平台，助力您的编程学习之旅
            </p>
            <div class="welcome-actions">
              <el-button type="primary" size="large" @click="$router.push('/questions')">
                <el-icon><Document /></el-icon>
                开始刷题
              </el-button>
              <el-button size="large" @click="$router.push('/api-example')">
                <el-icon><Connection /></el-icon>
                API 测试
              </el-button>
            </div>
          </div>
          <div class="welcome-illustration">
            <el-icon :size="120" color="#409EFF">
              <Platform />
            </el-icon>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Statistics Section -->
    <div class="stats-section">
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="stat-card" shadow="hover">
            <el-statistic
              title="总题目数"
              :value="statistics.totalQuestions"
              :precision="0"
            >
              <template #prefix>
                <el-icon style="vertical-align: -0.125em">
                  <Document />
                </el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="stat-card" shadow="hover">
            <el-statistic
              title="已完成"
              :value="statistics.completedQuestions"
              :precision="0"
            >
              <template #prefix>
                <el-icon style="vertical-align: -0.125em">
                  <CircleCheck />
                </el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="stat-card" shadow="hover">
            <el-statistic
              title="正确率"
              :value="statistics.accuracy"
              suffix="%"
              :precision="1"
            >
              <template #prefix>
                <el-icon style="vertical-align: -0.125em">
                  <TrendCharts />
                </el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="stat-card" shadow="hover">
            <el-statistic
              title="连续天数"
              :value="statistics.streakDays"
              :precision="0"
            >
              <template #prefix>
                <el-icon style="vertical-align: -0.125em">
                  <Calendar />
                </el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <h2 class="section-title">
        <el-icon><Star /></el-icon>
        平台特色
      </h2>
      <el-row :gutter="24">
        <el-col :xs="24" :md="8">
          <el-card class="feature-card" shadow="hover">
            <div class="feature-icon">
              <el-icon :size="48" color="#409EFF">
                <Document />
              </el-icon>
            </div>
            <h3 class="feature-title">丰富题库</h3>
            <p class="feature-description">
              涵盖算法、数据结构、系统设计等多个领域，从入门到进阶全面覆盖
            </p>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="8">
          <el-card class="feature-card" shadow="hover">
            <div class="feature-icon">
              <el-icon :size="48" color="#67C23A">
                <TrendCharts />
              </el-icon>
            </div>
            <h3 class="feature-title">智能分析</h3>
            <p class="feature-description">
              详细的学习报告和进度跟踪，帮助您了解学习状况和薄弱环节
            </p>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="8">
          <el-card class="feature-card" shadow="hover">
            <div class="feature-icon">
              <el-icon :size="48" color="#E6A23C">
                <Connection />
              </el-icon>
            </div>
            <h3 class="feature-title">API 集成</h3>
            <p class="feature-description">
              完整的 RESTful API 支持，方便与其他系统集成和二次开发
            </p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- Recent Activity -->
    <div class="activity-section">
      <h2 class="section-title">
        <el-icon><Clock /></el-icon>
        最近活动
      </h2>
      <el-card shadow="hover">
        <el-timeline>
          <el-timeline-item
            v-for="activity in recentActivities"
            :key="activity.id"
            :timestamp="activity.timestamp"
            :color="activity.color"
          >
            <div class="activity-item">
              <el-icon :color="activity.color">
                <component :is="activity.icon" />
              </el-icon>
              <span class="activity-text">{{ activity.text }}</span>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import {
  Star,
  Document,
  Connection,
  Platform,
  CircleCheck,
  TrendCharts,
  Calendar,
  Clock,
  User,
  Edit
} from '@element-plus/icons-vue'

export default {
  name: 'Home',
  components: {
    Star,
    Document,
    Connection,
    Platform,
    CircleCheck,
    TrendCharts,
    Calendar,
    Clock,
    User,
    Edit
  },
  setup() {
    // Statistics data
    const statistics = ref({
      totalQuestions: 1248,
      completedQuestions: 156,
      accuracy: 87.5,
      streakDays: 12
    })

    // Recent activities
    const recentActivities = ref([
      {
        id: 1,
        text: '完成了算法题：二叉树的最大深度',
        timestamp: '2024-01-20 14:30',
        color: '#67C23A',
        icon: 'CircleCheck'
      },
      {
        id: 2,
        text: '创建了新的题目：链表反转',
        timestamp: '2024-01-20 10:15',
        color: '#409EFF',
        icon: 'Edit'
      },
      {
        id: 3,
        text: '登录系统',
        timestamp: '2024-01-20 09:00',
        color: '#909399',
        icon: 'User'
      },
      {
        id: 4,
        text: '完成了算法题：快速排序',
        timestamp: '2024-01-19 16:45',
        color: '#67C23A',
        icon: 'CircleCheck'
      }
    ])

    // Methods
    const loadStatistics = async () => {
      // Simulate API call
      try {
        // In real app, this would be an API call
        // const stats = await apiClient.getStatistics()
        // statistics.value = stats
      } catch (error) {
        console.error('Failed to load statistics:', error)
      }
    }

    // Lifecycle
    onMounted(() => {
      loadStatistics()
    })

    return {
      statistics,
      recentActivities
    }
  }
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 32px;
}

.welcome-card {
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, rgba(103, 194, 58, 0.1) 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.welcome-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  color: #F7BA2A;
  animation: twinkle 2s infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.welcome-subtitle {
  font-size: 18px;
  color: #666;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.welcome-actions {
  display: flex;
  gap: 16px;
}

.welcome-illustration {
  flex-shrink: 0;
  margin-left: 40px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Statistics Section */
.stats-section {
  margin-bottom: 32px;
}

.stat-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-card :deep(.el-statistic__head) {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-card :deep(.el-statistic__content) {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
}

/* Features Section */
.features-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-card {
  border-radius: 12px;
  text-align: center;
  padding: 20px;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  margin-bottom: 16px;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.feature-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Activity Section */
.activity-section {
  margin-bottom: 32px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.activity-text {
  color: #2c3e50;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .welcome-content {
    flex-direction: column;
    text-align: center;
  }
  
  .welcome-illustration {
    margin: 24px 0 0 0;
  }
  
  .welcome-title {
    font-size: 28px;
    justify-content: center;
  }
  
  .welcome-actions {
    justify-content: center;
  }
  
  .welcome-actions .el-button {
    flex: 1;
    max-width: 150px;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 24px;
  }
  
  .welcome-subtitle {
    font-size: 16px;
  }
  
  .welcome-actions {
    flex-direction: column;
  }
  
  .welcome-actions .el-button {
    max-width: none;
  }
}
</style>