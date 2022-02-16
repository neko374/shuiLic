<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import yunnanJ from './yunnan/yunnan.json'
import { getWeather } from '@/api/weather'

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
      default: '100%'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      weather: [
        { code: '101290101', value: '昆明市' },
        { code: '101290401', value: '曲靖市' },
        { code: '101290701', value: '玉溪市' },
        { code: '101291001', value: '昭通市' },
        { code: '101290501', value: '保山市' },
        { code: '101291401', value: '丽江市' },
        { code: '101290901', value: '普洱市' },
        { code: '101291101', value: '临沧市' },
        { code: '101291501', value: '德宏傣族景颇族自治州' },
        { code: '101291201', value: '怒江傈僳族自治州' },
        { code: '101291301', value: '迪庆藏族自治州' },
        { code: '101290201', value: '大理白族自治州' },
        { code: '101290801', value: '楚雄彝族自治州' },
        { code: '101290301', value: '红河哈尼族彝族自治州' },
        { code: '101290601', value: '文山壮族苗族自治州' },
        { code: '101291601', value: '西双版纳傣族自治州' }
      ],
      weatherData: {}
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  created() {
    this.getWeatherData()
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
      this.setOptions(this.chartData)
    },
    setOptions({ expectedData } = {}) {
      var yunnan = yunnanJ
      var nameMap = '云南省'
      var seriesdata = [
        // 左边地图
        {
          type: 'map',
          map: nameMap,
          // selectedMode : 'multiple',
          aspectScale: 0.75,
          left: '2%',
          top: 10,
          width: '95%',
          height: '90%',
          roam: false,
          itemStyle: {
            normal: {
              areaColor: 'transparent',
              borderColor: '#fff',
              borderWidth: 1.5,
              label: {
                show: true,
                color: '#fff'
              }
            }
          },
          emphasis: {
            label: {
              show: true
            },
            itemStyle: {
              areaColor: '#58ffff'
            }
          },
          data: [{
            name: '昆明市',
            selected: true
          }]
        }
      ]

      var option = {
        backgroundColor: 'transparent',
        grid: {
          right: '5%',
          bottom: '3%',
          width: '25%',
          height: '80%'
        },
        series: seriesdata,
        tooltip: {
          trigger: 'item',
          backgroundColor: '#6A6AFF',
          formatter: data => {
            // 实时的光伏总压
            return "<div style='color:#58ffff;font-size:14px;width:150px;'>" + data.name + '</div>' + '<div style="font-size:12px;">气象</div>' + '<hr color="#58ffff"/>' +
             '<table width="150px" style="text-align:center;font-size:12px;margin-top:-40px;" cellspacing="0"><tr><td>天气：</td><td>' + this.weatherData[data.name][0].state + '</td></tr></br>' +
             '<tr><td>温度：</td><td>' + this.weatherData[data.name][0].temperature + '℃</td></tr><br/>' +
             '<tr><td>风速：</td><td>' + this.weatherData[data.name][0].windspeed + 'm/s</td></tr></table>'
          },
          extraCssText: 'height:140px;'
        }
      }

      if (option && typeof option === 'object') {
        echarts.registerMap(nameMap, yunnan)
        this.chart.setOption(option, true)
        this.chart.on('mouseover', params => {
          // console.log(params)
          if (params.name !== '昆明市') {
            this.chart.dispatchAction({
              type: 'downplay',
              name: '昆明市'
            })
          }
        })
        this.chart.on('mouseout', params => {
          // console.log(params)
          this.chart.dispatchAction({
            type: 'highlight',
            name: '昆明市'
          })
        })
      }
    },
    getWeatherData() {
      for (let j = 0; j < this.weather.length; j++) {
        const data = this.weather[j].code
        getWeather(data).then(response => {
          const res = response.weather
          this.weatherData[this.weather[j].value] = [{ state: res.phenomena, temperature: res.temperature, windspeed: res.windspeed, humidity: res.humidity }]
        })
      }
    }
  }
}
</script>
<style >
.chart canvas {
  width: 100%;
}
</style>

