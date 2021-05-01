# vue-h265-player

## Install

```bash
yarn add vue-h265-player
# or
npm i vue-h265-player
```

## Start

1. copy decoder to public `cp node_modules/vue-h265-player/src/components/h265-player/lib/libDecoder.wasm static/`

2. Introducing components

3. configuration parameter

props:

1. url: 需要播放的链接，播放器会根据该值的变化自动重启
2. maxRetryCount: 最大尝试重连次数，到达次数上限后会触发 `on-error`

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
  import H265Player from 'vue-h265-player';

  export default {
    name: 'App',
    components: {
      H265Player,
    },
    data: () => ({
      url: 'a h265 hls url',
    }),
    methods: {
      handleOnError(error) {
        console.log('error: ', error);
      },
    },
  };
</script>
```
