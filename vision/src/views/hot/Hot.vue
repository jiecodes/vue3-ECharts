<template>
<!--  Hot.vue 三级分类数据    用于展示的组件 子组件   销售商品占比模块(饼图)  -->
  <div class="comContainer">
    <div class="hot" ref="hotRef"></div>
    <!-- 左右箭头 --> 
    <span class="iconfont left" @click="toLeft" :style="spanStyle">&#xe659;</span>
    <span class="iconfont right" @click="toRight" :style="spanStyle" @mouseover="mouseOver" @mouseout="mouseOut">&#xe658;</span>
    <div class="name" @click="titleChange" :style="spanStyle">[ {{textName}} ]</div>
  </div>
</template>

<script>
// 导入vuex中的函数  用于theme切换  然后注册计算属性
import { mapState } from 'vuex'
// 导入主题切换的样式 用于计算属性
import { getThemeValue } from '@/utils/theme_utils.js'

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
      // 根据页面的宽度 offsetWidth得到文字大小
      titleFontSize: 0,
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
      // this.theme使用计算属性切换主题 是vuex定义的变量
      this.chartInstance = this.$echarts.init(this.$refs.hotRef, this.theme)
      // 初始option
      const initOption = {
        // 标题
        title: {
          text: '▎销售商品占比模块',
          top: '6%',
          left: '4%',
        },
        // 图例
        legend: {
          top: '11%',
          right: '10%',
          // 图例的样式
          icon: 'circle',
        },
        // 工具提示 展示三级分类
        tooltip: {
          show: true,
          // 工具提示的文字内容
          // formatter: '..'
          // formatter: () => {
          //   return '..'
          // }
          // 鼠标移入 展示每一项
          formatter: arg => {
            // 三级分类数据
            const thirdCategory = arg.data.children
            console.log(thirdCategory)
            // 的value值之和
            let total = 0;
            // 获取value值之和 
            thirdCategory.forEach(item => {
              total += item.value
            })
            // 展示的三级分类字符串
            let thirdString = ''
            // 获取三级分类是字符串
            thirdCategory.forEach(item => {
              thirdString += `${item.name} ${(item.value / total * 100).toFixed(3) + '%'}<br/>`
            })
            return thirdString


            console.log(arg)
          }
        },
        // 系列
        series: [
          {
            // 显示饼图
            type: 'pie',
            // 每一个类别名称的隐藏
            label: {
              show: false,
            },
            // 监听每一项高亮
            emphasis: {
              label: {
                show: true,
              },
              // 每一项中的类别名称线
              labelLine: {
                // 隐藏线
                show: false,
              }
            }
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
          value: item.value,
          children: item.children
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
      // 获取div的宽度
      this.titleFontSize = this.$refs.hotRef.offsetWidth / 100 * 3.5
      console.log(this.titleFontSize + '根据页面的宽度 offsetWidth得到文字大小')
      // 适配 option
      const adapterOption = {
        // 标题文字
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        // 图例大小
        legend: {
          textStyle: {
            fontSize: this.titleFontSize / 2
          },
          // 图例图形的宽高
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,   // 间距
        },
        // 系列
        series: {
          radius: this.titleFontSize * 5,
          // 饼图位置
          center: ['50%','50%']
        }, 
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
  },
  // 计算属性
  computed: {
    // 适配页面 箭头标题样式 文字大小
    spanStyle () {
      return {
        fontSize: this.titleFontSize * 1.5 + 'px',
        // 调用导入的方法   this.theme 当前的主题 通过theme_utils.js判断
        color: getThemeValue(this.theme).titleColor
        
      }
    },
    // 计算属性 主题切换 vuex
    // 调用函数  将数据进行计算属性的映射
    ...mapState(['theme'])
  },
  // 对属性进行监听 主题切换
  watch: {
    theme() {
      console.log('主题切换了')
      this.chartInstance.dispose()    // 销毁当前图表
      this.initChart()            // 重新初始化图表对象 切换主题
      this.screenAdapter()        // 屏幕适配 切换主题后
      this.updateChart()        // 更新图表数据
    }
  },

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