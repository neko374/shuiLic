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
        // console.log(val)
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
      // var xAxisData = chartData[0].data.xAxis || []
      // var data1 = chartData[0].data.series || []
      // var data2 = chartData[1].data.series || []
      // var data3 = chartData[2].data.series || []
      // var data4 = chartData[3].data.series || []
      // var data5 = chartData[4].data.series || []
      const chdata = this.getXaxis(chartData)
      // console.log(chdata)
      var xAxisData = chdata.xAxis
      var data1 = chdata.seriesArray[0] || []
      var data2 = chdata.seriesArray[1] || []
      var data3 = chdata.seriesArray[2] || []
      var data4 = chdata.seriesArray[3] || []
      var data5 = chdata.seriesArray[4] || []

      var yMaxLeft=0
      if(!('线电压AB' in this.ledfg)||this.ledfg['线电压AB'])
        yMaxLeft = this.getyMax(data1)
      if(!('线电压BC' in this.ledfg)||this.ledfg['线电压BC'])
        yMaxLeft = this.getyMax([yMaxLeft,...data2])
      if(!('线电压CA' in this.ledfg)||this.ledfg['线电压CA'])
        yMaxLeft = this.getyMax([yMaxLeft,...data3])
      if(!('直流侧电压' in this.ledfg)||this.ledfg['直流侧电压'])
        yMaxLeft = this.getyMax([yMaxLeft,...data4])
      yMaxLeft = Math.ceil(yMaxLeft*1.2)

      var yMaxRight = 0
      if(!('交流有功功率' in this.ledfg)||this.ledfg['交流有功功率'])
        yMaxRight = this.getyMax(data5)
      yMaxRight = Math.ceil(yMaxRight*1.2)

      // let yMaxLeft = [...data1, ...data2, ...data3, ...data4].reduce((pre, cur) => {
      //   if (cur != undefined && cur != '' && cur != null) { pre = pre > Number(cur) ? pre : Number(cur) }
      //   return pre
      // }, 0)
      // yMaxLeft = Math.ceil(yMaxLeft * 1.2)
      // let yMaxRight = data5.reduce((pre, cur) => {
      //   if (cur != undefined && cur != '' && cur != null) { pre = pre > Number(cur) ? pre : Number(cur) }
      //   return pre
      // }, 0)
      // yMaxRight = Math.ceil(yMaxRight * 1.2) | 50

      this.chart.setOption({
        // title: {
        //   x: 'center',
        //   text: '电压电流信息',
        //   textStyle: {
        //     color: '#1BACB1'
        //   }
        // },
        color: ['#13f75a', '#fb0000'],
        grid: {
          bottom: '3%',
          left: (((data1 && data1.length) || (data2 && data2.length) || (data3 && data3.length) || (data4 && data4.length)) && '2%') || '5%',
          right: (data5 && data5.length && '2%') || '5%',
          top: '70',
          containLabel: true
        },
        legend: {
          data: ['线电压AB', '线电压BC', '线电压CA', '直流侧电压', '交流有功功率'],
          textStyle: {
            color: '#008ACD',
            fontSize: 12
          },
          top: '7%',
          width: '80%',
          // left:'8%',
          // right: '8%',
          type: 'scroll' // 分页类型
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
            const unit = { '线电压AB': 'V', '线电压BC': 'V', '线电压CA': 'V', '直流侧电压': 'V', '交流有功功率': 'kW' }
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
        // backgroundColor:'rgba(0,0,0,0)',
        xAxis: {
          type: 'category',
          boundaryGap: false,
          // data: ['03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00'],
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

        yAxis: [{
          name: '电压/V',
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
          max: yMaxLeft,
          min: 0
        }, {
          name: '功率/kW',
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
          max: yMaxRight
          // min:-1000
        }],

        series: [{
          symbol:'none',
          name: '线电压AB',
          // data: [820, 932, 901, 934, 1290, 1330, 1320, 1300],
          data: data1,
          type: 'line'
          // smooth: false
        },
        {
          symbol:'none',
          name: '线电压BC',
          // data: [320, 632, 1301, 534, 1190, 1030, 1220, 1200],
          data: data2,
          type: 'line'
        },
        {
          symbol:'none',
          name: '线电压CA',
          // data: [800, 432, 401, 934, 1290, 1330, 1320, 1300],
          data: data3,
          type: 'line'
        },
        {
          symbol:'none',
          name: '直流侧电压',
          // data: [850, 332, 301, 900, 1290, 1330, 1320, 1300],
          data: data4,
          type: 'line'
        },
        {
          symbol:'none',
          name: '交流有功功率',
          // data: [890, 532, 701, 587, 1290, 1330, 1320, 1300],
          data: data5,
          type: 'line',
          yAxisIndex: 1
        }
        ]

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

