import Vue from 'vue'

import 'swiper/dist/css/swiper.css'
import BaiduMap from 'vue-baidu-map'
import { BmlMarkerClusterer } from 'vue-baidu-map'
Vue.component('bml-marker-clusterer', BmlMarkerClusterer)
Vue.use(BaiduMap, {
  ak: '' // 官方提供的ak秘钥
})

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
// import './assets/iconfont.css'
import '@/Extension'
import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import _ from 'lodash'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import { numFilter } from './filters'

import '@/assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.css'
import '@/assets/iconfont/iconfont.js'
import './assets/iconfont/iconfont.js'

import x2js from 'x2js' //xml数据处理插件
Vue.prototype.$x2js = new x2js() //全局方法挂载

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'development') {
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
