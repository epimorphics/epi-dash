<template>
  <div id="app">
    <div id="logo">
      <a href="/"><img src="./assets/epimorphics-logo.png"></a>
    </div>
    <br>
    <div class="links">
      <a href="/"><span class="link">Projects</span></a>
      <a href="/#/repos"><span class="link">Repos</span></a>
      <a href="/#/trello"><span class="link">Trello Boards</span></a>
      <a href="/#/new/project"><span class="link" href="/#/new/project">New Project</span></a>
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
}

#logo {
  text-align: center;
}

#logo img {
  width: 350px;
}


.links {
  width: 80%;
  margin: 0 auto;
  background-color: #dddddd;
  display: flex;
  justify-content: center;
}

.link {
}

a {
  text-decoration: none;
  color: inherit;
  padding: 20px 20px;
}

</style>
