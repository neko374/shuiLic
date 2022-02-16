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
    chartNameX:{
      type:Array
    }
  },
  data() {
    return {
      chart: null,
      yMax: {},
      ledfg:{}
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        // this.chart.resize()
        this.setOptions(val)
      }
    },
    chartNameX:{
      deep:true,
      handler(val){
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
      // console.log(this.chartNameX)
      // console.log(chartData)

      const chdata = this.getXaxis(chartData)
      // console.log(chdata)
      var xAxisData = chdata.xAxis || []
      var data1 = chdata.seriesArray[0] || []
      var data2 = chdata.seriesArray[1] || []
      var data3 = chdata.seriesArray[2] || []

      data1 = data1.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })
      data2 = data2.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })
      data3 = data3.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })
      data1 = data1.map(item => { if (item !== '') return item.toFixed(3); else return item })
      data2 = data2.map(item => { if (item !== '') return item.toFixed(4); else return item })
      data3 = data3.map(item => { if (item !== '') return item.toFixed(3); else return item })

      var yMaxLeft=0
      if(!('A相电压' in this.ledfg)||this.ledfg['A相电压'])
        yMaxLeft = this.getyMax(data1)
      if(!('C相电压' in this.ledfg)||this.ledfg['C相电压'])
        yMaxLeft = this.getyMax([yMaxLeft,...data2])
      if(!('B相电压' in this.ledfg)||this.ledfg['B相电压'])
        yMaxLeft = this.getyMax([yMaxLeft,...data3])
      // yMaxLeft = Math.ceil((yMaxLeft*1.2))

      const chdataX = this.getXaxis(this.chartNameX)

      var xAxisDataX = chdataX.xAxis || []
      var data1X = chdataX.seriesArray[0] || []
      var data2X = chdataX.seriesArray[1] || []
      var data3X = chdataX.seriesArray[2] || []

      data1X = data1X.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })
      data2X = data2X.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })
      data3X = data3X.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })
      data1X = data1X.map(item => { if (item !== '') return item.toFixed(3); else return item })
      data2X = data2X.map(item => { if (item !== '') return item.toFixed(4); else return item })
      data3X = data3X.map(item => { if (item !== '') return item.toFixed(3); else return item })

      if(!('昨日A相电压' in this.ledfg)||this.ledfg['昨日A相电压'])
        yMaxLeft = this.getyMax([yMaxLeft,...data1X])
      if(!('昨日C相电压' in this.ledfg)||this.ledfg['昨日C相电压'])
        yMaxLeft = this.getyMax([yMaxLeft,...data2X])
      if(!('昨日B相电压' in this.ledfg)||this.ledfg['昨日B相电压'])
        yMaxLeft = this.getyMax([yMaxLeft,...data3X])
      yMaxLeft = Math.ceil((yMaxLeft*1.2))

      this.chart.setOption({
        xAxis: [{
          type: 'category',
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
        },{
          type: 'category',
          data: xAxisDataX,
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
        }],
        textStyle: {
          color: '#000'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: params => {
            let par = params[0].name + '<br/>'
            const unit = { 'A相电压': 'V', 'B相电压': 'V', 'C相电压': 'V','昨日A相电压': 'V', '昨日B相电压': 'V', '昨日C相电压': 'V' }
            for (const x in params) {
              par += params[x].marker + params[x].seriesName + ': '
              if (params[x].data) { par += params[x].data + ' ' + unit[params[x].seriesName] + '<br/>' } else { par += '-<br/>' }
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
          name: '电压',
          type: 'value',
          axisLabel: {
            formatter: '{value} V'
          },
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
          max:yMaxLeft
          // max: Math.ceil((this.yMax.series2 > this.yMax.series1) ? this.yMax.series2 * 1.2 : this.yMax.series1 * 1.2)
        }],
        title: {
          x: 'center',
          // text: '放电量、剩余电量信息',
          textStyle: {
            color: '#000'
          }
        },
        color: ['#e6b600','#2b821d','#c12e34','#f6c306','#176c09','#eb1821'],
        grid: {
          bottom: '2%',
          left: (data1 && data1.length && '1%') || '2%',
          right: '5%',
          top: '70',
          containLabel: true
        },
        legend: {
          data: ['A相电压', 'C相电压', 'B相电压','昨日A相电压', '昨日C相电压', '昨日B相电压'],
          textStyle: {
            color: ['#e6b600','#2b821d','#c12e34','#f6c306','#176c09','#eb1821']
          },
          top: '5%'
        },
        textStyle: {
          color: '#008ACD'
        },
        series: [{
          symbol:'none',
          name: 'A相电压',
          // data: [820, 932, 901, 934, 1290, 1330, 1320, 1300],
          data: data1,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          type: 'line',
        }, {
          symbol:'none',
          name: 'C相电压',
          // data: [820, 932, 901, 934, 1290, 1330, 1320, 1300],
          data: data2,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          type: 'line',
        }, {
          symbol:'none',
          name: 'B相电压',
          // data: [820, 932, 901, 934, 1290, 1330, 1320, 1300],
          data: data3,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          type: 'line',
        },{
          symbol:'none',
          name: '昨日A相电压',
          // data: [820, 932, 901, 934, 1290, 1330, 1320, 1300],
          data: data1X,
          xAxisIndex:1,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          type: 'line',
        }, {
          symbol:'none',
          name: '昨日C相电压',
          // data: [820, 932, 901, 934, 1290, 1330, 1320, 1300],
          data: data2X,
          xAxisIndex:1,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          type: 'line',
        }, {
          symbol:'none',
          name: '昨日B相电压',
          // data: [820, 932, 901, 934, 1290, 1330, 1320, 1300],
          data: data3X,
          xAxisIndex:1,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          type: 'line',
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
      const value = data.reduce((pre,cur,index)=>{
        if(cur!=''&&cur!=undefined&&cur!=NaN){
          pre=pre>Number(cur)?pre:Number(cur)
        }
        return pre
      },0)
      return value
    },
    resetChart(){
      console.log(111)
      this.chart.dispatchAction({
          type: 'dataZoom',
          // 可选，dataZoom 组件的 index，多个 dataZoom 组件时有用，默认为 0
          dataZoomIndex: [0,1],
          // 开始位置的百分比，0 - 100
          start: 0,
          // 结束位置的百分比，0 - 100
          end: 100
      })
    }
  }
}
</script>

