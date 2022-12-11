<template>
<!--  rank.vue  用于展示的组件 子组件   销量排行模块(柱状图) -->
  <div class="comContainer">
    <div class="rank" ref="rankRef"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // chart图表 初始化
      chartInstance: null,
      // 获取到的销售排行 数据
      rankData: [],
      // 平移动画 区域缩放 默认展示的数据开始
      startValue: 0,
      // 平移动画 区域缩放 默认展示的数据结束
      endValue: 9,
      // 定时器变量、
      timer: null,
      // div的宽度
      titleFontSize: 0
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
    // 组件销毁 关闭定时器
    clearInterval(this.timer)
  },
  methods: {
    // 初始化 echarts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rankRef, 'chalk')
      // 初始option
      const initOption = {
        xAxis: {
          // 分类 展示每一项
          type: 'category',
        },
        yAxis: {
          // 值 展示数字 value
          type: 'value',
        },
        // 系列
        series: {
          type: 'bar',
        },
        // 标题
        title: {
          text: '▎地区销售排行',
          left: 20,
          top: 10,
        },
        // 直角坐标轴位置
        grid: {
          top: '20%',
          left: '4%',
          right: '1%',
          bottom: '5%',
          containLabel: true,     // 包含坐标轴文字
        },
        // 鼠标移动到轴上 显示文字提示
        tooltip: {
          show: true,
        },
      }
      // 设置初始option 数据显示图表  
      this.chartInstance.setOption(initOption)
      // 对初始化图表进行监听  鼠标移至轴内 清除定时器
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      // 鼠标移出 轴内 开启定时器
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取数据
    async getData() {
      // 数据赋值 rankData
      const res = await this.$http.get('rank')
      console.log(res)
      this.rankData = res.data
      // 对数据进行排序  sort 从大到小 
      this.rankData.sort((a, b) => {
        return b.value - a.value
      })
      // 更新数据
      this.updateChart()
      // 开启平移动画
      this.startInterval();
    },
    // 更新数据
    updateChart() {
      // 定义渐变颜色 数组
      const colorArr = [
        ['#0BA82C' , '#4FF778'],['#2E72BF', '#23E5E5'],['#5052EE', '#AB6EE5']
      ]

      // 获取x轴数据 category 省份
      const xData = this.rankData.map(item => {
        return item.name
      })
      // 获取y轴数据 value 值 对应的金额
      const yData = this.rankData.map(item => {
        return item.value
      })
      // 数据option
      const dataOption = {
        // 轴 展示分类 每一项
        xAxis: {
          data: xData,
        },
        // 区域缩放
        dataZoom: {
          show: false,
          // 平移动画 区域缩放 默认展示的数据开始
          startValue: this.startValue,
          // 平移动画 区域缩放 默认展示的数据结束
          endValue: this.endValue,
        },
        // 系列  展示值
        series: {
          data: yData,
          // 每一项 轴的样式
          itemStyle: {
            // 不同数值 value 显示不同颜色
            // color: 'red',
            // color: () => {
            //   return 'blue'
            // }
            color: arg => {
              // 每一个柱体对应的 data value
              console.log(arg)
              // 使用渐变颜色 变量
              let targetColor = null
              // return 'green'
              if (arg.value < 200) {
                // return 'blue'
                targetColor = colorArr[0]
              } else if (arg.value < 300 ) {
                // return 'red'
                targetColor = colorArr[1] 
              } else {
                // return 'green'
                targetColor = colorArr[2]
              }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  // 0%时的颜色
                  { 
                    offset: 0,
                    // 当前的颜色数组有俩个值  选择第一个值
                    color: targetColor[0]
                  },
                  // 100%时的颜色
                  { 
                    offset: 1,
                    color: targetColor[1]
                   },
                ])
            }
          },
        },
        
      }
      // 数据option 显示图表   对initOption内容整合
      this.chartInstance.setOption(dataOption)
    },
    // 浏览器大小发生变化 会调用的方法 来完成屏幕适配
    screenAdapter() {
      // 获取div的宽度
      this.titleFontSize = this.$refs.rankRef.offsetWidth / 100 * 3.5
      console.log(this.titleFontSize)
      // 适配 option
      const adapterOption = {
        // 标题文字大小
        title: {
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
        // 系列
        series: [
          {
            // 柱的宽度
            barWidth: this.titleFontSize * 1.2,
            // 半圆效果
            itemStyle: {
              borderRadius: [this.titleFontSize / 2, this.titleFontSize / 2, 0, 0]
            }
          },
        ],
      }
      // 适配option 显示图表   对initOption dataOption 内容整合
      this.chartInstance.setOption(adapterOption)
      // 调用 resize进行屏幕适配、
      this.chartInstance.resize();
    },
    // 定时器  实现平移动画  改变startValue endValue
    startInterval() {
      // 开始时 有定时器 则清除
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.startValue++;
        this.endValue++;
        if (this.endValue > this.rankData.length - 1) {
          this.startValue = 0,
          this.endValue = 9
        }
        // 更新数据
        this.updateChart();
      }, 2000);
    }
  }

}
</script>

<style scoped>
.rank {
  width: 100%;
  height: 100%;
}
</style>