<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo&&leftLogo" :src="logo1" class="sidebar-logo">
        <!-- <h1 v-else class="sidebar-title">{{ title }} </h1> -->
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo1&&leftLogo" :src="logo" class="sidebar-logo">
        <!-- <h1 class="sidebar-title">{{ title }} </h1> -->
      </router-link>
    </transition>
  </div>
</template>

<script>
import logo from '@/assets/binhaiLogo.png'
import logo1 from '@/assets/logo1.png'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Vue Element Admin',
      // logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
      logo,
      logo1,
      leftLogo: $_leftLogo

    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 70px;
  line-height: 70px;
  background: #053364;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      // width: 32px;
      // height: 32px;
      vertical-align: middle;
      margin-right: 12px;
      // width:85%;
      max-height:100%;
      max-width:100%;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 70px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    height: 70px;
    line-height: 70px;
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
