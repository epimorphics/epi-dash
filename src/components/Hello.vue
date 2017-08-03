<template>
  <div class="container">
    <br>
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
      <projectcard v-bind:project="project" v-bind:metricText="metricText"></projectcard>
    </ul>
  </div>
</template>

<script>
import request from 'superagent'
import projectcard from './ProjectCard'

export default {
  name: 'hello',
  components: {
    'projectcard': projectcard
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.container {
  width: 75%;
  margin: 0 auto;
}

.filters {
  text-align: center;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
