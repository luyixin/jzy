<template>
  <div class="base">
    <base-layout>
      <a-tabs @change="changePage" @edit="editPage" type="editable-card" hideAdd :active-key="activePage">
        <a-tab-pane :id="page.fullPath" :key="page.fullPath" v-for="page in pageList">
          <span slot="tab" :pagekey="page.fullPath">{{page.meta.name}}</span>
        </a-tab-pane>
      </a-tabs>
      <transition name="page-toggle">
        <router-view/>
      </transition>
    </base-layout>
  </div>
</template>
<script>
import baseLayout from '@/components/base_layout'

export default {
  components: {
    baseLayout
  },
  data () {
    return {
      pageList: [],
      activePage: ''
    }
  },
  mounted () {
    this.pageList.push(this.$route)
    this.activePage = this.$route.fullPath
  },
  watch: {
    $route (newRoute) {
      const { fullPath } = newRoute
      this.activePage = fullPath
      !this.pageList.some(a => a.fullPath === fullPath) && this.pageList.push(newRoute)
    },
    activePage (key) {
      this.$router.push(key)
    }
  },
  methods: {
    changePage (key) {
      this.activePage = key
    },
    editPage (key, action) {
      if (this.pageList.length === 1) return this.$message.warning('这是最后一页，不能再关闭了啦')
      let i = this.pageList.findIndex(a => a.fullPath === key)
      this.pageList = this.pageList.filter(a => a.fullPath !== key)
      const total = this.pageList.length
      i = i < total ? i : total - 1
      this.activePage = this.pageList[i].fullPath
    }
  }
}
</script>
<style lang="less" scoped>
.base {}
</style>
