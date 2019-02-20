<template>
  <div id="app">
    <img id="logo" alt="iTunes logo" src="./assets/iTunes-logo.jpg">
    <SearchDemo />
    <Footer />
  </div>
</template>

<script>
import SearchDemo from './components/SearchDemo.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'app',
  components: {
    SearchDemo,
    Footer
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
  margin: 75px auto;
  max-width: 1000px;
}

#logo {
  width: 250px;
}
</style>
