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
      yMax: {},
      ledfg:{}
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.chart.resize()
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
      // console.log(chartData)

      const chdata = this.getXaxis(chartData)
      // console.log(chdata)
      var xAxisData = chdata.xAxis
      var data1 = chdata.seriesArray[0] || []
      var data2 = []
      
      // var data3 = [...data2]
      var data3 = chdata.seriesArray[1] || []
      // const data22 = [...data2]
      // console.log(data22)
      // data2 = data2.map((item, index) => {
      //   let itemval = item
      //   if (index == 0) { itemval = 0 } else if (item != '') {
      //     for (let j = index - 1; j >= 0; j++) {
      //       if (data22[j] != '' && item != undefined) {
      //         itemval = Number(item) - Number(data22[j])
      //         break
      //       }
      //     }
      //   }
      //   return itemval
      // })
      data1 = data1.map(item => { if (item !== '' && (Number(item) < -10 || Number(item) > 1000)) return 0; else return item })
      data2=data1.map((item,index)=>{if(item) return (Number(item)+Number(data1[index+1]||data1[index-1]) )/24;else return item})

      // let datestart = 0
      // if (xAxisData.length > 0) { datestart = xAxisData[0].split(' ')[0] }
      // let data3start = data3[0]
      // data3 = data3.map((item, index) => {
      //   if (item == '') return item
      //   else {
      //     if (xAxisData[index]&&datestart == xAxisData[index].split(' ')[0]) {
      //       if(data3start==0||data3start=='') {
      //         data3start = item
      //         if(item!='')
      //           return 0
      //         else
      //           return item
      //       }
      //       return Number(item) - Number(data3start)
      //     } else {
      //       if(xAxisData[index])
      //         datestart = xAxisData[index].split(' ')[0]
      //       data3start = data3[index]
      //       return 0
      //     }
      //   }
      // })
      // data3 = [...data2]
      let datestart = 0
      // if (xAxisData.length > 0) { datestart = xAxisData[0].split(' ')[0] }
      // let data3start = data3[0]
      // data3 = data3.map((item, index) => {
      //   if (item === '') return data3start
      //   else {
      //     if (xAxisData[index]&&datestart == xAxisData[index].split(' ')[0]) {
      //       if(data3start=='') {
      //         data3start = item
      //         return item
      //       }
      //       data3start = Number(item) + Number(data3start)
      //       return data3start
      //     } else {
      //       if(xAxisData[index])
      //         datestart = xAxisData[index].split(' ')[0]
      //       data3start = data3[index]
      //       return 0
      //     }
      //   }
      // })
      data1 = data1.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })
      data2 = data2.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })
      data3 = data3.map((item, index) => { if (xAxisData[index] && new Date(xAxisData[index].replace(/-/g, '/')) > Date.now()) return ''; return item })
      data1 = data1.map(item => { if (item !== '') return item.toFixed(3); else return item })
      data2 = data2.map(item => { if (item !== '') return item.toFixed(4); else return item })
      data3 = data3.map(item => { if (item !== '') return item.toFixed(3); else return item })
      // let yMax = 0
      // yMax = data3.reduce((pre,cur)=>{
      //   if(cur!=''&&cur!=undefined) {
      //     pre=pre>Number(cur)?pre:Number(cur)
      //   }
      //   return pre
      // },0)

      var yMaxLeft=0
      if(!('有功' in this.ledfg)||this.ledfg['有功'])
        yMaxLeft = this.getyMax(data1)
      yMaxLeft = Number((yMaxLeft*1.1).toFixed(1))

      var yMaxRight1=0
      if(!('5min发电量' in this.ledfg)||this.ledfg['5min发电量'])
        yMaxRight1 = this.getyMax([yMaxRight1,...data2])
      if(yMaxRight1<1)
        yMaxRight1 = Number((yMaxRight1*1.3).toFixed(3))
      else
        yMaxRight1 = Math.ceil(yMaxRight1*1.3)

      var yMaxRight2=0
      if(!('累计发电量' in this.ledfg)||this.ledfg['累计发电量'])
        yMaxRight2 = this.getyMax([yMaxRight2,...data3])
      yMaxRight2 = Math.ceil(yMaxRight2*1.2)
      // console.log(chartData)
      // console.log(data2,data3)
      this.chart.setOption({
        xAxis: {
          type: 'category',
          // boundaryGap: false,
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
            const unit = { '有功': 'kW', '日累计发电量': 'kWh', '5min发电量': 'kWh' }
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
          name: '有功',
          type: 'value',
          axisLabel: {
            formatter: '{value} kW'
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
        }, {
          name: '5min电量',
          type: 'value',
          axisLabel: {
            formatter: '{value} kWh'
          },
          splitLine: {
            show: true
          },
          splitArea: {
            show: true
          },
          axisLine: {
            lineStyle: {
              color: 'blue'
            }
          },
          min:0,
          max:yMaxRight1
          // max: Math.ceil((this.yMax.series2 > this.yMax.series1) ? this.yMax.series2 * 1.2 : this.yMax.series1 * 1.2)
        }, {
          name: '累计电量',
          type: 'value',
          offset:80,
          axisLabel: {
            formatter: '{value} kWh'
          },
          splitLine: {
            show: true
          },
          splitArea: {
            show: true
          },
          axisLine: {
            lineStyle: {
              color: 'blue'
            }
          },
          min:0,
          max:yMaxRight2
          // max: Math.ceil((this.yMax.series2 > this.yMax.series1) ? this.yMax.series2 * 1.2 : this.yMax.series1 * 1.2)
        }],
        title: {
          x: 'center',
          // text: '放电量、剩余电量信息',
          textStyle: {
            color: '#000'
          }
        },
        color: ['#c12e34', '#e6b600', '#0c92cb','#2b821d'],
        grid: {
          bottom: '2%',
          left: (data1 && data1.length && '1%') || '2%',
          right: (data2 && data2.length && '5%') || '100',
          top: '70',
          containLabel: true
        },
        legend: {
          data: ['有功', '5min发电量', '日累计发电量'],
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
          name: '有功',
          // data: [820, 932, 901, 934, 1290, 1330, 1320, 1300],
          data: data1,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          type: 'line',
          z:2,
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
        }, {
          name: '5min发电量',
          // data: [820, 932, 901, 934, 1290, 1330, 1320, 1300],
          data: data2,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          yAxisIndex: 1,
          type: 'bar',
          areaStyle: {},
          z:1
        }, {
          symbol:'none',
          name: '日累计发电量',
          // data: [820, 932, 901, 934, 1290, 1330, 1320, 1300],
          data: data3,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          yAxisIndex: 2,
          type: 'line',
          areaStyle: {},
          z:0
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

