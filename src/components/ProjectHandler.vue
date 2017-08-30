<template>
  <div class="projectHolder">
    <div class="container">
      <div class="hello" v-for="project in projects">
          <!-- <projectcard  v-bind:project="project"></projectcard> -->
        <projectcard class="card" v-bind:graph="true" v-bind:name="project.name"></projectcard>
      </div>
    </div>
  </div>
</template>

<script>
import projectcard from './GeneralProjectCard'
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
    focus (projectName) {
      window.location.href = '/#/project?name=' + projectName
    }
  },
  mounted () {
    request('http://localhost:4000/json/projects')
      .then((response) => {
        this.displayed = response.body.map((project) => {
          const newproject = {name: project.name, source: project.source, metrics: {}, url: project.url, displayName: project.name}
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

<style scoped>

.filters {
  text-align: center;
}

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.card {
  width: 600px;
  height: 400px;
  margin: 20px;
}

</style>
