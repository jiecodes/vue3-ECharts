<template>
<!-- 第一次分离trend.vue 通用代码和流程  用于展示的组件 子组件   销量趋势图表(折线图) -->
  <div class="comContainer">
    <div class="trend" ref="trendRef"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // chart图表 初始化
      chartInstance: null,
      // 获取到的趋势折线图
      trendData: [],
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
  methods: {
    // 初始化 echarts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trendRef)
      // 初始option
      const initOption = {}
      // 设置初始option 数据显示图表  
      this.chartInstance.setOption(initOption)
    },
    // 获取数据
    getData() {
      // 数据赋值 tredData
      // this.trendData
      // 更新数据
      this.updateChart()
    },
    // 更新数据
    updateChart() {
      // 数据option
      const dataOption = {}
      // 数据option 显示图表   对initOption内容整合
      this.chartInstance.setOption(dataOption)
    },
    // 浏览器大小发生变化 会调用的方法 来完成屏幕适配
    screenAdapter() {
      // 适配 option
      const adapterOption = {}
      // 适配option 显示图表   对initOption dataOption 内容整合
      this.chartInstance.setOption(adapterOption)
      // 调用 resize进行屏幕适配、
      this.chartInstance.resize();
    },
  }

}
</script>

<style scoped>
.trend {
  width: 100%;
  height: 100%;
}
</style>