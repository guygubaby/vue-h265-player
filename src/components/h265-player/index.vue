<template>
  <div class="h265-player-container">
    <img
      v-show="isShowPlayIcon"
      class="play-icon"
      :src="PlayButton"
      alt="PlayButton"
    />
    <div class="player" :id="elemId"></div>
  </div>
</template>

<script>
import PlayButton from './assets/play-button.svg'
import {
  getRandomElemId,
  H265PlayerConstants,
  H265Player
} from './utils/player'

export default {
  props: {
    url: {
      validator: prop =>
        [null, undefined].includes(prop) || typeof prop === 'string',
      default: null,
      required: true
    },
    maxRetryCount: {
      validator: prop => typeof prop === 'number' && prop >= 1,
      default: 3,
      required: false
    }
  },
  data: () => ({
    PlayButton,
    elemId: '',
    isShowPlayIcon: false
  }),
  watch: {
    url: {
      async handler (urlVal) {
        if (urlVal) {
          await this.$nextTick()
          if (this.player) {
            this.player.changeUrl(urlVal)
          } else {
            this.init(urlVal)
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    changeUrl (url) {
      this.player.changeUrl(url)
    },
    init (url) {
      const player = new H265Player(this.elemId, this.maxRetryCount)
      // player.init()
      player.play(url)

      player.on(H265PlayerConstants.on_error, e => {
        this.$emit('on-error', e)
      })

      player.on(H265PlayerConstants.on_play, e => {
        this.$emit('on-play', e)
        this.isShowPlayIcon = false
      })

      player.on(H265PlayerConstants.on_dispose, e => {
        this.$emit('on-dispose', e)
        this.isShowPlayIcon = true
      })

      this.player = player
    },
    getPlayer () {
      return this.player
    }
  },
  created () {
    this.elemId = getRandomElemId()
    this.player = null
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>

<style lang="scss" scoped>
.h265-player-container,
.player {
  width: 100%;
  height: 100%;
}

.h265-player-container {
  position: initial;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4rem;
  height: 4rem;
  object-fit: contain;
  cursor: pointer;
  z-index: 1;
}

.player {
  background-color: #343231;
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep {
  .iconqingxiLOGO,
  span.fa-volume-off,
  span.fa-stop {
    display: none !important;
  }

  canvas + div {
    background-color: rgba($color: #000000, $alpha: 0.05) !important;
  }

  span.fa-volume-off + .no-padding {
    font-size: 12px !important;
  }

  span.fa-pause,
  span.fa-expand {
    font-size: 12px !important;
  }
}
</style>
