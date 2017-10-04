<template>
  <div>
    <br></br>
    <div class="titleBar">
      <span class="title">{{ project.name }}</span>
      <button class="settings" v-on:click="settings">Settings</button>
      <button class="settings" v-on:click="saveData">Save</button>
    </div>

    <br></br>
    <div class="graph">
    <graphreact v-bind:chartData="chartData"></graphreact>
    </div>

    <div id="allSources" v-if="!settingView">
      <contributorcard v-bind:contributors="project.contributors"></contributorcard>
      <metriccard v-bind:repometrics="repometrics" v-bind:trellometrics="trellometrics"></metriccard>
      <div v-for="repo in display.repo">
        <sourcecard v-bind:project="repo" v-bind:small="true">{{repo}}</sourcecard>
      </div>
      <div v-for="trello in display.trello">
        <sourcecard v-bind:project="trello" v-bind:small="true"></sourcecard>
      </div>
    </div>

    <div id="settings" v-else>
      <br></br>
      <div class="properties">
        Project Name <input type="text" v-model="project.name"></input>
      </div>
      <div class="properties">
        Webhook <input type="text" v-model="project.webhook"></input>
      </div>
      <div class="properties">
        <button v-on:click="deleteProject">Delete</button>
      </div>
      <br></br>
      <div id="sources">
        <div>
          <button v-on:click="nofilter">FILTER</button>
          <textarea class="filter" v-model:value="project.transform"></textarea>
        </div>
        <div>
          ADD REPOS
          <div id="repos">
            <div v-for="repo in repos">
              <input type="checkbox" v-bind:id="repo.name" v-bind:value="{name: repo.name, url: repo.url, transform: {}}" v-model="displayedRepos">{{ repo.displayName }}</input>
            </div>
          </div>
        </div>
        <div>
          ADD BOARDS
          <div id="trello">
            <div v-for="trello in trello">
              <input type="checkbox" v-bind:id="trello.name" v-bind:value="{name: trello.name, url: trello.url, transform: {} }" v-model="displayedTrello">{{ trello.displayName }}</input>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from 'superagent'
import ContributorCard from './Cards/ContributorCard'
import MetricCard from './Cards/MetricCard'
import SourceCard from './Cards/SourceCard'
import GraphReact from './LineReact'
import {getProject, getChartdata, mergeMetrics, getElems, applyTransform} from '../models/Project'

export default {
  name: 'general',
  components: {
    'sourcecard': SourceCard,
    'contributorcard': ContributorCard,
    'metriccard': MetricCard,
    'graphreact': GraphReact
  },
  data () {
    return {
      project: { name: 'New Project', transform: '{}', webhook: '', repos: [], trello: [] },
      settingView: true,
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
      chartData: {labels: [], dataset: []}
    }
  },
  computed: {
    transform () {
      return this.project.transform
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
      window.location.href = '#/'
    },
    saveData () {
      window.location.href = `#/project?name=${encodeURI(this.project.name)}`
      request.post(`${process.env.BACKEND}/test`)
      .set('Content-Type', 'application/json')
      .send({name: this.project.name, repos: this.displayedRepos, webhook: this.project.webhook, trello: this.displayedTrello, transform: this.project.transform})
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
      const repoNames = this.display.repo.map((repo) => repo.name)
      const trelloNames = this.display.trello.map((trello) => trello.name)
      const names = Array.concat(repoNames, trelloNames)
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
        this.trello = response.body.sort((a, b) => a.displayName.localeCompare(b.displayName))
      })
    request(`${process.env.BACKEND}/json/repos`)
      .then((response) => {
        this.repos = response.body.projects.sort((a, b) => a.displayName.localeCompare(b.displayName))
      })
    if (this.$route.query.name) {
      this.settingView = false
      getProject(this.$route.query.name)
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

<style>
.title {
  width: 700px;
  font-size: 40px;
}

.sources {
  display: inline;
  height-height: 400px;
}

#sources {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
}

.avatar {
  width: 50px;
  float: right;
}

.titleBar {
  height: 50px;
  width: 70%;
  display: flex;
  margin: 0 auto;
  background-color: #dddddd;
}

.settings {
  flex-align: right;
  float: right;
  height: 50px;
}

#allSources {
  width: 70%;
  display: flex;
  margin: 0 auto;
  flex-direction: column;
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
 height: 500px;
 min-width: 400px;
}

.graph {
  width: 30%;
  margin: auto;
}

#repos {
  width: 300px;
  height: 500px;
  overflow: scroll;
  text-overflow: ellipsis;
}

#trello {
  width: 300px;
  height: 500px;
  overflow: scroll;
  text-overflow: ellipsis;
}

.properties {
  display: flex;
  margin: 10px;
 justify-content: center;
}
</style>
