import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// 引入nprogress及样式
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 进度条开始
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
axios.interceptors.response.use(function (config) {
  // 进度条结束
  NProgress.done()
  return config
})
Vue.prototype.$axios = axios
Vue.filter('capitalize', function (value) {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1 + '').padStart(2, '0')
  const day = (date.getDate() + '').padStart(2, '0')
  const hour = (date.getHours() + '').padStart(2, '0')
  const mins = (date.getMinutes() + '').padStart(2, '0')
  const seconds = (date.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${mins}:${seconds}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
