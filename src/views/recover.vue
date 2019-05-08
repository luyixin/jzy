<template>
  <div class="recover">
    <user-layout>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item>
          <a-input size="large" type="text" placeholder="请输入用户名/手机号码" v-decorator="[
          'loginName', {rules: [{required: true, message: '请输入用户名/手机号码'}], validateTrigger: 'blur'}]">
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input size="large" type="password" placeholder="请输入旧密码" v-decorator="[
          'oldPassword', {rules: [{required: true, message: '请输入旧密码'}], validateTrigger: 'blur'}]">
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input size="large" type="password" placeholder="请输入新密码" v-decorator="[
          'password', {rules: [{required: true, message: '请输入新密码'}, {validator: validateToNextPassword}], validateTrigger: 'blur'}]">
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input size="large" type="password" placeholder="请再次输入新密码" v-decorator="[
          'newPasswordAgain', {rules: [{required: true, message: '请再次输入新密码'}, {
              validator: compareToFirstPassword,
            }], validateTrigger: 'blur'}]">
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
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
import { updatePassword } from '@/config/api'

export default {
  components: {
    userLayout
  },
  data () {
    return {
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        smsSendBtn: false
      }
    }
  },
  mounted () {},
  methods: {
    validateToNextPassword  (rule, value, callback) {
      callback(value && value.length < 5 ? '密码不能少于6位' : undefined)
    },
    compareToFirstPassword  (rule, value, callback) {
      callback(value && value !== this.form.getFieldValue('password') ? '两次输入密码不一致' : undefined)
    },
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields }, state } = this
      state.loginBtn = true
      validateFields(['loginName', 'oldPassword', 'password', 'newPasswordAgain'], { force: true }, (err, values) => {
        if (err) return (state.loginBtn = false)
        updatePassword(values).then(res => {
          if (res.code !== 200) return this.$message.error(res.error)
          this.$message.success(res.data)
          this.$router.go(-1)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.recover {
  .login-button, .getCaptcha {
    width: 100%;
  }
}
</style>
