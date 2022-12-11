<template>
<!--  第二次分离 切换一级分类数据实现    Hot.vue 三级分类数据    用于展示的组件 子组件   销售商品占比模块(饼图)  -->
  <div class="comContainer">
    <div class="hot" ref="hotRef"></div>
    <!-- 左右箭头 --> 
    <span class="iconfont left" @click="toLeft">&#xe659;</span>
    <span class="iconfont right" @click="toRight" @mouseover="mouseOver" @mouseout="mouseOut">&#xe658;</span>
    <div class="name" @click="titleChange">[ {{textName}} ]</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // chart图表 初始化
      chartInstance: null,
      // 获取到的销售排行 数据
      hotData: [],
      // 当前的一级分类
      currentIndex: 0,
      // 一级分类名称
      textName: '',
      timer1: null,
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
      this.chartInstance = this.$echarts.init(this.$refs.hotRef, 'chalk')
      // 初始option
      const initOption = {
        series: [
          {
            // 显示饼图
            type: 'pie'
          },
        ]
      } 
      // 设置初始option 数据显示图表  
      this.chartInstance.setOption(initOption)
    },
    // 获取数据
    async getData() {
      // 数据赋值 hotData
      const res = await this.$http.get('hot')
      console.log(res)
      this.hotData = res.data
      // 对数据进行排序  sort 从大到小 
      // 更新数据
      this.updateChart()
    },
    // 更新数据
    updateChart() {
      // 获取图例组件的数据
      const legendData = this.hotData[this.currentIndex].children.map(item => {
        return item.name
      })
      // 一个分类数据展示
      // this.hotData[0]
      // 获取展示到series的值  
      this.seriesData = this.hotData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value
        }
      })
      // 展示一级分类
      this.textName = this.hotData[this.currentIndex].name
      // 数据option
      const dataOption = {
        // 图例组件
        legend: {
          data: legendData
        },
        series: [
          {
            // 展示饼图的数据
            data: this.seriesData
          },
        ]
      }
      // 数据option 显示图表   对initOption内容整合
      this.chartInstance.setOption(dataOption)
    },
    // 浏览器大小发生变化 会调用的方法 来完成屏幕适配
    screenAdapter() {
      // 适配 option
      const adapterOption = {
        
      }
      // 适配option 显示图表   对initOption dataOption 内容整合
      this.chartInstance.setOption(adapterOption)
      // 调用 resize进行屏幕适配、
      this.chartInstance.resize();
    },
    // 点击左箭头
    toLeft() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.hotData.length - 1   // 2
      }
      // 更新数据
      this.updateChart()
    },
    // 点击右箭头
    toRight() {
      this.currentIndex++;
      if (this.currentIndex > this.hotData.length - 1) {
        this.currentIndex = 0
      }
      // 点击右箭头 清除定时器
      clearInterval(this.timer1)
      // 更新数据
      this.updateChart()
    },
    // 定时器
    setInterval() {
      this.timer1 = setInterval(() => {
        this.toLeft();
      }, 1000);
    },
    // 移入
    mouseOver() {
      this.setInterval()
    },
    // 移开
    mouseOut() {
      clearInterval(this.timer1)
    },
    // 切换一级分类名称
    titleChange() {
      this.currentIndex++;
      console.log(this.currentIndex + ' 当前点击的一级分类中的 第几个')
      console.log(this.hotData.length + ' 获取到的图表数据有 几个')
      if (this.currentIndex === this.hotData.length) {
        this.currentIndex = 0
      }
      // 更新数据
      this.updateChart()
    }
  }

}
</script>

<style scoped>
.hot {
  width: 100%;
  height: 100%;
}
.iconfont {
  font-size: 50px;
  z-index: 9;
  color: skyblue;
}
.left {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  cursor: pointer;
}
.right {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  cursor: pointer;
}
.name {
  position: absolute;
  right: 10%;
  bottom: 10%;
  color: white;
  font-size: 20px;
  cursor: pointer;
}
</style>