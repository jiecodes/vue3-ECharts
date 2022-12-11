<template>
<!--  用于展示的组件 子组件   商家分布模块(地图和散点图)  -->
  <div class="comContainer" @dblclick="revertMap">
    <div class="map" ref="mapRef"></div>
  </div>
</template>

<script>
import axios from 'axios'
// 导入 中国省份文字转换为拼音 json文件
import { getProvinceMapInfo } from '@/utils/map_utils.js'

export default {
  data() {
    return {
      // chart图表 初始化
      chartInstance: null,
      // 获取到的趋势折线图
      mapData: [],
      // 获取到的每一个省份矢量数据
      provinceData: {}
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
          // 放大地图
          top: '5%',
          bottom: '5%',
          itemStyle: {
            // 中国地图背景色
            areaColor: '#2E72BF',
            // 省份间隔颜色 边框颜色 border
            borderColor: "#fff"
          },
        },
        // 标题 文字
        title: {
          text: '▎商家分布',
          left: 20,
          top: 30,
        },
        // 图例组件
        legend: {
          top: 20,
          // 图例列表的布局朝向
           orient: 'vertical',
        },
      }
      // 设置初始option 数据显示图表  
      this.chartInstance.setOption(initOption)
      // 监听 chart点击  echarts内置方法 on       用户点击的是哪个区域 用形参arg
      this.chartInstance.on('click', async (arg) => {
        // 得到点击的哪个省份
        console.log(arg)
        // arg.name 得到中国的省份 但是是中文的 引入包(map_utils.js) 转换为拼音 因为province文件夹是拼音的
        const provinceInfo = getProvinceMapInfo(arg.name)
        // 导入包(map_utils.js) 文字转换拼音之后 每个省的信息
        console.log(provinceInfo)
        // 判断当前点击的省份数据 是否在provinceData中保存着  俩次点击相同的省份就好保存着   浏览器 网络中查看
        if (!this.provinceData[provinceInfo.key]) {
          // 获取每一个省份的矢量信息
          const resProvince = await axios.get('http://localhost:8899/' + provinceInfo.path)
          // 对省份的矢量信息进行缓存 缓存key(每个省份的拼音)  点击俩次一样的省份就不用再次请求数据
          this.provinceData[provinceInfo.key] = resProvince.data
          // 获取点击的省份的矢量数据
          console.log(resProvince)
          // 每个省份注册到全局echarts对象中    第一个参数是别名(省份的拼音)  第二个参数是数据(省份的矢量数据)
          this.$echarts.registerMap(provinceInfo.key, resProvince.data)

        }
        // 切换地图的显示 每个省份信息 
        const changeOption = {
          // 显示省份地图
          geo: {
            map: provinceInfo.key
          }
        }
        // 整个echarts实例对象f
        this.chartInstance.setOption(changeOption)
      })
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
      // 图例组件数据
      const legendData = this.mapData.map(item => {
        return item.name
      })
      // 处理图表需要的数据
      const seriesArr = this.mapData.map(item => {
        // 如果想在地图上使用散点图 需要给散点图表 添加一个配置  coordinateSystem: 'geo',
        // return的对象代表一个类下的所有散点图数据
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          // 地图和散点图结合
          coordinateSystem: 'geo',
          // 涟漪效果
          rippleEffect: {
            // 规模
            scale: 10,
            // 波纹的绘制方式  空心
            brushType: 'stroke', 
          }
        }
      })
      // 数据option
      const dataOption = {
        // 图例组件
        legend: {
          // 图裂的值
          data: legendData,
        },
        // 系列
        series: seriesArr,
      }
      // 数据option 显示图表   对initOption内容整合
      this.chartInstance.setOption(dataOption)
    },
    // 浏览器大小发生变化 会调用的方法 来完成屏幕适配
    screenAdapter() {
      // 获取图表div的宽度
      const titleFontSize = this.$refs.mapRef.offsetWidth / 100 * 3.5
      console.log(titleFontSize + '标题文字大小')
      // 适配 option
      const adapterOption = {
        // 图例 大小控制
        legend: {
          itemWidth: titleFontSize  / 2,
          itemHeight: titleFontSize / 2,
          // 图例之间的间隔
          itemGap: titleFontSize / 2,
          // 图例文字
          textStyle: {
            fontSize: titleFontSize / 2,
          }
        },
        // 标题
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
      }
      // 适配option 显示图表   对initOption dataOption 内容整合
      this.chartInstance.setOption(adapterOption)
      // 调用 resize进行屏幕适配、 地图能适配代码
      this.chartInstance.resize();
    },
    // 双击每一个省份地图 恢复中国地图
    revertMap() {
      const revertOption = {
        // 显示地图
        geo: {
          // 'china' 在 initOption指定了
          map: 'china'
        }
      }
      // 整个 echarts实例对象
      this.chartInstance.setOption(revertOption )
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