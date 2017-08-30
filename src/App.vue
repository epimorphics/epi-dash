<template>
  <div id="app">
    <div id="logo">
      <a href="/"><img src="./assets/epimorphics-logo.png"></a>
    </div>
    <br>
    <div class="container">
     <a href="/">Projects</a> <a href="/#/repos">Repos</a> <a href="/#/trello">Trello Boards</a>
      <a href="/#/new/project">new project</a>
     <br>
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#logo {
  text-align: center;
}

#logo img {
  width: 350px;
}

.container {
  width: 75%;
  margin: 0 auto;
}
</style>
