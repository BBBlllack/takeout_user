<template>
  <van-cell class="item">
    <!-- 展示信息 -->
    <div class="item-tc">
      <div class="item-title">
        <div style="font-size: 1.2rem; color: #333">{{ restaurantData.name }}</div>
        <div style="font-size: 0.8rem; color: hsl(0, 0%, 40%)">
          <van-icon name="location-o" />
          {{ restaurantData.address }}
        </div>
        <div style="font-size: 1rem; color: #666">
          <van-tag plain type="danger" style="margin-right: 1vw; font-size: 0.8rem">
            月销 {{ restaurantData.sale }}
          </van-tag>
          <van-tag plain type="success" style="margin-right: 1vw; font-size: 0.8rem">
            <!-- 星星图标 -->
            <van-icon name="star-o" />
            {{ restaurantData.mark }}
          </van-tag>
        </div>
      </div>
      <!-- 展示图片 -->
      <div>
        <img
          :src="restaurantData.cover"
          alt=""
          style="width: 15vw; height: 15vw; border-radius: 3vw"
        />
      </div>
    </div>
    <div class="announce">
      <van-text-ellipsis
        rows="2"
        :content="restaurantData.announce"
        expand-text="展开"
        collapse-text="收起"
      />
    </div>
  </van-cell>
  <van-row class="category-dish-container">
    <van-col span="6">
      <!-- 分类列表 -->
      <van-sidebar v-model="activeCategory" @change="onCategoryItemClick">
        <van-sidebar-item v-for="item in categoryData" :title="item.name" :key="item.id" />
      </van-sidebar>
    </van-col>
    <van-col span="18">
      <div class="dish-list">
        <!-- 菜品列表 -->
        <van-list
          v-model:loading="dishLoading"
          :finished="dishFinished"
          finished-text="没有更多了"
          @load="onLoadDish"
        >
          <van-cell v-for="item in dishList.records" :key="item.id">
            <van-card
              :price="item.price"
              :desc="item.descr"
              :title="item.name"
              :thumb="item.cover"
              class="dish-item"
            >
              <template #tags>
                <van-button
                  size="small"
                  round
                  icon="plus"
                  color="linear-gradient(to right, #ff6034, #ee0a24)"
                  @click="onClickAddToCart(item)"
                >
                  加购
                </van-button>
              </template>
            </van-card>
          </van-cell>
        </van-list>
      </div>
    </van-col>
  </van-row>
  <van-popup
    round
    @close="updateCartData"
    v-model:show="showCart"
    position="bottom"
    class="shopcar"
    :style="{ height: '80%' }"
  >
    <div v-show="popup_switch == 0">
      <van-contact-card
        type="edit"
        :tel="currentAddress.tel"
        :name="currentAddress.name"
        @click="chooseAddr"
      />
      <van-notice-bar
        left-icon="location-o"
        wrapable
        :scrollable="false"
        :text="currentAddress.address"
      />

      <div class="cart-list">
        <!-- 订单列表 -->
        <van-list
          v-model:loading="cartLoading"
          :finished="cartFinished"
          finished-text="没有更多了"
          @load="onLoadCart"
        >
          <van-cell v-for="item in cartData" :key="item.id" v-show="item.quantity != 0">
            <van-card
              :price="(item.dish?.price! * (1 - item.dish?.discount!) * item.quantity!).toFixed(2)"
              :desc="item.dish?.descr"
              :title="item.dish?.name"
              :thumb="item.dish?.cover"
            >
              <template #tags>
                <van-stepper
                  integer
                  min="0"
                  v-model="item.quantity"
                  :before-change="cartNumberChange"
                />
              </template>
            </van-card>
          </van-cell>
        </van-list>
      </div>
      <van-action-bar>
        <van-action-bar-icon icon="cart-o" text="购物车" @click="onClickShopCar" />
        <van-action-bar-button type="danger" text="立即下单" @click="onSubmit" />
      </van-action-bar>
    </div>
    <div v-show="popup_switch == 1">
      <van-address-list
        v-model="chosenAddressId"
        :list="addressList"
        default-tag-text="默认"
        right-icon="close"
        @add="onAddAddr"
        @edit="onDeleteAddr"
        @select="onSelectedAddr"
      ></van-address-list>
    </div>
    <div v-show="popup_switch == 2">
      <van-address-edit
        :show-area="false"
        show-delete
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        delete-button-text="返回"
        @save="onSaveAddr"
        @delete="onBackSelectAddr"
      />
    </div>
  </van-popup>

  <van-action-bar>
    <van-action-bar-icon icon="cart-o" text="购物车" @click="onClickShopCar" />
    <van-action-bar-button type="danger" text="立即下单" @click="onSubmit" />
  </van-action-bar>
</template>

