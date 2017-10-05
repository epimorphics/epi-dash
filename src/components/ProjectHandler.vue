<template>
  <div>
    <div class="projectHolder">
      <div class="hello" v-for="project in projects">
        <projectcard class="card" v-bind:graph="true" v-bind:name="project.name"></projectcard>
      </div>
    </div>
  </div>
</template>

<script>
import projectcard from './Cards/ProjectCard'
import request from 'superagent'
import { mergeMetrics } from '../models/Project'

export default {
  name: 'projectHandler',
  components: {
    'projectcard': projectcard
  },
  props: ['allProjects'],
  data () {
    return {
      projects: []
    }
  },
  methods: {
    focus (projectName) {
      window.location.href = '/#/project?name=' + projectName
    }
  },
  mounted () {
    request(`${process.env.BACKEND}/json/projects`)
      .then((response) => {
        response.body.map((project) => {
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
              newproject.metrics = mergeMetrics(allrepos)
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

.projectHolder {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  width: 500px;
  height: 500px;
  margin: 0px 40px 120px 40px;
}

</style>
