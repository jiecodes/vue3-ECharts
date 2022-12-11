<template>
<!--  第二次分离trend.vue   ui结构之前的项目   -->
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
      const initOption = {
        xAxis: {
          // category 每一项
          type: 'category',
        },
        yAxis: {
          // value值 展示
          type: 'value'
        },
      }
      // 设置初始option 数据显示图表  
      this.chartInstance.setOption(initOption)
    },
    // 获取数据
    async getData() {
      // 数据赋值 tredData
      const res = await this.$http.get('trend')
      console.log(res)
      this.trendData = res.data
      // 更新数据
      this.updateChart()
    },
    // 更新数据
    updateChart() {
      // x轴数据  月
      const xData = this.trendData.common.month
      // y轴数据   "地区销量趋势" 数据
      const mapData = this.trendData.map.data
      // console.log(mapData)
      // map方法 根据调用函数处理后的值  返回一个新数组 允许键值对 
      const yData = mapData.map(item => {
        return {
          // 图例文字数据 上海
          name: item.name,
          // 键值对
          type: 'line',
          data: item.data,
          // stack 数据堆叠  a放一个值
          stack: 'a',
        }
      })
      // 图例文字数据 上海
      const legendArr = mapData.map(item => {
        return item.name
      })
      // 数据option
      const dataOption = {
        // 图例数据
        legend: {
          // 展示图例数据
          data: legendArr,
        },
        xAxis: {
          data: xData,
        },
        // series: [
        //   {
        //     // y轴 值的展示
        //     data: yData,
        //   }
        // ],
        series: yData,
      }
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