<template>
  <div>
    <div class="header" v-on:click="openRepo">
      <div class="projectName">Metrics</div>
    </div>
    <div v-if="!open" class="body">
      <div class="bodyleft">
        <metricholder v-bind:metrics="repometrics"></metricholder>
      </div>
      <div class="bodyright">
        <metricholder v-bind:metrics="trellometrics"></metricholder>
      </div>
    </div>
  </div>
</template>

<script>
import MetricHolder from '../CardComponents/MetricHolder'
export default {
  name: 'project',
  components: {
    'metricholder': MetricHolder
  },
  data () {
    return {
      closable: true,
      open: this.small
    }
  },
  props: ['trellometrics', 'repometrics', 'small'],
  methods: {
    openRepo () {
      if (this.closable) {
        this.open = !this.open
      }
    }
  }
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
    align-items: flex-end;
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
