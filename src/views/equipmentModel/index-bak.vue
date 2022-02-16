<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/mixins/resize'
import dialogTree from './components/echartsVue/dialogTree'
import historyData from './components/echartsVue/historyData'
import deviceModel from './components/echartsVue/deviceModel'

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
      ledfg: {}
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
      var data = {
    "name": "flare",
    "children": [
        {
            "name": "data",
            "children": [
                {
                     "name": "converters",
                     "children": [
                      {"name": "Converters", "value": 721},
                      {"name": "DelimitedTextConverter", "value": 4294}
                     ]
                },
                {
                    "name": "DataUtil",
                    "value": 3322
                }
            ]
        },
        {
            "name": "display",
            "children": [
                {"name": "DirtySprite", "value": 8833},
                {"name": "LineSprite", "value": 1732},
                {"name": "RectSprite", "value": 3623}
           ]
        },
        {
            "name": "flex",
            "children": [
                {"name": "FlareVis", "value": 4116}
            ]
        },
        {
           "name": "query",
           "children": [
            {"name": "AggregateExpression", "value": 1616},
            {"name": "And", "value": 1027},
            {"name": "Arithmetic", "value": 3891},
            {"name": "Average", "value": 891},
            {"name": "BinaryExpression", "value": 2893},
            {"name": "Comparison", "value": 5103},
            {"name": "CompositeExpression", "value": 3677},
            {"name": "Count", "value": 781},
            {"name": "DateUtil", "value": 4141},
            {"name": "Distinct", "value": 933},
            {"name": "Expression", "value": 5130},
            {"name": "ExpressionIterator", "value": 3617},
            {"name": "Fn", "value": 3240},
            {"name": "If", "value": 2732},
            {"name": "IsA", "value": 2039},
            {"name": "Literal", "value": 1214},
            {"name": "Match", "value": 3748},
            {"name": "Maximum", "value": 843},
            {
             "name": "methods",
             "children": [
              {"name": "add", "value": 593},
              {"name": "and", "value": 330},
              {"name": "average", "value": 287},
              {"name": "count", "value": 277},
              {"name": "distinct", "value": 292},
              {"name": "div", "value": 595},
              {"name": "eq", "value": 594},
              {"name": "fn", "value": 460},
              {"name": "gt", "value": 603},
              {"name": "gte", "value": 625},
              {"name": "iff", "value": 748},
              {"name": "isa", "value": 461},
              {"name": "lt", "value": 597},
              {"name": "lte", "value": 619},
              {"name": "max", "value": 283},
              {"name": "min", "value": 283},
              {"name": "mod", "value": 591},
              {"name": "mul", "value": 603},
              {"name": "neq", "value": 599},
              {"name": "not", "value": 386},
              {"name": "or", "value": 323},
              {"name": "orderby", "value": 307},
              {"name": "range", "value": 772},
              {"name": "select", "value": 296},
              {"name": "stddev", "value": 363},
              {"name": "sub", "value": 600},
              {"name": "sum", "value": 280},
              {"name": "update", "value": 307},
              {"name": "variance", "value": 335},
              {"name": "where", "value": 299},
              {"name": "xor", "value": 354},
              {"name": "_", "value": 264}
             ]
            },
            {"name": "Minimum", "value": 843},
            {"name": "Not", "value": 1554},
            {"name": "Or", "value": 970},
            {"name": "Query", "value": 13896},
            {"name": "Range", "value": 1594},
            {"name": "StringUtil", "value": 4130},
            {"name": "Sum", "value": 791},
            {"name": "Variable", "value": 1124},
            {"name": "Variance", "value": 1876},
            {"name": "Xor", "value": 1101}
           ]
          },
        {
           "name": "scale",
           "children": [
            {"name": "IScaleMap", "value": 2105},
            {"name": "LinearScale", "value": 1316},
            {"name": "LogScale", "value": 3151},
            {"name": "OrdinalScale", "value": 3770},
            {"name": "QuantileScale", "value": 2435},
            {"name": "QuantitativeScale", "value": 4839},
            {"name": "RootScale", "value": 1756},
            {"name": "Scale", "value": 4268},
            {"name": "ScaleType", "value": 1821},
            {"name": "TimeScale", "value": 5833}
           ]
        }
    ]
};

var data2 = {
    "name": "flare",
    "children": [
        {
            "name": "flex",
            "children": [
                {"name": "FlareVis", "value": 4116}
            ]
        },
        {
            "name": "scale",
            "children": [
                {"name": "IScaleMap", "value": 2105},
                {"name": "LinearScale", "value": 1316},
                {"name": "LogScale", "value": 3151},
                {"name": "OrdinalScale", "value": 3770},
                {"name": "QuantileScale", "value": 2435},
                {"name": "QuantitativeScale", "value": 4839},
                {"name": "RootScale", "value": 1756},
                {"name": "Scale", "value": 4268},
                {"name": "ScaleType", "value": 1821},
                {"name": "TimeScale", "value": 5833}
           ]
        },
        {
            "name": "display",
            "children": [
                {"name": "DirtySprite", "value": 8833}
           ]
        }
    ]
};
      this.chart.setOption({
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
    },
    legend: {
        top: '2%',
        left: '3%',
        orient: 'vertical',
        data: [{
            name: 'tree1',
            icon: 'rectangle'
        },
        {
            name: 'tree2',
            icon: 'rectangle'
        }],
        borderColor: '#c23531'
    },
    series:[
        {
            type: 'tree',

            name: 'tree1',

            data: [data],

            top: '5%',
            left: '7%',
            bottom: '2%',
            right: '60%',

            symbolSize: 7,

            label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right'
            },

            leaves: {
                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                }
            },

            expandAndCollapse: true,

            animationDuration: 550,
            animationDurationUpdate: 750

        },
        {
            type: 'tree',
            name: 'tree2',
            data: [data2],

            top: '20%',
            left: '60%',
            bottom: '22%',
            right: '18%',

            symbolSize: 7,

            label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right'
            },

            leaves: {
                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                }
            },

            expandAndCollapse: true,

            animationDuration: 550,
            animationDurationUpdate: 750
        }
    ]
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
      const value = data.reduce((pre, cur, index) => {
        if (cur != '' && cur != undefined && cur != NaN) {
          pre = pre > Number(cur) ? pre : Number(cur)
        }
        return pre
      }, 0)
      return value
    },
    resetChart() {
      this.chart.dispatchAction({
        type: 'dataZoom',
        // 可选，dataZoom 组件的 index，多个 dataZoom 组件时有用，默认为 0
        dataZoomIndex: [0, 1],
        // 开始位置的百分比，0 - 100
        start: 0,
        // 结束位置的百分比，0 - 100
        end: 100
      })
    }
  }
}
</script>

