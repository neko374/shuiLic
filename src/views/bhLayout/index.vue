<template>
  <div id="app1">
    <GlobalHeader />
    <div class="app-content">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </div>
  </div>

</template>

<script>
import GlobalHeader from './components/GlobalHeader.vue'

export default {
  components: {
    GlobalHeader
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="less" scoped>
@import url("~@/styles/colors.less");
#app1 {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
  background: @main-color;
  // height: 100%;
  min-height: 100%;
  overflow: auto;
}
* {
  margin: 0;
  box-sizing: border-box;
}
html,
body {
  // height: 100%;
  min-height:768px;
}
#nav {
  margin: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.app-content {
  margin-top: 10px;
  // padding:0 10px 0px;
  height:calc(100vh - 60px);
}
@media screen and (min-width:1920px){
  .app-content{
    height:calc(100vh - 70px);
  }
}
.wait{
  width: 100%;
  height: 90px;

}
</style>

<style>
  /* 时间选择器 */
.el-form-item__label {
  color: #fff;
}
</style>
