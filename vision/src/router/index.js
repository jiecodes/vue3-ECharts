import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const SellerPage = () => import('@/views/seller/SellerPage.vue')
const TrendPage = () => import('@/views/trend/TrendPage.vue')
const MapPage = () => import('@/views/map/MapPage.vue')
const RankPage = () => import('@/views/rank/RankPage.vue')
const HotPage = () => import('@/views/hot/HotPage.vue')
const StockPage = () => import('@/views/stock/StockPage.vue')

const ScreenPage = () => import('@/views/ScreenPage.vue')

Vue.use(VueRouter)

const routes = [
  // 默认打开的页面   重定向
  {
    path: '',
    redirect: '/screenpage'
  },
  // 组件合并
  {
    path: '/screenpage',
    component: ScreenPage,
  },
  // 销售 商家销售统计(横向柱状图) 
  {
    path: '/sellerpage',
    component: SellerPage,
  },
  // 趋势 销量趋势图表(折线图)
  {
    path: '/trendpage',
    component: TrendPage,
  },
  // 地图 商家分布模块(地图和散点图) 
  {
    path: '/mappage',
    component: MapPage,
  },
  // 排行 销量排行模块(柱状图)
  {
    path: '/rankpage',
    component: RankPage
  },
  // 商品 销售商品占比模块(饼图)
  {
    path: '/hotpage',
    component: HotPage
  },
  // 库存 库存模块(圆环饼图)
  {
    path: '/stockpage',
    component: StockPage,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
 
export default router
