<template>
  <div class="projectHolder">
    <div class="filters">
      <span> Filter by: </span>
      <button v-on:click="all">All Projects</button>
      <button v-on:click="cb">CodebaseHQ</button>
      <button v-on:click="git">Github</button>
      <button v-on:click="test">Tests</button>
    </div>
    <br>
    <div class="filters">
      <span> Sort by: </span>
      <button v-on:click="sort('Critical')">Critical Issues</button>
      <button v-on:click="sort('Bugs')">Bugs</button>
      <button v-on:click="sort('Issues')">Issues</button>
    </div>
    <div class="project" v-for="project in displayed">
      <sourcecard v-bind:project="project"></sourcecard>
    </div>
  </div>
</template>

<script>
import SourceCard from './Cards/SourceCard'
import request from 'superagent'

export default {
  name: 'projectHandler',
  components: {
    'sourcecard': SourceCard
  },
  props: ['allProjects'],
  data () {
    return {
      displayed: [],
      projects: [],
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
    focus (project) {
      this.displayed = project
      window.location.href = '#/repo?name=' + project.name
    }
  },
  mounted () {
    request(`${process.env.BACKEND}/json/repos`)
      .then((response) => {
        const projects = response.body.projects
        return projects.map(project => {
          if (project.test == null) {
            project.test = 'notests'
          } else {
            if (project.test) {
              project.test = 'testpass'
            } else {
              project.test = 'testfail'
            }
          }
          return project
        })
      })
      .then((projects) => {
        this.projects = projects
        this.displayed = projects
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
  flex-direction: column;
  flex-wrap: wrap;
  flex-align: stretch;
  align-items: center;
}

.project {
  width: 800px;
  margin: 10px;
}

</style>
