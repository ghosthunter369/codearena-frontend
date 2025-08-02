<template>
  <div class="questions-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">
            <el-icon><Document /></el-icon>
            题目管理
          </h1>
          <p class="page-subtitle">管理和练习编程题目</p>
        </div>
        <div class="header-actions">
          <el-button 
            v-if="isAdmin"
            type="primary" 
            size="large" 
            @click="showCreateDialog = true"
          >
            <el-icon><Plus /></el-icon>
            创建题目
          </el-button>
        </div>
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <el-card class="filter-card" shadow="never">
      <el-row :gutter="16" align="middle">
        <el-col :xs="24" :sm="12" :md="8">
          <el-input
            v-model="searchQuery"
            placeholder="搜索题目标题或内容..."
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select
            v-model="selectedDifficulty"
            placeholder="选择难度"
            clearable
            @change="handleFilter"
          >
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select
            v-model="selectedTag"
            placeholder="选择标签"
            clearable
            @change="handleFilter"
          >
            <el-option label="算法" value="algorithm" />
            <el-option label="数据结构" value="data-structure" />
            <el-option label="动态规划" value="dp" />
            <el-option label="图论" value="graph" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="4">
          <el-button @click="resetFilters">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- Questions Table -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="filteredQuestions"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column prop="title" label="题目标题" min-width="200">
          <template #default="{ row }">
            <div class="question-title">
              <el-link type="primary" @click="viewQuestion(row)">
                {{ row.title }}
              </el-link>
              <el-tag
                v-if="row.difficulty"
                :type="getDifficultyType(row.difficulty)"
                size="small"
                class="difficulty-tag"
              >
                {{ getDifficultyText(row.difficulty) }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="tags" label="标签" width="200">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.tags"
              :key="tag"
              size="small"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'completed' ? 'success' : 'info'"
              size="small"
            >
              {{ row.status === 'completed' ? '已完成' : '未完成' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" @click="viewQuestion(row)">
                <el-icon><View /></el-icon>
                查看
              </el-button>
              <el-button 
                v-if="isAdmin"
                size="small" 
                type="primary" 
                @click="editQuestion(row)"
              >
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button
                v-if="isAdmin"
                size="small"
                type="danger"
                @click="deleteQuestion(row)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalQuestions"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- Create/Edit Question Dialog -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingQuestion ? '编辑题目' : '创建题目'"
      width="800px"
      :before-close="handleDialogClose"
    >
      <el-form
        ref="questionFormRef"
        :model="questionForm"
        :rules="questionRules"
        label-width="100px"
        size="large"
      >
        <el-form-item label="题目标题" prop="title">
          <el-input
            v-model="questionForm.title"
            placeholder="请输入题目标题"
            clearable
          />
        </el-form-item>

        <el-form-item label="题目内容" prop="content">
          <el-input
            v-model="questionForm.content"
            type="textarea"
            :rows="6"
            placeholder="请输入题目内容描述"
          />
        </el-form-item>

        <el-form-item label="难度等级" prop="difficulty">
          <el-radio-group v-model="questionForm.difficulty">
            <el-radio-button label="easy">简单</el-radio-button>
            <el-radio-button label="medium">中等</el-radio-button>
            <el-radio-button label="hard">困难</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="questionForm.tags"
            multiple
            filterable
            allow-create
            placeholder="选择或创建标签"
            style="width: 100%"
          >
            <el-option label="算法" value="algorithm" />
            <el-option label="数据结构" value="data-structure" />
            <el-option label="动态规划" value="dp" />
            <el-option label="图论" value="graph" />
            <el-option label="字符串" value="string" />
            <el-option label="数组" value="array" />
          </el-select>
        </el-form-item>

        <el-form-item label="示例输入" prop="sampleInput">
          <el-input
            v-model="questionForm.sampleInput"
            type="textarea"
            :rows="3"
            placeholder="请输入示例输入"
          />
        </el-form-item>

        <el-form-item label="示例输出" prop="sampleOutput">
          <el-input
            v-model="questionForm.sampleOutput"
            type="textarea"
            :rows="3"
            placeholder="请输入示例输出"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button
            type="primary"
            :loading="submitting"
            @click="handleSubmit"
          >
            {{ editingQuestion ? '更新' : '创建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Question Detail Dialog -->
    <el-dialog
      v-model="showDetailDialog"
      title="题目详情"
      width="900px"
    >
      <div v-if="selectedQuestion" class="question-detail">
        <div class="detail-header">
          <h2 class="detail-title">{{ selectedQuestion.title }}</h2>
          <div class="detail-meta">
            <el-tag
              :type="getDifficultyType(selectedQuestion.difficulty)"
              size="large"
            >
              {{ getDifficultyText(selectedQuestion.difficulty) }}
            </el-tag>
            <el-tag
              v-for="tag in selectedQuestion.tags"
              :key="tag"
              size="small"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
        
        <el-divider />
        
        <div class="detail-content">
          <h3>题目描述</h3>
          <p class="content-text">{{ selectedQuestion.content }}</p>
          
          <h3>示例</h3>
          <div class="example-section">
            <div class="example-item">
              <h4>输入：</h4>
              <el-input
                :model-value="selectedQuestion.sampleInput"
                type="textarea"
                :rows="3"
                readonly
              />
            </div>
            <div class="example-item">
              <h4>输出：</h4>
              <el-input
                :model-value="selectedQuestion.sampleOutput"
                type="textarea"
                :rows="3"
                readonly
              />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Document,
  Plus,
  Search,
  Refresh,
  View,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import apiClient from '../api/apiClient'

export default {
  name: 'Questions',
  components: {
    Document,
    Plus,
    Search,
    Refresh,
    View,
    Edit,
    Delete
  },
  setup() {
    const router = useRouter()
    
    // Reactive data
    const loading = ref(false)
    const submitting = ref(false)
    const questions = ref([])
    const selectedQuestions = ref([])
    const searchQuery = ref('')
    const selectedDifficulty = ref('')
    const selectedTag = ref('')
    const currentUser = ref(null)
    
    // Pagination
    const currentPage = ref(1)
    const pageSize = ref(20)
    const totalQuestions = ref(0)

    // Dialog states
    const showCreateDialog = ref(false)
    const showDetailDialog = ref(false)
    const editingQuestion = ref(null)
    const selectedQuestion = ref(null)

    // Form
    const questionFormRef = ref()
    const questionForm = reactive({
      title: '',
      content: '',
      difficulty: 'easy',
      tags: [],
      sampleInput: '',
      sampleOutput: ''
    })

    // Form validation rules
    const questionRules = {
      title: [
        { required: true, message: '请输入题目标题', trigger: 'blur' },
        { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' }
      ],
      content: [
        { required: true, message: '请输入题目内容', trigger: 'blur' },
        { min: 10, message: '内容至少 10 个字符', trigger: 'blur' }
      ],
      difficulty: [
        { required: true, message: '请选择难度等级', trigger: 'change' }
      ]
    }

    // Computed
    const filteredQuestions = computed(() => {
      let filtered = questions.value

      if (searchQuery.value) {
        filtered = filtered.filter(q => 
          q.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          q.content.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }

      if (selectedDifficulty.value) {
        filtered = filtered.filter(q => q.difficulty === selectedDifficulty.value)
      }

      if (selectedTag.value) {
        filtered = filtered.filter(q => q.tags.includes(selectedTag.value))
      }

      return filtered
    })

    // Check if current user is admin
    const isAdmin = computed(() => {
      return currentUser.value && currentUser.value.userRole === 'admin'
    })

    // Methods
    const getCurrentUser = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (user && user.id) {
          currentUser.value = user
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    }

    const loadQuestions = async () => {
      try {
        loading.value = true
        const response = await apiClient.getQuestions()
        
        // Parse the API response structure
        let questionsData = []
        if (response && response.data && response.data.records) {
          // API returns: { code: 0, data: { records: [...], total: "5" } }
          questionsData = Array.isArray(response.data.records) ? response.data.records : []
          totalQuestions.value = parseInt(response.data.total) || questionsData.length
        } else if (Array.isArray(response)) {
          // Direct array response
          questionsData = response
          totalQuestions.value = questionsData.length
        } else if (response?.data && Array.isArray(response.data)) {
          // Response with data array
          questionsData = response.data
          totalQuestions.value = questionsData.length
        }
        
        // Transform the data to match component expectations
        questions.value = questionsData.map(item => {
          // Parse tags - they come as JSON strings like "[\"栈\", \"二叉树\"]"
          let parsedTags = []
          if (Array.isArray(item.tags)) {
            parsedTags = item.tags.flatMap(tag => {
              if (typeof tag === 'string') {
                try {
                  // Try to parse JSON string
                  const parsed = JSON.parse(tag)
                  return Array.isArray(parsed) ? parsed : [tag]
                } catch {
                  return [tag]
                }
              }
              return [tag]
            })
          } else if (typeof item.tags === 'string') {
            try {
              const parsed = JSON.parse(item.tags)
              parsedTags = Array.isArray(parsed) ? parsed : [item.tags]
            } catch {
              parsedTags = [item.tags]
            }
          }
          
          return {
            id: item.id,
            title: item.title,
            content: item.content,
            difficulty: item.difficulty || 'medium',
            tags: parsedTags,
            status: item.status || 'pending',
            sampleInput: item.sampleInput || '',
            sampleOutput: item.sampleOutput || '',
            createTime: item.createTime || item.updateTime || new Date().toISOString(),
            submitNum: item.submitNum || 0,
            acceptedNum: item.acceptedNum || 0,
            judgeConfig: item.judgeConfig || {},
            userVO: item.userVO || {}
          }
        })
        
      } catch (error) {
        console.error('加载题目失败:', error)
        ElMessage.error('加载题目失败')
        // Mock data for demo - ensure it's always an array
        questions.value = [
          {
            id: 1,
            title: '两数之和',
            content: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。',
            difficulty: 'easy',
            tags: ['数组', '哈希表'],
            status: 'completed',
            sampleInput: '[2,7,11,15], target = 9',
            sampleOutput: '[0,1]',
            createTime: '2024-01-20 10:00:00'
          },
          {
            id: 2,
            title: '链表反转',
            content: '给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。',
            difficulty: 'medium',
            tags: ['链表', '递归'],
            status: 'pending',
            sampleInput: '[1,2,3,4,5]',
            sampleOutput: '[5,4,3,2,1]',
            createTime: '2024-01-19 15:30:00'
          }
        ]
        totalQuestions.value = questions.value.length
      } finally {
        loading.value = false
      }
    }

    const handleSearch = () => {
      currentPage.value = 1
    }

    const handleFilter = () => {
      currentPage.value = 1
    }

    const resetFilters = () => {
      searchQuery.value = ''
      selectedDifficulty.value = ''
      selectedTag.value = ''
      currentPage.value = 1
    }

    const handleSelectionChange = (selection) => {
      selectedQuestions.value = selection
    }

    const handleSizeChange = (size) => {
      pageSize.value = size
      loadQuestions()
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
      loadQuestions()
    }

    const viewQuestion = (question) => {
      // Navigate to question detail page
      router.push(`/questions/${question.id}`)
    }

    const editQuestion = (question) => {
      editingQuestion.value = question
      Object.assign(questionForm, question)
      showCreateDialog.value = true
    }

    const deleteQuestion = async (question) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除题目"${question.title}"吗？`,
          '确认删除',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )

        await apiClient.deleteQuestion(question.id)
        ElMessage.success('删除成功')
        loadQuestions()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          ElMessage.error('删除失败')
        }
      }
    }

    const handleSubmit = async () => {
      if (!questionFormRef.value) return

      try {
        await questionFormRef.value.validate()
        submitting.value = true

        if (editingQuestion.value) {
          await apiClient.updateQuestion(editingQuestion.value.id, questionForm)
          ElMessage.success('更新成功')
        } else {
          await apiClient.createQuestion(questionForm)
          ElMessage.success('创建成功')
        }

        handleDialogClose()
        loadQuestions()
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('提交失败')
      } finally {
        submitting.value = false
      }
    }

    const handleDialogClose = () => {
      showCreateDialog.value = false
      editingQuestion.value = null
      questionFormRef.value?.resetFields()
      Object.assign(questionForm, {
        title: '',
        content: '',
        difficulty: 'easy',
        tags: [],
        sampleInput: '',
        sampleOutput: ''
      })
    }

    const getDifficultyType = (difficulty) => {
      const types = {
        easy: 'success',
        medium: 'warning',
        hard: 'danger'
      }
      return types[difficulty] || 'info'
    }

    const getDifficultyText = (difficulty) => {
      const texts = {
        easy: '简单',
        medium: '中等',
        hard: '困难'
      }
      return texts[difficulty] || difficulty
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleString('zh-CN')
    }

    // Lifecycle
    onMounted(() => {
      getCurrentUser()
      loadQuestions()
    })

    // Cleanup on unmount
    onUnmounted(() => {
      // Reset all reactive data to prevent memory leaks
      questions.value = []
      selectedQuestions.value = []
      searchQuery.value = ''
      selectedDifficulty.value = ''
      selectedTag.value = ''
      showCreateDialog.value = false
      showDetailDialog.value = false
      editingQuestion.value = null
      selectedQuestion.value = null
      loading.value = false
      submitting.value = false
    })

    return {
      loading,
      submitting,
      questions,
      selectedQuestions,
      searchQuery,
      selectedDifficulty,
      selectedTag,
      currentPage,
      pageSize,
      totalQuestions,
      showCreateDialog,
      showDetailDialog,
      editingQuestion,
      selectedQuestion,
      questionFormRef,
      questionForm,
      questionRules,
      filteredQuestions,
      currentUser,
      isAdmin,
      loadQuestions,
      handleSearch,
      handleFilter,
      resetFilters,
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      viewQuestion,
      editQuestion,
      deleteQuestion,
      handleSubmit,
      handleDialogClose,
      getDifficultyType,
      getDifficultyText,
      formatDate
    }
  }
}
</script>

<style scoped>
.questions-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-subtitle {
  color: #666;
  margin: 0;
  font-size: 14px;
}

/* Filter Card */
.filter-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.filter-card :deep(.el-card__body) {
  padding: 20px;
}

/* Table Card */
.table-card {
  border-radius: 12px;
}

.question-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.difficulty-tag {
  margin-left: 8px;
}

.tag-item {
  margin-right: 4px;
  margin-bottom: 4px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* Dialog Styles */
.dialog-footer {
  text-align: right;
}

.question-detail {
  max-height: 600px;
  overflow-y: auto;
}

.detail-header {
  margin-bottom: 16px;
}

.detail-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.detail-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-content h3 {
  color: #2c3e50;
  margin: 20px 0 12px 0;
}

.detail-content h4 {
  color: #666;
  margin: 12px 0 8px 0;
  font-size: 14px;
}

.content-text {
  line-height: 1.6;
  color: #666;
  margin: 0 0 20px 0;
}

.example-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.example-item {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .example-section {
    grid-template-columns: 1fr;
  }
  
  .el-table {
    font-size: 12px;
  }
  
  .el-button-group .el-button {
    padding: 5px 8px;
    font-size: 12px;
  }
}
</style>