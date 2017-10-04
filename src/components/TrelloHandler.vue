<template>
  <div class="trelloHolder">
    <div class="trello" v-for="board in boards">
      <sourcecard v-bind:project="board"></sourcecard>
    </div>
  </div>
</template>

<script>
import request from 'superagent'
import sourceCard from './Cards/SourceCard'

export default {
  name: 'projectHandler',
  components: {
    'sourcecard': sourceCard
  },
  data () {
    return {
      displayed: [],
      boards: []
    }
  },
  methods: {
    focus (project) {
      window.location.href = '#/repo?name=' + project.name
    }
  },
  mounted () {
    request(`${process.env.BACKEND}/json/trello`)
      .then((response) => {
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
