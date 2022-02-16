<template>
  <div class="container-header">
    <div style="height:100%;display:flex;align-items:center;">
      <!-- <div class="header-logo" style="height:100%;">
        <img :src="logo" alt="" height="100%">
      </div> -->
      <div class="header-left">
        <div class="title">零能耗建筑运行管理系统</div>
      </div>
      <div v-if="device === 'mobile'" class="header-last">
        <div @click="toggleSideBar"><span class="iconfont1 icon-icon-test1" style="font-size:26px;" /></div>
      </div>
    </div>
    <div v-if="device !== 'mobile'" class="header-right">
      <template v-for="route in asyncRoutes">
        <div v-if="'component' in route" :key="route.path" :class="{'selected':liNumber === route.path}" class="item" @click="$router.push(route.path)">
          <span>{{ route.children[0].meta.title }}</span>
        </div>
      </template>
    </div>
    <div v-if="device !== 'mobile'" style="width:1px;" />
    <div v-if="sidebar" style="position:fixed;background:transparent;width:100vw;height:100vh;top:0;left:0;z-index:998" @click="sidebar=false;" />
    <transition name="fade">
      <div v-if="sidebar" class="header-sidebar">
        <template v-for="route in asyncRoutes">
          <div v-if="'component' in route && (!route.children[0].meta.device || route.children[0].meta.device === device)" :key="route.path" :class="{'selected':liNumber === route.path}" class="item" @click="$router.push(route.path);sidebar=false;">
            <span>{{ route.children[0].meta.title }}</span>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import { asyncRoutes, constantRoutes } from '@/router'
import binhaiLogo from '@/assets/binhaiLogo.png'
import ResizeHandler from './ResizeHandler'
import { mapGetters } from 'vuex'

export default {
  mixins: [ResizeHandler],
  data() {
    return {
      asyncRoutes,
      logo: binhaiLogo,
      liNumber: '',
      reEvt: '',
      reFontSize: '',
      sidebar: false
    }
  },
  computed: {
    ...mapGetters([
      'device'
    ])
  },
  watch: {
    $route() {
      this.addTags()
      this.activity_svpa()
    },
    device(val) {
      if (val !== 'mobile') {
        this.sidebar = false
      }
    }
  },
  created() {
    ((doc, win) => {
      var html = doc.getElementsByTagName('html')[0];
      // orientationchange->手机屏幕转屏事件
      // resize->页面大小改变事件(一边pc端有用)
      (this.reEvt =
        'orientationchange' in win ? 'orientationchange' : 'resize'),
      (this.reFontSize = function() {
        var clientW = doc.documentElement.clientWidth || doc.body.clientWidth
        if (!clientW) {
          return
        }
        html.style.fontSize = 100 * (clientW / 1920) + 'px'
      })
      if (!doc.addEventListener) return
      this.reFontSize()
      win.addEventListener(this.reEvt, this.reFontSize)
      // DOMContentLoaded->dom加载完就执行,onload要dom/css/js都加载完才执行
      doc.addEventListener('DOMContentLoaded', this.reFontSize)
    })(document, window)
  },
  mounted() {
    this.addTags()
    this.activity_svpa()
  },
  methods: {
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    activity_svpa() {
      this.liNumber = this.$route.path
    },
    toggleSideBar() {
      this.sidebar = true
    }
  }
}
</script>
<style>
  html {
  font-size: 100px;
}
body {
  font-size: 16px;
}
</style>
<style lang="less" scoped>
@import url("~@/styles/colors.less");
.container-header {
  padding:0 10px 0;
  height: 50px;
  background: @main-color;
  display: flex;
  align-items: center;
  position: relative;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  .header-left {
    // width: 20%;
    padding-left:10px;
    // margin-right:6%;
    .title {
      font-style: @value-word;
      text-align: right;
      color: white;
      font-size: 20px;
    }
    @media screen and(max-width:450px){
      .title{
        font-size: 12px;
      }
    }
  }
  .header-right {
    width: 45%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: white;
    .item{
      width: 25%;
      height: 50px;
      line-height: 50px;
      cursor: pointer;
      font-size: 18px;
      text-align: center;
    }
  }
  .header-last{
    width: 50px;
    justify-content: space-around;
    display: flex;
    align-items: center;
    .iconfont{
      font-size: 30px;
    }

  }
}
.selected {
   background: radial-gradient(green 45%, rgba(0,0,0,0) 80%); /* 标准的语法 */
}
.header-sidebar{
  position:absolute;
  background:@main-color;
  z-index:999;
  top:0;
  left:0;
  width:100%;
  overflow: hidden;
  height:100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
  .item{
    width: 25%;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    font-size: 18px;
    text-align: center;
  }
  @media screen and(max-width:500px){
  .item{
    font-size: 14px;
  }
}
}
.fade-enter-active {
  transition: all 0.28s;
  transform:translateY(0);
}
.fade-leave-active{
  transition: all 0.5s;
  transform:translateY(-100%);
}
.fade-enter{
  transform:translateY(-100%);
}
@media screen and (min-width:1920px){
.container-header {
  height: 60px;
  .header-left {
    .title {
      font-size: 24px;
    }
  }
  .header-right {
    .item{
      width: 25%;
      height: 60px;
      line-height: 60px;
      font-size: 18px;
    }
  }
  .header-last{
    .iconfont{
      font-size: 34px;
    }
  }
}
}
</style>
