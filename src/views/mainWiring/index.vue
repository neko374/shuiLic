<template>
  <div
    class="app-container"
    oncontextmenu="window.event.returnValue=false;return false;"
    onselectstart="event.returnValue=false;return false;"
    ondragstart="window.event.returnValue=false;return false;"
  >
    <TableTe v-model="list" :td-width="[7,7,6]" />
    <hr color="rgb(78,175,211)" style="border-width:0.5px;margin:0;">
    <test class="img" />
  </div>
</template>

<script>
import TableTe from '@/components/TableTe'
import test from './components/test'
import { getCurrentData, getChartData } from '@/api/getCurChart'

export default {
  components: { TableTe, test },
  data() {
    return {
      list: [],
      TimeOut: ''
    }
  },
  created() {
    if (this.$store.state.mainWiring.mainList) { this.list = this.$store.state.mainWiring.mainList }

    this.reload()
    this.TimeOut = setInterval(this.reload, 1000 * sjzRealTime)
  },
  beforeDestroy() {
    this.$store.dispatch('mainWiring/setMainList', this.list)
    clearInterval(this.TimeOut)
  },
  methods: {
    reload() {
      this.list.forEach(value => {
        getCurrentData(value)
      })
    }
  }
}
</script>

<style scoped>
  .img{
    width: 100%;
    height: calc(100% - 130px);
  }
</style>
