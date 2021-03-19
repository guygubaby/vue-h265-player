<template>
  <div id="app">
    <H265Player
      @on-error="handleOnError"
      :url="url"
      :maxRetryCount='5'
      style="width: 80vw;height:45vw"
    />
  </div>
</template>

<script>
import H265Player from '../dist/h265-player.umd.js'

export default {
  name: 'App',
  components: {
    H265Player
  },
  data: () => ({
    url:
      'a fake url'
  }),
  methods: {
    handleOnError (error) {
      console.log('error: ', error)
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
