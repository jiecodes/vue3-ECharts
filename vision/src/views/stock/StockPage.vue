<template>
  <!-- 第六个做的 测试使用 用于全屏展示  库存销量模块(圆环饼图)      在这个组件中 通过子组价注册的方式,显示 stock.vue这个组件 -->
  <div class="stockpage">
    <stock></stock>
  </div>
</template>

<script>
import Stock from './Stock.vue'
export default {
  data() {
    return {

    }
  },
  components: {
    Stock
  }
}
</script>

<style scoped>
.stockpage {
  width: 100%;
  height: 100%;
}

</style>