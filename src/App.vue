<template>
  <div class="app">
    <a-locale-provider :locale="locale">
      <router-view/>
    </a-locale-provider>
  </div>
</template>
<script>
import { Base64 } from 'js-base64'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { routes } from '@/config/router'

export default {
  data () {
    return {
      locale: zhCN,
      userInfo: window.localStorage.getItem('userInfo'),
      menusId: []
    }
  },
  watch: {
    '$route' (v) {
      if (!this.userInfo || v.fullPath === '/login' || v.fullPath === '/recover') return
      !this.menusId.includes(v.meta.id) && this.redirectUrl(routes)
    }
  },
  mounted () {
    if (!this.userInfo) return this.$router.replace('/login')
    try {
      this.menusId = JSON.parse(Base64.decode(Base64.decode(this.userInfo))).menus.map(a => +a)
      !this.menusId.includes(this.$route.meta.id) && this.redirectUrl(routes)
    } catch (e) {
      this.$router.replace('/login')
    }
  },
  methods: {
    redirectUrl (routes) {
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].meta && routes[i].meta.id && this.menusId.includes(routes[i].meta.id)) {
          return this.$router.replace(routes[i].meta.fullPath)
        }
        routes[i].children && this.redirectUrl(routes[i].children)
      }
    }
  }
}
</script>
<style lang="less">
@import "ant-design-vue/dist/antd.css";

// 页面切换动画
.page-toggle-enter-active{
  transition: all 0.2s ease-in 0.25s;
}
.page-toggle-leave-active{
  transition: all 0.2s ease-out 0s;
}
.page-toggle-enter, .page-toggle-leave-to{
  opacity: 0;
  padding: 0px;
}
</style>
