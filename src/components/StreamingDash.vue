<template>
  <div class="container">
    <pingcard class="ping" v-for="host in hosts" v-bind:host="host"></pingcard>
  </div>
</template>

<script>
import PingCard from './PingCard'
export default {
  name: 'streamingDash',
  data () {
    return {
      hosts: ['http://target:80', 'http://epimorphics.com']
    }
  },
  components: {
    'pingcard': PingCard
  }
}
</script>

<style scoped>
.ping {
  height: 600px;
  width: 600px;
}

.container {
  display: flex;
  flex-wrap: wrap;
}
</style>
