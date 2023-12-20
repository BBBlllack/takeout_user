<template>
  <div class="login-box">
    <van-cell-group inset>
      <h1>登录</h1>
      <van-cell>
        <van-field
          v-model="form.phone"
          left-icon="user-o"
          label="用户名"
          placeholder="请输入用户名"
        />
        <van-field
          v-model="form.password"
          left-icon="closed-eye"
          label="密码"
          placeholder="请输入密码"
        />
      </van-cell>
      <van-cell>
        <van-button
          class="login-button"
          round
          block
          color="linear-gradient(to right, #ff6034, #ee0a24)"
          @click="login(form)"
        >
          登陆
        </van-button>
        <van-button
          class="login-button"
          round
          block
          color="linear-gradient(to right,#FF9F1C, #F3511D)"
          @click="login(form)"
        >
          注册
        </van-button>
      </van-cell>
    </van-cell-group>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { login } from '@/api'
const form = ref({
  phone: '',
  password: ''
})
</script>
<style scoped>
.login-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  text-align: center;
  background: linear-gradient(to right, #ffca58, #ff9f1c);
}
.login-button {
  margin-top: 1vh;
}
</style>
