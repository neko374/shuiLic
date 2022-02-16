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
    title: {
      type: String
    },
    value: {
      type: Array
    },
    nameOption: {
      type: Object
    }
  },
  data() {
    return {
      chart: null,
      yMax: [],
      ledfg: {}
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    },
    nameOption: {
      deep: true,
      handler(val) {
        this.setOptions(this.value)
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
      this.legendChange()
    },
    setOptions(chartData) {
      const chdata = this.getXaxis(chartData)
      // console.log(chdata,'00',chartData)
      var xAxisData = chdata.xAxis
      // console.log(chartData)
      var data1 = chdata.seriesArray[0] || []

      data1 = data1.map(item => { if (item != '' || item != undefined) return Number(item).toFixed(2) })
      // data2 = data2.map(item => { if (item != '' || item != undefined) return Number(item).toFixed(2) })
      // data3 = data3.map(item => { if (item != '' || item != undefined) return Number(item).toFixed(2) })
      data1 = data1.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })
      // data2 = data2.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })
      // data3 = data3.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })

      this.chart.setOption({
        xAxis: {
          type: 'category',
          // boundaryGap: false,
          data: xAxisData,
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#008ACD'
            }
          }
        },
        textStyle: {
          color: '#008ACD'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: params => {
            let par = params[0].name + '<br/>'
            const unit = {}
            unit[this.nameOption.legend[0]] = this.nameOption.unit
            for (const x in params) {
              if(unit[params[x].seriesName])
                par += params[x].marker + params[x].seriesName + ': ' + (params[x].data === undefined ? '-' : (params[x].data + ' ' + unit[params[x].seriesName])) + '<br/>'
              else
                par += params[x].marker + params[x].seriesName + ': ' + (params[x].data === undefined ? '-' : params[x].data) + '<br/>'
            }
            return par
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            // magicType: { show: true, type: ['line', 'bar'] },
            // restore: { show: true },
            saveAsImage: { show: true },
            dataZoom: { show: true }
          },
          emphasis: {
            iconStyle: {
              borderColor: '#008ACD'
            }
          },
          iconStyle: {
            borderColor: '#008ACD'
          },
          right: '4%'
        },
        yAxis: [{
          name: this.nameOption.yAxisName,
          type: 'value',
          splitLine: {
            show: true
          },
          splitArea: {
            show: true
          },
          // axisLine: {
          //   lineStyle: {
          //     color: '#008ACD'
          //   }
          // },
          axisLabel: {
            formatter: (this.nameOption.unit?`{value} ${this.nameOption.unit}`:'{value}')
          },
        }],
        // title: {
        //   x: 'center',
        //   text: '充放电SOC信息',
        //   textStyle: {
        //     color: '#1BACB1'
        //   }
        // },
        color: ['red', '#FFE1A6'],
        grid: {
          bottom: '3%',
          left: (data1 && data1.length && '2%') || '50',
          right: '50',
          top: '70',
          containLabel: true
        },
        legend: {
          data: this.nameOption.legend,
          textStyle: {
            color: '#008ACD'
          },
          top: '5%'
        },
        // textStyle: {
        //   color: '#008ACD'
        // },
        series: [{
          symbol: 'none',
          name: this.nameOption.legend[0],
          data: data1,
          type: 'line',
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          markPoint: {
            data: [
              { type: 'max', name: '最大值',
                label: {
                  formatter: function(value) {
                    return Number(value.value).toFixed(0)
                  }
                }},
              { type: 'min', name: '最小值' }
            ],
            label: {
              color: 'white'
            }
          },
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
          // itemStyle: {
          //   normal: {
          //     color: 'blue'
          //   }
          // },
          // areaStyle: {}
        }]

      })
    },
    getXaxis(data) {
      let xAxis = data.reduce((pre, cur) => {
        if ('xAxis' in cur.data) {
          pre = _.uniq([...pre, ...cur.data.xAxis])
          pre = _.sortBy(pre)
        }
        return pre
      }, [])
      xAxis = [...xAxis]
      const series = {}
      data.forEach((value, index) => {
        series[index] = xAxis.map(item => '')
        if ('xAxis' in value.data) {
          value.data.xAxis.forEach((val, ind) => {
            const b = xAxis.indexOf(val)
            if (b != -1) series[index][b] = value.data.series[ind]
          })
        }
      })
      return { xAxis: xAxis, seriesArray: series }
    },
    legendChange() {
      this.chart.on('legendselectchanged', obj => {
        const selected = obj.selected
        const legend = obj.name
        // 使用 legendToggleSelect Action 会重新触发 legendselectchanged Event，导致本函数重复运行
        // 使得 无 selected 对象
        if (selected != undefined) {
          this.ledfg = selected
          this.setOptions(this.value)
        }
      })
    },
    getyMax(data) {
      const value = data.reduce((pre, cur) => {
        if (cur != '' && cur != undefined && cur != NaN) {
          pre = pre > Number(cur) ? pre : Number(cur)
        }
        return pre
      }, 0)
      return value
    },
    resetChart() {
      if (this.chart != null) {
        this.chart.dispose()
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.value)
        this.legendChange()
      }
    }
  }
}
</script>
<style >
  .chart canvas{
    width:100%;
  }
</style>

