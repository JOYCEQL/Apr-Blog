---
title: Teleport-Vue3.0新特性里的任意门
description: vue3新特性
date: 2021-10-09
tags:
  - vue3
---


# Teleport-Vue3.0新特性里的任意门

## 前言
在正式介绍Teleport之前，我们先来看看这个新特性实现的效果：点击上方按钮时下方出现Action面板弹层，
在H5中很常见的功能，比如Modal,Toast，PC端组件库的Dialog等。


![teleport1.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17ee98acb78e42b8806730d30eed06d1~tplv-k3u1fbpfcp-watermark.image?)


按照我们的思路这个弹层Dom位置上应该在最顶层，便于控制显示层级，避免嵌套导致的CSS层级问题。而逻辑上我们会将这部分代码作为**子组件**作用到它应该隶属的父组件中，便于管理。需要注意一点，这里说的是逻辑上，因为Dom已不在父组件中。

先来一个问题，在Vue2.X中如何实现一个类似的效果？
##  Teleport是什么
[官方文档](https://v3.cn.vuejs.org/guide/teleport.html#%E4%B8%8E-vue-components-%E4%B8%80%E8%B5%B7%E4%BD%BF%E7%94%A8)

Teleport是Vue3中新增的**内置组件**，它可以将被包含的节点挂载到指定的dom节点下。比如本文的案例，挂载到Body下与`<div id="app"></div>`同级(在第三方组件库中经常能够看到此类效果)，使用方法很简单，添加一个**to**属性，指定目标位置，

**to： 必填的属性，HtmlElement或选择器，比如 p, .class， #id等**

```js
 <teleport to="body">
      <div>内容</div>
 </teleport> 
```
上面的代码将会被插入到body标签下，与#app同级。我准备了一个完整的例子。
## 用Teleport实现一个Action面板

这里使用vite创建，原因很简单-快
```js
yarn create @vitejs/app my-vue-app --template vue
```
项目里使用了less，需要安装less和less-loader

创建两个组件,一个**父组件**（HelloWord.vue），一个**子组件**(Action.vue)

HelloWord.vue

```js

<template>
  <div class="">
    <button class="btn" @click="openAction">打开Action</button>
    <Action
      :show="showAction"
      @close="showAction = false"
      :options="options"
    ></Action>
  </div>
</template>
 
<script>
import Action from "./Action.vue";
import { ref } from "vue";
export default {
  name: "Hello",
  components: {
    Action,
  },
  setup() {
    const showAction = ref(false);

    const options = ["选项1", "选项2", "选项3", "选项4"];

    const openAction = () => {
      showAction.value = true;
    };

    return {
      showAction,
      options,
      openAction
    };
  },
};
</script>
 
<style scoped >
.btn {
  background-color: pink;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
```
Action.vue

```js

<template>
  <teleport to="body">
    <transition name="action-fade">
      <div v-if="show" class="action-list" @click="$emit('close')">
        <div class="action-wrapper" @click.stop>
          <div class="action-container">
            <li v-for="(item, index) in options" :key="index"  @click="clickThis(item)">
              {{ item }}
            </li>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script>
export default {
  name: "Action",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    clickThis(item) {
      this.$emit("close");
      alert(item);
    },
  },
};
</script>

<style lang="less">
.action-list {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.action-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.action-container {
  width: 100%;
  max-height: 300px;
  padding: 10px 0;
  overflow-y: auto;
  z-index: 9999;
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
.action-container li {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 60px;
  list-style: none;
}
.action-container li:active {
  background: #f2f3f5;
}

.action-body {
  margin: 20px 0;
}


.action-fade-enter-active,
.action-fade-leave-active {
  transition: opacity 0.3s;
  .action-wrapper {
    transition: all 0.3s;
  }
}

.action-fade-enter-from,
.action-fade-leave-to {
  opacity: 0;
  .action-wrapper {
    transform: translate3d(0, 100%, 0);
  }
}
</style>

```

整体的布局采用**定位**，使用**transation**组件丰富了一下过渡效果。Action组件使用了teleport组件，to属性的值是**body**标签。我们来看下渲染后的Dom结构。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d55ec950d9a4912a43c81047be8ce53~tplv-k3u1fbpfcp-watermark.image?)
观察上图可以看到，Action组件里的内容渲染到了body下，并与app根组件同级。


那么问题来了，我想在Vue2.X中将这个Action组件渲染到任意节点下下要怎么做?，原理就是将Action组件作为子节点动态添加或者移除于该节点，感兴趣的同学可以看下。现在我们来看一下Element部分源码的实现，实际上就是给用代码给Body下添加了弹出层Dom，在组件销毁时移除了这部分Dom。

## Element部分源码

这部分代码位于 packages/dialog/src/component.vue，只保留相关逻辑。
visible控制Dialog的显隐，appendToBody的el-dialog的props,这里值得一提的是组件销毁后移除了body下面的Dialog，这是由于Dialog组件实际上是渲染到了body节点下面，不执行removeChild会出现bug。

```js
  watch: {
      visible(val) {
        if (val) {
          if (this.appendToBody) {
            document.body.appendChild(this.$el);
          }
        } 
      }
    }，
    destroyed() {
     // if appendToBody is true, remove DOM node after destroy
      if (this.appendToBody && this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    }
```



## 总结
本文的代码案例很简单，如果你想要封装的彻底易用一些，可以使用**插槽(slot)** 。文章开头有提到，Toast，Modal，Dialog等等都可以用Teleport来实现，是不是很简单。

我们好像通篇都在讲将Teleport组件to到Body下，别忘了，它的选择是多样的。

## 源码沙盒地址
https://codesandbox.io/s/vue3-teleport-6dwg9


