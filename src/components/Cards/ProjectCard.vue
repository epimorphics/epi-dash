<template>
  <div>
    <br></br>
    <cardheader
      v-bind:source="source"
      v-bind:title="name"
      v-bind:href="`#/project?name=${encodeURI(name)}`"
      v-bind:contributors="project.contributors"
    > </cardheader>
    <br></br>
    <div class="graph">
    <graphreact v-if="graph" v-bind:chartData="chartData"></graphreact>
    </div>
    <metriccard v-if="metrics" v-bind:repometrics="repometrics" v-bind:trellometrics="trellometrics"></metriccard>
  </div>
</template>

<script>
import request from 'superagent'
import CardHeader from '../CardComponents/CardHeader'
import GraphReact from '../LineReact'
import {getProject, getChartdata, mergeMetrics, getElems, applyTransform} from '../../models/Project'

export default {
  name: 'general',
  components: {
    'cardheader': CardHeader,
    'graphreact': GraphReact
  },
  props: ['name', 'graph', 'metrics'],
  data () {
    return {
      project: { name: 'New Project' },
      settingView: true,
      source: 'epi',
      display: {
        trello: [],
        repo: []
      },
      trello: [],
      repos: [],
      temptransform: '{ }',
      displayedTrello: [],
      displayedRepos: [],
      trellometrics: {},
      repometrics: {},
      chartData: {}
    }
  },
  watch: {
    displayedTrello () {
      this.updateTrello()
        .then(() => {
          this.setChart()
          this.setMetrics()
        })
    },
    displayedRepos () {
      this.updateRepos()
        .then(() => {
          this.setChart()
          this.setMetrics()
        })
    },
    transform () {
      this.setMetrics()
      this.setChart()
    }
  },
  methods: {
    settings () {
      this.settingView = !this.settingView
    },
    deleteProject () {
      request.post(`${process.env.BACKEND}/delete/project/`)
      .set('Content-Type', 'application/json')
      .send({name: this.project.name})
      .end()
    },
    saveData () {
      request.post(`${process.env.BACKEND}/test`)
      .set('Content-Type', 'application/json')
      .send({name: this.project.name, repos: this.displayedRepos, trello: this.displayedTrello, transform: this.project.transform})
      .end()
    },
    nofilter () {
      const temp = this.project.transform
      this.project.transform = this.temptransform
      this.temptransform = temp
    },
    updateTrello () {
      return Promise.all(getElems(this.displayedTrello))
        .then((responses) => {
          this.display.trello = responses
        })
    },
    updateRepos () {
      return Promise.all(getElems(this.displayedRepos))
        .then((responses) => {
          this.project.contributors = responses
            .reduce((all, project) => {
              if (project.avatars != null) {
                project.avatars.map((avatar) => {
                  if (all.findIndex((contributor) => contributor === avatar) === -1) {
                    all.push(avatar)
                  }
                })
              }
              return all
            }, [])
          this.display.repo = responses
        })
    },
    setChart () {
      let names = this.display.repo.map((repo) => repo.name)
      names = Array.concat(names, this.display.trello.map((trello) => trello.name))
      getChartdata(names, this.project.transform)
        .then((data) => {
          this.chartData = data
        })
    },
    setSources () {
      this.updateTrello()
      this.updateRepos()
      this.setChart()
      this.setMetrics()
    },
    setMetrics () {
      this.trellometrics = applyTransform(mergeMetrics(this.display.trello), JSON.parse(this.project.transform))
      this.repometrics = applyTransform(mergeMetrics(this.display.repo), JSON.parse(this.project.transform))
    }
  },
  mounted () {
    request(`${process.env.BACKEND}/json/trello`)
      .then((response) => {
        this.trello = response.body
      })
    request(`${process.env.BACKEND}/json/repos`)
      .then((response) => {
        this.repos = response.body.projects
      })
    if (this.name) {
      getProject(encodeURI(this.name))
        .then((project) => {
          this.project = project
          this.displayedRepos = project.repos
          this.displayedTrello = project.trello
          this.setSources()
        })
    }
  }
}
</script>

<style scoped>
.title {
  font-size: 40px;
}

.sources {
  display: inline;
  height-height: 400px;
}

#sources {
  display: flex;
  float: none;
  max-height: 400px;
}

.avatar {
  width: 50px;
  float: right;
}

.contributors {
  height: 50px;
  width: 100%;
  background-color: #dddddd;
}

#settings {
  float: right;
  height: 50px;
}

#allSources > div{
  padding: 10px;
}

.metrics {
  display: flex;
  flex: auto;
  padding-left: 10px;
}

.filter {
 width: 100%;
 height: 400px;
}

.graph {
}

a {
  text-decoration: none;
  color:inherit;
}

</style>
