---
title: 用Div写一个低仿甘特图
description:  技术demo
date: 2021-10-11
tags:
  - vue
---

# 用Div写一个低仿甘特图


> 业务场景中，可能会有需要实现类似甘特图的需求，但是往往不需要太复杂的场景，可以不用那些强大的插件(比如[dhtmlxGantt](https://dhtmlx.com/docs/products/dhtmlxGantt/))。于是手写一个简单的就足以应对普通场景。

> **顺便一提，本文的demo以一天为基准，具体到秒。**
## 蓝图
一个简易版的甘特图需要哪些功能?

首先，最直观的是可以根据日期看到各种事项，其次，可以新增或者编辑事项。其他功能（比如**拖动**）我们暂不考虑。

最终效果如下（本文以**会议室预约**为例，使用了Vue+ElementUI)

![gantt1.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0eaca02821504ba78c4d6b9ad50805bd~tplv-k3u1fbpfcp-watermark.image?)
## 分析

整体结构分为**操作区**和**展览区**，前者可以改变时间、新增事项，后者除了展示之外，可以点击已经安排或者空白区域的时间段新增或者编辑。甘特图的难点是什么？于我而言就是怎么去做这个展示区域如何比较精确的渲染到合适的区域。




## 实现

展示区分为两部分，分别是上方的**时刻区域**和下方的**内容区域**，内容区域左侧是对应的会议室，右侧是这个会议室一天的安排。我们先抛开逻辑看一部分templete模版代码。

```js
<template>
     //时刻区
      <div class="time-bar clear">
        <div class="gui-table clear">
          <li
            :style="{width: 100/(config.endTime-config.startTime+1)+'%'}"
            v-for="(item, index) in (config.endTime-config.startTime+1)"
            :key="index"
          >
            <span><span v-if="config.startTime+index<10">0</span>{{config.startTime+index}}:00</span>
            <div class="gui-cle"></div>
            <div class="gui-lit"></div>
          </li>
        </div>
      </div>
      //内容展示区
      <div
        class="info"
        style="margin-top: 2px;overflow:auto;"
        :style="{height:'auto'}"
      >
        <div id="gui-content">
          <div
            class="gui-content gui-list clear room-gui-list"
            v-for="room in roomList"
            :key="room.roomId"
          >
            <div
              id="roomName"
              class="fasten ellipsis"
              :title="room.name"
            >{{room.name}}</div>
          <div class="gui-tab">
              <li
                v-for="(o) in (config.endTime-config.startTime+1)"
                :key="o"
                :style="{width: 100/(config.endTime-config.startTime+1)+'%',cursor:'pointer'}"
              ></li>
          </div>
            <template v-if="room.roomId">
              <div
                    v-for="(item, index) in room.roomData"
                    :key="index"
                    class="meet-item-one"
                    v-bind:class="[!item.status?'meet-color-having':'meet-color-finished']"
                    :title="item.content"
                    :style="{left:getLeftTime(item.startTime)+'%',width:getWidth(item)+'%'}"
                    v-show="getWidth(item)!=0"
                  >
                    <p
                      class="ellipsis"
                    >{{item.content}}</p>
                  </div>
            </template>
          </div>
        </div>
      </div>
 </template>
```
> 时刻区域的时间刻度给定一个可以配置的config对象，并根据这个区间操作得出个数及其宽度，也就是均分的一个状态，正如我们看到的那样。

```js
   config: {
        startTime: 6,
        endTime: 18
   },
```
> 内容区域初始的时候是没有任何数据的，渲染的逻辑同上，最终循环生成li标签，不同的是这些li标签都加上了边框，这里好像是废话。。。重点来了，渲染对应的时刻区间内**上色**，使用定位div的方式覆盖在原来的模版上，这样就有两个问题，一是确定div的**位置**，二是计算div的**宽度**，这两个值对应style的left和width，使用两个函数计算。

**getLeftTime**


```js
getLeftTime (cTime) {
  const dTime = new Date(cTime).getTime()
  const leftTime = new Date(this.chooseDate + ' ' + this.config.startTime + ':00:00').getTime()
  if (leftTime >= dTime) {
    return 12
  } else {
    const time = (dTime - leftTime) / 1000 
    const leftPercent = time / ((this.config.endTime - this.config.startTime + 1) * 60 * 60) * 100 * 0.88 + 12
    if (leftPercent < 100) {
      return leftPercent
    } else {
      return 100
    }
  }
},
```
**getWidth**

```js
   getWidth (item) {
      const _left1 = this.getLeftTime(item.startTime)
      const _left2 = this.getLeftTime(item.endTime)
      return _left2 - _left1
    },
```
> **getLeftTime**的逻辑将选择的时间与当前时间比较，如果选择的时间大于当前事项的时间区间，返回12，此时left是12%，之所以是12是因为左侧会议室的宽度为12%，那么此时的宽度width就是_left2 - _left1=0,故不上色；
> 
> 当走到else逻辑，将时间戳由毫秒转为秒计算，leftPercent即为left的百分比值，因为右侧是占了88%，左侧是占了百分之12，而left的计算是从最左侧开始(定位)，所以要乘以88%在加上左侧的12。

说了这么多逻辑，我们看看需要的数据长啥样

```js
  data () {
      return {
        roomList: [
            {
              roomId: '1123',
              name: '一号会议室',
              roomData: [
                {
                  roomId: '1123',
                  id: '223865',
                  status: 0,
                  startTime: '2021-01-14 8:10:00',
                  endTime: '2021-01-14 10:00:00',
                  content: '商量产品选型'
                }
              ]
            },
            {
              roomId: '23234',
              name: '二号会议室',
              roomData: [
                {
                  roomId: '1123',
                  id: '879786',
                  status: 1,
                  startTime: '2021-01-14 14:00:00',
                  endTime: '2021-01-14 16:00:00',
                  content: '方案修改计划'
                }
              ]
            }
          ]
       }
     }
```
roomList即为数据格式，实际业务中可以同后端协商具体的格式，实现方法大同小异。由于这里的demo是纯前端实现，新增的逻辑就是找到对应的会议室数据，将form表单push到roomData中区(编辑功能类似)，完整的代码实现请查看**文末项目地址**。
## 总结
除了本文的实现方式之外，Echarts也可以，点击查看[🎉用Echarts写一个低仿甘特图（具体到秒)](https://juejin.cn/post/7020213150473535524)

## 项目地址
> [项目地址](https://codesandbox.io/s/vue-gantt-h8948)