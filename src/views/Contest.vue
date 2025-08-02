<template>
  <div class="contest-container">
    <div class="contest-header">
      <h1>编程竞赛</h1>
      <p>参加编程竞赛，提升算法能力</p>
    </div>

    <div class="contest-content">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="contest in contests" :key="contest.id">
          <el-card class="contest-card" shadow="hover">
            <div class="contest-info">
              <h3>{{ contest.title }}</h3>
              <p class="contest-desc">{{ contest.description }}</p>
              <div class="contest-meta">
                <el-tag :type="contest.status === 'ongoing' ? 'success' : contest.status === 'upcoming' ? 'warning' : 'info'">
                  {{ getStatusText(contest.status) }}
                </el-tag>
                <span class="contest-time">{{ contest.time }}</span>
              </div>
              <div class="contest-actions">
                <el-button type="primary" :disabled="contest.status === 'ended'">
                  {{ contest.status === 'ongoing' ? '参加竞赛' : contest.status === 'upcoming' ? '报名参加' : '查看结果' }}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Contest',
  setup() {
    const isMounted = ref(true)
    const contests = ref([
      {
        id: 1,
        title: '周赛 #1',
        description: '算法基础题目竞赛，适合初学者参加',
        status: 'ongoing',
        time: '2024-01-20 14:00 - 16:00'
      },
      {
        id: 2,
        title: '月赛 #12',
        description: '高难度算法竞赛，挑战你的编程极限',
        status: 'upcoming',
        time: '2024-01-25 19:00 - 22:00'
      },
      {
        id: 3,
        title: '新年特别赛',
        description: '新年主题编程竞赛，丰厚奖品等你来拿',
        status: 'ended',
        time: '2024-01-01 10:00 - 18:00'
      }
    ])

    const getStatusText = (status) => {
      const statusMap = {
        ongoing: '进行中',
        upcoming: '即将开始',
        ended: '已结束'
      }
      return statusMap[status] || status
    }

    // 组件卸载时清理
    onUnmounted(() => {
      isMounted.value = false
      // 清理数据引用
      contests.value = []
    })

    return {
      contests,
      getStatusText
    }
  }
}
</script>

<style scoped>
.contest-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.contest-header {
  text-align: center;
  margin-bottom: 40px;
}

.contest-header h1 {
  font-size: 32px;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.contest-header p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.contest-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.contest-info h3 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 20px;
}

.contest-desc {
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.contest-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.contest-time {
  color: #999;
  font-size: 14px;
}

.contest-actions {
  text-align: center;
}
</style>