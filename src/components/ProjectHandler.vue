<template>
  <div class="projectHolder">
    <div class="filters">
      <a href="/#/new/project">new project</a>
    </div>
    <ul class="hello" v-for="project in projects">
      <a v-on:click="focus(project.url)">
      <projectcard  v-bind:project="project"></projectcard>
      </a>
    </ul>
  </div>
</template>

<script>
import projectcard from './ProjectCard'
import request from 'superagent'

export default {
  name: 'projectHandler',
  components: {
    'projectcard': projectcard
  },
  props: ['allProjects'],
  data () {
    return {
      displayed: [],
      projects: [],
      trello: [],
      repo: [],
      users: [],
      metricText: {
        bugs: 'Active Bugs',
        critical: 'Critical Issues',
        issues: 'Issues'
      }
    }
  },
  methods: {
    all () {
      this.displayed = this.projects
    },
    cb () {
      this.displayed = this.projects.filter((project) => project.source === 'cb')
    },
    repos () {
      this.displayed = this.projects.filter((project) => project.source === 'repos')
    },
    git () {
      this.displayed = this.projects.filter((project) => project.source === 'git')
    },
    sort (key) {
      var temp = this.projects.filter((project) => key in project.metrics)
      this.displayed = temp.sort((x, y) =>
        y.metrics[key] - x.metrics[key])
    },
    test () {
      this.displayed = this.projects.filter((project) => project.test !== 'notests')
    },
    focus (projecturl) {
      window.location.href = projecturl
    }
  },
  mounted () {
    request('http://localhost:4000/json/projects')
      .then((response) => {
        this.displayed = response.body.map((project) => {
          const newproject = {name: project.name, metrics: {}, url: project.url, displayName: project.name}
          const repoPromises = []
          project.repos.map((repo) => {
            repoPromises.push(request(repo.url).then((response) => response.body))
          })
          project.trello.map((repo) => {
            repoPromises.push(request(repo.url).then((response) => response.body))
          })
          Promise.all(repoPromises)
            .then((allrepos) => {
              allrepos.map((repo) => {
                console.log(repo)
                Object.keys(repo.metrics).map((key) => {
                  if (newproject.metrics.hasOwnProperty(key)) {
                    newproject.metrics[key] += repo.metrics[key]
                  } else {
                    newproject.metrics[key] = repo.metrics[key]
                  }
                })
              })
              this.projects.push(newproject)
            })
        })
      })
  }
}
</script>

<style>

.filters {
  text-align: center;
}

</style>
