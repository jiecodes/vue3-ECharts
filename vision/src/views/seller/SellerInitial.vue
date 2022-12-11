<template>
  <!--  第一次分离seller    seller 商家销售统计横向统计柱状图    图表展示的组件  子组件      seller.vue初始的样子    把文件名切换为seller.vue看效果 -->
  <div class="seller">
    <div class="comContainer">
      <div class="comChart" ref="sellerRef">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // echart对象 初始化
      chartInstance: null,
      // 服务器获取到的 商家销售统计图数据
      sellerData: [],
      currentPage: 1,     // 当前选中第几页
      total: 0,           // 总共有几页
      timer: 0,       // 定时器 现在的数字
    }
  },
  // dom加载完成
  mounted() {
    // 调用初始化echarts对象 方法
    this.initChart();
    // 获取数据
    this.getData();
  },
  beforeDestroy() {
    // 组件销毁 删除定时器
    clearInterval(this.timer)
  },
  methods: {
    // 初始化 echarts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef)
      // 对图表进行 鼠标事件的监听 echart实例自带的on方法
      this.chartInstance.on('mouseover', () => {
        // 鼠标移入 清除定时器
        clearInterval(this.timer)
      })
      this.chartInstance.on('mouseout', () => {
        // 鼠标离开 开启定时器
        this.startInterval()
      })
    },
    // 获取服务器数据
    async getData() {
      // http://127.0.0.1:8888/api/   await async 接收promise传递过来的数据
      const res = await this.$http.get('seller')
      console.log(res)
      console.log(res.data)
      this.sellerData = res.data
      // 1 对 sellerData里面的value 数据排序 
      this.sellerData.sort((a, b) => {
        return a.value - b.value    // 从小到大排序  从坐标轴开始
      })
      // 2 每5个元素 显示一页   算出有几页
      this.total = this.sellerData.length % 5 === 0 ? this.sellerData.length / 5 : this.sellerData.length / 5 + 1 

      // 获取数据后 更新图表
      this.updataChart();
      // 启动定时器
      this.startInterval();
    },
    // 更新图表
    updataChart() {
      const start = (this.currentPage - 1) * 5    // 0
      const end = this.currentPage * 5      // 5
      // 柱状图 展示的数据 每个5条数据    slice方法 从已有的数据返回选定的元素
      const showData = this.sellerData.slice(start, end)
      // 获取x,y轴数据  
      const sellerNames = showData.map((item) => {
        return item.name
      })
      console.log(sellerNames)
      const sellerValues = showData.map((item) => {
        return item.value
      })
      const option = {
        xAxis: {
          // 数字
          type: 'value', 
        },
        yAxis: {
          // 名字
          type: 'category', 
          data: sellerNames
        },
        series: [
          {
            // bar 柱状 
            type: 'bar',
            data: sellerValues
          },
        ]
      }
      // 重新获取option  更新数据
      this.chartInstance.setOption(option)
      // 页面自适应
      window.onresize = this.chartInstance.resize
    },
    // 开启每隔三秒的定时器
    startInterval() {
      this.timer = setInterval(() => {
        this.currentPage++;
        if  (this.currentPage > this.total) {
          this.currentPage = 1
          // 清空定时器
          // clearInterval(timer)
        }
        // 更新数据
        this.updataChart()
      },3000)
    },
  }
}
</script>

<style scoped lang="scss">

</style>

