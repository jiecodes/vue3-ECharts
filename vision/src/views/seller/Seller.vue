<template>
  <!--   seller 商家销售统计横向统计柱状图    图表展示的组件  子组件 -->
  <div class="seller">
    <div class="comContainer">
      <div class="comChart" ref="sellerRef">
      </div>
    </div>
  </div>
</template>

<script>
// 导入vuex中的函数  用于theme切换  然后注册计算属性
import { mapState } from 'vuex'

export default {
  data() {
    return {
      // echart实例对象 初始化
      chartInstance: null,
      // 服务器获取到的 商家销售统计图数据
      sellerData: [],
      currentPage: 1,     // 当前选中第几页
      total: 0,           // 总共有几页
      timer: null,       // 定时器 现在的数字
    }
  },
  // dom加载完成
  mounted() {
    // 调用初始化echarts对象 方法
    this.initChart();
    // 获取数据
    this.getData();
    // addEventListener 向指定元素添加监听事件    resize 页面发生变化触发的事件
    window.addEventListener('resize', this.screenAdapter )
    // 项目加载完成 主动进行屏幕适配
    this.screenAdapter();

  },
  beforeDestroy() {
    // 组件销毁 删除定时器      避免内存泄漏
    clearInterval(this.timer)
    // 组件销毁 移除监听事件
    window.removeEventListener('resize', this.screenAdapter)
  },
  // 计算属性 主题切换 vuex
  computed: {
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
      this.updataChart()        // 更新图表数据
    }
  },
  methods: {
    // 初始化 echarts对象
    initChart() {
      // 初始化 echarts 第二个参数是主题    this.theme使用计算属性切换主题 是vuex定义的变量
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef, this.theme)
      // 对图标初始化option  option第一次分离
      const initOption = {
         // 标题
        title: {
          // 标题文字
          text: '▎商家销售统计',
          // 标题文字样式
          textStyle: {
            fontSize: 66,
          }
        },
        // 直角坐标轴位置
        grid: {
          top: '20%',
          left: '4%',
          right: '1%',
          bottom: '5%',
          containLabel: true,     // 包含坐标轴文字
        },
        // 文字提示框 移动鼠标
        tooltip: {
          // 移入轴中显示 文字
          trigger: 'axis',
          // 移入坐标轴上 显示的样式
          axisPointer: {
            type: 'line',     // 展示的类型是line
            z: 0,             // 默认line背景 层级最低
            lineStyle: {      // line的样式 背景色
              type: 'line',   // 解决新版本的  断层效果
              width: 66,      // 背景线 宽度
              color: '#2D3443'
            }
          }
        },
        xAxis: {
          // 数字
          type: 'value',
        },
        yAxis: {
          // 名字
          type: 'category', 
        },
        // 系列
        series: [
          {
            // bar 柱状 
            type: 'bar',
            // 柱的宽度
            barWidth: 66,
            // 展示柱体的文字
            label: {
              // 默认展示文字 设置为true
              show: true,
              position: 'right', // 文字显示到右边
              // 柱状体上的文字的颜色
              textStyle: {
                color: 'white',
              },
            },
            // 控制柱状图 每一个柱体
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],   // 每一个柱体的四个角
              // color: 'red',      // 每一个柱体的 颜色 
              // 颜色渐变 不同百分比之下的颜色的值
              // color: new this.$echarts.graphic.linearGradient(x1, y1, x2, y2, [])  x y 对应的坐标点
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [    // 0 0 坐标轴0 0  1 0坐标轴1 0 从左往右
                // 百分0 状态下的颜色值
                {
                  offset: 0,
                  color: '#5052EE'
                },
                // 百分100 状态下的颜色值
                {
                  offset: 1,
                  color: '#AB6EE5'
                },
              ])    
            }
          },
        ]
      }
      // echarts的初始化数据
      this.chartInstance.setOption(initOption)
      
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
        return item.value     // 值
      })
      // data 数据的option   可以整合 initOption里面的配置
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        // 系列
        series: [
          {
            // x轴的数据
            data: sellerValues,
          }, 
        ]
      }
      // 重新获取option  更新数据
      this.chartInstance.setOption(dataOption)
      // 页面自适应
      // window.onresize = this.chartInstance.resize
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
    // 浏览器大小发生变化 会调用的方法 来完成屏幕适配
    screenAdapter() {
      // 获取div图表的宽度
      console.log(this.$refs.sellerRef.offsetWidth + '  图表的宽度 div的宽度')
      // 获取文字大小
      const titleFontSize = this.$refs.sellerRef.offsetWidth / 100 * 3.5
      console.log(titleFontSize + '  适配文字大小')

      // 对图表进行适配 option 第三次分离
      const adapterOption = {
        // 标题
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        // 柱状体 每一项的 文字提示
        tooltip: {
          // 移入坐标轴 每一项 显示的样式 背景线   坐标轴指示器配置项
          axisPointer: {
            // 线样式
            lineStyle: {
              // 每一项 线宽
              with: titleFontSize
            }
          }
        },
        // 系列
        series: [
          {
            // 柱的宽度
            barWidth: titleFontSize,
            // 每一项 的样式
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]   // 每一个柱体的四个角
            }
          },
        ],
      }
      // 屏幕大小发生变化 调动echarts实例对象方法
      this.chartInstance.setOption(adapterOption)
      // 手动调用图表对象resize方法 进行图表适配
      this.chartInstance.resize()

    },
  }
}
</script>

<style scoped lang="scss">

</style>

