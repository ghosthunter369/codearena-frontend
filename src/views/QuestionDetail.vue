<template>
  <div class="question-detail-container">
    <!-- Header with navigation -->
    <div class="question-header">
      <div class="header-left">
        <el-button @click="goBack" :icon="ArrowLeft" circle />
        <div class="question-info">
          <h1 class="question-title">{{ question.title }}</h1>
          <div class="question-meta">
            <el-tag :type="getDifficultyType(question.difficulty)" size="small">
              {{ getDifficultyText(question.difficulty) }}
            </el-tag>
            <el-tag
              v-for="tag in question.tags"
              :key="tag"
              size="small"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="submitCode" :loading="submitting">
          <el-icon><Check /></el-icon>
          提交代码
        </el-button>
      </div>
    </div>

    <!-- Main content area -->
    <div class="main-content">
      <!-- Left panel - Question details -->
      <div class="left-panel">
        <el-card class="question-card" shadow="never">
          <el-tabs v-model="activeTab" class="question-tabs">
            <el-tab-pane label="题目描述" name="description">
              <div class="question-content">
                <div class="content-section">
                  <div class="problem-header">
                    <h2 class="problem-title">{{ question.title }}</h2>
                    <div class="problem-stats">
                      <span class="stat-item">
                        <el-icon><User /></el-icon>
                        通过率: {{ getAcceptanceRate() }}%
                      </span>
                      <span class="stat-item">
                        <el-icon><Document /></el-icon>
                        提交次数: {{ question.submitNum || 0 }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="description-content">
                    <div class="description-text" v-html="formatDescription(question.content)"></div>
                  </div>
                </div>

                <div class="content-section">
                  <h3 class="section-title">
                    <el-icon><EditPen /></el-icon>
                    示例
                  </h3>
                  <div class="example-container">
                    <div class="example-item">
                      <div class="example-header">
                        <span class="example-label">示例 1:</span>
                      </div>
                      <div class="example-content">
                        <div class="example-io">
                          <div class="io-label">输入:</div>
                          <div class="io-content">{{ question.sampleInput }}</div>
                        </div>
                        <div class="example-io">
                          <div class="io-label">输出:</div>
                          <div class="io-content">{{ question.sampleOutput }}</div>
                        </div>
                        <div class="example-explanation" v-if="question.explanation">
                          <div class="io-label">解释:</div>
                          <div class="io-content">{{ question.explanation }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="content-section" v-if="question.constraints && question.constraints.length">
                  <h3 class="section-title">
                    <el-icon><Warning /></el-icon>
                    提示
                  </h3>
                  <div class="constraints-container">
                    <ul class="constraints-list">
                      <li v-for="constraint in question.constraints" :key="constraint">
                        {{ constraint }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="题解" name="solutions">
              <div class="solutions-content">
                <el-empty description="提交代码后可查看题解" />
              </div>
            </el-tab-pane>

            <el-tab-pane label="提交记录" name="submissions">
              <div class="submissions-content">
                <el-table :data="submissions" style="width: 100%">
                  <el-table-column prop="status" label="状态" width="120">
                    <template #default="{ row }">
                      <el-tag :type="getStatusType(row.status)" size="small">
                        {{ getStatusText(row.status) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="language" label="语言" width="100" />
                  <el-table-column prop="runtime" label="执行用时" width="100" />
                  <el-table-column prop="memory" label="内存消耗" width="100" />
                  <el-table-column prop="submitTime" label="提交时间" />
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>

      <!-- Right panel - Code editor -->
      <div class="right-panel">
        <el-card class="code-card" shadow="never">
          <template #header>
            <div class="code-header">
              <div class="language-selector">
                <span class="selector-label">语言:</span>
                <el-select v-model="selectedLanguage" placeholder="选择语言" size="small" @change="onLanguageChange">
                  <el-option label="Java" value="java" />
                  <el-option label="Python" value="python" />
                  <el-option label="C++" value="cpp" />
                  <el-option label="JavaScript" value="javascript" />
                  <el-option label="Go" value="go" />
                </el-select>
              </div>
              <div class="code-actions">
                <el-button size="small" @click="resetCode">
                  <el-icon><Refresh /></el-icon>
                  重置代码
                </el-button>
                <el-button size="small" @click="runCode" :loading="running">
                  <el-icon><CaretRight /></el-icon>
                  运行代码
                </el-button>
              </div>
            </div>
          </template>

          <div class="code-editor-container">
            <div class="code-editor">
              <div class="editor-wrapper">
                <pre class="line-numbers" ref="lineNumbers"></pre>
                <div class="editor-content">
                  <!-- 编辑模式：带实时高亮的编辑器 -->
                  <div v-if="isEditing" class="editor-with-highlight">
                    <pre class="highlight-background"><code 
                      :class="`language-${getHighlightLanguage(selectedLanguage)}`"
                      v-html="highlightedCode"
                    ></code></pre>
                    <textarea
                      ref="codeTextarea"
                      v-model="code"
                      class="code-textarea-overlay"
                      :placeholder="getCodeTemplate(selectedLanguage)"
                      spellcheck="false"
                      @input="updateHighlight"
                      @blur="stopEditing"
                      @scroll="syncLineNumbers"
                      @keydown="handleKeydown"
                    ></textarea>
                  </div>
                  
                  <!-- 预览模式：显示高亮代码 -->
                  <pre 
                    v-else
                    class="code-preview"
                    @click="startEditing"
                  ><code 
                    :class="`language-${getHighlightLanguage(selectedLanguage)}`"
                    v-html="highlightedCode || '点击开始编写代码...'"
                  ></code></pre>
                </div>
              </div>
            </div>
          </div>

          <!-- Test cases and output -->
          <div class="test-section">
            <el-tabs v-model="activeTestTab" class="test-tabs">
              <el-tab-pane label="测试用例" name="testcases">
                <div class="test-cases">
                  <div class="test-case-tabs">
                    <el-button
                      v-for="(testCase, index) in testCases"
                      :key="index"
                      :type="activeTestCase === index ? 'primary' : ''"
                      size="small"
                      @click="activeTestCase = index"
                    >
                      用例 {{ index + 1 }}
                    </el-button>
                    <el-button size="small" @click="addTestCase">
                      <el-icon><Plus /></el-icon>
                      添加用例
                    </el-button>
                  </div>
                  <div class="test-case-content" v-if="testCases[activeTestCase]">
                    <div class="input-section">
                      <label>输入:</label>
                      <el-input
                        v-model="testCases[activeTestCase].input"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入测试数据..."
                      />
                    </div>
                    <div class="expected-section">
                      <label>期望输出:</label>
                      <el-input
                        v-model="testCases[activeTestCase].expected"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入期望的输出结果..."
                      />
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane label="执行结果" name="output">
                <div class="output-section">
                  <div v-if="testOutput" class="test-result">
                    <div class="result-header">
                      <el-tag :type="testOutput.success ? 'success' : 'danger'">
                        {{ testOutput.success ? '通过' : '失败' }}
                      </el-tag>
                      <span class="runtime">执行用时: {{ testOutput.runtime }}ms</span>
                    </div>
                    <div class="result-content">
                      <div class="result-item">
                        <strong>输入:</strong>
                        <pre>{{ testOutput.input }}</pre>
                      </div>
                      <div class="result-item">
                        <strong>输出:</strong>
                        <pre>{{ testOutput.output }}</pre>
                      </div>
                      <div class="result-item" v-if="testOutput.expected">
                        <strong>期望:</strong>
                        <pre>{{ testOutput.expected }}</pre>
                      </div>
                    </div>
                  </div>
                  <el-empty v-else description="运行代码查看执行结果" />
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Check,
  Refresh,
  CaretRight,
  Plus,
  User,
  Document,
  EditPen,
  Warning
} from '@element-plus/icons-vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css' // Dark theme
import apiClient from '../api/apiClient'

export default {
  name: 'QuestionDetail',
  components: {
    ArrowLeft,
    Check,
    Refresh,
    CaretRight,
    Plus,
    User,
    Document,
    EditPen,
    Warning
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    // Reactive data
    const question = ref({
      id: '',
      title: '',
      content: '',
      difficulty: 'medium',
      tags: [],
      sampleInput: '',
      sampleOutput: '',
      constraints: []
    })

    const activeTab = ref('description')
    const activeTestTab = ref('testcases')
    const activeTestCase = ref(0)
    const selectedLanguage = ref('java')
    const code = ref('')
    const running = ref(false)
    const submitting = ref(false)
    const highlightedCode = ref('')
    const isEditing = ref(false)

    // Template refs
    const codeTextarea = ref(null)
    const lineNumbers = ref(null)

    const testCases = ref([
      { input: '', expected: '' }
    ])

    const testOutput = ref(null)
    const submissions = ref([])

    // Code templates for different languages
    const codeTemplates = {
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // 在这里编写你的代码
        
    }
}`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # 在这里编写你的代码
        pass`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // 在这里编写你的代码
        
    }
};`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // 在这里编写你的代码
    
};`,
      go: `func twoSum(nums []int, target int) []int {
    // 在这里编写你的代码
    
}`
    }

    // Methods
    const loadQuestion = async () => {
      try {
        const questionId = route.params.id
        const response = await apiClient.getQuestion(questionId)
        
        if (response && response.data) {
          const data = response.data
          question.value = {
            id: data.id,
            title: data.title,
            content: data.content,
            difficulty: data.difficulty || 'medium',
            tags: Array.isArray(data.tags) ? data.tags : [],
            sampleInput: data.sampleInput || '',
            sampleOutput: data.sampleOutput || '',
            constraints: data.constraints || [
              '2 <= nums.length <= 10^4',
              '-10^9 <= nums[i] <= 10^9',
              '-10^9 <= target <= 10^9',
              'Only one valid answer exists.'
            ]
          }
          
          // Initialize test case with sample data
          if (data.sampleInput && data.sampleOutput) {
            testCases.value[0] = {
              input: data.sampleInput,
              expected: data.sampleOutput
            }
          }
        }
      } catch (error) {
        console.error('Failed to load question:', error)
        ElMessage.error('Failed to load question')
        
        // Mock data for demo
        question.value = {
          id: route.params.id,
          title: 'Two Sum',
          content: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
          difficulty: 'easy',
          tags: ['Array', 'Hash Table'],
          sampleInput: 'nums = [2,7,11,15], target = 9',
          sampleOutput: '[0,1]',
          constraints: [
            '2 <= nums.length <= 10^4',
            '-10^9 <= nums[i] <= 10^9',
            '-10^9 <= target <= 10^9',
            'Only one valid answer exists.'
          ]
        }
        
        testCases.value[0] = {
          input: 'nums = [2,7,11,15], target = 9',
          expected: '[0,1]'
        }
      }
    }

    const goBack = () => {
      router.push('/questions')
    }

    const getCodeTemplate = (language) => {
      return codeTemplates[language] || codeTemplates.java
    }

    const getHighlightLanguage = (language) => {
      const languageMap = {
        java: 'java',
        python: 'python',
        cpp: 'cpp',
        javascript: 'javascript',
        go: 'go'
      }
      return languageMap[language] || 'java'
    }

    const updateHighlight = () => {
      if (code.value) {
        try {
          const highlighted = hljs.highlight(code.value, { 
            language: getHighlightLanguage(selectedLanguage.value) 
          }).value
          highlightedCode.value = highlighted
        } catch (error) {
          // Fallback to plain text if highlighting fails
          highlightedCode.value = code.value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        }
      } else {
        highlightedCode.value = ''
      }
      updateLineNumbers()
    }

    const startEditing = () => {
      isEditing.value = true
      nextTick(() => {
        if (codeTextarea.value) {
          codeTextarea.value.focus()
        }
      })
    }

    const stopEditing = () => {
      isEditing.value = false
      updateHighlight()
    }

    const syncLineNumbers = () => {
      if (codeTextarea.value && lineNumbers.value) {
        const scrollTop = codeTextarea.value.scrollTop
        const scrollLeft = codeTextarea.value.scrollLeft
        
        lineNumbers.value.scrollTop = scrollTop
        
        // 同步高亮层的滚动
        const highlightLayer = document.querySelector('.highlight-background')
        if (highlightLayer) {
          highlightLayer.scrollTop = scrollTop
          highlightLayer.scrollLeft = scrollLeft
        }
      }
    }

    const handleKeydown = (event) => {
      // Handle tab key for indentation
      if (event.key === 'Tab') {
        event.preventDefault()
        const textarea = codeTextarea.value
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        
        // Insert 4 spaces for tab
        const newValue = code.value.substring(0, start) + '    ' + code.value.substring(end)
        code.value = newValue
        
        // Move cursor
        nextTick(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4
          updateHighlight()
        })
      }
    }

    const updateLineNumbers = () => {
      if (lineNumbers.value) {
        const lines = code.value.split('\n').length
        const numbers = Array.from({ length: lines }, (_, i) => i + 1).join('\n')
        lineNumbers.value.textContent = numbers
      }
    }


    const onLanguageChange = () => {
      if (!code.value || code.value === getCodeTemplate(selectedLanguage.value)) {
        resetCode()
      }
      updateHighlight()
    }

    const resetCode = () => {
      code.value = getCodeTemplate(selectedLanguage.value)
      updateHighlight()
    }

    const addTestCase = () => {
      testCases.value.push({ input: '', expected: '' })
      activeTestCase.value = testCases.value.length - 1
    }

    const runCode = async () => {
      if (!code.value.trim()) {
        ElMessage.warning('请先编写代码')
        return
      }

      try {
        running.value = true
        activeTestTab.value = 'output'
        
        // Simulate code execution (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const currentTestCase = testCases.value[activeTestCase.value]
        testOutput.value = {
          success: Math.random() > 0.3, // Random success for demo
          input: currentTestCase.input,
          output: currentTestCase.expected, // Mock output
          expected: currentTestCase.expected,
          runtime: Math.floor(Math.random() * 100) + 50
        }
        
        ElMessage.success('代码执行成功')
      } catch (error) {
        console.error('代码执行失败:', error)
        ElMessage.error('代码执行失败')
      } finally {
        running.value = false
      }
    }

    const submitCode = async () => {
      if (!code.value.trim()) {
        ElMessage.warning('请先编写代码')
        return
      }

      try {
        await ElMessageBox.confirm(
          '确定要提交你的解决方案吗？',
          '提交代码',
          {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'info'
          }
        )

        submitting.value = true
        
        // Simulate submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const statusOptions = ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error']
        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)]
        
        const newSubmission = {
          status: randomStatus,
          language: getLanguageDisplayName(selectedLanguage.value),
          runtime: Math.floor(Math.random() * 100) + 50 + 'ms',
          memory: Math.floor(Math.random() * 20) + 10 + 'MB',
          submitTime: new Date().toLocaleString('zh-CN')
        }
        
        submissions.value.unshift(newSubmission)
        
        if (newSubmission.status === 'Accepted') {
          ElMessage.success('恭喜！你的解决方案已通过！')
        } else {
          ElMessage.error('你的解决方案未通过，请重试')
        }
        
      } catch (error) {
        if (error !== 'cancel') {
          console.error('提交失败:', error)
          ElMessage.error('提交失败')
        }
      } finally {
        submitting.value = false
      }
    }

    const formatDescription = (content) => {
      return content.replace(/\n/g, '<br>')
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

    const getStatusType = (status) => {
      const types = {
        'Accepted': 'success',
        'Wrong Answer': 'danger',
        'Time Limit Exceeded': 'warning',
        'Runtime Error': 'danger',
        'Compile Error': 'info'
      }
      return types[status] || 'info'
    }

    const getStatusText = (status) => {
      const texts = {
        'Accepted': '通过',
        'Wrong Answer': '答案错误',
        'Time Limit Exceeded': '超时',
        'Runtime Error': '运行错误',
        'Compile Error': '编译错误'
      }
      return texts[status] || status
    }

    const getLanguageDisplayName = (language) => {
      const names = {
        java: 'Java',
        python: 'Python',
        cpp: 'C++',
        javascript: 'JavaScript',
        go: 'Go'
      }
      return names[language] || language
    }

    const getAcceptanceRate = () => {
      const accepted = question.value.acceptedNum || 0
      const submitted = question.value.submitNum || 0
      if (submitted === 0) return 0
      return Math.round((accepted / submitted) * 100)
    }

    // Initialize code template when language changes
    const initializeCode = () => {
      if (!code.value) {
        code.value = getCodeTemplate(selectedLanguage.value)
      }
    }

    // Lifecycle
    onMounted(() => {
      loadQuestion()
      initializeCode()
    })

    onUnmounted(() => {
      // Cleanup
      question.value = {}
      code.value = ''
      testCases.value = []
      testOutput.value = null
      submissions.value = []
    })

    return {
      question,
      activeTab,
      activeTestTab,
      activeTestCase,
      selectedLanguage,
      code,
      running,
      submitting,
      highlightedCode,
      isEditing,
      codeTextarea,
      lineNumbers,
      testCases,
      testOutput,
      submissions,
      loadQuestion,
      goBack,
      getCodeTemplate,
      getHighlightLanguage,
      updateHighlight,
      updateLineNumbers,
      startEditing,
      stopEditing,
      syncLineNumbers,
      onLanguageChange,
      resetCode,
      addTestCase,
      runCode,
      submitCode,
      formatDescription,
      getDifficultyType,
      getDifficultyText,
      getStatusType,
      getStatusText,
      getLanguageDisplayName,
      getAcceptanceRate,
      initializeCode,
      handleKeydown
    }
  }
}
</script>

