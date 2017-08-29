<template>
  <div>
    <div class="section">
      <div>
        <div class="header">{{ project.displayName}}</div>
      </div>
      <div v-if="project.test !== 'notests'" v-bind:class="project.test" class="test sectionContent">
        {{ project.test }}
      </div>
    </div>
    <div class="graph">
    <linetest v-bind:chartData="{labels: this.labels[0],
          datasets: this.datasets
    }"></linetest>
    </div>
    <div class="section">
      <div class="header">
        Metrics
      </div>
      <div class="sectionContent">
        <ul v-for="key in Object.keys(project.metrics)">
          <li>{{ project.metrics[key] }} {{ key }}</li>
        </ul>
      </div>
    </div>
    <contributorcard v-bind:contributors="project.avatars"></contributorcard>
    <div class="section">
      <div class="header">
        Description
      </div>
      <div class="sectionContent" v-if="project.description != null">{{ project.description }} </div>
    </div>
  </div>
</template>

<script>
import request from 'superagent'
import ContributorCard from './ContributorCard'
import linetest from './LineReact'
import moment from 'moment'
export default {
  data () {
    return {
      project: { metrics: {} },
      datasets: [],
      labels: [],
      colors: ['#1D0CCC', '#4597FF', '#FFC685', '#CC6523']
    }
  },
  components: {
    'contributorcard': ContributorCard,
    'linetest': linetest
  },
  name: 'projectPage',
  mounted () {
    request(`http://localhost:4000/json/project/${this.$route.query.name}`)
      .then((response) => {
        this.project = response.body
        if (this.project.description == null) {
          this.project.description = ''
        }
        if (this.project.test == null) {
          this.project.test = 'notests'
        } else {
          if (this.project.test) {
            this.project.test = 'testpass'
          } else {
            this.project.test = 'testfail'
          }
        }
      })
    request(`http://localhost:4000/json/timeseries/${this.$route.query.name}`)
      .then((response) => {
        let series = response.body
        this.datasets = Object.keys(series).map((key) => {
          let background = this.colors[Object.keys(series).findIndex((obj) => obj === key) % this.colors.length]
          return {
            label: key,
            pointBackgroundColor: background,
            pointBorderColor: background,
            lineColor: background,
            backgroundColor: background,
            borderWidth: 3,
            borderColor: background,
            fill: false,
            data: series[key].reduce((acc, obj) =>
            Array.concat(acc, Object.values(obj)), [])
          }
        })
        this.labels = Object.values(series).map(obj =>
          obj.reduce((all, data) => Array.concat(all, Object.keys(data).map((time) => moment(time, 'YYYY-MM-DDTHH:mm:ss+00:00').format('YYYY-MM-DD'))), []))
      })
  }
}
</script>

<style scoped>

  .header {
    height: 50px;
    background-color: #dddddd;
    font-size: 40px;
    padding-left: 10px;
  }

  .body {
    display: flex;
    height: 130px;
  }

  .bodyleft {
    width: 45%;
    padding: 10px;
    background-color: #aaaaaa;
  }

  .bodyright {
    width: 55%;
    padding: 10px;
    background-color: #888888;
  }

  .bottom {
    height: 20px;
    width: 100%;
  }

  .notests {
    background-color: #444455;
  }

  .testpass {
    background-color: #449944;
  }

  .testfail {
    background-color: #994444;
  }

  .avatar {
    width: 50px;
    margin: 20px;
  }

  .cb {
    content:url("https://pbs.twimg.com/profile_images/378800000410745178/8704302b5009e71d66fbc8f52cefc0bc_400x400.png");
  }

  .git {
    content:url("https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png");
  }

  .source {
    width: 50px;
    height: 50px;
    float: right;
  }

  .contributors {
    height: 50px;
    background-color: #dddddd;
  }

  .section {
    background-color: #AAAAAA;
    margin: 20px;
  }

  .sectionContent {
    padding: 10px;
  }

  .test {
    height: 20px;
  }

  .graph {
    width: 50%;
    margin: auto;
  }
</style>
