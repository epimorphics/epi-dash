<template>
  <div class="header">
    <span class="projectName">Contributors</span>

    <img class="avatar" v-for="login in contributors" v-bind:src="login"></img>
  </div>
</template>

<script>
export default {
  name: 'contributorcard',
  data () {
    return {
      closable: this.small,
      open: this.small
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
