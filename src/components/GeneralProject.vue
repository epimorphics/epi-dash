<template>
  <div>
    <br></br>
    <div class="contributors">
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
        <projectcard v-bind:project="repo" v-bind:small="true">{{repo}}</projectcard>
      </div>
      <div v-for="trello in display.trello">
        <projectcard v-bind:project="trello" v-bind:small="true"></projectcard>
      </div>
    </div>

    <div id="settings" v-else>
      <br></br>
      <div id="projectName">
        Project Name <input type="text" v-model="project.name"></input>
        <button v-on:click="deleteProject">Delete</button>
        Webhook <input type="text" v-model="project.webhook"></input>
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
              <input type="checkbox" v-bind:id="repo.name" v-bind:value="{url: repo.url, transform: {}}" v-model="displayedRepos">{{ repo.displayName }}</input>
            </div>
          </div>
        </div>
        <div>
          ADD BOARDS
          <div id="trello">
            <div v-for="trello in trello">
              <input type="checkbox" v-bind:id="trello.name" v-bind:value="{url: trello.url, transform: {} }" v-model="displayedTrello">{{ trello.displayName }}</input>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from 'superagent'
import ContributorCard from './ContributorCard'
import MetricCard from './MetricCard'
import ProjectCard from './ProjectCard'
import GraphReact from './LineReact'
import {getProject, getChartdata, mergeMetrics, getElems, applyTransform} from '../models/Project'

export default {
  name: 'general',
  components: {
    'projectcard': ProjectCard,
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
      request.post(`http://192.168.1.137:4000/delete/project/`)
      .set('Content-Type', 'application/json')
      .send({name: this.project.name})
      .end()
      window.location.href = '#/'
    },
    saveData () {
      window.location.href = `#/project?name=${encodeURI(this.project.name)}`
      request.post('http://192.168.1.137:4000/test')
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
    request('http://192.168.1.137:4000/json/trello')
      .then((response) => {
        this.trello = response.body.sort((a, b) => a.displayName.localeCompare(b.displayName))
      })
    request('http://192.168.1.137:4000/json/repos')
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

.contributors {
  height: 50px;
  width: 100%;
  background-color: #dddddd;
}

.settings {
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
 height: 500px;
 min-width: 400px;
}

.graph {
  width: 50%;
  margin: auto;
}
 
#repos {
  width: 500px;
  height: 500px;
  overflow: scroll;
}

#trello {
  width: 500px;
  height: 500px;
  overflow: scroll;
}
</style>
