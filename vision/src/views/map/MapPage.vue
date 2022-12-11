<template>
  <!-- 第三个做的 mapPage  测试使用 用于全屏展示  商家分布模块(地图和散点图)     在这个组件中 通过子组价注册的方式,显示 map.vue这个组件 -->
  <div class="mapPage">
    <maps></maps>
  </div>
</template>

<script>
// 导入 子组件 Map.vue
import Maps from './Maps.vue'

export default {
  data() {
    return {

    }
  },
  components: {
    Maps
  }
  
}
</script>

<style scoped>
.mapPage {
  width: 100%;
  height: 100%;
}

</style>