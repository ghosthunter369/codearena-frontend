<template>
  <div class="dashboard-container">
    <!-- 主要内容区域 -->
    <div class="dashboard-content" style="min-height: calc(100vh - 80px); margin-left:20px; width: 80%;">
      <!-- 左侧边栏 -->
      <div class="dashboard-sidebar">
        <div class="sidebar-stats">
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalQuestions }}</div>
            <div class="stat-label">题目总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.signInDays }}</div>
            <div class="stat-label">连续签到</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalUsers }}</div>
            <div class="stat-label">用户总数</div>
          </div>
        </div>
        
        <div class="sidebar-signin" @click="handleSignIn">
          <div class="signin-icon">
            <el-icon :class="{ 'is-signed': todaySignedIn }"><Calendar /></el-icon>
          </div>
          <div class="signin-info">
            <div class="signin-status">{{ todaySignedIn ? '今日已签到' : '今日未签到' }}</div>
            <div class="signin-days">已连续签到 {{ stats.signInDays }} 天</div>
          </div>
        </div>
        
        <div class="sidebar-menu">
          <div class="menu-title">快捷操作</div>
          <div class="menu-list">
            <div class="menu-item" @click="$router.push('/questions')">
              <el-icon><Document /></el-icon>
              <span>题目练习</span>
            </div>
            <div class="menu-item" @click="$router.push('/profile')">
              <el-icon><User /></el-icon>
              <span>个人资料</span>
            </div>
            <div class="menu-item" @click="createQuestion">
              <el-icon><Plus /></el-icon>
              <span>创建题目</span>
            </div>
            <div class="menu-item" @click="$router.push('/favorites')">
              <el-icon><Star /></el-icon>
              <span>我的收藏</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧主内容 -->
      <div class="dashboard-main">
        <!-- 搜索栏 -->
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索题目、用户或内容..."
            @input="handleSearchInput"
            @keyup.enter="performSearch"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #append>
              <el-button @click="performSearch">搜索</el-button>
            </template>
          </el-input>
          
          <div class="search-filters">
            <el-radio-group v-model="searchType" size="small">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="questions">题目</el-radio-button>
              <el-radio-button label="users">用户</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        
        <!-- 题目区域 -->
        <div class="questions-section">
          <div class="section-header">
            <h2>题目练习</h2>
            <div class="header-actions">
              <el-button type="primary" @click="createQuestion" size="small">
                <el-icon><Plus /></el-icon>创建题目
              </el-button>
              <el-button @click="$router.push('/questions')" size="small">查看全部</el-button>
            </div>
          </div>
          
          <!-- 题目类型切换 -->
          <div class="question-tabs">
            <el-tabs v-model="activeQuestionType" @tab-change="handleQuestionTypeChange">
              <el-tab-pane label="面试题" name="interview">
                <!-- 加载状态 -->
                <div v-if="loading.questions" class="loading-state">
                  <el-skeleton :rows="3" animated />
                </div>
                
                <!-- 空状态 -->
                <div v-else-if="interviewQuestions.length === 0" class="empty-state">
                  <el-empty description="暂无面试题" />
                </div>
                
                <!-- 题目列表 -->
                <div v-else class="question-list">
                  <div 
                    v-for="question in interviewQuestions" 
                    :key="question.id"
                    class="question-card"
                    @click="viewQuestion(question)"
                  >
                    <div class="question-header">
                      <h3>{{ question.title }}</h3>
                      <div class="question-tags">
                        <el-tag type="warning" size="small" effect="plain">面试题</el-tag>
                        <el-tag :type="getDifficultyType(question.difficulty)" size="small" effect="plain">
                          {{ getDifficultyText(question.difficulty) }}
                        </el-tag>
                      </div>
                    </div>
                    <p class="question-desc">{{ question.content || question.description }}</p>
                    <div class="question-footer">
                      <span class="question-date">{{ formatDate(question.createTime) }}</span>
                      <el-button type="primary" text size="small">
                        查看详情 <el-icon><ArrowRight /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              
              <el-tab-pane label="算法题" name="algorithm">
                <!-- 加载状态 -->
                <div v-if="loading.algorithm" class="loading-state">
                  <el-skeleton :rows="3" animated />
                </div>
                
                <!-- 空状态 -->
                <div v-else-if="algorithmQuestions.length === 0" class="empty-state">
                  <el-empty description="暂无算法题" />
                </div>
                
                <!-- 题目列表 -->
                <div v-else class="question-list">
                  <div 
                    v-for="question in algorithmQuestions" 
                    :key="question.id"
                    class="question-card"
                    @click="viewQuestion(question)"
                  >
                    <div class="question-header">
                      <h3>{{ question.title }}</h3>
                      <div class="question-tags">
                        <el-tag type="success" size="small" effect="plain">算法题</el-tag>
                        <el-tag :type="getDifficultyType(question.difficulty)" size="small" effect="plain">
                          {{ getDifficultyText(question.difficulty) }}
                        </el-tag>
                      </div>
                    </div>
                    <p class="question-desc">{{ question.content || question.description }}</p>
                    <div class="question-footer">
                      <span class="question-date">{{ formatDate(question.createTime) }}</span>
                      <el-button type="success" text size="small">
                        开始练习 <el-icon><ArrowRight /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  User, 
  Document, 
  Calendar, 
  Plus, 
  Search,
  ArrowRight,
  HomeFilled,
  Rank,
  ChatDotRound,
  Bell,
  CaretBottom,
  Setting,
  SwitchButton,
  Star
} from '@element-plus/icons-vue'
import apiClient from '../api/apiClient'

