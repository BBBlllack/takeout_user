<template>
  <div class="list">
    <van-list
      v-model:loading="orderListLoading"
      :finished="orderListLoadFinished"
      finished-text="没有更多了"
      @load="orderListLoad"
    >
      <van-collapse
        v-model="activeItem"
        accordion
        v-for="item in orderList.records"
        :key="item.id"
        @click="onItemClick(item)"
      >
        <van-collapse-item :name="item.id">
          <template #title>
            <div class="order-item">
              <van-image
                fit="cover"
                round
                class="order-item-img"
                :src="item.restaurant.cover"
                alt=""
              />
              <div class="order-item-title">
                <div>{{ item.restaurant.name }}</div>
                <div>
                  <van-space>
                    <van-tag type="primary">{{ item.create_time }}</van-tag>
                    <van-tag type="warning">¥{{ item.totalprice }}</van-tag>
                    <!-- 订单状态 -->
                    <van-tag type="success">{{ orderStatus[item.status!] }}</van-tag>
                  </van-space>
                </div>
              </div>
            </div>
          </template>
          <template #default>
            <van-cell-group>
              <van-cell
                v-for="food in orderDetail"
                :key="food.id"
                :title="food.dish!.name"
                :label="food.price + '¥'"
                :value="food.quantity + '份'"
                center
                style="background-color: #f7f8fa"
                border
              >
                <template #icon>
                  <van-image
                    fit="cover"
                    round
                    class="order-item-img"
                    :src="item.restaurant.cover"
                    alt=""
                  />
                </template>
              </van-cell>
            </van-cell-group>
          </template>
        </van-collapse-item>
      </van-collapse>
    </van-list>
  </div>
  <TabView />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TabView from '@/views/TabView.vue'
import { onMounted } from 'vue'
import type { orderListItemType, pageType, orderDetailListItemType } from '@/types'
import { getOrderList, getOrderDetail } from '@/api'

// 订单状态枚举
const orderStatus = ['已下单', '已出餐', '已完成']

interface orderPage extends pageType {
  records: orderListItemType[]
}
// 订单列表
const orderList = ref<orderPage>({
  records: [] as orderListItemType[],
  total: 20,
  current: 0,
  size: 10
})

// 订单列表加载状态
const orderListLoading = ref(true)
// 是否加载完毕
const orderListLoadFinished = ref(false)

// 继续加载订单列表
const orderListLoad = async () => {
  console.log('load')
  // 判断是否加载完毕
  if (orderList.value.records.length >= orderList.value.total) {
    orderListLoadFinished.value = true
    return
  }
  orderListLoading.value = true
  orderList.value.current++
  const res = await getOrderList(orderList.value.current, orderList.value.size)
  orderList.value.records.push(...res.records)
  orderListLoading.value = false
}

// 刷新订单列表
const refreshOrderList = async () => {
  console.log('refresh')
  orderListLoading.value = true
  const res = await getOrderList(1, 10)
  console.log(res)
  orderList.value = res
  orderList.value.current = 1
  orderListLoading.value = false
}

// 订单列表详情
const orderDetail = ref<orderDetailListItemType[]>([])

// 点击订单列表项
const onItemClick = async (item: orderListItemType) => {
  console.log(item)
  // 获取订单详情
  const res = await getOrderDetail(item.id)
  orderDetail.value = res
}

// 当前激活的订单项
const activeItem = ref(1)
onMounted(() => {
  console.log('order')
  refreshOrderList()
})
</script>
<style scoped>
.order-item {
  display: flex;
  align-items: center;
  flex-direction: row;
  color: #333;
  padding: 10px 0;
}
.order-item-img {
  width: 15vw;
  height: 15vw;
  margin-right: 10px;
}
.order-item-title {
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  /* justify-content: center; */
}
</style>
