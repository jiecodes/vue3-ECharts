const theme = {
  chalk: {
    // 背景颜色
    backgroundColor: '#161522',
    // 标题的文字颜色
    titleColor: '#ffffff',
    // 左上角logo的图标路径
    // logoSrc: 'logo_dark.png',
    logoSrc: 'logo_dark1.jpeg',
    // 切换主题按钮的图片路径
    themeSrc: 'qiehuan_dark.png',
    // 页面顶部的边框图片
    headerBorderSrc: 'header_border_dark.png'

  },
  vintage: {
    // 背景颜色
    backgroundColor: '#eeeeee',
    // 标题的文字颜色
    titleColor: '#000000',
    // Trend.vue专用  下拉背景色 自己添加
    titleBackgroundColor: '#ffffff',
    // 左上角logo的图标路径
    // logoSrc: 'logo_light2.png',
    logoSrc: 'logo_light1.jpeg',
    // 切换主题按钮的图片路径
    themeSrc: 'qiehuan_light.png',
    // 页面顶部的边框图片
    headerBorderSrc: 'header_border_light.png'
  }
}
// 导出函数 根据传入的themeName(chalk vintage) 来判断return出哪一个对象
export function getThemeValue (themeName) {
  return theme[themeName]
}
