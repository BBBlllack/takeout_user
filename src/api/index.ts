import instance from '@/api/request'
import router from '@/router'
import { useTokenStore } from '@/stores'
import type {
  loginType,
  responseType,
  loginResType,
  pageType,
  restaurantType,
  orderDetailListItemType,
  categoryType,
  shopCarItemType,
  addressType,
  userType
} from '@/types'
import { showSuccessToast, showFailToast } from 'vant'

// 登陆
export async function login(data: loginType) {
  if (data.phone === '') {
    showFailToast('手机号不能为空')
    return
  }
  if (data.password === '') {
    showFailToast('密码不能为空')
    return
  }
  const res: responseType = await instance.post('/user/login', data)
  const resData: loginResType = res.data
  if (res.code === 1) {
    showSuccessToast('登陆成功')
    const tokenStore = useTokenStore()
    tokenStore.setToken(resData.token)
    // 跳转到首页
    router.push('/')
  } else {
    showFailToast(res.msg || '糟糕，出错啦')
  }
}

// 获取用户信息
export async function getUserInfo() {
  const res: responseType = await instance.get('/user/info')
  if (res.code === 0) {
    showFailToast(res.msg || '获取用户信息失败')
  }
  const resData: userType = res.data
  return resData
}

// 更新用户信息
export async function updateUserInfo(data: userType) {
  const res: responseType = await instance.post('/user/update', data)
  if (res.code === 0) {
    showFailToast(res.msg || '更新用户信息失败')
    return false
  }
  return true
}

// 获取饭店列表
export async function getRestaurantList(page: number, pagesize: number, key?: string) {
  console.log('获取饭店列表')
  const res: responseType = await instance.get('/rest/user/list', {
    params: {
      page: page,
      size: pagesize,
      key: key
    }
  })
  if (res.code === 0) {
    showFailToast(res.msg || '糟糕，出错啦')
  }
  const resData: pageType = res.data
  return resData
}

// 获取饭店信息
export async function getRestaurantInfo(id: number) {
  const res: responseType = await instance.get('/rest/info', {
    params: {
      id: id
    }
  })
  if (res.code != 1) {
    showFailToast(res.msg || '糟糕，出错啦')
  }
  const resData: restaurantType = res.data
  return resData
}

// 根据饭店id和分类id获取饭店菜品列表
export async function getDishList(rid: number, cid: number, page: number, pagesize: number) {
  const res: responseType = await instance.get('/dish/user/list', {
    params: {
      rid: rid,
      cid: cid,
      page: page,
      size: pagesize
    }
  })
  if (res.code === 0) {
    showFailToast(res.msg || '糟糕，出错啦')
  }
  const resData: pageType = res.data
  return resData
}

// 获取分类列表
export async function getCategoryList(rid: number) {
  // console.log('获取分类列表')
  const res: responseType = await instance.get('/category/user/list', {
    params: {
      rid: rid
    }
  })
  if (res.code === 0) {
    showFailToast(res.msg || '糟糕，出错啦')
  }
  const resData: categoryType[] = res.data
  return resData
}

// 获取购物车列表
export async function getCartList(rid: number) {
  const res: responseType = await instance.get('/cart/list', {
    params: {
      rid: rid
    }
  })
  if (res.code === 0) {
    showFailToast(res.msg || '糟糕，出错啦')
  }
  const resData: shopCarItemType[] = res.data
  return resData
}

// 更新购物车
export async function updateCartList(data: shopCarItemType[]) {
  const res: responseType = await instance.post('/cart/update', data)
  if (res.code === 0) {
    showFailToast(res.msg || '购物车保存失败')
    return false
  }
  return true
}

// 获取地址列表
export async function getAddressList() {
  const res: responseType = await instance.get('/address/list')
  if (res.code === 0) {
    showFailToast(res.msg || '地址获取失败')
  }
  const resData: addressType[] = res.data
  return resData
}

// 更新地址状态
export const updateAddress = async (data: addressType) => {
  const res: responseType = await instance.post('/address/update', data)
  if (res.code === 0) {
    showFailToast(res.msg || '地址更新失败')
    return false
  }
  return true
}

// 下单!!!
export const addOrder = async (rid: number, aid: number, cart: number[]) => {
  const res: responseType = await instance.post('/order/submit', {
    rid: rid,
    aid: aid,
    cart: cart
  })
  if (res.code === 0) {
    showFailToast(res.msg || '下单失败')
    return false
  }
  return true
}

// 获取订单列表
export async function getOrderList(
  page: number,
  pagesize: number,
  key?: string,
  begin?: string,
  end?: string
) {
  if (key == '') {
    key = undefined
  }
  if (begin == '') {
    begin = undefined
  }
  if (end == '') {
    end = undefined
  }
  console.log(page, pagesize, key)
  const res: responseType = await instance.get('/order/user/list', {
    params: {
      page: page,
      size: pagesize,
      key: key,
      begin: begin,
      end: end
    }
  })
  console.log(res)
  if (res.code === 0) {
    showFailToast(res.msg || '糟糕，出错啦')
  }
  const resData: pageType = res.data
  return resData
}

// 获取订单详情
export async function getOrderDetail(id: number) {
  const res: responseType = await instance.get('/order/user/detail', {
    params: {
      id: id
    }
  })
  if (res.code === 0) {
    showFailToast(res.msg || '糟糕，出错啦')
  }
  const resData: orderDetailListItemType[] = res.data
  console.log(resData)
  return resData
}
