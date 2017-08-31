<template>
  <div class="trelloHolder">
    <div class="trello" v-for="board in boards">
      <projectcard v-bind:project="board"></projectcard>
    </div>
  </div>
</template>

<script>
import request from 'superagent'
import projectCard from './ProjectCard'

export default {
  name: 'projectHandler',
  components: {
    'projectcard': projectCard
  },
  data () {
    return {
      displayed: [],
      boards: []
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
      window.location.href = '#/repo?name=' + project.name
    }
  },
  mounted () {
    request('http://192.168.1.137:4000/json/trello')
      .then((response) => {
        console.log(response)
        this.boards = response.body
      })
  }
}
</script>

<style scoped>

.trelloHolder {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  flex-align: stretch;
  align-items: center;
}

.trello {
  width: 800px;
  margin: 10px;
}

</style>
