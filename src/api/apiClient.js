// API Client 统一配置和导出
import axiosInstance from '../common/axiosInstance'

// API 客户端实例
class ApiClient {
  constructor() {
    // 初始化
  }

  // User Service 方法
  async loginUser(loginData) {
    try {
      // Map frontend fields to backend API fields
      const apiData = {
        userAccount: loginData.username,
        userPassword: loginData.password
      }
      const response = await axiosInstance.post('/user/login', apiData)
      return response.data
    } catch (error) {
      console.error('登录失败:', error)
      // Re-throw with better error message
      if (error.response?.data) {
        throw new Error(error.response.data.message || error.response.data.msg || '登录失败')
      }
      throw new Error(error.message || '网络连接失败')
    }
  }

  async registerUser(registerData) {
    try {
      // Map frontend fields to backend API fields
      const apiData = {
        userAccount: registerData.username || registerData.email,
        userPassword: registerData.password,
        checkPassword: registerData.confirmPassword
      }
      const response = await axiosInstance.post('/user/register', apiData)
      return response.data
    } catch (error) {
      console.error('注册失败:', error)
      // Re-throw with better error message
      if (error.response?.data) {
        throw new Error(error.response.data.message || error.response.data.msg || '注册失败')
      }
      throw new Error(error.message || '网络连接失败')
    }
  }

  async getCurrentUser() {
    try {
      const response = await axiosInstance.get('/user/get/login')
      return response.data
    } catch (error) {
      console.error('获取当前用户失败:', error)
      throw error
    }
  }

  async updateMyProfile(profileData) {
    try {
      const response = await axiosInstance.post('/user/update/my', profileData)
      return response.data
    } catch (error) {
      console.error('更新个人信息失败:', error)
      if (error.response?.data) {
        throw new Error(error.response.data.message || error.response.data.msg || '更新失败')
      }
      throw new Error(error.message || '网络连接失败')
    }
  }

  async editUserProfile(profileData) {
    try {
      const response = await axiosInstance.post('/user/edit', profileData)
      return response.data
    } catch (error) {
      console.error('编辑用户信息失败:', error)
      if (error.response?.data) {
        throw new Error(error.response.data.message || error.response.data.msg || '编辑失败')
      }
      throw new Error(error.message || '网络连接失败')
    }
  }

  // User Sign-in APIs
  async addUserSignIn() {
    try {
      const response = await axiosInstance.post('/user/add/sign_in')
      return response.data
    } catch (error) {
      console.error('用户签到失败:', error)
      if (error.response?.data) {
        throw new Error(error.response.data.message || error.response.data.msg || '签到失败')
      }
      throw new Error(error.message || '网络连接失败')
    }
  }

  async getUserSignInRecord(year) {
    try {
      const response = await axiosInstance.get('/user/get/sign_in', {
        params: { year }
      })
      return response.data
    } catch (error) {
      console.error('获取签到记录失败:', error)
      throw error
    }
  }

  // User Management APIs (for admin)
  async getUserList(queryParams) {
    try {
      const response = await axiosInstance.post('/user/list/page/vo', queryParams)
      return response.data
    } catch (error) {
      console.error('获取用户列表失败:', error)
      throw error
    }
  }

  async getUserById(id) {
    try {
      const response = await axiosInstance.get('/user/get/vo', {
        params: { id }
      })
      return response.data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  async deleteUser(id) {
    try {
      const response = await axiosInstance.post('/user/delete', { id })
      return response.data
    } catch (error) {
      console.error('删除用户失败:', error)
      if (error.response?.data) {
        throw new Error(error.response.data.message || error.response.data.msg || '删除失败')
      }
      throw new Error(error.message || '网络连接失败')
    }
  }

  async logoutUser() {
    try {
      const response = await axiosInstance.post('/user/logout')
      return response.data
    } catch (error) {
      console.error('退出登录失败:', error)
      throw error
    }
  }

  // Question Service 方法 - 支持题目类型筛选
  async getQuestions(params = {}) {
    try {
      // 默认查询算法题 (questionType = 1)
      const requestParams = {
        current: 1,
        pageSize: 10,
        questionType: 1, // 默认算法题
        ...params
      }
      const response = await axiosInstance.post('/question/list/page/vo', requestParams)
      return response.data
    } catch (error) {
      console.error('获取问题列表失败:', error)
      throw error
    }
  }

  // 获取算法题
  async getAlgorithmQuestions(params = {}) {
    try {
      const requestParams = {
        current: 1,
        pageSize: 10,
        questionType: 1, // 算法题
        ...params
      }
      const response = await axiosInstance.post('/question/list/page/vo', requestParams)
      return response.data
    } catch (error) {
      console.error('获取算法题失败:', error)
      throw error
    }
  }

  // 获取面试题
  async getInterviewQuestions(params = {}) {
    try {
      const requestParams = {
        current: 1,
        pageSize: 10,
        questionType: 0, // 面试题
        ...params
      }
      const response = await axiosInstance.post('/question/list/page/vo', requestParams)
      return response.data
    } catch (error) {
      console.error('获取面试题失败:', error)
      throw error
    }
  }

  async getQuestionById(id) {
    try {
      const response = await axiosInstance.get('/question/get/vo', {
        params: { id }
      })
      return response.data
    } catch (error) {
      console.error('获取问题详情失败:', error)
      throw error
    }
  }

  async createQuestion(questionData) {
    try {
      const response = await axiosInstance.post('/question/add', questionData)
      return response.data
    } catch (error) {
      console.error('创建问题失败:', error)
      throw error
    }
  }

  async updateQuestion(questionData) {
    try {
      const response = await axiosInstance.post('/question/update', questionData)
      return response.data
    } catch (error) {
      console.error('更新问题失败:', error)
      throw error
    }
  }

  async deleteQuestion(id) {
    try {
      const response = await axiosInstance.post('/question/delete', { id })
      return response.data
    } catch (error) {
      console.error('删除问题失败:', error)
      throw error
    }
  }

  async editQuestion(questionData) {
    try {
      const response = await axiosInstance.post('/question/edit', questionData)
      return response.data
    } catch (error) {
      console.error('编辑问题失败:', error)
      throw error
    }
  }

  async doQuestionSubmit(submitData) {
    try {
      const response = await axiosInstance.post('/question/question_submit/do', submitData)
      return response.data
    } catch (error) {
      console.error('提交问题失败:', error)
      throw error
    }
  }

  async getQuestionSubmitList(params = {}) {
    try {
      const response = await axiosInstance.post('/question/question_submit/list/page', params)
      return response.data
    } catch (error) {
      console.error('获取提交列表失败:', error)
      throw error
    }
  }

  // Search Service 方法 - 根据swagger文档修正
  async searchContent(searchRequest) {
    try {
      const response = await axiosInstance.post('/search/search', searchRequest)
      return response.data
    } catch (error) {
      console.error('搜索失败:', error)
      throw error
    }
  }

  async getSearchSuggestions(keyword) {
    try {
      const response = await axiosInstance.get('/search/suggestions', {
        params: { keyword }
      })
      return response.data
    } catch (error) {
      console.error('获取搜索建议失败:', error)
      throw error
    }
  }
}

// 创建单例实例
const apiClient = new ApiClient()

export default apiClient