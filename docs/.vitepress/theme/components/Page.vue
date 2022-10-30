<template>
  <ShareCard />
  <div class="wrapper">
    <!-- 博客列表 -->
    <div class="wrapper-blog">
      <div class="blogList">
        <a
          class="blog"
          v-for="item in posts"
          :href="withBase(item.regularPath)"
        >
          <div class="title">{{ item.frontMatter.title }}</div>
          <div class="date">{{ item.frontMatter.date }}</div>
        </a>
      </div>

      <div class="pagination">
        <span @click="go('prev')"
          ><IconParkSolidArrowCircleLeft
          v-if="pageCurrent!==1"
            style="font-size: 40px"
          ></IconParkSolidArrowCircleLeft
        ></span>

         {{ pageCurrent }} / {{pagesNum}}  

        <span @click="go('next')" >
          <IconParkSolidArrowCircleRight
          v-if="pageCurrent!==pagesNum"
            style="font-size: 40px"
          ></IconParkSolidArrowCircleRight>
        </span>


        <!-- <div
            class="link"
            :class="{ activeLink: pageCurrent === i }"
            v-for="i in pagesNum"
            :key="i"
            @click="go(i)"
          >
            {{ i }} 
          </div> -->
      </div>
    </div>
    <!-- 关于作者 -->
    <div class="wrapper-info">
      <div class="profile">
        <div class="avator"></div>
        <div class="name">你好，我是April👋🏼</div>
        <div class="plate">
          <div>📄 博文</div>
          <div>🏷️ 分类</div>
          <div>🕧 归档</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import ShareCard from "./ShareCard.vue";
import { useData, withBase } from "vitepress";
import IconParkSolidArrowCircleLeft from "../../components/IconParkSolidArrowCircleLeft.vue";
import IconParkSolidArrowCircleRight from "../../components/IconParkSolidArrowCircleRight.vue";
const { theme } = useData();

// get posts
let postsAll = theme.value.posts || [];
// get postLength
let postLength = theme.value.postLength;
// get pageSize
let pageSize = theme.value.pageSize;
//  pagesNum
let pagesNum =
  postLength % pageSize === 0
    ? postLength / pageSize
    : postLength / pageSize + 1;
pagesNum = parseInt(pagesNum.toString());
//pageCurrent
let pageCurrent = ref(1);
// filter index post
postsAll = postsAll.filter((item) => {
  return item.regularPath.indexOf("index") < 0;
});
// pagination
let allMap = {};
for (let i = 0; i < pagesNum; i++) {
  allMap[i] = [];
}
let index = 0;
for (let i = 0; i < postsAll.length; i++) {
  if (allMap[index].length > pageSize - 1) {
    index += 1;
  }
  allMap[index].push(postsAll[i]);
}
// set posts
let posts = ref([]);
console.log(allMap[pageCurrent.value - 1]);
posts.value = allMap[pageCurrent.value - 1];

// click pagination
const go = (type) => {
  if (type === "prev") {
    if(pageCurrent.value>1)pageCurrent.value=pageCurrent.value-1;
  }else{
    if(pageCurrent.value<pagesNum)pageCurrent.value = ++pageCurrent.value;
  }
  posts.value = allMap[pageCurrent.value - 1];
};
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  margin: 0 auto;
}
.blog-title {
  text-align: center;
}
.blogList {
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.blog {
  width: 100%;
  display: flex;
  padding: 12px 0;
  margin: 10px;
  justify-content: space-between;
  border-bottom: 1px solid var(--c-blog-border);
  cursor: pointer;
}
.blog:hover {
  color: var(--vp-c-brand);
  text-decoration: none;
  border-bottom: 1px solid var(--vp-c-brand);
}
.title {
  font-size: 1.2em;
}
.date {
  padding-bottom: 7px;
}
.pagination {
  width: 100%;
  display: flex;
  align-items: center;
  user-select: none;
  justify-content: space-between;
  svg {
    user-select:all;
    cursor: pointer;
  }
  svg:hover{
    color: var(--vp-c-brand);
  }
}
.link {
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  border: 1px solid #282936;
  cursor: pointer;
  border-right: none;
  transition: 0.2s;
  border-radius: 2px;
}
.link:last-child {
  border-right: 1px solid #282936;
}
.link:hover {
  transform: translate(-1px, -1px);
}
.activeLink {
  background-color: var(--c-brand);
  color: white;
}
.wrapper {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  .wrapper-blog {
    flex-shrink: 0;
    width: 70%;
    .blogList {
    }
  }
  .wrapper-info {
    width: 30%;
    padding-top: 40px;
    .profile {
      width: 288px;
      height: 322px;
      border-radius: 8px;
      // background-color: var(--c-blog-bg);
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      .avator {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: url("../../images/avator.jpg") center center / cover
          no-repeat;
      }
      .name {
        margin: 12px 0;
        padding-bottom: 10px;
        border-bottom: 1px dashed var(--c-blog-border);
      }
      .plate {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        div {
          width: 100%;
          text-align: center;
          cursor: pointer;
          line-height: 30px;
          transition: all 0.5;
        }
        div:hover {
          color: var(--vp-c-brand);
        }
      }
    }
  }
}
</style>