<style scoped>
.question-detail-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  width: 95%;
  margin-left: 45px;
  max-width: 1720px;
}

/* Header */
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.question-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.question-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.question-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.tag-item {
  margin-right: 4px;
}

/* Main content */
.main-content {
  flex: 1;
  display: flex;
  gap: 1px;
  overflow: hidden;
}

.left-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.right-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.question-card,
.code-card {
  height: 100%;
  border-radius: 0;
  border: none;
}

.question-card :deep(.el-card__body),
.code-card :deep(.el-card__body) {
  height: calc(100% - 60px);
  padding: 0;
  overflow: hidden;
}

/* Question content */
.question-tabs {
  height: 100%;
}

.question-tabs :deep(.el-tabs__content) {
  height: calc(100% - 40px);
  overflow-y: auto;
  padding: 20px;
}

.question-content {
  max-width: none;
}

.content-section {
  margin-bottom: 32px;
}

.problem-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.problem-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.problem-stats {
  display: flex;
  gap: 24px;
  color: #666;
  font-size: 14px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c3e50;
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}

.description-content {
  background: #fafafa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.description-text {
  line-height: 1.8;
  color: #333;
  font-size: 15px;
  white-space: pre-line;
}

.example-container {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.example-item {
  padding: 0;
  margin: 0;
  background: transparent;
}

.example-header {
  background: #e9ecef;
  padding: 12px 16px;
  border-bottom: 1px solid #dee2e6;
}

.example-label {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.example-content {
  padding: 16px;
}

.example-io {
  display: flex;
  margin-bottom: 12px;
  align-items: flex-start;
}

.example-explanation {
  display: flex;
  margin-bottom: 12px;
  align-items: flex-start;
}

.io-label {
  min-width: 60px;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.io-content {
  flex: 1;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  background: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  color: #333;
}

.constraints-container {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 16px;
}

.constraints-list {
  margin: 0;
  padding-left: 20px;
  color: #856404;
}

.constraints-list li {
  margin-bottom: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
}

/* Code editor */
.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.language-selector :deep(.el-select) {
  width: 140px;
}

.language-selector :deep(.el-select__wrapper) {
  width: 100%;
}

.selector-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.code-actions {
  display: flex;
  gap: 8px;
}

.code-editor-container {
  height: 60%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  background: #1e1e1e;
}

.code-editor {
  height: 100%;
  position: relative;
}

.editor-wrapper {
  display: flex;
  height: 100%;
}

.line-numbers {
  background: #252526;
  color: #858585;
  padding: 16px 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  text-align: right;
  user-select: none;
  min-width: 50px;
  border-right: 1px solid #3e3e42;
  white-space: pre;
  margin: 0;
}

.editor-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.editor-with-highlight {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.highlight-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 16px 16px 16px 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  background: #1e1e1e;
  color: #d4d4d4;
  white-space: pre;
  overflow: hidden;
  box-sizing: border-box;
  pointer-events: none;
  z-index: 1;
  text-align: left;
}

.highlight-background code {
  background: transparent;
  padding: 0;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  display: block;
  white-space: pre;
  color: inherit;
  text-align: left;
}

.code-textarea-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 16px 16px 16px 16px;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  background: transparent;
  color: rgba(212, 212, 212, 0.3);
  white-space: pre;
  overflow: hidden;
  box-sizing: border-box;
  z-index: 2;
  caret-color: #d4d4d4;
  text-align: left;
}

.code-textarea-overlay::placeholder {
  color: #6a6a6a;
}

.code-textarea-overlay:focus {
  outline: 2px solid #409eff;
  outline-offset: -2px;
}

.code-preview {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  background: #1e1e1e;
  color: #d4d4d4;
  white-space: pre;
  overflow: auto;
  box-sizing: border-box;
  cursor: text;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.code-preview:hover {
  border-color: #409eff;
}

.code-preview code {
  background: transparent;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  display: block;
  white-space: pre;
  color: inherit;
}

.code-textarea::placeholder {
  color: #6a6a6a;
}

.code-textarea:focus {
  outline: none;
}

/* Syntax highlighting overrides */
.editor-content :deep(.hljs) {
  background: transparent !important;
  color: #d4d4d4 !important;
}

.editor-content :deep(.hljs-keyword) {
  color: #569cd6 !important;
}

.editor-content :deep(.hljs-string) {
  color: #ce9178 !important;
}

.editor-content :deep(.hljs-comment) {
  color: #6a9955 !important;
}

.editor-content :deep(.hljs-number) {
  color: #b5cea8 !important;
}

.editor-content :deep(.hljs-class) {
  color: #4ec9b0 !important;
}

.editor-content :deep(.hljs-function) {
  color: #dcdcaa !important;
}

/* Test section */
.test-section {
  height: 40%;
  margin-top: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.test-tabs {
  height: 100%;
}

.test-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 20px;
  background: #fafbfc;
  border-bottom: 1px solid #e4e7ed;
}

.test-tabs :deep(.el-tabs__nav-wrap) {
  padding: 12px 0;
}

.test-tabs :deep(.el-tabs__item) {
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  border-radius: 6px;
  margin-right: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-width: 100px;
}

.test-tabs :deep(.el-tabs__item.is-active) {
  background: #409eff;
  color: white;
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.test-tabs :deep(.el-tabs__item:hover) {
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
}

.test-tabs :deep(.el-tabs__active-bar) {
  display: none;
}

.test-tabs :deep(.el-tabs__content) {
  height: calc(100% - 60px);
  overflow-y: auto;
  padding: 24px;
}

.test-case-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.test-case-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.input-section,
.expected-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-section label,
.expected-section label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 15px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-section label::before {
  content: "📝";
  font-size: 16px;
}

.expected-section label::before {
  content: "✅";
  font-size: 16px;
}

/* Output section */
.output-section {
  padding: 20px;
  background: #fafbfc;
  border-radius: 8px;
  min-height: 200px;
}

.test-result {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.runtime {
  color: #666;
  font-size: 14px;
  background: #f8f9fa;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.result-item strong {
  color: #2c3e50;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-item strong::before {
  content: "📋";
  font-size: 16px;
}

.result-item:nth-child(2) strong::before {
  content: "📤";
}

.result-item:nth-child(3) strong::before {
  content: "🎯";
}

.result-item pre {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  color: #333;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Responsive design */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .left-panel,
  .right-panel {
    width: 100%;
    height: 50%;
  }
}

@media (max-width: 768px) {
  .question-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .header-left {
    width: 100%;
  }
  
  .header-right {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  
  .code-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .test-case-tabs {
    justify-content: flex-start;
  }
}
</style>