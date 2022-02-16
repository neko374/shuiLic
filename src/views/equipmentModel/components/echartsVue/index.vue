<template>
  <chart-pie v-bind="$props" @changeTree="changeTree" />
</template>

<script>
import ChartPie from './echarts.vue'

export default {
  name: 'Echart',
  components: { ChartPie },
  props: ChartPie.props,
  methods: {
    changeTree() {
      this.$emit('changeTree')
    }
  }
}
</script>
