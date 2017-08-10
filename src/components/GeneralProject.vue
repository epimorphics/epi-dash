<template>
  <div>
    <div class="contributors">
      <span class="title">{{ sources.name }}</span>
      <button id="settings" v-on:click="settings">Settings</button>
    </div>

    <div id="allSources" v-if="!settingView">
      <contributorcard v-bind:contributors="contributors"></contributorcard>
      <metriccard v-bind:repometrics="repometrics" v-bind:trellometrics="trellometrics"></metriccard>
      <div v-for="repo in display.repo">
        <projectcard v-bind:project="repo" v-bind:small="true">{{repo}}</projectcard>
      </div>
      <div v-for="repo in display.trello">
        <projectcard v-bind:project="repo" v-bind:small="true"></projectcard>
      </div>
    </div>

    <div id="settings" v-else>
      <br></br>
      <div id="projectName">
        Project Name <input type="text" v-model="sources.name"></input>
      </div>
      <br></br>
      <div id="sources">
        <div id="repos">
          ADD REPOS 
          <div>
            <div v-for="repo in repos">
              <input type="checkbox" v-bind:id="repo.name" v-bind:value="repo.name" v-model="displayedRepos">{{ repo.name }}</input>
            </div>
          </div>
        </div>
        <div id="trello">
          ADD BOARDS 
          <div>
            <div v-for="trello in trello">
              <input type="checkbox" v-bind:id="trello.name" v-bind:value="trello.shortLink" v-model="displayedTrello">{{ trello.name }}</input>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from 'superagent'
import ProjectCard from './ProjectCard'
import TrelloCard from './TrelloCard'
import ContributorCard from './ContributorCard'
import MetricCard from './MetricCard'

export default {
  name: 'general',
  components: {
    'projectcard': ProjectCard,
    'trellocard': TrelloCard,
    'contributorcard': ContributorCard,
    'metriccard': MetricCard
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
      metrics: []
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
    settings () {
      this.settingView = !this.settingView
    },
    updateTrello () {
      const trello = this.trello.reduce((all, elem) => {
        if (this.displayedTrello.includes(elem.shortLink)) {
          if (this.trelloTransforms.hasOwnProperty(elem.shortLink)) {
            all.push(this.applyTransform(elem, this.trelloTransforms[elem.shortLink].transform))
          } else {
            all.push(elem)
          }
        }
        return all
      }, [])
      this.display.trello = trello
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
      this.display.repo = this.repos.filter((elem) => {
        return this.displayedRepos.includes(elem.name)
      })
      this.contributors = this.display.repo.reduce((all, repo) => {
        const avatars = repo.avatars.filter((avatar) => {
          return !all.includes(avatar)
        })
        return Array.concat(all, avatars)
      }, [])
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
    request('http://localhost:4000/json/')
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
            this.displayedRepos.push(repo.name)
          })
          this.sources.git.map((repo) => {
            this.displayedRepos.push(repo.name)
          })
          this.sources.trello.map((repo) => {
            Object.keys(repo).map((key) => {
              this.displayedTrello.push(key)
              this.trelloTransforms = Object.assign(this.trelloTransforms, repo)
            })
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