<script setup lang="ts">
import {
  getRestaurantInfo,
  getCategoryList,
  getDishList,
  getCartList,
  updateCartList,
  updateAddress,
  getAddressList,
  addOrder
} from '@/api'
import type {
  addressType,
  categoryType,
  dishType,
  pageType,
  restaurantType,
  shopCarItemType
} from '@/types'
import router from '@/router'
import { ref } from 'vue'
import { onMounted } from 'vue'
import {
  type AddressEditInfo,
  type AddressListAddress,
  showFailToast,
  showSuccessToast,
  showToast
} from 'vant'
import type { Numeric } from 'vant/lib/utils'

// ######## 地址数据
interface AddressItem {
  id?: number
  name?: string
  tel?: string
  address?: string
}

// 地址选择弹出框 0:购物车页面 1:地址列表页面 2:地址编辑页面
const popup_switch = ref(0)
// 选中的地址id
const chosenAddressId = ref()
// 地址列表
const addressList = ref<AddressListAddress[]>([
  {
    id: 1,
    name: '张三',
    tel: '13000000000',
    address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室'
  },
  {
    id: 2,
    name: '李四',
    tel: '1310000000',
    address: '浙江省杭州市拱墅区莫干山路 50 号'
  }
])

// 获取地址列表
const refreshAddressList = async () => {
  console.log('getAddressList')
  const res = await getAddressList()
  console.log(res)
  // 将res按照字段转换为AddressListAddress类型并添加到addressList
  addressList.value = res.map((item): AddressListAddress => {
    return {
      id: item.id as Numeric,
      name: item.name as string,
      tel: item.phone as string,
      address: item.detail as string,
      isDefault: item.status === 3
    }
  })
  // 选中默认地址
  chosenAddressId.value = addressList.value.find((item) => item.isDefault)?.id
  //
  console.log(addressList.value)
}

// 保存地址
const onSaveAddr = async (e: AddressEditInfo) => {
  showToast('保存地址')
  console.log(e)
  // 构造一个addressType对象
  const address: addressType = {
    name: e.name!,
    phone: e.tel!,
    detail: e.addressDetail!,
    status: 1
  }
  const res = await updateAddress(address)
  if (res) {
    showSuccessToast('保存成功')
    refreshAddressList()
    popup_switch.value = 1
  } else {
    showFailToast('保存失败')
  }
}

// 删除地址
const onDeleteAddr = async (e: AddressItem) => {
  // showToast('删除地址')
  console.log(e)
  // 构造一个addressType对象
  const address: addressType = {
    id: e.id!,
    name: e.name!,
    phone: e.tel!,
    detail: e.address!,
    status: 0
  }
  const res = await updateAddress(address)
  if (res) {
    showSuccessToast('删除成功')
    refreshAddressList()
  } else {
    showFailToast('删除失败')
  }
}

// 新增地址
const onAddAddr = () => {
  // showToast('新增地址')
  popup_switch.value = 2
}

// 返回地址选择页面
const onBackSelectAddr = () => {
  popup_switch.value = 1
  refreshAddressList()
}

// 当前选中的地址
const currentAddress = ref<AddressItem>({
  id: 1,
  name: '未选择',
  tel: '未选择',
  address: '未选择'
})

// 转到选择地址页面
const chooseAddr = () => {
  console.log('chooseAddr')
  popup_switch.value = 1
  refreshAddressList()
}

// 选中地址
const onSelectedAddr = (item: AddressListAddress) => {
  console.log('onSelectedAddr')
  console.log(item)
  popup_switch.value = 0
  // 将当前地址填充到currentAddress
  currentAddress.value = item as AddressItem
}

// ######## 餐馆数据
// 餐馆数据
const restaurantData = ref<restaurantType>({})

// 根据id获取餐馆数据
const getRestaurantData = async () => {
  console.log('getRestaurantData')
  // 获取路由传递的id参数并转换为number类型
  const id = Number(router.currentRoute.value.params.id)
  // 获取餐馆数据
  const res = await getRestaurantInfo(id)
  console.log(res)
  restaurantData.value = res
  getCategoryData(id)
}

// ########## 类别数据

// 类别数据
const categoryData = ref<categoryType[]>([])

// 获取类别数据
const getCategoryData = async (id: number) => {
  console.log('getCategoryData')
  const res = await getCategoryList(id)
  console.log(res)
  categoryData.value = res
  if (res.length > 0) {
    // 更新当前选中的类别
    activeCategory.value = 0
    // 刷新菜品列表数据
    getDishListData(res[0].id!, id)
  }
}

// 当前选中的类别
const activeCategory = ref()

// 点击类别列表项
const onCategoryItemClick = (index: number) => {
  console.log('onCategoryItemClick')
  // 取出当前点击的类别
  const item = categoryData.value[index]
  console.log(item)
  // 刷新菜品列表数据
  getDishListData(item.id!, restaurantData.value.id!)
}

// ######### 菜品数据

// 继承pageType并覆盖records为dishType类型
interface dishPageType extends pageType {
  records: dishType[]
}

// 菜品数据列表展示
const dishLoading = ref(false)
const dishFinished = ref(false)

// 菜品列表数据
const dishList = ref<dishPageType>({
  records: [] as dishType[],
  total: 100,
  size: 20,
  current: 1
})

