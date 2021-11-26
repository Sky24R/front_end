// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Antd from 'ant-design-vue';
import Qs from 'qs'


import {
  Button,
  Layout,
  Input,
  Row,
  Col,
  Icon,
  Divider,
  Upload,
  Modal,

} from 'ant-design-vue'
Vue.prototype.$http=axios
axios.defaults.baseURL = 'http://127.0.0.1:5000';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';

Vue.config.productionTip = false
Vue.use(router)
Vue.use(Antd) //挂载到vue中

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
  let ret = ''
  for (let it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  }
  return ret
}]

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
