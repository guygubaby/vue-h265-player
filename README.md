# vue-h265-player

## install

```bash
yarn add vue-h265-player
# or
npm i vue-h265-player
```

## Using documents

1. copy `src/components/h265-player/lib/libDecoder.wasm` to your `public` path
2. Introducing components
3. configuration parameter

props:

1. url: 需要播放的链接，播放器会根据该值的变化自动重启

events:

1. on-error: 链接不可用时会触发该方法

## eg

```html
<template>
  <div id="app">
    <H265Player
      @on-error="handleOnError"
      :url="url"
      style="width: 80vw;height:45vw"
    />
  </div>
</template>

<script>
  import H265Player from './components/h265-player/index.vue'

  export default {
    name: 'App',
    components: {
      H265Player
    },
    data: () => ({
      url: ''
    }),
    methods: {
      handleOnError(error) {
        console.log('error: ', error)
      }
    }
  }
</script>
```