export default {
  name: 'Dashboard',
  components: {
    User,
    Document,
    Calendar,
    Plus,
    Search,
    ArrowRight,
    HomeFilled,
    Rank,
    ChatDotRound,
    Bell,
    CaretBottom,
    Setting,
    SwitchButton,
    Star
  },
  setup() {
    const router = useRouter()
    const currentUser = ref(null)
    const interviewQuestions = ref([])
    const algorithmQuestions = ref([])
    const activeQuestionType = ref('interview') // 默认显示面试题
    const searchKeyword = ref('')
    const searchSuggestions = ref([])
    const searchResults = ref([])
    const searchType = ref('all')
    const todaySignedIn = ref(false)

    const stats = reactive({
      totalQuestions: 0,
      signInDays: 0,
      totalUsers: 0
    })

    const loading = reactive({
      questions: false,
      algorithm: false,
      signIn: false
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

    // 获取面试题 (questionType=0)
    const getInterviewQuestions = async () => {
      loading.questions = true
      try {
        const response = await apiClient.getInterviewQuestions({ 
          current: 1, 
          pageSize: 5 
        })
        if (response && response.data && response.data.records) {
          interviewQuestions.value = response.data.records
          stats.totalQuestions = response.data.total || 0
        }
      } catch (error) {
        console.error('获取面试题失败:', error)
        interviewQuestions.value = []
      } finally {
        loading.questions = false
      }
    }

    // 获取算法题 (questionType=1)
    const getAlgorithmQuestions = async () => {
      loading.algorithm = true
      try {
        const response = await apiClient.getAlgorithmQuestions({ 
          current: 1, 
          pageSize: 5 
        })
        if (response && response.data && response.data.records) {
          algorithmQuestions.value = response.data.records
        }
      } catch (error) {
        console.error('获取算法题失败:', error)
        algorithmQuestions.value = []
      } finally {
        loading.algorithm = false
      }
    }

    // 处理题目类型切换
    const handleQuestionTypeChange = (tabName) => {
      activeQuestionType.value = tabName
      if (tabName === 'algorithm' && algorithmQuestions.value.length === 0) {
        getAlgorithmQuestions()
      } else if (tabName === 'interview' && interviewQuestions.value.length === 0) {
        getInterviewQuestions()
      }
    }

    // 获取用户统计
    const getUserStats = async () => {
      try {
        const response = await apiClient.getUserList({ 
          current: 1, 
          pageSize: 1 
        })
        if (response && response.data) {
          stats.totalUsers = response.data.total || 0
        }
      } catch (error) {
        console.error('获取用户统计失败:', error)
      }
    }

    // 获取签到状态
    const getSignInStatus = async () => {
      try {
        const currentYear = new Date().getFullYear()
        const response = await apiClient.getUserSignInRecord(currentYear)
        if (response && response.data) {
          const today = new Date().getDate()
          todaySignedIn.value = response.data.includes(today)
          stats.signInDays = response.data.length || 0
        }
      } catch (error) {
        console.error('获取签到状态失败:', error)
      }
    }

    // 处理签到
    const handleSignIn = async () => {
      if (todaySignedIn.value) return
      
      loading.signIn = true
      try {
        const response = await apiClient.addUserSignIn()
        if (response && response.data) {
          todaySignedIn.value = true
          stats.signInDays += 1
          ElMessage.success('签到成功！')
        }
      } catch (error) {
        console.error('签到失败:', error)
        ElMessage.error('签到失败，请稍后重试')
      } finally {
        loading.signIn = false
      }
    }

    // 搜索输入处理
    const handleSearchInput = () => {
      // 简化版搜索建议
      if (searchKeyword.value.length > 1) {
        searchSuggestions.value = [
          'Vue.js面试题',
          'JavaScript算法',
          'React组件设计',
          '数据结构'
        ].filter(item => 
          item.toLowerCase().includes(searchKeyword.value.toLowerCase())
        )
      } else {
        searchSuggestions.value = []
      }
    }

    // 执行搜索
    const performSearch = () => {
      if (!searchKeyword.value.trim()) return
      
      // 模拟搜索结果
      searchResults.value = [
        {
          id: 1,
          title: `关于"${searchKeyword.value}"的搜索结果`,
          description: '这是一个模拟的搜索结果，实际项目中需要调用真实的搜索API'
        }
      ]
      
      ElMessage.success(`搜索"${searchKeyword.value}"完成`)
    }

    // 创建题目
    const createQuestion = () => {
      router.push('/questions?action=create')
    }

    // 查看题目
    const viewQuestion = (question) => {
      router.push(`/questions/${question.id}`)
    }

    // 获取难度类型
    const getDifficultyType = (difficulty) => {
      const types = {
        'easy': 'success',
        'medium': 'warning', 
        'hard': 'danger'
      }
      return types[difficulty] || 'info'
    }

    // 获取难度文本
    const getDifficultyText = (difficulty) => {
      const texts = {
        'easy': '简单',
        'medium': '中等',
        'hard': '困难'
      }
      return texts[difficulty] || '未知'
    }

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    }

    // 初始化
    onMounted(() => {
      getCurrentUser()
      getInterviewQuestions() // 默认加载面试题
      getUserStats()
      getSignInStatus()
    })

    return {
      currentUser,
      interviewQuestions,
      algorithmQuestions,
      activeQuestionType,
      searchKeyword,
      searchSuggestions,
      searchResults,
      searchType,
      todaySignedIn,
      stats,
      loading,
      handleSignIn,
      handleSearchInput,
      performSearch,
      createQuestion,
      viewQuestion,
      handleQuestionTypeChange,
      getDifficultyType,
      getDifficultyText,
      formatDate
    }
  }
}
</script>

<style scoped>
/* 全局容器 */
.dashboard-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* 主要内容区域 */
.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: row-reverse; /* 改变方向，让侧边栏靠右 */
  padding: 20px;
  gap: 30px;
  justify-content: flex-end; /* 让内容靠右，这样main就会靠左 */
}

