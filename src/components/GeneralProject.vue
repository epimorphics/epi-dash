<template>
  <div>
    <br></br>
    <div class="contributors">
      <span class="title">{{ sources.name }}</span>
      <button id="saveData" v-on:click="saveData">Save</button>
      <button id="settings" v-on:click="settings">Settings</button>
    </div>

    <br></br>
    <div class="graph">
    <graphreact v-bind:chartData="{labels: this.labels[0],
          datasets: this.datasets
    }"  ></graphreact>
    </div>

    <div id="allSources" v-if="!settingView">
      <contributorcard v-bind:contributors="contributors"></contributorcard>
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
        Project Name <input type="text" v-model="sources.name"></input>
      </div>
      <button v-on:click="deleteProject">Delete</button>
      <br></br>
      <textarea class="filter" v-model:value="transform"></textarea><button v-on:click="nofilter">Filter </button>
      <br></br>
      <div id="sources">
        <div id="repos">
          ADD REPOS
          <div>
            <div v-for="repo in repos">
              <input type="checkbox" v-bind:id="repo.name" v-bind:value="{url: repo.url, transform: {}}" v-model="displayedRepos">{{ repo.displayName }}</input>
            </div>
          </div>
        </div>
        <div id="trello">
          ADD BOARDS
          <div>
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
import TrelloCard from './TrelloCard'
import ContributorCard from './ContributorCard'
import MetricCard from './MetricCard'
import ProjectCard from './ProjectCard'
import GraphReact from './LineReact'
import {getProject, getDataset, transformDataset, mergeMetrics, getElems, applyTransform} from '../models/Project'

export default {
  name: 'general',
  components: {
    'projectcard': ProjectCard,
    'trellocard': TrelloCard,
    'contributorcard': ContributorCard,
    'metriccard': MetricCard,
    'graphreact': GraphReact
  },
  data () {
    return {
      sources: { name: 'New Project' },
      contributors: [],
      settingView: true,
      display: {
        trello: [],
        repo: []
      },
      trello: [],
      displayedTrello: [],
      trelloTransforms: {},
      repos: [],
      transform: '{ }',
      temptransform: '{ }',
      displayedRepos: [],
      trellometrics: {},
      repometrics: {},
      metrics: [],
      datasets: [],
      labels: [],
      colors: ['#1D0CCC', '#4597FF', '#FFC685', '#CC6523', '#AAF235']
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
      request.post(`http://localhost:4000/delete/project/`)
      .set('Content-Type', 'application/json')
      .send({name: this.sources.name})
      .end()
    },
    saveData () {
      request.post('http://localhost:4000/test')
      .set('Content-Type', 'application/json')
      .send({name: this.sources.name, repos: this.displayedRepos, trello: this.displayedTrello, transform: this.transform})
      .end()
    },
    nofilter () {
      const temp = this.transform
      this.transform = this.temptransform
      this.temptransform = temp
    },
    setChart () {
      let names = this.display.repo.map((repo) => repo.name)
      names = Array.concat(names, this.display.trello.map((trello) => trello.name))
      getDataset(names)
        .then((data) => {
          this.datasets = data.datasets
          this.labels = data.labels
          this.datasets = transformDataset(this.datasets, this.transform)
        })
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
          this.contributors = responses
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
            .filter((elem) => elem != null)
          this.display.repo = responses
        })
    },
    setSources () {
      this.updateTrello()
      this.updateRepos()
      this.setChart()
      this.setMetrics()
    },
    setMetrics () {
      this.trellometrics = applyTransform(mergeMetrics(this.display.trello), JSON.parse(this.transform))
      this.repometrics = applyTransform(mergeMetrics(this.display.repo), JSON.parse(this.transform))
    }
  },
  mounted () {
    request('http://localhost:4000/json/trello')
      .then((response) => {
        this.trello = response.body
        this.setSources()
      })
    request('http://localhost:4000/json/repos')
      .then((response) => {
        this.repos = response.body.projects
        this.setSources()
      })
    if (this.$route.query.name) {
      this.settingView = false
      getProject(this.$route.query.name)
        .then((project) => {
          this.sources = project
          this.transform = project.transform
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
  width: 50%;
  margin: auto;
}
</style>
