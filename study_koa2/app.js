// 1 创建koa对象
// 导入koa
const Koa = require('koa')
// 创建koa实例对象
const app = new Koa()

// 2 编写响应函数(中间件)
// ctx 上下文 就是web容器   作用: ctx.request拿到请求对象 ctx.response拿到响应对象
// next 下一个中间件 下一个中间件是否能够得到执行,取决于next函数有没有调用
app.use((ctx, next) => {
  //           打印俩次 第一次是输入地址回车后打印的 第二次是浏览器会自己发送网络图标的请求
  console.log('第一次中间件   1')
  // 设置请求体
  ctx.response.body = 'hello word'
  next();
  console.log('第一次中间件  2')
})
app.use(async (ctx, next) => {
  console.log('第二次中间件   1')
  const res = await next();
  console.log(res)      // 接收的是promise  用async和await接收 简化promise
  console.log('第二次中间件   2')
})
app.use((ctx, next) => {
  console.log('第三次中间件')
  return '字 符 串'
})
// 3 监听端口
app.listen(3000, () => {
  console.log('127.0.0.1:3000')
})

