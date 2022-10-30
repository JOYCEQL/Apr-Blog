---
title: 🎉用Echarts写一个低仿甘特图（具体到秒)
description: 技术demo
date: 2021-10-08
tags:
  - vue echarts
---

# 🎉用Echarts写一个低仿甘特图（具体到秒)


## 开始之前
前两天用Html原生标签配合Vue完成了一个低仿版的甘特图[相关文章](https://juejin.cn/post/7017643739849965575)，那么同样的功能用Echarts写起来有何不同？欲知详情，请按滚轮下滑😉。

老规矩，先来看看长啥样(大致功能点)



![echarts-gantt.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/559b29b46eef4e5299c92f1095595820~tplv-k3u1fbpfcp-watermark.image?)

## 做些准备
开发这样的一个小型甘特图需要准备些什么？

1.本文案例使用Vue和Echarts，交互上的组件使用了Element-ui。

2.Echarts的相关知识点(会看**文档**就行)。

## 梳理思路
简而言之就是魔改Echarts中的**横向柱状图**。跟上个Demo一样，在横向时间轴的渲染及给定区域上色是共同的核心点，不同的是这里面的点击类似事件没div中好处理(比较而言)，先提一嘴，我们后面会分析。
## 初始化
> 用vue脚手架脚手架创建一个项目(Vue2.x)，安装好Echarts和Element,**项目源码**在文末查看。
创建两个组件Home.vue和Gantt.vue，后者作为前者的子组件。在Home组件中使用

```js
 <Gantt :baseDate="baseDate" ref="gantt" :ganttData="ganttData" @getInfoCallback="getGanttInfo"  :roomData="roomData"></Gantt>
```
Gantt组件中接收了三个props值

```js
```
> baseDate：时间选择器,(yyyy-mm-dd格式)
> 
> roomData：左侧会议室数据，对应Y轴。
> 
> ganttData：甘特图内容数据。

## 要点分析
在前面的效果图中可以看到展示的是8:00到18:00，对应的是Echarts X轴的配置。

## 时间轴渲染

```js
        xAxis: {
          type: 'time',
          position: 'top',
          interval: 3600 * 1000,         // 以一个小时递增
          // max:`${this.baseDate} 24:00`,
          max: `${this.baseDate} 19:00`, // 设置最大时间为19点,不包括19点
          min: `${this.baseDate} 08:00`, //最小时间8点
          axisLabel: {
            formatter: function (value, index) {
              var data = new Date(value)
              var hours = data.getHours()
              return hours + ':00'
            },
            textStyle: {
              color: 'rgba(0,0,0,0.65)', // 更改坐标轴文字颜色
              fontSize: 14 // 更改坐标轴文字大小
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e5e5e5'
            },
            onZero: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        },
```
就是修改Echarts配置项中的xAxis对象，type设置为'time'，因为我们这里要用时间;顶部显示position为top；interval是以毫秒为单位的，所以这里我们换算成小时，再设置min和max区间就行了，这里用到了传入的时间**baseDate**。由于显示上的优化，横坐标的显示有做格式化，只显示**小时:00**。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a881e624dd84cd4a193ea311cf41189~tplv-k3u1fbpfcp-watermark.image?)
## 左侧类别渲染
home.vue

```js
  created(){
       this.roomData = [
          '会议室一',
          '会议室二',
          '会议室三',
          '会议室四'
        ]
    }
```

gantt.vue
```js
      yAxis: {
          inverse: true, // 是否反转
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#e5e5e5'
            }
          },
          data: this.roomData,   //会议室数据
          axisLabel: {
            textStyle: {
              color: 'rgba(0, 0, 0, 0.65)', // 刻度颜色
              fontSize: 14 // 刻度大小
            }
          }
        },
```
使用传入的roomData数据给到Echarts配置项中的yAxis，这里的inverse属性顾名思义，翻转Y轴，Echarts默认的Y轴数据是从下到上渲染的，假如你想翻过来，inverse设置为true即可。

## 主体内容渲染(核心)
前面提到的三个传入的props我们已经用了两个，ganttData该派上用场了，之所以是这样的结构，是因为Echarts数据格式是这么要求的。

