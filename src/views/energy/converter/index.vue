<template>
  <div class="app-container">
    <TableTe v-model="list" :td-width="[7,7,7]" />
    <hr color="rgb(78,175,211)" style="border-width:0.5px;margin:0;">
    <div class="botContainer">
      <div style="width:calc(98% - 20%);height:100%;margin-right:2%;">
        <p style="color:#1BACB1;font-size:20px;text-align:center;margin-block-start: 10px;margin-block-end: 10px;">电压功率信息</p>
        <div>
          <el-form :inline="true" style="text-align: center;">
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
            <el-form-item style="margin-bottom: 2px">
              <el-button size="medium" type="success" class="el-icon-search" @click="dataChange">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div style="height:calc(100% - 80px);">
          <charts3 v-model="chartName" style="height:100%;" ref="charts3"/>
        </div>
      </div>
      <table class="tableA" border="0" cellspacing="0">
        <tr><td colspan="2" style="color:#fff;text-align:center;background:#53CCC5;height:45px;">运行状态</td></tr>
        <tr>
          <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[2].stateType[0].state==1?'red':'#19E659')}" />
          <td class="td2">{{ stateName[2].stateType[0].name }}</td>
        </tr>
        <tr>
          <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[2].stateType[6].state==1?'red':'#19E659')}" />
          <td class="td2">{{ stateName[2].stateType[6].name }}</td>
        </tr>
        <tr>
          <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[2].stateType[1].state==1?'red':'#19E659')}" />
          <td class="td2">{{ stateName[2].stateType[1].name }}</td>
        </tr>
        <tr>
          <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[2].stateType[2].state==1?'red':'#19E659')}" />
          <td class="td2">{{ stateName[2].stateType[2].name }}</td>
        </tr>
        <tr>
          <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[2].stateType[3].state==1?'red':'#19E659')}" />
          <td class="td2">{{ stateName[2].stateType[3].name }}</td>
        </tr>
        <tr>
          <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[2].stateType[4].state==1?'red':'#19E659')}" />
          <td class="td2">{{ stateName[2].stateType[4].name }}</td>
        </tr>
        <tr>
          <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[2].stateType[5].state==1?'red':'#19E659')}" />
          <td class="td2">{{ stateName[2].stateType[5].name }}</td>
        </tr>
        <tr>
          <td class="iconfont icon-dian_blue td1" :style="{color:(guzhang==1?'red':'#19E659')}" />
          <td class="td2">故障</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import TableTe from '@/components/TableTe'
import charts3 from '../components/charts3'
import alarmTable from '../components/alarmTable'
import { getFarmcfginfoList, getChartVal, getCurrentData, getCurrentData1, getChartData } from '@/api/getCurChart'
import { getEquipTypeList } from '@/api/hbvpp/equipType'
import { mqttgybitAlarmList } from '@/api/hbvpp/mqtt/gybitAlarm'
import { getDeviceAlarm } from '@/api/hbvpp/deviceAlarm'
import { mqttgyycyxList } from '@/api/hbvpp/mqtt/gyycyx'

