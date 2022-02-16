<template>
  <div style="width:100%;height:100%;">
    <div ref="chartTree" class="chart" />
    <dialog-tree
      :dialog-status-tree="dialogStatusTree"
      :dialog-visible-tree.sync="dialogVisibleTree"
      :device-data="deviceData"
      @changeTree="changeTree"
      :projectId="projectId"
    />
    <history-data
      :dialog-status-tree="dialogStatusTree"
      :dialog-visible-tree.sync="dialogVisibleTree"
      :device-data="deviceData"
    />
    <device-model
      :dialog-status-tree="dialogStatusModel"
      :dialog-visible-tree.sync="dialogVisibleModel"
      :device-data="deviceData"
      :projectId="projectId"
    />
  </div>
</template>

<script>
import echarts from 'echarts'
import { BASIC_OPTION } from './default_options'
import { COLOR_ARRAY } from './color'
import ResizeListener from 'element-resize-detector'
import dialogTree from './dialogTree'
import historyData from './historyData'
import deviceModel from './deviceModel'

export default {
  name: 'ChartPie',
  components: {
    dialogTree,
    historyData,
    deviceModel
  },
  props: {
    seriesData: {
      type: Array,
      required: true,
      default: () => []
    },
    extraOption: {
      type: Object,
      default: () => ({})
    },
    echtreeflag: {
      type: Boolean,
      default: false
    },
    projectId:{
      type:String|Number,
      default:''
    }
  },
  data() {
    return {
      chart: null,
      dialogStatusTree: '',
      dialogVisibleTree: false,
      dialogStatusModel: '',
      dialogVisibleModel: false,
      dialogStatus:'',
      deviceData: {}
    }
  },
  watch: {
    seriesData: {
      deep: true,
      handler() {
        this.updateChartView()
      }
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chartTree)
    this.addEchartsYj()
    this.updateChartView()
    window.addEventListener('resize', this.handleWindowResize)
    this.addChartResizeListener()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    /**
     * 将业务数据加入到基础样式配置中
     * @returns {Object} 完整的echart配置
     */
    assembleDataToOption() {
      // const formatter = name => {
      //   const total = this.seriesData.reduce((acc, cur) => acc + cur.value, 0);
      //   const data = this.seriesData.find(item => item.name === name) || {};
      //   const percent = data.value
      //     ? `${Math.round((data.value / total) * 100)}%`
      //     : '0%';

      //   // return `{a|${name}}{b|${percent}}`;
      //   return `${name}`;
      // };

      return _.merge(
        {},
        BASIC_OPTION,
        { color: COLOR_ARRAY },
        {
          // legend: { formatter },
          series: [{ data: this.seriesData }]
        },
        this.extraOption
      )
    },

    /**
     * 对chart元素尺寸进行监听，当发生变化时同步更新echart视图
     */
    addChartResizeListener() {
      const instance = ResizeListener({
        strategy: 'scroll',
        callOnAdd: true
      })

      instance.listenTo(this.$refs.chartTree, () => {
        if (!this.chart) return
        this.chart.resize()
      })
    },

    /**
     * 更新echart视图
     */
    updateChartView() {
      if (!this.chart) return

      const fullOption = this.assembleDataToOption()
      // console.log(fullOption)
      this.chart.setOption(fullOption, true)
    },

    /**
     * 当窗口缩放时，echart动态调整自身大小
     */
    handleWindowResize() {
      if (!this.chart) return
      this.chart.resize()
    },

    /**
     * echarts右键菜单
     */
    addEchartsYj() {
      // 去除默认的鼠标事件
      document.oncontextmenu = function() { return false }
      // 新加上鼠标右击事件
      this.chart.on('contextmenu', params => {
        // console.log("右键事件");
        const data = params.data
        let asdf = this.findIndexArray(this.seriesData,data.id,[])
        if(asdf.length>1) {
          data.pidName = asdf[asdf.length - 2]
        }
        if (('projectId' in data)) {
          this.$contextmenu({
            items: [
              {
                label: '新增子级设备',
                onClick: () => {
                  this.deviceData = {
                    name:data.name,
                    id:0
                  }
                  this.dialogStatus = 'diaTree'
                  this.dialogStatusTree = 'createChild'
                  this.dialogVisibleTree = true
                }
              },
            ],
            event,
            customClass: 'class-a',
            zIndex: 3,
            minWidth: 230
          })
          return
        }
        this.$contextmenu({
          items: [
            {
              label: '创建节点',
              icon: 'iconfontMenu iconMenu-xiangmuxinxi',
              // onClick: () => {
              //   this.dialogStatus = 'station'
              //   this.dialogFormVisible = true
              // },
              children: [
                {
                  label: '新增同级设备',
                  onClick: () => {
                    this.deviceData = _.cloneDeep(data)
                    this.dialogStatus = 'diaTree'
                    this.dialogStatusTree = 'create'
                    this.dialogVisibleTree = true
                  }
                },
                {
                  label: '新增子级设备',
                  onClick: () => {
                    this.deviceData = _.cloneDeep(data)
                    this.dialogStatus = 'diaTree'
                    this.dialogStatusTree = 'createChild'
                    this.dialogVisibleTree = true
                  }
                },
                {
                  label: '节点编辑',
                  onClick: () => {
                    this.deviceData = _.cloneDeep(data)
                    this.dialogStatus = 'diaTree'
                    this.dialogStatusTree = 'update'
                    this.dialogVisibleTree = true
                  }
                }
              ]
            },
            {
              label: '模型编辑',
              icon: 'iconfont icon-xinxiguanli',
              onClick: () => {
                this.deviceData = _.cloneDeep(data)
                this.dialogStatus = 'deviceModel'
                this.dialogStatusModel = 'deviceModel'
                this.dialogVisibleModel = true
              }
            },
            {
              label: '历史数据',
              icon: 'iconfontMenu iconMenu-shishishuju',
              onClick: () => {
                this.deviceData = _.cloneDeep(data)
                this.dialogStatus = 'history'
                this.dialogStatusTree = 'history'
                this.dialogVisibleTree = true
              }
            },
            {
              label: '删除',
              icon:'iconfont icon-trash',
              onClick: () => {
                this.deviceData = _.cloneDeep(data)
                this.dialogStatus = 'diaTree'
                this.dialogStatusTree = 'delete'
                this.dialogVisibleTree = true
              }
            }
          ],
          event,
          customClass: 'class-a',
          zIndex: 3,
          minWidth: 230
        })
      })
    },
    changeTree() {
      this.$emit('changeTree')
    },
    findIndexArray(data, id, indexArray) {
      let arr = Array.from(indexArray)
      for (let i = 0, len = data.length; i < len; i++) {
          arr.push(data[i].name)
          if (data[i].id === id) {
              return arr
          }
          let children = data[i].children
          if (children && children.length) {
              let result = this.findIndexArray(children, id, arr)
              if (result) return result
          }
          arr.pop()
      }
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
