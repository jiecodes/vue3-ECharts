<template>
<!--  用于展示的组件 子组件   销量趋势图表(折线图) -->
  <div class="comContainer" :style="titleStyle">
    <!-- 标题文字 -->
    <div class="title">
      <div @click="isShow = !isShow">
        <span :style="titleStyle">{{'▎ ' + currentSelect}}</span> 
        <span class="iconfont dropDown" :style="titleStyle">&#xe65c;</span>
      </div>
      <div class="select" v-if="isShow" :style="marginStyle" >
        <div class="selectItem" @click="handleSelect(item.key, item.text)"  v-for="(item, index) in selectTypes" :key="index">
          {{item.text}}
        </div>
      </div>
    </div>
    <div class="trend" ref="trendRef"></div>
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
      isShow1:false,
      // chart图表 初始化
      chartInstance: null,
      // 获取到的趋势折线图
      trendData: [],
      // 是否显示 文字标题 title
      isShow: false,
      // 显示的文字标题 title
      showType: 'map',
      // 当前显示的title
      currentSelect: '你好',
      // 用于适配 title文字大小
      titleFontSize: null,
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
    // 标题文字显示哪个
    selectTypes() {
      if (!this.trendData) {
        // 防止报错 没找到数据 为了使用v-show
        return []
      } else {
        // 显示的title标题 进行过滤 下拉不显示当前的title文字
        return this.trendData.type.filter(item => {
          // 返回 item key属性的值 不等于 当前显示的类型
          return item.key !== this.showType
        })
      }
    },
    // 标题文字大小 用于适配
    titleStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        // 导入的vuex里面的方法,传入主题名称 设置主题里面的文字颜色 
        color: getThemeValue(this.theme).titleColor,
      }
    },
    // 给标题文字加 marginLeft 适配
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + 'px',
        backgroundColor: getThemeValue(this.theme).titleBackgroundColor,
        color: getThemeValue(this.theme).titleColor
      }
    },
    // 计算属性 主题切换 vuex    调用函数  将数据进行计算属性的映射
    ...mapState(['theme'])
  },
  // 对属性进行监听 主题切换
  watch: {
    theme() {
      console.log('主题切换了')
      this.chartInstance.dispose()    // 销毁当前图表
      this.initChart()            // 切换主题后 初始化数据对象
      this.screenAdapter()        // 屏幕适配
      this.updateChart()          // 数据的重新加载
    }
  },
  methods: {
    // 初始化 echarts对象
    initChart() {
      // 使用 index.html 导入的主题 chalk       this.theme使用计算属性切换主题 是vuex定义的变量
      this.chartInstance = this.$echarts.init(this.$refs.trendRef, this.theme)
      // 初始option
      const initOption = {
        xAxis: {
          // category 每一项
          type: 'category',
          // 距离坐标轴的间隙
          boundaryGap: false,
        },
        yAxis: {
          // value值 展示
          type: 'value',
        },
        // 直角坐标轴位置
        grid: {
          top: '20%',
          left: '4%',
          right: '4%',
          bottom: '5%',
          containLabel: true,     // 包含坐标轴文字
        },
        // 工具提示(移动鼠标展示提示)
        tooltip: {
          // 触发类型
          trigger: 'axis'
        },
        // 图例组件 标题
        legend: {
          // 标题位置
          top: '12%',
          left: '4%',
          // 图例图标为圆形
          icon: 'circle'
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
      // 半透明颜色值
      const colorArr = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      // x轴数据  月
      const xData = this.trendData.common.month
      // y轴数据   "地区销量趋势" 数据
      const mapData = this.trendData[this.showType].data
      // console.log(mapData)
      // map方法 根据调用函数处理后的值  返回一个新数组 允许键值对 
      const yData = mapData.map((item, index) => {
        return {
          // 图例文字数据 上海
          name: item.name,
          // 键值对
          type: 'line',
          data: item.data,
          // stack 数据堆叠  a放一个值
          stack: 'a',
          // areaStyle 填充颜色
          areaStyle: {
            // 线性渐变
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [   // 从上往下
              // 0%的颜色
              {
                offset: 0,
                color: colorArr[index]
              }, 
              // 100%的颜色
              {
                offset: 1,
                color: colorArr1[index]
              },
            ])  
          },
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
        series: yData,
      }
      // 数据option 显示图表   对initOption内容整合
      this.chartInstance.setOption(dataOption)
    },
    // 浏览器大小发生变化 会调用的方法 来完成屏幕适配
    screenAdapter() {
      // 文字大小
      this.titleFontSize = this.$refs.trendRef.offsetWidth / 100 * 3.5
      console.log(this.$refs.trendRef.offsetWidth + ' div 图表的宽度')
      console.log(this.titleFontSize + ' /100*3.5 之后的宽度 用于文字的适配大小')
      // 适配 option
      const adapterOption = {
        // 图例 大小控制
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,   // 间距
          // 标题文字样式
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      // 适配option 显示图表   对initOption dataOption 内容整合
      this.chartInstance.setOption(adapterOption)
      // 调用 resize进行屏幕适配、
      this.chartInstance.resize();
    },
    // 点击title标题的每一项
    handleSelect(currentType, currentText) {
      // 切换当前title显示的文字
      this.showType = currentType
      this.updateChart()

      this.currentSelect = currentText
      this.isShow = false


    },
  }

}
</script>

<style scoped>
.trend {
  width: 100%;
  height: 100%;
}

.title {
  position: absolute;
  top: 8px;
  left: 40px;
  z-index: 2;
  color: white;
  cursor:pointer
}
/* 下拉箭头 */
.dropDown {
  margin-left: .5rem;
  cursor:pointer
}
.select {
  background-color: #222733;
}

</style>