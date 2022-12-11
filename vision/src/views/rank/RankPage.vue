<template>
  <!-- 第四个做的 测试使用 用于全屏展示  销量排行模块(柱状图)      在这个组件中 通过子组价注册的方式,显示 rank.vue这个组件 -->
  <div class="rankPage">
    <rank></rank>
  </div>
</template>

<script>
import Rank from './Rank.vue'

export default {
  data() {
    return {}
  },
  components: {
    Rank,
  }
}
</script>

<style>
.rankPage {
  width: 100%;
  height: 100%;
}
</style>