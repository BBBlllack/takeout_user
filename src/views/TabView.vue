<template>
  <RouterView />
  <van-tabbar
    class="tabbar"
    v-model="activeName"
    active-color="linear-gradient(to right, #ff6034, #ee0a24)"
  >
    <van-tabbar-item name="/home" replace to="home" icon="home-o">主页</van-tabbar-item>
    <van-tabbar-item name="/order" replace to="order" icon="orders-o">订单</van-tabbar-item>
    <van-tabbar-item name="/setting" replace to="setting" icon="setting-o">设置</van-tabbar-item>
  </van-tabbar>
</template>
<script setup lang="ts">
import router from '@/router'
import { onMounted } from 'vue'
import { ref } from 'vue'
const activeName = ref('/home')
onMounted(() => {
  // 用当前路由的name来设置activeName
  activeName.value = router.currentRoute.value.path
})
</script>
<style scoped>
.tabbar {
  /* 渐变色 */
  /* background: #f3511d; */
}
/* linear-gradient(to right, #ffca58, #f3511d); */
.van-tabbar-item--active {
  background: linear-gradient(to bottom, #ffca58, #f3511d);
  color: #fff;
}
</style>
