<template>
  <div class="api-example">
    <h2>API 使用示例</h2>
    
    <!-- Question API 示例 -->
    <div class="api-section">
      <h3>Question API</h3>
      <button @click="fetchQuestions" :disabled="loading">
        {{ loading ? '加载中...' : '获取问题列表' }}
      </button>
      <button @click="createQuestion" :disabled="loading">
        创建问题
      </button>
      <div v-if="questions.length" class="results">
        <h4>问题列表：</h4>
        <ul>
          <li v-for="question in questions" :key="question.id">
            {{ question.title }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Search API 示例 -->
    <div class="api-section">
      <h3>Search API</h3>
      <input 
        v-model="searchKeyword" 
        placeholder="输入搜索关键词"
        @keyup.enter="performSearch"
      />
      <button @click="performSearch" :disabled="loading">
        搜索
      </button>
      <div v-if="searchResults.length" class="results">
        <h4>搜索结果：</h4>
        <ul>
          <li v-for="result in searchResults" :key="result.id">
            {{ result.title }}
          </li>
        </ul>
      </div>
    </div>

    <!-- User API 示例 -->
    <div class="api-section">
      <h3>User API</h3>
      <button @click="fetchCurrentUser" :disabled="loading">
        获取当前用户
      </button>
      <div v-if="currentUser" class="results">
        <h4>当前用户：</h4>
        <p>用户名: {{ currentUser.username }}</p>
        <p>邮箱: {{ currentUser.email }}</p>
      </div>
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="error">
      错误: {{ error }}
    </div>
  </div>
</template>

<script>
import apiClient from '../api/apiClient'

export default {
  name: 'ApiExample',
  data() {
    return {
      loading: false,
      error: null,
      questions: [],
      searchKeyword: '',
      searchResults: [],
      currentUser: null
    }
  },
  methods: {
    async fetchQuestions() {
      this.loading = true
      this.error = null
      try {
        const response = await apiClient.getQuestions()
        this.questions = response || []
        console.log('获取问题列表成功:', response)
      } catch (error) {
        this.error = error.message
        console.error('获取问题列表失败:', error)
      } finally {
        this.loading = false
      }
    },

    async createQuestion() {
      this.loading = true
      this.error = null
      try {
        const questionData = {
          title: '示例问题',
          content: '这是一个示例问题的内容',
          tags: ['vue', 'javascript'],
          difficulty: 'MEDIUM'
        }
        const response = await apiClient.createQuestion(questionData)
        console.log('创建问题成功:', response)
        // 重新获取问题列表
        await this.fetchQuestions()
      } catch (error) {
        this.error = error.message
        console.error('创建问题失败:', error)
      } finally {
        this.loading = false
      }
    },

    async performSearch() {
      if (!this.searchKeyword.trim()) return
      
      this.loading = true
      this.error = null
      try {
        const searchRequest = {
          keyword: this.searchKeyword,
          type: 'ALL',
          page: 1,
          size: 10
        }
        const response = await apiClient.searchContent(searchRequest)
        this.searchResults = response?.items || []
        console.log('搜索成功:', response)
      } catch (error) {
        this.error = error.message
        console.error('搜索失败:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchCurrentUser() {
      this.loading = true
      this.error = null
      try {
        const response = await apiClient.getCurrentUser()
        this.currentUser = response
        console.log('获取用户信息成功:', response)
      } catch (error) {
        this.error = error.message
        console.error('获取用户信息失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.api-example {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.api-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.api-section h3 {
  margin-top: 0;
  color: #42b983;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
}

button:hover:not(:disabled) {
  background-color: #369870;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  width: 200px;
}

.results {
  margin-top: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.results h4 {
  margin-top: 0;
}

.results ul {
  margin: 0;
  padding-left: 20px;
}

.error {
  color: red;
  background-color: #ffe6e6;
  padding: 10px;
  border-radius: 4px;
  margin-top: 15px;
}
</style>