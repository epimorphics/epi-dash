<template>
  <a v-bind:href="!small ? href : null">
    <div class="header">
      <img class="source" v-bind:class="source"></img>
      <span class="projectName" v-if="title">{{ title }}</span>
      <span v-if="!small" class="avatarBox">
        <img class="avatar" v-for="login in contributors" v-bind:src="login"></img>
      </span>
    </div>
  </a>
</template>
<script>
  export default {
    props: ['href', 'source', 'title', 'contributors', 'small']
  }
</script>
<style scoped>

  a {
   text-decoration: none;
   color: inherit;
  }

  .header {
    background-color: #dddddd;
    display: flex;
    flex-direction: row;
  }

  .projectName {
    font-size: 35px;
    margin: 5px;
  }

  .avatar {
    width: 50px;
    height: 50px;
    float: right;
  }

  .cb {
    content:url("https://pbs.twimg.com/profile_images/378800000410745178/8704302b5009e71d66fbc8f52cefc0bc_400x400.png");
  }

  .git {
    content:url("https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png");
    background-color: white;
  }

  .trello {
    content:url("http://icons.iconarchive.com/icons/alecive/flatwoken/512/Apps-Trello-icon.png");
    background-color: white;
  }

  .epi {
    content:url("http://localhost:8080/static/epi-icon.png");
  }

  .source {
    width: 50px;
    height: 50px;
    float: left;
  }

  .avatarBox {
    flex-grow: 1;
  }
</style>
