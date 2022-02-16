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
    }
  },
  data() {
    return {
      chart: null,
      yMax: [],
      ledfg:{}
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
      this.legendChange()
    },
    setOptions(chartData) {
      const chdata = this.getXaxis(chartData)
      // console.log(chdata)
      var xAxisData = chdata.xAxis
      // console.log(chartData)
      var data1 = chdata.seriesArray[0] || []
      var data2 = chdata.seriesArray[1] || []
      var data3 = chdata.seriesArray[2] || []

      data1 = data1.map(item => { if (item != '' || item != undefined) return Number(item).toFixed(2) })
      data2 = data2.map(item => { if (item != '' || item != undefined) return Number(item).toFixed(2) })
      data3 = data3.map(item => { if (item != '' || item != undefined) return Number(item).toFixed(2) })
      data1 = data1.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })
      data2 = data2.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })
      data3 = data3.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })
      // console.log('data1',data1)
      var yMax1=0
      if(!('当日充电量' in this.ledfg)||this.ledfg['当日充电量'])
        yMax1 = this.getyMax(data1)
      if(!('当日放电量' in this.ledfg)||this.ledfg['当日放电量'])
        yMax1 = this.getyMax([yMax1,...data2])
      yMax1 = Math.ceil(yMax1*1.2)

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
            const unit = { '当日充电量': 'kWh', '当日放电量': 'kWh', 'SOC': '%' }
            for (const x in params) {
              par += params[x].marker + params[x].seriesName + ': ' + (params[x].data === undefined ? '-' : (params[x].data + ' ' + unit[params[x].seriesName])) + '<br/>'
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
          name: '充电/放电量',
          type: 'value',
          splitLine: {
            show: true
          },
          splitArea: {
            show: true
          },
          axisLine: {
            lineStyle: {
              color: '#008ACD'
            }
          },
          axisLabel: {
            formatter: '{value} kWh'
          },
          min: 0,
          max: yMax1
        }, {
          name: 'SOC',
          type: 'value',
          splitLine: {
            show: true
          },
          splitArea: {
            show: true
          },
          nameTextStyle: {
            color: 'red'
          },
          axisLine: {
            lineStyle: {
              color: 'red'
            }
          },
          axisLabel: {
            color: 'red',
            formatter: '{value} %'
          },
          max: 100,
          min: 0
        }],
        // title: {
        //   x: 'center',
        //   text: '充放电SOC信息',
        //   textStyle: {
        //     color: '#1BACB1'
        //   }
        // },
        color: ['#53C2EB', '#FFE1A6'],
        grid: {
          bottom: '3%',
          left: (data1 && data1.length && '2%') || (data2 && data2.length && '2%') || '50',
          right: (data3 && data3.length && '2%') || '4%',
          top: '70',
          containLabel: true
        },
        legend: {
          data: ['当日充电量', '当日放电量', 'SOC'],
          textStyle: {
            color: '#008ACD'
          },
          top: '5%'
        },
        textStyle: {
          color: '#008ACD'
        },
        series: [{
          symbol:'none',
          name: '当日充电量',
          data: data1,
          type: 'line',
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          itemStyle: {
            normal: {
              color: 'blue'
            }
          },
          areaStyle: {}
        },
        {
          symbol:'none',
          name: '当日放电量',
          data: data2,
          type: 'line',
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          itemStyle: {
            normal: {
              color: 'green'
            }
          },
          areaStyle: {}
          // itemStyle: {
          //   normal: {
          //     lineStyle: {
          //       width: 2
          //     },
          //     color: new echarts.graphic.LinearGradient(
          //       0, 0, 0, 1,
          //       [
          //         { offset: 0, color: '#FFE1A6' }, // 柱图渐变色
          //         { offset: 0.5, color: '#FFE1A6' }, // 柱图渐变色
          //         { offset: 1, color: '#FFE1A6' } // 柱图渐变色
          //       ]
          //     )
          //   },
          //   emphasis: {
          //     color: new echarts.graphic.LinearGradient(
          //       0, 0, 0, 1,
          //       [
          //         { offset: 0, color: '#FFE1A6' }, // 柱图高亮渐变色
          //         { offset: 0.7, color: '#FFE1A6' }, // 柱图高亮渐变色
          //         { offset: 1, color: '#FFE1A6' } // 柱图高亮渐变色
          //       ]
          //     )
          //   }
          // },
          // areaStyle: {
          //   normal: {
          //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //       { offset: 0, color: 'rgba(255, 255, 0, 0.5)' },
          //       { offset: 1, color: 'rgba(255, 255, 0, 0.5)' }
          //     ])
          //   }
          // }
        },
        {
          symbol:'none',
          name: 'SOC',
          data: data3,
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2,
                type: 'solid'
              },
              color: 'red'
            }
          }
        }]

      })
    },
    getXaxis(data) {
      let xAxis = data.reduce((pre,cur)=>{
        if('xAxis' in cur.data)
          pre = new Set([...pre,...cur.data.xAxis])
        return pre
      },[])
      xAxis = [...xAxis]
      let series = {}
      data.forEach((value,index)=>{
        series[index]= xAxis.map(item=>'')
        if('xAxis' in value.data) {
          value.data.xAxis.forEach((val,ind)=>{
            let b = xAxis.indexOf(val)
            if(b!=-1) series[index][b] = value.data.series[ind]
          })
        }
      })
      return {xAxis:xAxis,seriesArray:series}
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
    getyMax(data){
      const value = data.reduce((pre,cur)=>{
        if(cur!=''&&cur!=undefined&&cur!=NaN){
          pre=pre>Number(cur)?pre:Number(cur)
        }
        return pre
      },0)
      return value
    },
    resetChart(){
      if(this.chart!=null) {
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

