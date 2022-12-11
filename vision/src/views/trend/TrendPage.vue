<template>
  <!-- 第二个做的  测试使用 用于全屏展示  销量趋势图表(折线图)      在这个组件中 通过子组价注册的方式,显示 Trend.vue这个组件 -->
  <div class="trendPage">
    <trend></trend>
  </div>
</template>

<script>
// 导入 子组件 Trend.vue
import Trend from './Trend.vue'

export default {
  data() {
    return {

    }
  },
  components: {
    Trend
  }
  
}
</script>

<style scoped>
.trendPage {
  width: 100%;
  height: 100%;
}

</style>