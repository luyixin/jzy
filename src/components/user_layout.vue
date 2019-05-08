<template>
  <div class="user-layout">
    <div class="header">
      <img alt="logo" class="logo" src="@/assets/images/logo.png" />
      <span class="title">今状元学生管理系统</span>
    </div>
    <div class="container">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>
.user-layout {
  width: 100vw;
  height: 100vh;
  padding-top: 110px;
  background: #f0f2f5 url(~@/assets/images/background.svg) no-repeat 50%;
  background-size: 100%;
  .header {
    text-align: center;
    height: 44px;
    line-height: 44px;
    margin-bottom: 40px;
    a {
      text-decoration: none;
    }
    .logo {
      height: 44px;
      vertical-align: top;
      margin-right: 16px;
    }
    .title {
      font-size: 24px;
      color: rgba(0,0,0,.85);
      font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
      font-weight: 600;
      position: relative;
      top: 2px;
    }
  }
  .container {
    width: 368px;
    margin: 0 auto;
  }
}
</style>
