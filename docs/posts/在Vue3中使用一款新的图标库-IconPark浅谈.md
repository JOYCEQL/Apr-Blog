---
title: 在Vue3中使用一款新的图标库-IconPark浅谈
description: 开源分享
date: 2022-10-30
tags:
  - icon
---

# 在Vue3中使用一款新的图标库-IconPark浅谈

在日常的开发中，或是为了提高开发效率，或是为了换种方案解决问题，我们可能会需要借助一些工具，所谓"工欲善其事,必先利其器"。话不多说，我们切入正题！


## 它是谁
说到图标,很难绕过iconfont，今天介绍的是由字节开源的图标库-iconPark

[官网](https://iconpark.oceanengine.com/home)


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6922bed54c2d4b45b7cff0ed0881a714~tplv-k3u1fbpfcp-watermark.image?)

iconPark的官方图标库提供了**2437**个图标，能够满足大部分场景下的使用相比于IconFont给我最直观的感受就是图标的统一性很强,分类清晰，最重要的是很强大,这套图标库可以用于Vue/React端,由于我在工作中使用的是vue技术桟，正巧在最近的Vue3项目中使用了IconPark,下面我们就来聊聊。

注：以下例子仅在Vue3项目中使用，Vue2.X用法相似,可阅读官方文档了解

## 怎么用

这里我们使用npm包的方式引入,首先我们需要建立一个Vue3的项目(使用webpack)

#### npm安装

`npm install @icon-park/vue-next`


#### 按需引入
找到项目根目录下的 **babel.config.js**添加如下代码

```js
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'import',
      {
        libraryName: '@icon-park/vue-next',
        libraryDirectory: 'es/icons',
        camel2DashComponentName: false
      },
      'icon'      // 多个组件库时需要加上这个属性,不重复即可。
    ]
  ]
}

```
需要注意的是，你如果要按需引入多个组件库,那么就需要为组件库注明name,否则会报错。
#### 渐入佳境

由于在main.js中引入大量组件代码可能不太美观，我将这部分抽离出去放在一个js中维护

src目录下新增 plugins目录,用ES6语法引入并注册


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d329371c614483da7425120f3ab8446~tplv-k3u1fbpfcp-watermark.image?)


```js
import { Play } from '@icon-park/vue-next'
export function IconPark (app) {
  app.component('Play', Play)
}
```
main.js里

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { IconPark } from '@/plugins/iconPark'
const app = createApp(App)
IconPark(app)
app.use(store).use(router).mount('#app')

```

可以看到，上面的IconPark函数传入一个参数app,执行了app.component,引入的图标以组件的形式被全局注册，于是意味着这些图标会以组件的形式使用。

#### 来个图标
`<play  theme="filled" size="60" fill="#3a5de7" />
`

渲染到页面上
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61d70f6a750e48809230cec72fcd95f9~tplv-k3u1fbpfcp-watermark.image?)

当然，颜色，大小，格式等等,官网都提供了灵活的配置,可以自行选择,如果你觉得这2000多个图标还不够用，或者说没你想要的，可以给官方给出补充建议。好吧，我们聊到这里。
