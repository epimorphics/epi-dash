<template>
  <div id="app">
    <div id="logo">
      <img src="./assets/epimorphics-logo.png">
    </div>
    <br>
    <router-view></router-view>
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
</style>
