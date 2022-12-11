import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import SocketService from '@/utils/socket_service'
// 对服务端进行 websocket 的链接
SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.Instance

//  导入文件的字体图标
// import '@/assets/font/font_t76g9yq1ga/iconfont.css'
// import '@/assets/font/font_3814286_fwp3xleikvk/iconfont.css'
import '@/assets/font/font_3814286_30fecw0yxg4/iconfont.css'

// axios 配置默认路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// axios 挂载到vue原型上    this.$http 发起ajax请求
Vue.prototype.$http = axios 

// index.html  导入echarts后   将全局的echarts对象挂载到Vue原型上 方便使用(this.$echarts)    window.echarts index.html导入echarts 就可以在window点出echarts
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
