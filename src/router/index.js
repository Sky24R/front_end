import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Preprocessing from '@/views/Preprocessing'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Preprocessing',
      component: Preprocessing
    }
  ]
})
