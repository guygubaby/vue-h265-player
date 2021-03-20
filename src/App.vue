<template>
  <div id="app">
    <H265Player :url="url" :maxRetryCount="3" />
  </div>
</template>

<script>
import Vue from 'vue'
import H265Player from './components/h265-player/index'

export default Vue.extend({
  name: 'App',
  components: {
    H265Player
  },
  data: () => ({
    url: 'a h265 hls url'
  })
})
</script>

<style lang="scss">
body {
  margin: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 1rem auto;
  width: 80vw;
  height: 70vh;
}
</style>
