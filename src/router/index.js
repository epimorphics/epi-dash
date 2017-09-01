import Vue from 'vue'
import Router from 'vue-router'
import RepoHandler from '@/components/RepoHandler'
import ProjectHandler from '@/components/ProjectHandler'
import SourcePage from '@/components/SourcePage'
import TrelloHandler from '@/components/TrelloHandler'
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
      path: '/repos',
      name: 'Repositories',
      component: RepoHandler
    },
    {
      path: '/repo',
      name: 'Repo',
      component: SourcePage
    },
    {
      path: '/trello',
      name: 'Trello',
      component: TrelloHandler
    },
    {
      path: '/new/project',
      name: 'New Project',
      component: ProjectPage
    },
    {
      path: '/project',
      name: 'New Project',
      component: ProjectPage
    }
  ]
})
