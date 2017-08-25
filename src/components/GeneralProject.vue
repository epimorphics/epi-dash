<template>
  <div>
    <br></br>
    <div class="contributors">
      <span class="title">{{ sources.name }}</span>
      <button id="saveData" v-on:click="saveData">Save</button>
      <button id="settings" v-on:click="settings">Settings</button>
    </div>

    <br></br>
    <graphreact class="graph"  v-bind:chartData="{labels: this.labels[0],
          datasets: this.datasets
    }"  ></graphreact>

    <div id="allSources" v-if="!settingView">
      <contributorcard v-bind:contributors="contributors"></contributorcard>
      <metriccard v-bind:repometrics="repometrics" v-bind:trellometrics="trellometrics"></metriccard>
      <div v-for="repo in display.repo">
        <projectcard v-bind:project="repo" v-bind:small="true">{{repo}}</projectcard>
      </div>
      <div v-for="trello in display.trello">
        <projectcard v-on:unfilter="unfilter" v-bind:project="trello" v-bind:small="true" v-bind:filtered="true"></projectcard>
      </div>
    </div>

    <div id="settings" v-else>
      <br></br>
      <div id="projectName">
        Project Name <input type="text" v-model="sources.name"></input>
      </div>
      <br></br>
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
import moment from 'moment'
import ContributorCard from './ContributorCard'
import MetricCard from './MetricCard'
import ProjectCard from './ProjectCard'
import GraphReact from './LineReact'

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
      displayedRepos: [],
      trellometrics: {},
      repometrics: {},
      metrics: [],
      datasets: [],
      labels: [],
      colors: ['#1D0CCC', '#4597FF', '#FFC685', '#CC6523']
    }
  },
  watch: {
    displayedTrello () {
      this.updateTrello()
      this.setMetrics()
    },
    displayedRepos () {
      this.updateRepos()
      this.setMetrics()
    }
  },
  methods: {
    setChart () {
      let names = this.display.repo.map((repo) => repo.name)
      names = Array.concat(names, this.display.trello.map((trello) => trello.name))
      const seriesPromise = names.map((name) => request(`http://localhost:4000/json/timeseries/${name}`))
      Promise.all(seriesPromise)
        .then((out) => {
          let reduction = out.map(resp =>
            resp.body
          )
          reduction = reduction.reduce((all, obj) => {
            Object.keys(obj).map((label) => {
              if (all.hasOwnProperty(label)) {
                all[label] = Array.concat(all[label], obj[label])
              } else {
                all[label] = obj[label]
              }
            })
            return all
          }, {})
          reduction = Object.keys(reduction).reduce((all, key) => {
            all[key] = reduction[key].reduce((acc, obj) => {
              Object.keys(obj).map((date) => {
                const timestamp = moment(date, 'YYYY-MM-DDTHH:mm:SS+00:00').format('YYYY-MM-DDTHH:mm')
                if (acc.hasOwnProperty(timestamp)) {
                  acc[timestamp] += parseInt(obj[date])
                } else {
                  acc[timestamp] = parseInt(obj[date])
                }
              })
              return acc
            }, {})
            return all
          }, {})
          this.datasets = Object.keys(reduction).map((key) => {
            let background = this.colors[Object.keys(reduction).findIndex((obj) => obj === key) % this.colors.length]
            return {
              pointBackgroundColor: background,
              pointBorderColor: background,
              lineColor: background,
              backgroundColor: background,
              borderWidth: 3,
              borderColor: background,
              fill: false,
              label: key,
              data: Object.values(reduction[key])
            }
          })
          const labels = Object.keys(reduction).reduce((all, key) => {
            all.push(Object.keys(reduction[key]).map((date) => date))
            return all
          }, [])
          this.labels = labels
        })
    },
    unfilter (msg) {
      if (this.trelloTransforms.hasOwnProperty(msg)) {
        delete this.trelloTransforms[msg]
      }
      this.setMetrics()
      this.updateTrello()
    },
    settings () {
      this.settingView = !this.settingView
    },
    saveData () {
      request.post('http://localhost:4000/test')
      .set('Content-Type', 'application/json')
      .send({name: this.sources.name, repos: this.displayedRepos, trello: this.displayedTrello})
      .end()
    },
    updateTrello () {
      const repoPromises = this.displayedTrello.map((elem) =>
        request(elem.url)
          .then((response) => {
            return this.applyTransform(response.body, elem.transform)
          })
      )
      Promise.all(repoPromises)
        .then((responses) => {
          this.display.trello = responses
          this.setMetrics()
          this.setChart()
        })
    },
    applyTransform (object, transform) {
      const newObject = object
      if (transform) {
        if (transform.merge) {
          let val = 0
          if (newObject.metrics[transform.name]) {
            val = newObject.metrics[transform.name]
          }
          transform.merge.map((property) => {
            if (newObject.metrics.hasOwnProperty(property)) {
              val += newObject.metrics[property]
              delete newObject.metrics[property]
            }
          })
          newObject.metrics[transform.name] = val
        }
        if (transform.show) {
          const newMetrics = {}
          transform.show.map((property) => {
            if (newObject.metrics.hasOwnProperty(property)) {
              newMetrics[property] = newObject.metrics[property]
            }
          })
          newObject.metrics = newMetrics
        }
      }
      return newObject
    },
    updateRepos () {
      const repoPromises = this.displayedRepos.map((elem) =>
        request(elem.url)
          .then((response) => {
            return this.applyTransform(response.body, elem.transform)
          })
      )
      Promise.all(repoPromises)
        .then((responses) => {
          this.display.repo = responses
          this.setMetrics()
          this.setChart()
        })
    },
    setSources () {
      this.updateTrello()
      this.updateRepos()
      this.setMetrics()
    },
    setMetrics () {
      const trellometrics = this.display.trello.map((elem) => elem.metrics)
      this.trellometrics = trellometrics.reduce((all, elem) => {
        Object.keys(elem).map((key) => {
          if (!all.hasOwnProperty(key)) {
            all[key] = elem[key]
          } else {
            all[key] += elem[key]
          }
        })
        return all
      }, {})
      const repometrics = this.display.repo.map((elem) => elem.metrics)
      this.repometrics = repometrics.reduce((all, elem) => {
        Object.keys(elem).map((key) => {
          if (!all.hasOwnProperty(key)) {
            all[key] = elem[key]
          } else {
            all[key] += elem[key]
          }
        })
        return all
      }, {})
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
      request(`http://localhost:4000/json/${this.$route.query.name}`)
        .then((response) => {
          this.sources = response.body
          this.sources.cb.map((repo) => {
            this.displayedRepos.push(repo)
          })
          this.sources.git.map((repo) => {
            this.displayedRepos.push(repo)
          })
          this.sources.trello.map((repo) => {
            this.displayedTrello.push(repo)
          })
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
</style>
