<template>
  <div id="app">
    <div id="nav">
      <div id="logo">
        <a href="/"><img src="./assets/epimorphics-logo.png"></a>
      </div>
      <br>
      <div class="links">
        <a href="/"><span class="link">Projects</span></a>
        <a href="/#/repos"><span class="link">Repos</span></a>
        <a href="/#/trello"><span class="link">Trello Boards</span></a>
        <a v-bind:href="'/#/new/project'"><span class="link">New Project</span></a>
      </div>
    </div>
    <div class="container">
    <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
.container {
  display: flex;
  width: 80%;
  margin: 0 auto;
  flex-direction: column;
  justify-content: center;
}
</style>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display:flex;
  margin: 0px;
  min-height: 100%;
}

#logo {
  text-align: left;
}

#logo img {
  width: 350px;
}

.links {
  background-color: #dddddd;
  display: flex;
  flex-direction: column;
  height: 100%;
}

a {
  text-decoration: none;
  color: inherit;
  padding: 20px 20px;
}

</style>
