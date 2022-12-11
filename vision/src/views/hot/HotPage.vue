<template>
  <!-- 第五个做的 测试使用 用于全屏展示  销售商品占比模块(饼图)      在这个组件中 通过子组价注册的方式,显示 Hot.vue这个组件 -->
  <div class="hotpage">
    <hot></hot>
  </div>
</template>

<script>
import Hot from './Hot.vue' 
export default {
  data() {
    return {

    }
  },
  components: {
    Hot
  }
}
</script>

<style>
.hotpage {
  width: 100%;
  height: 100%;
}
</style>