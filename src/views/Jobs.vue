<template>
  <div class="jobs-container">
    <div class="jobs-header">
      <h1>求职招聘</h1>
      <p>发现优质工作机会，找到理想职位</p>
    </div>

    <div class="jobs-toolbar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索职位、公司..."
        :prefix-icon="Search"
        size="large"
        clearable
        class="search-input"
      />
      <el-select v-model="selectedCity" placeholder="城市" size="large" clearable>
        <el-option label="北京" value="beijing" />
        <el-option label="上海" value="shanghai" />
        <el-option label="深圳" value="shenzhen" />
        <el-option label="杭州" value="hangzhou" />
      </el-select>
      <el-select v-model="selectedExperience" placeholder="经验" size="large" clearable>
        <el-option label="应届生" value="fresh" />
        <el-option label="1-3年" value="junior" />
        <el-option label="3-5年" value="mid" />
        <el-option label="5年以上" value="senior" />
      </el-select>
    </div>

    <div class="jobs-content">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :lg="8" v-for="job in jobs" :key="job.id">
          <el-card class="job-card" shadow="hover">
            <div class="job-header">
              <div class="company-logo">
                <el-avatar :size="50" :src="job.company.logo">
                  {{ job.company.name.charAt(0) }}
                </el-avatar>
              </div>
              <div class="job-basic">
                <h3 class="job-title">{{ job.title }}</h3>
                <p class="company-name">{{ job.company.name }}</p>
              </div>
            </div>
            
            <div class="job-info">
              <div class="salary">{{ job.salary }}</div>
              <div class="job-meta">
                <el-tag size="small">{{ job.city }}</el-tag>
                <el-tag size="small" type="info">{{ job.experience }}</el-tag>
                <el-tag size="small" type="warning">{{ job.education }}</el-tag>
              </div>
              <div class="job-skills">
                <el-tag
                  v-for="skill in job.skills"
                  :key="skill"
                  size="small"
                  effect="plain"
                  class="skill-tag"
                >
                  {{ skill }}
                </el-tag>
              </div>
            </div>
            
            <div class="job-footer">
              <span class="publish-time">{{ job.publishTime }}</span>
              <el-button type="primary" size="small">投递简历</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue'
import { Search } from '@element-plus/icons-vue'

export default {
  name: 'Jobs',
  components: {
    Search
  },
  setup() {
    const isMounted = ref(true)
    const searchQuery = ref('')
    const selectedCity = ref('')
    const selectedExperience = ref('')

    const jobs = ref([
      {
        id: 1,
        title: '前端开发工程师',
        company: {
          name: '腾讯科技',
          logo: ''
        },
        salary: '20K-35K',
        city: '深圳',
        experience: '3-5年',
        education: '本科',
        skills: ['Vue.js', 'React', 'TypeScript', 'Node.js'],
        publishTime: '2天前'
      },
      {
        id: 2,
        title: '算法工程师',
        company: {
          name: '字节跳动',
          logo: ''
        },
        salary: '25K-45K',
        city: '北京',
        experience: '3-5年',
        education: '硕士',
        skills: ['Python', '机器学习', 'TensorFlow', '深度学习'],
        publishTime: '1天前'
      },
      {
        id: 3,
        title: 'Java后端开发',
        company: {
          name: '阿里巴巴',
          logo: ''
        },
        salary: '18K-30K',
        city: '杭州',
        experience: '1-3年',
        education: '本科',
        skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
        publishTime: '3天前'
      }
    ])

    // 组件卸载时清理
    onUnmounted(() => {
      isMounted.value = false
      // 清理搜索状态
      searchQuery.value = ''
      selectedCity.value = ''
      selectedExperience.value = ''
      // 清理数据引用
      jobs.value = []
    })

    return {
      searchQuery,
      selectedCity,
      selectedExperience,
      jobs
    }
  }
}
</script>

<style scoped>
.jobs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.jobs-header {
  text-align: center;
  margin-bottom: 32px;
}

.jobs-header h1 {
  font-size: 32px;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.jobs-header p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.jobs-toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.job-card {
  margin-bottom: 20px;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.job-card:hover {
  transform: translateY(-2px);
}

.job-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.job-basic {
  flex: 1;
}

.job-title {
  margin: 0 0 4px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.company-name {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.job-info {
  margin-bottom: 16px;
}

.salary {
  font-size: 20px;
  font-weight: 700;
  color: #f56c6c;
  margin-bottom: 12px;
}

.job-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.job-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  font-size: 12px;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.publish-time {
  color: #999;
  font-size: 12px;
}
</style>