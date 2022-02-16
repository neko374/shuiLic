<template>
  <div class="app-container">
    <TableTe v-model="list" :td-width="[8,8,8]" class="tablete1" :color="['#ffc900','#2b821d','#eb1821']"/>
    <hr color="rgb(78,175,211)" style="border-width:0.5px;margin:0;">
    <div class="botBox" :style="{height:botBoxHeight}">
      <el-form
        :inline="true"
        style="margin-left:8%;margin-top:10px;float:left;"
      >
        <el-form-item label="开始时间" style="margin-bottom: 2px">
          <el-date-picker
            ref="datepicker"
            v-model="date[0]"
            class="sjzsksj"
            style="width:200px;"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:05:00"
            :clearable="false"
            :picker-options="pickerOptionsstart"
            placeholder="开始时间"
          />
        </el-form-item>
        <el-form-item label="结束时间" style="margin-bottom: 2px">
          <el-date-picker
            ref="datepicker1"
            v-model="date[1]"
            class="sjzsksj"
            style="width:200px;"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            :clearable="false"
            :picker-options="pickerOptionsend"
            placeholder="结束时间"
          />
        </el-form-item>
      </el-form>
      <el-form :inline="true" style="margin-left:10px;margin-top:10px;float:left;">
        <el-form-item style="margin-bottom: 2px">
          <el-button size="medium" type="success" class="el-icon-search" @click="dataChange">查询</el-button>
        </el-form-item>
      </el-form>
      <div style="clear:both;" />
      <div class="photovoltaic" style="height:calc(100% - 50px);width:98%;margin-left:2%">
        <charts1 v-model="chartName" ref="chart1" :chartNameX="chartNameX"/>
      </div>
    </div>
  </div>
</template>

<script>
import TableTe from '@/components/TableTe'
import charts1 from '../components/charts2'
import LineChartthird from '../components/LineChartthird'
import { getCurrentData, getCurrentData1, getChartData } from '@/api/getCurChart'

export default {
  components: { TableTe, charts1, LineChartthird },
  watch: {
    'date.0'(val) {
      this.$refs.datepicker.handleClose()
    },
    'date.1'(val) {
      this.$refs.datepicker1.handleClose()
    }
  },
  data() {
    return {
      date: [new Date().format('yyyy-MM-dd 00:05:00'), new Date(Date.now() + 24 * 3600 * 1000).format('yyyy-MM-dd 00:00:00')],
      list: [],
      pv1: [],
      pickerOptionsstart: {
        disabledDate: time => {
          return time.getTime() >= new Date(this.date[1]).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000
        }
      },
      pickerOptionsend: {
        disabledDate: time => {
          return time.getTime() <= new Date(this.date[0]).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000
        }
      },
      TimeOut: '',
      TimeOutC: '',
      chartNameX: [],
      chartName: [],
      chartName1: [],
      botBoxHeight: 'calc(100% - 50px)'
    }
  },
  created() {
    if (this.$store.state.pvElectric.pv1Cur) { this.pv1 = this.$store.state.pvElectric.pv1Cur }

    if (this.$store.state.pvElectric.pv1Chart) { this.chartName1 = this.$store.state.pvElectric.pv1Chart }

    this.list = this.pv1
    this.chartName = this.chartName1
    this.reload()
    this.reloadC()
    this.TimeOut = setInterval(this.reload, 1000 * sjzRealTime)
    this.TimeOutC = setInterval(this.reloadC, 1000 * 60)
  },
  beforeDestroy() {
    clearInterval(this.TimeOut)
    clearInterval(this.TimeOutC)
  },
  methods: {
    reload() {
      getCurrentData1(this.list.reduce((pre, cur) => pre.concat(cur), []), response => {
        const res = response
        this.list.forEach(value => {
          value.forEach(val => {
            if ('protocolType' in val) {
              if ('stateQk' in val) {
                val.protocolType.forEach((proval, proindex) => {
                  for (const j in val.stateQk) {
                    const val1 = val.stateQk[j]
                    if (val1.type == res[val.farmId[0] + '-' + proval] && res[val.farmId[0] + '-' + proval] !== '') {
                      if (typeof val.valuec != 'object') { val.valuec = ['', '', '', '', ''] }
                      const valuesd = [...val.valuec]
                      valuesd[proindex] = Number(res[val.farmId[0] + '-' + proval])
                      // console.log(Number(res[val.farmId[0] + '-' + proval]))
                      val.valuec = valuesd
                      if (valuesd.indexOf(3) > -1) {
                        val.value = '正常'
                      } else {
                        val.value = val.stateQk[j].name
                      }
                      break
                    }
                  }
                })
              } else {
                if (res[val.farmId[0] + '-' + val.protocolType] != undefined) {
                  val.value = res[val.farmId[0] + '-' + val.protocolType]
                }
              }
            }
          })
        })
      })
    },
    reloadC() {
      getChartData(this.chartName, { time: this.date }, '光伏电站')
      this.chartNameX = JSON.parse(JSON.stringify(this.chartName))
      let date = [new Date(this.date[0].replace(/-/g, '/')),new Date(this.date[1].replace(/-/g, '/'))]
      date[0] = date[0].setDate(date[0].getDate()-1)
      date[1] = date[1].setDate(date[1].getDate()-1)
      date = [new Date(date[0]).format(),new Date(date[1]).format()]
      getChartData(this.chartNameX, { time: date }, '光伏电站')
    },
    // 查询按钮
    dataChange() {
      this.reloadC()
    }
  }
}
</script>

<style scoped>
  .botBox{
    height:calc(100% - 300px);
    min-height:380px;
  }
</style>
