<template>
<!-- 第一次分离Maps.vue 展示中国地图      用于展示的组件 子组件  商家分布模块(地图和散点图)  -->
<!-- geo: {
  type: 'map',
  map: 'china',
} -->

  <div class="comContainer">
    <div class="map" ref="mapRef"></div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      // chart图表 初始化
      chartInstance: null,
      // 获取到的趋势折线图
      mapData: [],
    }
  },
  // dom加载完成
  mounted() {
    // 初始echarts对象
    this.initChart();
    // 获取数据
    this.getData()
    // 图表根据屏幕适配   addEventListener 向指定元素添加监听事件    resize 页面发生变化触发的事件
    window.addEventListener('resize', this.screenAdapter)
    // 页面加载完成 主动进行屏幕适配
    this.screenAdapter();
  },
  // 组件销毁
  destroyed() {
    // 组价销毁 取消屏幕适配方法     移除window事件 阻止内存泄漏
    window.removeEventListener('resize', this.screenAdapter)
  },
  // 计算属性
  computed: {

  },
  methods: {
    // 初始化 echarts对象
    async initChart() {
      // 使用 index.html 导入的主题 chalk
      this.chartInstance = this.$echarts.init(this.$refs.mapRef, 'chalk')
      // 获取中国地图的矢量数据 数据在本地    http://localhost:8899/static/map/china.json
      // 获取本地中国地图矢量数据 不能通过this.$http 因为数据是本地的 而this.$http有基本链接   解决:通过导入axios获取
      const resMap = await axios.get('http://localhost:8899/static/map/china.json')
      console.log(resMap)
      // 注册中国地图矢量数据   第一个数据别名 第二个数据真正的数据
      this.$echarts.registerMap('china', resMap.data)

      // 初始option
      const initOption = {
        // 显示中国地图
        geo: {
          type: 'map',
          map: 'china',
        }
      }
      // 设置初始option 数据显示图表  
      this.chartInstance.setOption(initOption)
    },
    // 获取数据
    async getData() {
      // 数据赋值 tredData
      const res = await this.$http.get('map')
      console.log(res)
      this.mapData = res.data
      // 更新数据
      this.updateChart()
    },
    // 更新数据
    updateChart() {
      // 数据option
      const dataOption = {

      }
      // 数据option 显示图表   对initOption内容整合
      this.chartInstance.setOption(dataOption)
    },
    // 浏览器大小发生变化 会调用的方法 来完成屏幕适配
    screenAdapter() {
      // 适配 option
      const adapterOption = {
        // 图例 大小控制
        
      }
      // 适配option 显示图表   对initOption dataOption 内容整合
      this.chartInstance.setOption(adapterOption)
      // 调用 resize进行屏幕适配、
      this.chartInstance.resize();
    },

  }

}
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}

</style>