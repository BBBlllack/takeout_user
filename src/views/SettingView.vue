<template>
  <div class="info">
    <van-space direction="vertical" fill align="center" size="2rem">
      <!-- 头像区域 -->
      <van-uploader :after-read="afterRead" :max-count="1">
        <van-image
          round
          width="30vw"
          height="30vw"
          fit="cover"
          :src="userData.avatar"
          class="avatar-img"
        />
        <!-- <img
          src="https://img.yzcdn.cn/vant/leaf.jpg"
          style="width: 30vw; height: 30vw; object-fit: cover; border-radius: 50%"
        /> -->
      </van-uploader>

      <div class="tags">
        <van-space>
          <van-tag type="primary" round plain>{{ userStatus[userData.status!] }}</van-tag>
          <van-tag type="warning" round plain>{{ userData.regtime }}</van-tag>
        </van-space>
      </div>
      <van-cell-group inset>
        <van-form @submit="onSubmit">
          <van-cell>
            <van-field
              v-model="userData.name"
              name="name"
              label="用户名"
              placeholder="不修改用户名请留空"
            />
            <van-field
              v-model="userData.phone"
              name="phone"
              label="电话"
              placeholder="不修改电话请留空"
            />
            <van-field
              v-model="userData.password"
              type="password"
              name="password"
              label="密码"
              placeholder="不修改密码请留空"
            />
          </van-cell>
          <van-cell>
            <van-space direction="vertical" fill>
              <van-button
                round
                block
                color="linear-gradient(to right, #ff6034, #ee0a24)"
                native-type="submit"
                @click="onSubmit"
              >
                保存信息
              </van-button>
              <van-button round block type="default" @click="onLogOut">退出登录</van-button>
            </van-space>
          </van-cell>
        </van-form>
      </van-cell-group>
    </van-space>
  </div>
  <TabView />
</template>

<script setup lang="ts">
import TabView from '@/views/TabView.vue'
import { ref } from 'vue'
import type { userType } from '@/types'
import { updateUserInfo, getUserInfo } from '@/api'
import axios from 'axios'
import { showFailToast, showLoadingToast, showSuccessToast } from 'vant'
import router from '@/router'
import { onMounted } from 'vue'

interface pictureBadRes {
  success: boolean
  code: string
  message: string
  images?: string
  data: { url: string }
}
// 上传头
const afterRead = async (file: any) => {
  console.log('上传头像')
  showLoadingToast({
    message: '上传中...',
    forbidClick: true,
    loadingType: 'spinner',
    duration: 0
  })

  // 将图片上传到sm.ms图床
  const formData = new FormData()
  formData.append('smfile', file.file)
  const res = await axios.post('/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'EbGJXCofcjs7WYDGf1KN5p6JuxJew8pJ'
    }
  })
  const resData = res.data as pictureBadRes
  if (resData.success) {
    // 如果上传成功
    console.log(res)
    const pic = resData.data.url
    userData.value.avatar = pic
  } else {
    // 如果重复上传
    userData.value.avatar = resData.images
  }
  showSuccessToast('上传头像成功')
  console.log(res)
}

const userData = ref<userType>({
  id: 0,
  name: '',
  phone: '',
  password: '',
  avatar: 'https://img.yzcdn.cn/vant/leaf.jpg',
  regtime: '2023-01-01',
  status: 2
})

// 用户类型枚举
const userStatus = ['封号中', '普通用户', 'VIP用户']

// 获取用户信息
const refreshtUserInfo = async () => {
  console.log('获取用户信息')
  const ret = await getUserInfo()
  if (ret) {
    userData.value = ret
    console.log(userData.value)
  }
}

// 更新用户信息提交
const onSubmit = async () => {
  console.log(userData.value)
  const res = await updateUserInfo(userData.value)
  if (res) {
    showSuccessToast('更新成功')
  } else {
    showFailToast('更新失败')
  }
}

// 退出登录
const onLogOut = () => {
  localStorage.removeItem('token')
  // localStorage.removeItem('user')
  showSuccessToast('帐号已退出')
  router.push('/login')
}

onMounted(() => {
  refreshtUserInfo()
})
</script>

<style scoped>
.info {
  padding: 0 1rem;
  margin-top: 10vh;
}
.avatar-img {
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
}
.tags {
  width: 100%;
  text-align: center;
  font-size: 1rem;
}
</style>
