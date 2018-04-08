import Vue from 'vue'
import Router from 'vue-router'
import Intro from '@/pages/Intro'
import Doc from '@/pages/Document/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/intro',
    },
    {
      path: '/intro',
      name: 'intro',
      component: Intro,
    },
    {
      path: '/doc',
      name: 'doc',
      component: Doc,
    }
  ]
})
