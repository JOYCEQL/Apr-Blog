<template>
  <div class="shareCard">
      <h1>April's Blog</h1>
      <p>Web前端技术博客，积跬步以至千里，致敬每个爱学习的你。</p>
  </div>
</template>

<script lang="ts" setup>
type card = {
  text: string;
  icon: string;
  url: string;
};

</script>
<style scoped lang="scss">
.shareCard {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 400px;
  width: 100%;
  background: url("../../images/shan.png") center center / cover no-repeat;
  color: #fff;
  h1{
    font-size: 40px;
  }
  p{
    margin-top: 30px;
    font-size: 18px;
  }
}
.share-avator {
  width: 50px;
}
.cardPart {
  display: flex;
}
.card {
  cursor: pointer;
}
.card:hover {
  transform: translate(-2px, -2px);
}
</style>

