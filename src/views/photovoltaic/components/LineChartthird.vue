<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '98%'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      yMax: {}
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.value)
    },
    setOptions({ expectedData } = {}) {
      for (const key in expectedData) {
        if (key !== 'xAxis' && typeof expectedData[key] !== 'undefined') {
          this.yMax[key] = undefined
          expectedData[key].forEach(value => {
            if (value === undefined) { return } else {
              if (this.yMax[key] === undefined) { this.yMax[key] = value } else {
                this.yMax[key] = this.yMax[key] > value ? this.yMax[key] : value
              }
            }
          })
        }
      }
      if (expectedData.xAxis !== undefined && expectedData.xAxis1 !== undefined) {
        expectedData.xAxis = expectedData.xAxis.length > expectedData.xAxis1.length ? expectedData.xAxis : expectedData.xAxis1
      }
      this.chart.setOption({
        // title: {
        //   text: '水电站电压-电流曲线',
        //   bottom: '0',
        //   left: 'center'
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          bottom: '2%',
          left: '2%',
          right: '2%',
          containLabel: true
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            // magicType: { show: true, type: ['line', 'bar'] },
            // restore: { show: true },
            saveAsImage: { show: true },
            dataZoom: { show: true }
          }
        },
        legend: [
          {
            data: ['A相U', 'B相U', 'C相U', 'AB线U']
          },
          {
            top: 20,
            data: ['AC线U', 'BC线U', 'A相I', 'B相I', 'C相I']
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: expectedData.xAxis,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'U',
            axisLabel: {
              formatter: '{value} V'
            },
            axisLine: {
              lineStyle: {
                color: '#675bba'
              }
            },
            position: 'left',
            max: Math.ceil(Math.max.apply(null, [this.yMax.seriesva, this.yMax.seriesvb, this.yMax.seriesvc, this.yMax.seriesvab, this.yMax.seriesvca, this.yMax.seriesvbc]) * 1.2)
          },
          {
            type: 'value',
            name: 'I',
            position: 'right',
            axisLine: {
              lineStyle: {
                color: '#d14a61'
              }
            },
            axisLabel: {
              formatter: '{value} A'
            },
            max: Math.ceil(Math.max.apply(null, [this.yMax.seriesia, this.yMax.seriesib, this.yMax.seriesic]) * 1.2)
          }
        ],
        series: [
          {
            name: 'A相U',
            type: 'line',
            smooth: true,
            data: expectedData.seriesva
          },
          {
            name: 'B相U',
            type: 'line',
            smooth: true,
            data: expectedData.seriesvb
          },
          {
            name: 'C相U',
            type: 'line',
            smooth: true,
            data: expectedData.seriesvc
          },
          {
            name: 'AB线U',
            type: 'line',
            smooth: true,
            data: expectedData.seriesvab
          },
          {
            name: 'AC线U',
            type: 'line',
            smooth: true,
            data: expectedData.seriesvca
          },
          {
            name: 'BC线U',
            type: 'line',
            smooth: true,
            data: expectedData.seriesvbc
          },
          {
            yAxisIndex: 1,
            name: 'A相I',
            type: 'line',
            smooth: true,
            data: expectedData.seriesia
          },
          {
            yAxisIndex: 1,
            name: 'B相I',
            type: 'line',
            smooth: true,
            data: expectedData.seriesib
          },
          {
            yAxisIndex: 1,
            name: 'C相I',
            type: 'line',
            smooth: true,
            data: expectedData.seriesic
          }
        ]
      })
    }
  }
}
</script>
<style >
  .chart canvas{
    width:100%;
  }
</style>

