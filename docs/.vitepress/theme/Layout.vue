<template>
  <Layout>
    <!-- <template #nav-bar-content-after> <ToggleTheme /></template> -->
    <template #layout-top>
      <!-- <Title v-if="isPost" /> -->
      <!-- <Category v-if="isPost" /> -->
    </template>
    <!-- Home slot-->
    <!-- <template #home-hero-after><HomeHero /> </template> -->
    <template #home-features-after> <Page /></template>
  </Layout>
</template>
<script  setup>
import DefaultTheme from "vitepress/theme";
import Comments from "./components/Comments.vue";
import Page from "./components/Page.vue";
import ToggleTheme from "./components/ToggleTheme.vue";
import Category from "./components/Category.vue";
import Title from "./components/Title.vue";
import { useData } from "vitepress";
import { computed,onMounted } from "vue";
const { Layout } = DefaultTheme;

const isPost = computed(() => {
  return useData().page.value.relativePath.indexOf("posts") > -1 ? true : false;
});
onMounted(()=>{
  console.log("compute");
})
</script>
<style scoped>
</style>