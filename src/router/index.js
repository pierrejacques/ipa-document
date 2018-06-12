import axios from 'axios'
import Vue from 'vue'
import Router from 'vue-router'
import Intro from '@/pages/Intro'
import Doc from '@/pages/Document/index'

Vue.use(Router)

const appRouter = new Router({
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

appRouter.beforeEach((to, from, next) => {
  axios.post('http://www.zhongxiaotuan.com/api/monitor/push', {
    stamp: +new Date(),
    type: 'PageView',
    isProd: process.isProduction,
    info: {
      pageId: `ipa-doc/${to.name}`,
      elementId: null,
      payload: {},
    }
  }).then().catch();
  next();
})

export default appRouter;