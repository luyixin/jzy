<template>
  <a-layout class="base-layout">
    <a-layout-sider :trigger="null" width="256px" collapsible v-model="collapsed">
      <div class="logo">
        <img class="logo-img" src="@/assets/images/logo.png"/>
        <div class="logo-title">今状元学生管理系统</div>
      </div>
      <a-menu :selectedKeys="[$route.path]" :defaultOpenKeys="[openKeys]" mode="inline" theme="dark" :inlineCollapsed="collapsed">
        <a-sub-menu :key="a.meta.key" v-for="a of routes" v-if="a.children && isDispalyMenus(a.children.map(j => j.meta.id))">
          <span slot="title">
            <a-icon :type="a.meta.iconType"/>
            <span>{{a.meta.name}}</span>
          </span>
          <a-menu-item v-for="item of a.children" :key="item.meta.fullPath" v-if="menus.includes(item.meta.id)" @click="handleClick(item.meta.fullPath)">{{item.meta.name}}</a-menu-item>
        </a-sub-menu>
        <a-menu-item :key="a.meta.fullPath" v-else-if="menus.includes(a.meta.id)" @click="handleClick(a.meta.fullPath)">
          <a-icon :type="a.meta.iconType"/>
          <span>{{a.meta.name}}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click.stop="()=> collapsed = !collapsed"/>
        <div class="user-info">
          <span>你好, {{userInfo.userName}} | {{userInfo.roleName}}</span>
          <span class="login-out" @click.stop="loginOut">退出</span>
        </div>
      </a-layout-header>
      <a-layout-content class="layout" :style="{ margin: '24px 16px', padding: '24px', backgroundColor: '#fff', minHeight: '480px' }">
        <slot></slot>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { Base64 } from 'js-base64'
import { routes } from '@/config/router'

export default {
  data () {
    return {
      userInfo: {},
      menus: [],
      collapsed: false,
      routes: routes[0].children[2].children
    }
  },
  computed: {
    openKeys () {
      return this.$route.fullPath.substr(1).split('/')[1]
    }
  },
  mounted () {
    const userInfo = window.localStorage.getItem('userInfo')
    this.userInfo = userInfo ? JSON.parse(Base64.decode(Base64.decode(userInfo))) : {}
    this.menus = this.userInfo.menus.map(a => +a)
  },
  methods: {
    isDispalyMenus (localMenus) {
      return localMenus.some(a => this.menus.includes(a))
    },
    handleClick (link) {
      this.$router.push(link)
    },
    loginOut () {
      delete window.localStorage.userInfo
      this.$router.replace('/login')
    }
  }
}
</script>
<style lang="less" scoped>
.base-layout {
  font-size: 18px;
  transition: color .3s;
  height: 100vh;
  .logo {
    height: 64px;
    position: relative;
    line-height: 64px;
    padding-left: 24px;
    overflow: hidden;
    background-color: #002140;
    .logo-title {
      color: #fff;
      font-size: 18px;
      margin: 0 0 0 12px;
      font-family: "Myriad Pro","Helvetica Neue",Arial,Helvetica,sans-serif;
      font-weight: 600;
      display: inline-block;
      height: 32px;
      line-height: 32px;
      vertical-align: middle;
    }
    .logo-img {
      width: 32px;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .trigger {
    font-size: 20px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
  }
  .user-info {
    font-size: 14px;
    float: right;
    padding-right: 24px;
    .login-out {
      cursor: pointer;
      margin-left: 24px;
    }
  }
  .layout {
    overflow-y: auto;
  }
}
</style>
