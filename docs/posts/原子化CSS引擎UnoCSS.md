---
title: 原子化CSS引擎UnoCSS
description: 开源分享
date: 2022-10-30
tags:
  - css
---

# 原子化CSS引擎UnoCSS


## 前言

原子化CSS(Atomic CSS）是近年来提出的一种架构方式，与之有区别的是我们比较常用的组件化书写方式。今天介绍的是AntFu的开源新作原子化CSS引擎—UnoCSS。

AntFu 在开发Vitesse是使用 [Tailwind CSS](https://tailwindcss.com/) 作为 Vitesse 的默认 UI 框架。但由于 Tailwind 生成了数 MB 的 CSS，使得加载与更新 CSS 成为了整个 Vite 应用的性能瓶颈。后来作者发现了[Windi CSS](https://cn.windicss.org/)，相比于 [Tailwind CSS](https://tailwindcss.com/) 具有按需加载，零依赖等特性。

由于作者是vite团队成员，所以该文案例所用的构建工具也将选用vite

案例技术桟：Pnpm+Vite+Vue3

## 什么是原子化

John Polacek 在 [文章 Let’s Define Exactly What Atomic CSS is](https://css-tricks.com/lets-define-exactly-atomic-css/) 中有一个定义：

> Atomic CSS is the approach to CSS architecture that favors small, single-purpose classes with names based on visual function

译文：

> 原子化 CSS 是一种 CSS 的架构方式，它倾向于小巧且用途单一的 class，并且会以视觉效果进行命名。

单纯的定义并不够直观，你可以理解为下面的CSS书写方式就是原子化CSS，仔细发现它的类名和样式值是有着强关联的。

这是一个简单的例子

```HTML
<div  class="m-0 text-red" /> 
```

```CSS
.m-0 {
  margin: 0;
}
.text-red {
  color: red;
}
/* ... */
```

## 原子化vs组件化

### 原子化

1. 减少了CSS体积，提高了CSS复用

2. 减少起名的复杂度

3. 增加了记忆成本 将CSS拆分为原子之后，你势必要记住一些class才能书写，哪怕tailwindCSS提供了完善的工具链，你写background，也要记住开头是bg

4. 可能会造成class名过长的问题

### 组件化

5. CSS体积增加

6. 起名难

综上，原子化和组件化相结合似乎是更好的方向。

# 常见原子化CSS框架

在正式介绍UnoCSS之前，我们先来了解几个知名度高的同类思维CSS框架，热度比较高的有以下两种。

## [TailwindCSS](https://tailwindcss.com/)

> 😃 持续迭代，目前已发布3.0

知名度最高的一款CSS框架，2.0版本增加了深色模式，JIT引擎(预先扫描源代码 ，按需编译所有CSS)，相比传统的旧版本Tailwind，保持了开发和生产环境的一致(旧版本使用开发环境未处理，生成的 CSS 文件会有数 MB 的大小，生产环境使用了[PurgCSS](https://www.tailwindcss.cn/docs/optimizing-for-production#purge-css-options)删除未使用的CSS)

最新发布了3.0版本，默认开启JIT引擎(2.0需要手动开启)

## [Windi CSS](https://cn.windicss.org/)

维护恐成难题

WindiCSS是以 [TailwindCSS](https://www.tailwindcss.cn/)为灵感制作的库，并且兼容了 TailwindCSS，零依赖，也不要求用户安装 PostCSS 和 Autoprefixer，提供了更快的加载时间和热更新，同样支持按需生成，AntFu大佬在2021年的测试结果如下，HMR有100倍的效果。值得一提的是，WindCSS增加了属性模式，这意味着你可以以写属性的形式去写class名。

![未知文件名](%E5%8E%9F%E5%AD%90%E5%8C%96CSS%E5%BC%95%E6%93%8EUnoCSS%203a08f7ec-a319-4dcb-a858-7104f3e11c7d/%E6%9C%AA%E7%9F%A5%E6%96%87%E4%BB%B6%E5%90%8D)

# UnoCSS

Windi CSS已经足够优秀，但Antfu仍旧没有满意，框架预设外的自定义工具的额外配置仍旧比较繁琐，不够灵活；所以他重新构想了原子化CSS，UnoCSS得以诞生。

> [UnoCSS](https://github.com/antfu/unocss) - 具有高性能且极具灵活性的即时原子化 CSS 引擎。

之所以把它称作引擎，是因为没有像TailwindCSS，WindI CSS那样提供核心的应用程序，所有能力由预设提供，突出核心：按需使用。

## 关于作者

知名开源作者AntFu [Github](https://github.com/antfu)，Vite，Nuxt团队核心人员，Slidev作者

![未知文件名](%E5%8E%9F%E5%AD%90%E5%8C%96CSS%E5%BC%95%E6%93%8EUnoCSS%203a08f7ec-a319-4dcb-a858-7104f3e11c7d/%E6%9C%AA%E7%9F%A5%E6%96%87%E4%BB%B6%E5%90%8D%201)

## 预设(presets)

unoCSS官方默认提供了三种预设

7. @unoCSS/preset-uno 工具类预设

8. @unoCSS/preset-attributify 属性化预设

9. @unoCSS/preset-icons 图标类icon支持

安装一波~😎

```Shell
pnpm i -D unoCSS @unoCSS/preset-uno @unoCSS/preset-attributify @unoCSS/preset-icons
```

在vite.config.ts中引入，unoCSS作为插件在vite中使用

```TypeScript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unoCSS/vite'
import { presetUno, presetAttributify, presetIcons } from 'unoCSS'

import transformerDirective from "@unoCSS/transformer-directives";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  UnoCSS({
    presets: [presetUno(), presetAttributify(), presetIcons()],
    transformers: [transformerDirective()],
  })],
})
```

安装vscode插件，获得良好的输入提示。

![未知文件名](%E5%8E%9F%E5%AD%90%E5%8C%96CSS%E5%BC%95%E6%93%8EUnoCSS%203a08f7ec-a319-4dcb-a858-7104f3e11c7d/%E6%9C%AA%E7%9F%A5%E6%96%87%E4%BB%B6%E5%90%8D%202)

### @unoCSS/preset-uno

这个预设提供了流行的实用程序优先框架的通用超集，包括Tailwind CSS，Windi CSS，Bootstrap，Tachyons等

比如 `ml-3`（Tailwind），`ms-2`（Bootstrap），`ma4`（Tachyons），`mt-10px`（Windi CSS）

这些写法都会生效

```HTML
<div w-20 h-20 bg-blue  ml-3 ms-2 ma4 mt-10px />
```

### @unoCSS/preset-attributify

继承了WindiCSS的属性化模式，简化了书写class，以属性的形式去写class，但是在使用组件的时候，较大可能出现属性太多，容易混淆的情况。

```HTML
  <button
    bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
    text="sm white"
  >
    Click
  </button>
```

### @unoCSS/preset-icons

UnoCSS提供了图标的预设，它是纯CSS的图标，可以选择[Icones ](https://icones.js.org/)或 [Iconify](https://icon-sets.iconify.design/)作为图标源使用，同样也支持自定义icon，本身实现按需加载。

10. 安装

```YAML
// 安装全部，大概140多M，开发时会安装，打包只会使用用到的图标
pnpm i -D @unoCSS/preset-icons @iconify-json

// 安装某个图标集合
pnpm i -D @unoCSS/preset-icons @iconify-json/icon集合id(例如icon-park-twotone）
```

https://icones.js.org/collection/icon-park-twotone 中的 icon-park-twotone 即为这个Icon集合 id

![未知文件名](%E5%8E%9F%E5%AD%90%E5%8C%96CSS%E5%BC%95%E6%93%8EUnoCSS%203a08f7ec-a319-4dcb-a858-7104f3e11c7d/%E6%9C%AA%E7%9F%A5%E6%96%87%E4%BB%B6%E5%90%8D%203)

11. 使用

以[Icones ](https://icones.js.org/)集合为例，复制i开头或者点击UnoCSS得到类名。

![未知文件名](%E5%8E%9F%E5%AD%90%E5%8C%96CSS%E5%BC%95%E6%93%8EUnoCSS%203a08f7ec-a319-4dcb-a858-7104f3e11c7d/%E6%9C%AA%E7%9F%A5%E6%96%87%E4%BB%B6%E5%90%8D%204)

```HTML
<div class="i-icon-park-twotone-winking-face"> </div>
```

12. 多色图标

直接设置color值即可，属性化模式示例，color-blue

```HTML
<div i-icon-park-twotone-winking-face colo text-size-100px  color-blue> </div>
```

13. 额外属性

可以提供额外的 CSS 属性来控制图标的默认行为，默认情况下图标内联示例:

```TypeScript
// vite.config.ts

presetIcons({
  extraProperties: {
    'display': 'inline-block',
    'vertical-align': 'middle',
    // ...
  },
})
```

更多查看https://github.com/unoCSS/unoCSS/tree/main/packages/preset-icons



  ## 插件(plugins)


  ### @unoCSS/transformer-directives

  官方提供了这个插件实现在style中使用apply指令写原子化CSS

```TypeScript
  export default defineConfig({
    plugins: [
      vue(),
      UnoCSS({
        ...
        transformers: [transformerDirective()]
      })
    ]
  });
```

## 规则(rules)

除了官方默认的工具类外，支持自定义CSS规则，配置rules数组即可，支持方式1和方式2(正则匹配)两种。

```TypeScript
// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({
      ...
      rules: [
        // 方式1
        [ 
          "p-a", 
          {  
            position: "absolute",
          }
        ],
        // 方式2
        [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}px` })]
      ],

    })
  ]
});
```

项目中使用时会解析成对应的CSS样式，`<div class="m-20"></div>` 对应的style为

```SCSS
.m-20{
  margin : 5px;
}
```

值得一提，在安装了UnoCSS提供的VsCode插件后，这些自定义的部分同样会提示出来。

# 纯CSS图标

顾名思义，不含有任何js元素，纯CSS实现。

## 现有方案

有个名为 [css.gg](https://github.com/astrit/css.gg) 的纯 CSS 图标解决方案，它完全通过伪元素（`::before`，`::after`）来构建图标，使用这种方案需要对CSS工作原理有着深刻理解。

## UnoCSS中的方案

另一种方案，是将svg转换成dataurl，AntFu这里使用了Base64，并做了一系列优化，也就是说我们看到的图标其实是图片，配合CSS的mask属性可以轻松实现多色图标。

![未知文件名](%E5%8E%9F%E5%AD%90%E5%8C%96CSS%E5%BC%95%E6%93%8EUnoCSS%203a08f7ec-a319-4dcb-a858-7104f3e11c7d/%E6%9C%AA%E7%9F%A5%E6%96%87%E4%BB%B6%E5%90%8D%205)

14. 处理svg字符串，转为dataurl

```JavaScript
const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
```

svg本身是文本格式，转为Base64会变大，因此需要优化大小。

15. 优化-减小体积

```TypeScript
// https://bl.ocks.org/jennyknuth/222825e315d45a738ed9d6e04c7a88d0
// https://codepen.io/tigt/post/optimizing-svgs-in-data-uris

// 编码器
function encodeSvg(svg: string) {
    return svg.replace('<svg', (~svg.indexOf('xmlns') ? '<svg' : '<svg xmlns="http://www.w3.org/2000/svg"'))
      .replace(/"/g, '\'')
      .replace(/%/g, '%25')
      .replace(/#/g, '%23')
      .replace(/{/g, '%7B')
      .replace(/}/g, '%7D')
      .replace(/</g, '%3C')
      .replace(/>/g, '%3E')
  }
  
  const dataUrl = `data:image/svg+xml;utf8,${encodeSvg(svg)}`       
```

16. 输出结果：传入svg字符串运行encodesvg方法我们会得到如下格式的url，最小编码的url诞生。

```HTML
%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%3E%3Cpath%20d%3D%22M224%20387.814V512L32%20320l192-192v126.912C447.375%20260.152%20437.794%20103.016%20380.93%200%20521.287%20151.707%20491.48%20394.785%20224%20387.814z%22%2F%3E%3C%2Fsvg%3E
```

# 写在最后

对比TailWindCSS，UnoCSS可能显得并不是很出类拔萃，但它有着更小，更灵活的优势；对一个开源项目来讲，开坑并不难，难的是维护，对比TailWindCSS一个公司级维护的项目，UnoCSS仍旧有着很长的路要走。

# 参考资料

17. [重新构想原子化CSS](https://antfu.me/posts/reimagine-atomic-css-zh)

