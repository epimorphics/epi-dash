<template>
  <div>
    <div class="header">
      <img class="source trello"></img>
      <div class="projectName">{{ board.name }}</div>
    </div>
    <div class="body">
      <div class="bodyleft">
        {{ board.deadlines }}
      </div>
      <div class="bodyright">
        <div v-for="key in Object.keys(board.metrics)">
          <div>{{ board.metrics[key] }} {{ key }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'trelloCard',
    props: ['board']
  }
</script>

<style scoped>

  .header {
    background-color: #dddddd;
    display: flex;
    flex-direction: row;
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
    overflow-y: scroll;
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
    align-items: flex-end;
  }

  .trello {
    content:url("http://icons.iconarchive.com/icons/alecive/flatwoken/512/Apps-Trello-icon.png");
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

  .avatarBox {
    align-items: flex-end;
  }
</style>
