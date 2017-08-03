<template>
  <div>
    <div class="header">
      <img class="source" v-bind:class="project.source"></img>
      <span class="projectName">{{ project.name }}</span>
      <span v-for="avatar in project.avatars">
        <img class="avatar" v-bind:src="avatar"></img>
      </span>
    </div>
    <div class="body">
      <div class="bodyleft">
        {{ project.description }}
      </div>
      <div class="bodyright">
        <ul v-for="key in Object.keys(project.metrics)">
          <li>{{ project.metrics[key] }} {{ metricText[key] }}</li>
        </ul>
      </div>
    </div>
    <div class="bottom" v-bind:class="project.test">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'project',
    props: ['project', 'metricText']
  }
</script>

<style>

  .header {
    height: 50px;
    background-color: #dddddd;
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
    float: right;
  }

  .cb {
    content:url("https://pbs.twimg.com/profile_images/378800000410745178/8704302b5009e71d66fbc8f52cefc0bc_400x400.png");
  }

  .git {
    content:url("https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png");
    background-color: white;
  }

  .source {
    width: 50px;
    height: 50px;
    float: left;
  }

  .projectName {
    font-size: 40px;
    margin: 10px;
  }
</style>
