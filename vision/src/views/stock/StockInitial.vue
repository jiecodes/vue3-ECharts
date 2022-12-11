<template>
<!-- 第一次分离 五个圆环实现   stock.vue    用于展示的组件 子组件   库存销量模块(圆环饼图)  -->
  <div class="comContainer">
    <div class="stock" ref="stockRef"></div> 
  </div>
</template>

<script>
export default {
  data() {
    return {
      // chart图表 初始化
      chartInstance: null,
      // 获取到的趋势折线图
      stockData: [],
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
      this.chartInstance = this.$echarts.init(this.$refs.stockRef)
      // 初始option
      const initOption = {
        // 系列
        series: {
        }
      }
      // 设置初始option 数据显示图表  
      this.chartInstance.setOption(initOption)
    },
    // 获取数据
    async getData() {
      const res = await this.$http.get('stock')
      console.log(res)
      // 数据赋值 stockData
      this.stockData = res.data
      // 更新数据
      this.updateChart()
    },
    // 更新数据
    updateChart() {
      // 每一个饼图的中心点
      const pieCenterArr = [
        ['18%', '40%'],['50%','40%'],['82%', '40%'],['34%' , '75%'],['66%', '75%']
      ];
      // 获取数组中的前五个数据   slice 分割字符串(包含0不包含5)
      const sliceData = this.stockData.slice(0, 5)
      // this.stockData中的前五个数据
      console.log(sliceData)
      const seriesData = sliceData.map((item,index) => {
        return {
          // 显示饼图
          type: 'pie',
          // 饼图转换为圆环图 radius 外圆半径和内圆半径
          radius: [110, 100],
          // 设置每一个饼图中心点 坐标  遍历时每一个index获取对应的中心点坐标
          center: pieCenterArr[index],
          // 五个饼图 每一个饼图俩个区域(每个区域都设置value值)
          data: [
            { value: item.sales },
            { value: item.stock }, 
          ]
         
        }
      })
      // 数据option
      const dataOption = {
        // 显示饼图
        series: seriesData
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
.stock {
  width: 100%;
  height: 100%;
}
</style>