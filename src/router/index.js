import Vue from 'vue'
import Router from 'vue-router'
import ProjectHandler from '@/components/ProjectHandler'
import ProjectPage from '@/components/ProjectPage'
import TrelloHandler from '@/components/TrelloHandler'
import GeneralProject from '@/components/GeneralProject'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Projects',
      component: ProjectHandler
    },
    {
      path: '/repo',
      name: 'Repo',
      component: ProjectPage
    },
    {
      path: '/trello',
      name: 'Trello',
      component: TrelloHandler
    },
    {
      path: '/new/project',
      name: 'New Project',
      component: GeneralProject
    },
    {
      path: '/project',
      name: 'New Project',
      component: GeneralProject
    }
  ]
})