/* 左侧边栏 */
.dashboard-sidebar {
  width: 200px;
  min-width: 200px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  padding: 15px;
  height: fit-content;
}

.sidebar-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.sidebar-signin {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #409eff, #007fff);
  color: white;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.sidebar-signin:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.signin-icon {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.signin-icon .el-icon {
  font-size: 24px;
}

.signin-icon .is-signed {
  color: #67c23a;
}

.signin-status {
  font-size: 16px;
  font-weight: bold;
}

.signin-days {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
}

.sidebar-menu {
  flex: 1;
}

.menu-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
}

.menu-list .menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #606266;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 4px;
}

.menu-list .menu-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.menu-list .menu-item .el-icon {
  margin-right: 10px;
  font-size: 18px;
}

/* 右侧主内容 */
.dashboard-main {
  flex: 0.8; /* 增加宽度比例，从0.6改为0.8 */
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 20px;
  min-width: 1480px; /* 确保最小宽度 */
}

/* 搜索栏 */
.search-bar {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.search-filters {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

/* 题目区域 */
.questions-section {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 800px; /* 进一步增加最小高度 */
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* 题目标签页 */
.question-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 20px;
  background-color: #f9f9f9;
}

.question-tabs :deep(.el-tabs__nav-wrap) {
  padding: 10px 0;
}

.question-tabs :deep(.el-tabs__item) {
  font-size: 14px;
  height: 40px;
  line-height: 40px;
}

.question-tabs {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.question-tabs :deep(.el-tabs) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.question-tabs :deep(.el-tabs__content) {
  padding: 0;
  flex: 1;
  overflow: auto;
}

.question-tabs :deep(.el-tab-pane) {
  height: 100%;
}

/* 题目列表 */
.question-list {
  padding: 24px 30px;
  flex: 1;
  overflow: auto;
}

.question-card {
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.question-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #e6e6e6;
  transform: translateY(-2px);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.question-header h3 {
  margin: 0;
  font-size: 22px; /* 显著增大标题字体 */
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 16px;
  line-height: 1.4;
}

.question-tags {
  display: flex;
  gap: 10px; /* 增加标签间距 */
}

.question-tags :deep(.el-tag) {
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  border-radius: 6px;
}

.question-desc {
  margin: 10px 0 25px 0;
  font-size: 16px; /* 显著增大描述字体 */
  color: #606266;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 4; /* 显示更多行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 80px; /* 确保描述有足够的高度 */
}

.question-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-footer :deep(.el-button) {
  font-size: 16px;
  padding: 10px 20px;
}

.question-date {
  font-size: 12px;
  color: #909399;
}

/* 加载和空状态 */
.loading-state,
.empty-state {
  padding: 40px 0;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-sidebar {
    width: 220px;
  }
}

@media (max-width: 992px) {
  .dashboard-sidebar {
    width: 180px;
  }
  
  .sidebar-stats {
    flex-direction: column;
    gap: 10px;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .stat-value {
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    flex-direction: column;
    padding: 10px;
    gap: 15px;
  }
  
  .dashboard-sidebar {
    width: 100%;
    min-width: 95%;
    padding: 5px;
  }
  
  .sidebar-stats {
    flex-direction: row;
  }
  
  .stat-item {
    flex-direction: column;
    align-items: center;
  }
  
  .dashboard-main {
    gap: 15px;
  }
  
  .question-list {
    padding: 15px;
  }
}
</style>