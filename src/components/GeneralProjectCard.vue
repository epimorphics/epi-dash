<template>
  <div>
    <div class="header" v-on:click="openRepo">
      <div class="projectName">{{ project.name }}</div>
    </div>
    <div v-if="!open" class="body">
    <div>{{display.repo}}</div>
    <div>{{display.trello}}</div>
    </div>
  </div>
</template>

<script>
import ProjectCard from './ProjectCard'
import TrelloCard from './TrelloCard'
import ContributorCard from './ContributorCard'
import MetricCard from './MetricCard'
import Project from '../models/CustomProject'

export default {
  name: 'general',
  components: {
    'projectcard': ProjectCard,
    'trellocard': TrelloCard,
    'contributorcard': ContributorCard,
    'metriccard': MetricCard
  },
  props: ['trello', 'repos', 'project'],
  data () {
    return {
      sources: { name: 'New Project' },
      contributors: [],
      settingView: true,
      display: {
        trello: [],
        repo: []
      },
      trelloTransforms: {},
      trellometrics: {},
      repometrics: {},
      metrics: []
    }
  },
  mounted () {
    this.project = new Project(this.project)
    this.project.fetch()
      .then((out) => {
        console.log(out)
        this.display.trello = out.trello
        this.display.repo = out.repo
      })
  },
  computed: {
    displayedTrello () {
      return this.project.trello.reduce((all, elem) => Array.concat(all, Object.keys(elem)), [])
    },
    displayedRepos () {
      const git = this.project.git.map((repo) => repo.name)
      const cb = this.project.cb.map((repo) => repo.name)
      return git.concat(cb)
    },
    allRepos () {
      return this.repos
    }
  },
  watch: {
    repos () {
      this.metrics = this.allRepos.reduce((all, elem) => {
        return all.concat(elem.metrics)
      })
    }
  },
  methods: {
    updateTrello () {
      const updatedDisplay = this.trello.reduce((all, elem) => {
        if (this.displayedTrello.includes(elem.shortLink)) {
          if (this.trelloTransforms.hasOwnProperty(elem.shortLink)) {
            console.log('true')
            all.push(this.applyTransform(elem, this.trelloTransforms[elem.shortLink].transform))
          } else {
            console.log('false')
            all.push(elem)
          }
        }
        return all
      }, [])
      this.display.trello = updatedDisplay
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
