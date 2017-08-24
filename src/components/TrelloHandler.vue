<template>
  <div class="TrelloHolder">
    <div v-for="board in boards">
      <projectcard v-on:click.native="focus(board)" v-bind:project="board"></projectcard>
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
