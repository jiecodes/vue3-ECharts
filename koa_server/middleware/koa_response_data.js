// 处理业务逻辑的中间件,读取某个json文件的数据
const path = require('path')
const fileUtils = require('../utils/file_utils')
module.exports = async (ctx, next) => {
  // 根据url  获取请求路径
  const url = ctx.request.url // /api/seller 路径   ../data/seller.json 项目中的文件
  let filePath = url.replace('/api', '') //  /seller
  filePath = '../data' + filePath + '.json'  // ../data/seller.json
  filePath = path.join(__dirname, filePath)   // filePath  获取到完整的绝对路径 
  // 成功之后所做的事情
  try {
    const ret = await fileUtils.getFileJsonData(filePath)
    ctx.response.body = ret     // 根据 utils->file_utils.js文件 设置响应体
    // 失败之后所做的事情
  } catch (error) {
    const errorMsg = {
      message: '读取文件内容失败, 文件资源不存在',
      status: 404
    }
    ctx.response.body = JSON.stringify(errorMsg)
  }
 
  console.log(filePath)
  await next()
}