Home.vue
```js
  created () {
    this.ganttData = [
      {
        value: [
          {
            index: 0,
            roomName: '会议室一',
            RoomId: '2234',
            id: '444',
            startTime: `${this.baseDate} 10:28`,
            endTime: `${this.baseDate} 12:28`,
            status: '0',
            content: '吃饭'
          }
        ]
      }
    ]
  },
```
Gantt.vue

```js
    series: [
          {
            type: 'custom',
            clickable: false,
            renderItem: function (params, api) {
              var categoryIndex = api.value(0).index // 使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
              var start = api.coord([api.value(0).startTime, categoryIndex]) //使用 api.coord(...) 将数值在当前坐标系中的值转换成为屏幕上的点的像素值。
              var end = api.coord([api.value(0).endTime, categoryIndex])
              var height = 40
              return {
                type: 'rect',  //矩形
                shape: echarts.graphic.clipRectByRect({
                 // 矩形的位置和大小。
                  x: start[0],
                  y: start[1] - height / 2,
                  width: end[0] - start[0],
                  height: height
                }, {
                  // 当前坐标系的包围盒。
                  x: params.coordSys.x,
                  y: params.coordSys.y,
                  width: params.coordSys.width,
                  height: params.coordSys.height
                }),
                style: api.style()
              }
            },
            label: {
              normal: {
                show: true,
                position: 'insideBottom',
                formatter: function (params) {
                  return params.value[0].content
                },
                textStyle: {
                  align: 'center',
                  fontSize: 14,
                  fontWeight: '400',
                  lineHeight: '30' 
                }
              }
            },
            encode: {
              x: [0], 
              y: 0      
            },

            itemStyle: {
              normal: {
                color: function (params) {
                  if (params.value[0].status === '1') return '#4dc394'
                  else return '#e5835b'
                }
              }
            },
    
            data: this.ganttData
          }
        ]
```
由于我们这个例子的特殊性，设置type属性值为'custom'，开启Ecahrts的自定义渲染函数renderItem，，
api.value(0)即为需要渲染的数据项。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2539db659ce04262b135f11b415c051f~tplv-k3u1fbpfcp-watermark.image?)
关于这里用到的详细api，可以查看Echarts官网关于这部分的详细说明，下面我们简要说明一下。
https://echarts.apache.org/zh/option.html#series-custom

### [renderItem(params,api)](https://echarts.apache.org/zh/option.html#series-custom.renderItem)
   
