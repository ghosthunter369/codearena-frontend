<template>
  <div class="discuss-container">
    <div class="discuss-header">
      <h1>技术讨论</h1>
      <p>与其他开发者交流技术心得</p>
    </div>

    <div class="discuss-toolbar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索讨论话题..."
        :prefix-icon="Search"
        size="large"
        clearable
        class="search-input"
      />
      <el-button type="primary" size="large" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        发起讨论
      </el-button>
    </div>

    <div class="discuss-content">
      <el-card class="discuss-list" shadow="never">
        <div v-for="topic in topics" :key="topic.id" class="topic-item">
          <div class="topic-avatar">
            <el-avatar :src="topic.author.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
          </div>
          <div class="topic-content">
            <h3 class="topic-title">{{ topic.title }}</h3>
            <p class="topic-excerpt">{{ topic.excerpt }}</p>
            <div class="topic-meta">
              <span class="author">{{ topic.author.name }}</span>
              <span class="time">{{ topic.createTime }}</span>
              <el-tag size="small">{{ topic.category }}</el-tag>
            </div>
          </div>
          <div class="topic-stats">
            <div class="stat-item">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ topic.replies }}</span>
            </div>
            <div class="stat-item">
              <el-icon><View /></el-icon>
              <span>{{ topic.views }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Create Topic Dialog -->
    <el-dialog v-model="showCreateDialog" title="发起讨论" width="600px">
      <el-form :model="topicForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="topicForm.title" placeholder="请输入讨论标题" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="topicForm.category" placeholder="选择分类">
            <el-option label="算法" value="algorithm" />
            <el-option label="前端" value="frontend" />
            <el-option label="后端" value="backend" />
            <el-option label="数据库" value="database" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="topicForm.content"
            type="textarea"
            :rows="6"
            placeholder="请输入讨论内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="createTopic">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus, User, ChatDotRound, View } from '@element-plus/icons-vue'

export default {
  name: 'Discuss',
  components: {
    Search,
    Plus,
    User,
    ChatDotRound,
    View
  },
  setup() {
    const isMounted = ref(true)
    const searchQuery = ref('')
    const showCreateDialog = ref(false)
    
    const topicForm = reactive({
      title: '',
      category: '',
      content: ''
    })

    const topics = ref([
      {
        id: 1,
        title: '如何优化递归算法的性能？',
        excerpt: '在解决动态规划问题时，经常遇到递归算法性能问题，有什么好的优化方法吗？',
        author: {
          name: '算法爱好者',
          avatar: ''
        },
        createTime: '2小时前',
        category: '算法',
        replies: 15,
        views: 234
      },
      {
        id: 2,
        title: 'Vue 3 Composition API 最佳实践',
        excerpt: '分享一些在项目中使用 Composition API 的经验和最佳实践...',
        author: {
          name: '前端开发者',
          avatar: ''
        },
        createTime: '5小时前',
        category: '前端',
        replies: 8,
        views: 156
      }
    ])

    const createTopic = () => {
      if (!topicForm.title || !topicForm.content) {
        ElMessage.warning('请填写完整信息')
        return
      }
      
      ElMessage.success('讨论发布成功')
      showCreateDialog.value = false
      Object.assign(topicForm, {
        title: '',
        category: '',
        content: ''
      })
    }

    // 组件卸载时清理
    onUnmounted(() => {
      isMounted.value = false
      showCreateDialog.value = false
      // 清理数据引用
      topics.value = []
      searchQuery.value = ''
    })

    return {
      searchQuery,
      showCreateDialog,
      topicForm,
      topics,
      createTopic
    }
  }
}
</script>

<style scoped>
.discuss-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.discuss-header {
  text-align: center;
  margin-bottom: 32px;
}

.discuss-header h1 {
  font-size: 32px;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.discuss-header p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.discuss-toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.discuss-list {
  border-radius: 12px;
}

.topic-item {
  display: flex;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.topic-item:last-child {
  border-bottom: none;
}

.topic-avatar {
  flex-shrink: 0;
}

.topic-content {
  flex: 1;
}

.topic-title {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 18px;
  cursor: pointer;
}

.topic-title:hover {
  color: #409eff;
}

.topic-excerpt {
  margin: 0 0 12px 0;
  color: #666;
  line-height: 1.6;
}

.topic-meta {
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 14px;
  color: #999;
}

.topic-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
}
</style>