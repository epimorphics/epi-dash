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
      <button v-on:click="sort('critical')">Critical Issues</button>
      <button v-on:click="sort('bugs')">Bugs</button>
      <button v-on:click="sort('issues')">Issues</button>
    </div>
    <ul class="hello" v-for="project in displayed">
      <projectcard v-on:click.native="focus(project)" v-bind:project="project" v-bind:metricText="metricText"></projectcard>
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
    request('http://localhost:4000/json')
      .then((response) => {
        const projects = response.body.projects
        return request('http://localhost:4000/json/tests')
          .then((tests) => {
            return projects.map(project => {
              const test = tests.body.tests.find((elem) => elem.name === project.name)
              if (test === undefined) {
                project.test = 'notests'
              } else {
                if (test.success === true) {
                  project.test = 'testpass'
                } else {
                  project.test = 'testfail'
                }
              }
              return project
            })
          })
      })
      .then((projects) => {
        this.projects = projects
        this.displayed = projects
        console.log(this.projects)
      })
    request('http://localhost:4000/json/users')
      .then((response) => {
        this.users = response.body.users
      })
  }
}
</script>

<style>

.filters {
  text-align: center;
}

</style>
