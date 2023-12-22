<template>
  <van-sticky>
    <van-search
      v-model="searchKey"
      shape="round"
      background="linear-gradient(to right, #FFCA58, #F3511D)"
      placeholder="请输入搜索关键词"
      @search="onSearch"
    />
  </van-sticky>
  <div class="list">
    <van-swipe :autoplay="3000" lazy-render>
      <van-swipe-item v-for="image in images" :key="image">
        <img class="swipe-img" :src="image" />
      </van-swipe-item>
    </van-swipe>
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        class="item"
        v-for="item in resturantData.records"
        :key="item.id"
        @click="onItemClick(item)"
      >
        <!-- 左边展示图片 -->
        <template #icon>
          <img :src="item.cover" alt="" style="width: 25vw; height: 25vw; border-radius: 3vw" />
        </template>
        <!-- 右边展示信息 -->
        <div class="item-right">
          <div style="font-size: 1.2rem; color: #333">{{ item.name }}</div>
          <div style="font-size: 1rem; color: #666">
            <van-tag plain type="danger" style="margin-right: 1vw; font-size: 0.8rem">
              月销 {{ item.sale }}
            </van-tag>
            <van-tag plain type="success" style="margin-right: 1vw; font-size: 0.8rem">
              <!-- 星星图标 -->
              <van-icon name="star-o" />
              {{ item.mark }}
            </van-tag>
            <van-text-ellipsis :content="item.announce" />
          </div>
        </div>
      </van-cell>
    </van-list>
  </div>
  <TabView />
</template>

<script setup lang="ts">
import TabView from '@/views/TabView.vue'
import { ref } from 'vue'
import type { pageType, restaurantType } from '@/types'
import { getRestaurantList } from '@/api'
import { onMounted } from 'vue'
import router from '@/router'

const searchKey = ref('')
const images = ref([
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
])

// 继承pageType并覆盖records为restaurantType类型
interface restaurantPageType extends pageType {
  records: restaurantType[]
}
// 餐馆数据
const resturantData = ref<restaurantPageType>({
  records: [] as restaurantType[],
  total: 100,
  size: 10,
  current: 1
})

// 是否加载中
const loading = ref(false)
// 是否加载完毕
const finished = ref(false)

// 加载更多
const onLoad = async () => {
  loading.value = true
  resturantData.value.current++
  const res = await getRestaurantList(resturantData.value.current, resturantData.value.size)
  // console.log(res)
  if (resturantData.value.records.length >= resturantData.value.total) {
    finished.value = true
  } else {
    resturantData.value.records.push(...res.records)
  }
  loading.value = false
}

// 搜索店家名称
const onSearch = async (value: string) => {
  finished.value = false
  loading.value = true
  console.log(value)
  // 根据店家名称搜索
  const res = await getRestaurantList(1, 10, value)
  resturantData.value = res
  loading.value = false
}

// 刷新店家列表
const refresh = async () => {
  loading.value = true
  const res = await getRestaurantList(1, 10, searchKey.value)
  resturantData.value = res
  loading.value = false
}

// 点击餐馆列表项
const onItemClick = (item: restaurantType) => {
  router.push(`/restaurant/${item.id}`)
}

onMounted(() => {
  refresh()
})
</script>
<style scoped>
.swipe-img {
  width: 100%;
  height: 30vh;
  border-radius: 3vw;
  object-fit: fill;
}
.list {
  height: 85vh;
  /* 使上边的元素不一起滚动 */
  overflow: auto;
  /* 设置滚动条不显示 */
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.item {
  padding: 2vw;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  margin: 2vw 2vw;
  width: auto;
  border: 1px solid #ccc;
  border-radius: 3vw;
  /* 阴影效果 */
  /* box-shadow: 0 0 0.5vh #ccc; */
}

.item-right {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: left;
  margin-left: 2vw;
  text-align: left;
}
</style>