export default {
  components: { TableTe, charts3, alarmTable },
  filters: {
    xsPidType(val, comments) {
      for (const j in comments) {
        if (comments[j].pidType == val) {
          return comments[j].comment
        }
      }
    }
  },
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
      tableData: [],
      list: [],
      pcs1: [],
      stateName: [
        { state: [], protocolType: 20, farmId: [pcs1id], stateType: [
          { type: 0, name: '正常', state: 0 },
          { bits: 65535, name: '故障', state: 0 }
        ] },
        { state: [], farmId: [pcs1id], protocolType: 63, stateType: [
          { type: 0, name: '正常', state: 0 },
          { bits: 65535, name: '故障', state: 0 }
        ] },
        { state: [], farmId: [pcs1id], protocolType: 64, stateType: [
          { str: [0], name: '停机状态', state: 0 },
          { str: [1], name: '软启动中', state: 0 },
          { str: [4], name: '离网运行', state: 0 },
          { str: [2, 3, 5], name: '并网运行', state: 0 },
          { str: [3, 4], name: '放电状态', state: 0 },
          { str: [2], name: '充电状态', state: 0 },
          { str: [6], name: '待机状态', state: 0 },
          { str: [7], name: '故障恢复中', state: 0 },
        ] }
      ],
      stateName1: [
        { state: [], protocolType: 20, farmId: [pcs1id], stateType: [
          { type: 0, name: '正常', state: 0 },
          { bits: 65535, name: '故障', state: 0 }
        ] },
        { state: [], farmId: [pcs1id], protocolType: 63, stateType: [
          { type: 0, name: '正常', state: 0 },
          { bits: 65535, name: '故障', state: 0 }
        ] },
        { state: [], farmId: [pcs1id], protocolType: 64, stateType: [
          { str: [0], name: '停机状态', state: 0 },
          { str: [1], name: '软启动中', state: 0 },
          { str: [4], name: '离网运行', state: 0 },
          { str: [2, 3, 5], name: '并网运行', state: 0 },
          { str: [3, 4], name: '放电状态', state: 0 },
          { str: [2], name: '充电状态', state: 0 },
          { str: [6], name: '待机状态', state: 0 },
          { str: [7], name: '故障恢复中', state: 0 },
        ] }
      ],
      state1: [
        { name: '停机状态' },
        { name: '离网运行' },
        { name: '放电状态' },
        { name: '故障' }
      ],
      state2: [
        { name: '软启动中' },
        { name: '并网运行' },
        { name: '充电状态' },
        { name: '', color: 'rgba(0,0,0,0)' }
      ],
      date: [new Date().format('yyyy-MM-dd 00:05:00'), new Date(Date.now() + 24 * 3600 * 1000).format('yyyy-MM-dd 00:00:00')],
      pickerOptionsstart: {
        disabledDate: time => {
          return time.getTime() >= new Date(this.date[1].replace(/-/g, '/')).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000
        }
      },
      pickerOptionsend: {
        disabledDate: time => {
          return time.getTime() <= new Date(this.date[0].replace(/-/g, '/')).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000
        }
      },
      chartData: {},
      deviceId: 'PCS1',
      TimeOut: '',
      TimeOutC: '',
      chartName: [],
      chartName1: [
        { data: {}, protocolType: 41 },
        { data: {}, protocolType: 42 },
        { data: {}, protocolType: 43 },
        { data: {}, protocolType: 10 },
        { data: {}, protocolType: 27 }
      ],
      stateChartName: [
        { state: [], protocolType: 20, stateType: [
          { name: '逆变过流', bit: 0, alarmLevel: '故障' },
          { name: '逐波限流故障', bit: 1, alarmLevel: '故障' },
          { name: '变流器故障', bit: 2, alarmLevel: '故障' },
          { name: '电池电压低', bit: 3, alarmLevel: '故障' },
          { name: '电池电压低关辅助电源', bit: 4, alarmLevel: '故障' },
          { name: '电池功率低', bit: 5, alarmLevel: '故障' },
          { name: '直流母线过压', bit: 6, alarmLevel: '故障' },
          { name: '直流母线短路', bit: 7, alarmLevel: '故障' },
          { name: '输出接触器开路', bit: 8, alarmLevel: '故障' },
          { name: '输出接触器短路', bit: 9, alarmLevel: '故障' },
          { name: '变流器过温', bit: 10, alarmLevel: '故障' },
          { name: '输出过载', bit: 11, alarmLevel: '故障' },
          { name: '电池接反故障', bit: 12, alarmLevel: '故障' },
          { name: 'DC接触器故障', bit: 13, alarmLevel: '故障' },
          { name: 'BMS通信故障', bit: 14, alarmLevel: '故障' },
          { name: '逆变器缺相故障', bit: 15, alarmLevel: '故障' }
        ] },
        { state: [], protocolType: 63, stateType: [
          { name: '电网过压', bit: 0, alarmLevel: '故障' },
          { name: '电网欠压', bit: 1, alarmLevel: '故障' },
          { name: '电网相序反', bit: 2, alarmLevel: '故障' },
          { name: '电网频率异常', bit: 3, alarmLevel: '故障' },
          { name: '变流器孤岛效应保护', bit: 4, alarmLevel: '故障' },
          { name: '驱动线故障', bit: 5, alarmLevel: '故障' },
          { name: '防雷故障', bit: 6, alarmLevel: '故障' },
          { name: '绝缘阻抗异常', bit: 7, alarmLevel: '故障' },
          { name: '交流辅助电源故障', bit: 8, alarmLevel: '故障' },
          { name: '直流辅助电源故障', bit: 9, alarmLevel: '故障' },
          { name: '电源15V故障', bit: 10, alarmLevel: '故障' },
          { name: '交流风扇故障', bit: 11, alarmLevel: '故障' },
          { name: '直流风扇故障', bit: 12, alarmLevel: '故障' },
          { name: '紧急关机', bit: 13, alarmLevel: '故障' },
          { name: '变流器不同步', bit: 14, alarmLevel: '故障' },
          { name: 'CT或霍尔开路故障', bit: 15, alarmLevel: '故障' }
        ] }
      ]
    }
  },
  computed: {
    guzhang() {
      return this.stateName[0].stateType[1].state | this.stateName[1].stateType[1].state | this.stateName[2].stateType[7].state
    }
  },
  created() {
    if (this.$store.state.energyConverter.pcs1Cur) { this.pcs1 = this.$store.state.energyConverter.pcs1Cur }
    if (this.$store.state.energyConverter.pcs1Chart) { this.chartName1 = this.$store.state.energyConverter.pcs1Chart }

    this.list = this.pcs1
    this.chartName = this.chartName1
    this.stateName = this.stateName1
    this.reload()
    getCurrentData(this.stateName, this.deviceId)
    getChartData(this.chartName, { time: this.date }, this.deviceId)
    this.TimeOut = setInterval(this.reload, 1000 * sjzRealTime)
    this.TimeOutC = setInterval(this.reloadC, 1000 * 60)
  },
  beforeDestroy() {
    this.$store.dispatch('energyConverter/setPcs1Cur', this.pcs1)
    this.$store.dispatch('energyConverter/setPcs1Chart', this.chartName1)
    clearInterval(this.TimeOut)
    clearInterval(this.TimeOutC)
  },
  methods: {
    reload() {
      const asdfg = this.list.reduce((pre, cur) => pre.concat(cur), []).concat(this.stateName)
      getCurrentData1(asdfg, response => {
        const res = response
        this.list.forEach(value => {
          value.forEach(val => {
              if ('separator' in val) {
                let asd = res[val.farmId[0] + '-' + val.protocolType[0]]
                let asd1 = res[val.farmId[0] + '-' + val.protocolType[1]]
                if (asd.toString().split('').length == 1) {
                  asd = '0' + asd
                }
                if (asd1.toString().split('').length == 1) {
                  asd1 = '0' + asd1
                }
                val.value = asd + val.separator + asd1
              } else if ('stateQk' in val) {
                for (const j in val.stateQk) {
                  if (val.stateQk[j].type == res[val.farmId[0] + '-' + val.protocolType] && res[val.farmId[0] + '-' + val.protocolType] !== '') {
                    val.value = val.stateQk[j].name
                    break
                  }
                }
              } else {
                if (res[val.farmId[0] + '-' + val.protocolType] != undefined&&res[val.farmId[0] + '-' + val.protocolType] !== '') {
                  if ('coefficient' in val) { val.value = res[val.farmId[0] + '-' + val.protocolType] * val.coefficient } else { val.value = res[val.farmId[0] + '-' + val.protocolType] }
                }
              }
          })
        })
        this.stateName.forEach(value => {
          const states = []
          value.stateType.forEach(val => {
            if ('type' in val) {
              if (val.type == res[value.farmId[0] + '-' + value.protocolType] && res[value.farmId[0] + '-' + value.protocolType] !== '') {
                states.push(val.name)
                val.state = 1
              } else {
                val.state = 0
              }
            } else if ('bit' in val) {
              const type = Number((Math.pow(2, val.bit).toString(10)))
              if ((type & Number(res[value.farmId[0] + '-' + value.protocolType])) != 0) {
                states.push(val.name)
                val.state = 1
              } else {
                val.state = 0
              }
            } else if ('str' in val && res[value.farmId[0] + '-' + value.protocolType] !== '') {
              let asd = Number(res[value.farmId[0] + '-' + value.protocolType]).toString(2).slice(-6, -3)
              if (asd != '') { asd = Number(parseInt(asd, 2).toString(10)) } else { asd = 0 }
              if (val.str.indexOf(asd) > -1) {
                states.push(val.name)
                val.state = 1
              } else {
                val.state = 0
              }
            } else if ('bits' in val) {
              const asd = Number(res[value.farmId[0] + '-' + value.protocolType])
              if (val.bits & asd != 0) {
                states.push(val.name)
                val.state = 1
              } else {
                val.state = 0
              }
            }
          })
          value.state = states
        })
      })
    },
    reloadC() {
      getChartData(this.chartName, { time: this.date }, this.deviceId)
    },
    dataChange() {
      getChartData(this.chartName, { time: this.date }, this.deviceId)
    }
  }
}
</script>

<style scoped>
/* .table111{
  width:200px;
} */
.botContainer {
  height: calc(100% - 260px);
  min-height:400px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-around;
}
@media screen and (max-width:1500px){
    .botContainer{
      height: calc(100% - 155px);
      min-height:300px;
    }
  }
  .dateTime{
    width:330px;
  }
  @media screen and (max-width: 1400px) and (min-width: 1201px){
    .dateTime{
      width:350px;
      margin-right:200px;
    }
  }

  @media screen and (max-width:1200px){
    .dateTime{
    width:350px;
  }
  }
.tableA {
  width:20%;
  height:calc(100% - 10px);
  margin-top:10px;
}
    .tableA tr:nth-child(2n){
        background:#EFF3FB;
    }
    .td1{
      width:70px;
      padding-left:20px;
      font-size:25px;
    }
    @media screen and (max-width:1200px){
      .td1{
        width:45px;
        padding-left:10px;
        font-size:20px;
      }
      .td2{
        font-size:14px;
      }
    }
</style>
