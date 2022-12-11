<template>
  <!-- 第一个做的   sellerPage 测试使用 用于全屏展示  商家销售统计(横向柱状图)     在这个组件中 通过子组价注册的方式,显示Seller.vue这个组件 -->
  <div class="sellerPage">
    <div class="comPage">
      <seller></seller>
    </div>
  </div>
</template>

<script>
// 使用子组件
// 1 导入组件
import Seller from './Seller.vue'

export default {
  data() {
    return {

    }
  },

  // 2 注册组件
  components: {
    seller: Seller
  }
}
</script>

<style scoped lang="scss">

</style>