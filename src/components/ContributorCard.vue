<template>
  <div class="header">
    <span class="projectName">Contributors</span>
    <img class="avatar" v-for="login in contributors" v-bind:src="getAvatar(login)"></img>
  </div>
</template>

<script>
import request from 'superagent'
export default {
  name: 'contributorcard',
  data () {
    return {
      closable: this.small,
      open: this.small,
      users: []
    }
  },
  mounted () {
    request('http://localhost:4000/json/users')
      .then((response) => {
        this.users = response.body.users
      })
  },
  methods: {
    getAvatar (login) {
      const user = this.users.find((user) => {
        if (user.login === login) {
          return true
        }
        return false
      })
      if (user) {
        if (user.hasOwnProperty('avatar_url')) {
          return user.avatar_url
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  },
  props: ['contributors']
}
</script>

<style scoped>

  .header {
    background-color: #dddddd;
  }

  .avatar {
    width: 50px;
    height: 50px;
    float: right;
  }

  .projectName {
    font-size: 40px;
    margin: 10px;
  }

</style>
