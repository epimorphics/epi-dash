import Vue from 'vue'
import Router from 'vue-router'
import ProjectHandler from '@/components/ProjectHandler'
import ProjectPage from '@/components/ProjectPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Projects',
      component: ProjectHandler
    },
    {
      path: '/project',
      name: 'Project',
      component: ProjectPage
    }
  ]
})
