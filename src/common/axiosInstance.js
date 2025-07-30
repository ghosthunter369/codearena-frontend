import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加 SaToken
axiosInstance.interceptors.request.use(
  (config) => {
    const satoken = localStorage.getItem('satoken')
    if (satoken) {
      config.headers.satoken = satoken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理认证错误
axiosInstance.interceptors.response.use(
  (response) => {
    // Check if response indicates authentication failure
    if (response.data && response.data.code === 401) {
      localStorage.removeItem('satoken')
      localStorage.removeItem('user')
      window.location.href = '/login'
      return Promise.reject(new Error('Authentication failed'))
    }
    return response
  },
  (error) => {
    console.error('请求错误:', error.response?.data?.msg || error.message)
    
    // Handle authentication errors
    if (error.response?.status === 401 || 
        error.response?.data?.code === 401 ||
        error.response?.data?.msg?.includes('鉴权失败') ||
        error.response?.data?.message?.includes('Unauthorized')) {
      // Clear authentication data
      localStorage.removeItem('satoken')
      localStorage.removeItem('user')
      localStorage.removeItem('rememberMe')
      localStorage.removeItem('username')
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default axiosInstance