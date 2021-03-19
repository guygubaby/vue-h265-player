import H265PlayerComponent from './index.vue'
export { H265Player, H265PlayerConstants } from './utils/player'

H265PlayerComponent.install = Vue =>
  Vue.component('H265Player', H265PlayerComponent)

export default H265PlayerComponent