```js
    var categoryIndex = api.value(0).index 
    var start = api.coord([api.value(0).startTime, categoryIndex]) 
    var end = api.coord([api.value(0).endTime, categoryIndex])
    var height = 40
```
> categoryIndex就是拿到这一项数据在ganttData中的index值(已经给定的，非排序的index）。通过api.coord计算出这条数据在坐标系中的位置信息,即start和end数据。
> 
> height给定了40，没有用api去计算这一行的高度，原因是渲染占满一行感觉挺丑，读者可自行修改(参考上文链接)


```js
    x: start[0],
    y: start[1] - height / 2,
    width: end[0] - start[0],
    height: height
```

>根据计算出X,Y便得出了矩形在坐标系中的位置，并设置宽高

### [encode](https://echarts.apache.org/zh/option.html#series-custom.encode)

```js
    encode: {
      x: 1, // 这个例子中的可选参数,因为这个例子中的维度根据一个对象，可以写不为0参数或者不写这个参数。
      y: 0 // 把"维度0"映射到 Y 轴。
    },

```
如你所见，ganttData数据中的value数组里是一个对象。

```js
    this.ganttData = [
      {
        value: [
          {
            index: 1,
            roomName: '会议室二',
            RoomId: '123',
            id: '333',
            startTime: `${this.baseDate} 8:28`,
            endTime: `${this.baseDate} 9:28`,
            status: '1',
            content: '睡觉'
          }
        ]
      }
     ]
```
### itemStyle
很简单，根据不同的状态返回不同的**颜色**

```js
    itemStyle: {
          normal: {
            color: function (params) {
              if (params.value[0].status) return '#4dc394'
              else return '#e5835b'
            }
          }
        },
```
渲染的部分就告一段落，看看交互。
# 事件交互
鼠标移入图例显示缩略信息，点击新增或者编辑维护数据。

> Gantt.vue
## 鼠标移入

> 首先增加一个移入显示tooltip的功能，这部分其实也是配置，echarts中option的tooltip属性。


```js
     tooltip: {
          trigger: 'item',
          show: true,
          hideDelay: 100,
          backgroundColor: 'rgba(255,255,255,1)',
          borderRadius: 5,
          textStyle: {
            color: '#000'
          },
          formatter: function (params) {
            const item = params.data.value[0]
            return item.content + '<br/>' +
            (item.status==='1' ? '<span style="color:#4dc394;">已完成</span>'
              : '<span style="color:#e5835b;">进行中</span>') + '<br/>' +
              item.startTime + ' - ' + item.endTime
          }
        },
```
## 新增&编辑
这部分我开始做的时候其实有点小头疼，原因在于要区分点击区域，新增的内容应该隶属哪个会议室？修改的话修改的又是哪个?我是这么做的:

```js
  // 任意位置点击事件----注册双击
  myChart.getZr().on('click', params => {
    if (!params.target) {
    // 点击在了空白处，做些什么。
      const point = [params.offsetX, params.offsetY]
      if (myChart.containPixel('grid', point)) {
      // 获取被点击的点在y轴上的索引
        const idxArr = myChart.convertFromPixel({ seriesIndex: 0 }, point)
        const xValue = new Date(+idxArr[0]).getHours()
        const yValue = idxArr[1]
        const sendData = [xValue, yValue]
        this.$emit('getInfoCallback', sendData)
      }
    }
  })
  // 图例点击事件-返回数据给父组件---单击事件
  myChart.on('click', params => {
    this.$emit('getInfoCallback', params.data.value)
  })
}
```
使用Echarts提供的**任意区域点击事件**api根据params有没有targat属性来判断是**新增**还是**编辑**。

### 新增
进入if逻辑，yValue得到的是点击区域Y轴的索引值，也就是roomData对应会议室的索引值。
emit给父组件(Home）返回sendData:[横轴时刻，y轴的索引]，父组件中取第二项就可以拿到点击的对应会议室索引。
### 编辑
编辑则直接注册click事件，通过参数拿到图例的信息给父组件，你可能会问，为什么不在上面的if(!params.target）的else逻辑拿？因为没有，任意区域点击事件只返回它的**位置信息**。

Gantt.vue的逻辑就是这么简单。

### 小坑
有一个小坑，就是Echarts图例销毁，因为时间选择器选择之后要重新初始化Echarts，那么就需要先销毁再创建
```js
  myEcharts () {
      const container = document.getElementById('main')
      this.$echarts.init(container).dispose()
      var myChart = this.$echarts.init(container)
    }
```

> Home.vue

父组件中接受到子组件的数据就可以新增或者编辑，这里的逻辑看文末代码就可以直接明白。
值得一提的是一个数据的**注意点**

ganttData中的index要和roomData中会议室名字索引值一一对应，在工作中的话，这些数据全部由后端返回，读者可自行组织(该数据结构只适用于本案例)，大功告成😁。如果你看到了这里，点个赞再走吧，谢谢。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff50cab60f674928982e24d42a7a1f36~tplv-k3u1fbpfcp-watermark.image?)
# 项目源码
> [沙盒地址](https://codesandbox.io/s/vue-echarts-gantt-forked-z5kfk)
# 往期文章
[手写一个精确到秒的低仿甘特图](https://juejin.cn/post/7017643739849965575)

[Teleport，Vue3.0新特性里的"任意门](https://juejin.cn/post/7016866669968490532)

[移动端Picker组件滚动穿透问题踩坑](https://juejin.cn/post/7013600126715461640)

[Ant Design of Vue没有表格合计行api，换种思路](https://juejin.cn/post/7012784170128637966)

