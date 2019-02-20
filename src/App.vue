<template>
  <div id="app">
    <img id="logo" alt="iTunes logo" src="./assets/iTunes-logo.jpg">

    <SearchDemo />
  </div>
</template>

<script>
import SearchDemo from './components/searchDemo.vue'

export default {
  name: 'app',
  components: {
    SearchDemo
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#logo {
  width: 250px;
}
</style>
