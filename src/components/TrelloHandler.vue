<template>
  <div class="TrelloHolder">
    <div v-for="board in boards">
      <div> {{ board.name }}</div>
      <div v-if="Object.keys(board.stats).length > 0">
        STATS
        <div v-for="key in Object.keys(board.stats)">
          {{ key }}  {{board.stats[key]}}
        </div>
      </div>
      <br>
      <div v-if="Object.keys(board.deadlines).length > 0">
        DEADLINES
        <div v-for="key in Object.keys(board.deadlines)">
          {{key}} {{board.deadlines[key]}}
        </div>
      </div>
      <br>
    </div>
  </div>
</template>

<script>
import request from 'superagent'

export default {
  name: 'projectHandler',
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
      this.displayed = project
      window.location.href = '#/project?name=' + project.name
    }
  },
  mounted () {
    request('http://localhost:4000/json/trello')
      .then((response) => {
        console.log(response)
        this.boards = response.body
      })
  }
}
</script>

<style>

.filters {
  text-align: center;
}

</style>
