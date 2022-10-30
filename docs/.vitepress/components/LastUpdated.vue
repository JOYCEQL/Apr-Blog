<template>
</template>

<script>
export default {
  props: ['slot-key'],
  setup ({props,ctx}) {
    ctx.$page.lastUpdated = "2022/1/6 下午2:00:00";
  }
};
</script>