// 继续加载菜品列表数据(追加)
const onLoadDish = async () => {
  console.log('onLoadDish')
  dishLoading.value = true
  if (restaurantData.value.id === undefined) {
    return
  }
  // 更新页码
  dishList.value.current++
  const res = await getDishList(
    restaurantData.value.id!,
    categoryData.value[activeCategory.value].id!,
    dishList.value.current,
    dishList.value.size
  )
  // 拓展列表数据
  dishList.value.records.push(...res.records)
  // 加载完毕
  dishLoading.value = false
  // 判断是否全部加载完毕
  if (dishList.value.records.length >= dishList.value.total) {
    dishFinished.value = true
  }
}

// 根据类别id和饭店id,刷新菜品列表数据(重置)
const getDishListData = async (categoryId: number, restaurantId: number) => {
  console.log('getDishListData')
  // 重置加载状态
  dishLoading.value = true
  const res = await getDishList(restaurantId, categoryId, 1, 10)
  console.log(res)
  // 重置列表数据
  dishList.value = res
  // 加载完毕
  if (dishList.value.records.length >= dishList.value.total) {
    dishFinished.value = true
  } else {
    dishFinished.value = false
  }
}

// ########## 购物车

// 展示购物车
const showCart = ref(false)

// 购物车数据
const cartData = ref<shopCarItemType[]>([])
const cartLoading = ref(false)
const cartFinished = ref(false)

// 获取购物车数据
const onLoadCart = async () => {
  console.log('getShopCarData')
  cartLoading.value = true
  const res = await getCartList(restaurantData.value.id!)
  console.log(res)
  cartData.value = res
  cartLoading.value = false
  cartFinished.value = true
}

// 添加到购物车
const onClickAddToCart = async (item: dishType) => {
  console.log('onClickAddToCart')
  // 构造一个shopCarItemType对象
  const shopCarItem: shopCarItemType = {
    did: item.id!,
    quantity: 1,
    rid: restaurantData.value.id!
  }
  const res = await updateCartList([shopCarItem])
  if (res) {
    // 添加成功
    showSuccessToast('添加成功')
  }
}

// 购物车数量变化
const cartNumberChange = (value: number) => {
  console.log('beforeChange')
  if (value === 0) {
    // 从购物车中隐藏
    showFailToast('删除')
  }
  return true
}

// 更新购物车数据(将当前购物车数据同步到后端)
const updateCartData = () => {
  console.log('submitCart')
  updateCartList(cartData.value)
}

// 点击购物车
const onClickShopCar = () => {
  console.log('onClickShopCar')
  // 切换购物车显示状态
  showCart.value = !showCart.value
  // 切换地址选择状态到购物车页面
  popup_switch.value = 0
  // 刷新购物车数据
  if (showCart.value) {
    onLoadCart()
  }
}

// ####### 下单
// 点击立即下单
const onSubmit = async () => {
  console.log('onSubmit')
  // 获取餐馆id
  const restaurantId = restaurantData.value.id
  // 获取当前地址id
  const addressId = chosenAddressId.value
  if (addressId === undefined) {
    showFailToast('请选择地址')
    return
  }
  // 获取购物车id
  const cart = await getCartList(restaurantData.value.id!)
  const cartIds = cart.map((item) => item.id) as number[]
  if (cartIds.length === 0) {
    showFailToast('购物车为空')
    return
  }
  // 提交!终于可以下单了!
  const res = await addOrder(restaurantId!, addressId, cartIds)
  if (res) {
    showSuccessToast('下单成功')
    // 关掉该死的购物车
    showCart.value = false
  } else {
    showFailToast('下单失败')
  }
}

onMounted(() => {
  getRestaurantData()
})
</script>
<style scoped>
.item {
  /* padding: 2vw; */
  /* margin-top: 0.5vh;
  margin-bottom: 0.5vh; */
  margin: 1vh 2vw;
  width: auto;
  border: 1px solid #ccc;
  border-radius: 3vw;
  /* 阴影效果 */
  box-shadow: 0 0 0.5vh #ccc;
  display: flex;
  flex-direction: row;
  /* 让内部块元素各据左右 */
  justify-content: space-between;
}
.item-tc {
  /* width: 80%; */
  display: flex;
  flex-direction: row;
  text-align: left;
  justify-content: space-between;
}
.item-title {
  width: 80%;
  display: flex;
  /* 行排列 */
  flex-direction: column;
  /* 块左右排列 */
  justify-content: space-between;
  /* 上对齐 */
  align-items: flex-start;
}
.announce {
  margin-top: 1vh;
  margin-bottom: 1vh;
  text-align: left;
}

.category-dish-container {
  height: 60;
}
.dish-list {
  height: 70vh;
  /* 使上边的元素不一起滚动 */
  overflow: auto;
  /* 设置滚动条不显示 */
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.dish-item {
  border: #ccc 1px solid;
  border-radius: 2vw;
}

.shopcar {
  height: 50%;
}
.cart-list {
  height: 100%;
}
</style>
