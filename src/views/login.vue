<template>
  <div class="login">
    <user-layout>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item>
          <a-input size="large" type="text" placeholder="请输入用户名/手机号码" v-decorator="[
            'username',
            {rules: [{required: true, message: '请输入用户名/手机号码'}], validateTrigger: 'blur'}
          ]">
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input size="large" type="password" autocomplete="false" placeholder="请输入密码" v-decorator="[
            'password',
            {rules: [{required: true, message: '请输入密码'}], validateTrigger: 'blur'}
          ]">
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <router-link to="/recover" class="forge-password" style="float: right;">修改密码</router-link>
        </a-form-item>
        <a-form-item style="margin-top:24px">
          <a-button size="large" type="primary" class="login-button" :loading="state.loginBtn" :disabled="state.loginBtn" htmlType="submit">确定</a-button>
        </a-form-item>
      </a-form>
    </user-layout>
  </div>
</template>
<script>
import userLayout from '@/components/user_layout'
import { routes } from '@/config/router'
import { login } from '@/config/api'
import { Base64 } from 'js-base64'

export default {
  components: {
    userLayout
  },
  data () {
    return {
      form: this.$form.createForm(this),
      menusId: [],
      state: {
        loginBtn: false
      }
    }
  },
  mounted () {},
  methods: {
    redirectUrl (routes) {
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].meta && routes[i].meta.id && this.menusId.includes(routes[i].meta.id)) {
          return this.$router.replace(routes[i].meta.fullPath)
        }
        routes[i].children && this.redirectUrl(routes[i].children)
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields }, state } = this
      state.loginBtn = true
      validateFields(['username', 'password'], { force: true }, (err, values) => {
        if (err) return (state.loginBtn = false)
        login({
          loginName: values.username,
          password: values.password
        }).then(res => {
          state.loginBtn = false
          if (!res.status) return this.$message.error(res.error)
          window.localStorage.setItem('userInfo', Base64.encode(Base64.encode(JSON.stringify(res.data))))
          this.$nextTick(() => {
            this.menusId = res.data.menus.map(a => +a)
            this.redirectUrl(routes)
          })
          // this.$router.replace('/base/user/user_manage')
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  .login-button {
    width: 100%;
  }
}
</style>
