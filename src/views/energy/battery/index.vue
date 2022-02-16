<template>
  <div class="app-container">
    <TableTe v-model="list" :td-width="[6,8,8]" cellspacing='5'/>
    <hr color="rgb(78,175,211)" style="border-width:0.5px;margin:0;">
    <div style="margin:10px 0;">
      <el-radio-group v-model="radio" class="micRadio" size="medium" @change="showST">
        <el-radio-button label="功率" />
        <el-radio-button label="故障告警" />
      </el-radio-group>
      <div v-if="showP==='功率'" style="color:#1BACB1;text-align:center;margin-top:0;float:right;width: calc(100% - 340px);
    margin-right: 170px;font-size:20px;">充放电SOC信息</div>
      <div v-if="showP==='故障告警'" style="float:right;">
        <span class="iconfont icon-dian_blue td1" style="color:#19E659" /><span class="td2">正常</span>
        <span class="iconfont icon-dian_blue td1" style="color:rgb(244,231,42)" /><span class="td2">轻度告警</span>
        <span class="iconfont icon-dian_blue td1" style="color:rgb(211,95,23)" /><span class="td2">中度告警</span>
        <span class="iconfont icon-dian_blue td1" style="color:rgb(251,0,21)" /><span class="td2">重度告警</span>
        <span class="iconfont icon-dian_blue td1" style="color:rgb(241,118,112)" /><span class="td2">其他告警</span>
      </div>
    </div>
    <div class="botContainer">
      <div style="width:100%;height:100%;">
        <!-- <p v-if="showP==='功率'" style="color:#1BACB1;font-size:20px;text-align:center;margin-top:0;">充放电SOC信息</p> -->
        <div v-if="showP==='功率'" style="text-align:center;">
          <el-form
            :inline="true"
          >
            <el-form-item label="开始时间" style="margin-bottom: 2px">
              <el-date-picker
                ref="datepicker"
                v-model="date[0]"
                class="sjzsksj"
                style="width:200px;"
                type="datetime"
                default-time="00:05:00"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
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
        <div v-if="showP==='功率'" style="height:calc(100% - 60px);">
          <charts2 v-model="chartName" style="height:100%;" ref="charts2"/>
        </div>
        <div v-if="showP==='故障告警'" style="height:100%;">
          <div class="tableA">
            <table style="width:100%;height:100%;" border="0" cellspacing="0">
              <tr><td colspan="8" style="color:#fff;text-align:center;background:#53CCC5;height:45px;">运行告警</td></tr>
              <tr>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[0].stateType[0],stateName[0].stateType[1],stateName[0].stateType[2])}" />
                <td class="td2">{{ getStateName(stateName[0].stateType[0],stateName[0].stateType[1],stateName[0].stateType[2]) || '组端欠压' }}</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[0].stateType[3],stateName[0].stateType[4],stateName[0].stateType[5])}" />
                <td class="td2">{{ getStateName(stateName[0].stateType[3],stateName[0].stateType[4],stateName[0].stateType[5]) || '组端过压' }}</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[0].stateType[6],stateName[0].stateType[7],stateName[0].stateType[8])}" />
                <td class="td2">{{ getStateName(stateName[0].stateType[6],stateName[0].stateType[7],stateName[0].stateType[8]) || '组端过流' }}</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[3].stateType[6].state==1?'rgb(241,118,112)':'#19E659')}" />
                <td class="td2">放电禁止</td>
              </tr>
              <tr>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[0].stateType[9],stateName[0].stateType[10],stateName[0].stateType[11])}" />
                <td class="td2">{{ getStateName(stateName[0].stateType[9],stateName[0].stateType[10],stateName[0].stateType[11]) || '绝缘电阻低' }}</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[0].stateType[12],stateName[0].stateType[13],stateName[0].stateType[14])}" />
                <td class="td2">{{ getStateName(stateName[0].stateType[12],stateName[0].stateType[13],stateName[0].stateType[14]) || '模块欠温' }}</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[0].stateType[15],stateName[1].stateType[0],stateName[1].stateType[1])}" />
                <td class="td2">{{ getStateName(stateName[0].stateType[15],stateName[1].stateType[0],stateName[1].stateType[1]) || '模块过温' }}</td>
                
                <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[3].stateType[5].state==1?'rgb(241,118,112)':'#19E659')}" />
                <td class="td2">充电禁止</td>
              </tr>
              <tr>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[1].stateType[2],stateName[1].stateType[3],stateName[1].stateType[4])}" />
                <td class="td2">{{ getStateName(stateName[1].stateType[2],stateName[1].stateType[3],stateName[1].stateType[4]) || '单体过压' }}</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[1].stateType[5],stateName[1].stateType[6],stateName[1].stateType[7])}" />
                <td class="td2">{{ getStateName(stateName[1].stateType[5],stateName[1].stateType[6],stateName[1].stateType[7]) || '单体欠压' }}</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[1].stateType[8],stateName[1].stateType[9],stateName[1].stateType[10])}" />
                <td class="td2">{{ getStateName(stateName[1].stateType[8],stateName[1].stateType[9],stateName[1].stateType[10]) || '单体压差' }}</td>

                <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[13].stateType[0].state==1?'rgb(241,118,112)':'#19E659')}" />
                <td class="td2">{{ stateName[13].stateType[0].name }}</td>
              </tr>
              <tr>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[1].stateType[11],stateName[1].stateType[12],stateName[1].stateType[13])}" />
                <td class="td2">{{ getStateName(stateName[1].stateType[11],stateName[1].stateType[12],stateName[1].stateType[13]) || '单体过温' }}</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[1].stateType[14],stateName[1].stateType[15],stateName[2].stateType[0])}" />
                <td class="td2">{{ getStateName(stateName[1].stateType[14],stateName[1].stateType[15],stateName[2].stateType[0]) || '单体欠温' }}</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[2].stateType[1],stateName[2].stateType[2],stateName[2].stateType[3])}" />
                <td class="td2">{{ getStateName(stateName[2].stateType[1],stateName[2].stateType[2],stateName[2].stateType[3]) || '单体温差' }}</td>

                <td class="iconfont icon-dian_blue td1" :style="{color:(ktgj1==1?'rgb(241,118,112)':'#19E659')}" />
                <td class="td2">空调1告警</td>
              </tr>
              <tr>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[2].stateType[4],stateName[2].stateType[5],stateName[2].stateType[6])}" />
                <td class="td2">{{ getStateName(stateName[2].stateType[4],stateName[2].stateType[5],stateName[2].stateType[6]) || '单体SOC低' }}</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[2].stateType[7],stateName[2].stateType[8],stateName[2].stateType[9])}" />
                <td class="td2">{{ getStateName(stateName[2].stateType[7],stateName[2].stateType[8],stateName[2].stateType[9]) || '单体SOC高' }}</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[3].stateType[0].state==1?'red':'#19E659')}" />
                <td class="td2">各主控失联</td>

                <td class="iconfont icon-dian_blue td1" :style="{color:(ktgj2==1?'rgb(241,118,112)':'#19E659')}" />
                <td class="td2">空调2告警</td>
              </tr>
              <tr>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[2].stateType[10],stateName[2].stateType[11],stateName[2].stateType[12])}" />
                <td class="td2">{{ getStateName(stateName[2].stateType[10],stateName[2].stateType[11],stateName[2].stateType[12]) || '单体SOH低' }}</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:getStateColor(stateName[2].stateType[13],stateName[2].stateType[14],stateName[2].stateType[15])}" />
                <td class="td2">{{ getStateName(stateName[2].stateType[13],stateName[2].stateType[14],stateName[2].stateType[15]) || '单体SOH高' }}</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[3].stateType[1].state==1?'rgb(241,118,112)':'#19E659')}" />
                <td class="td2">各从控失联</td>

                <td class="iconfont icon-dian_blue td1" :style="{color:(ktgj3==1?'rgb(241,118,112)':'#19E659')}" />
                <td class="td2">空调3告警</td>
              </tr>
              <tr>
                <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[3].stateType[2].state==1?'rgb(241,118,112)':'#19E659')}" />
                <td class="td2">各组电压异常</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[3].stateType[3].state==1?'rgb(241,118,112)':'#19E659')}" />
                <td class="td2">接触器断开异常</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[3].stateType[4].state==1?'rgb(241,118,112)':'#19E659')}" />
                <td class="td2">接触器闭合异常</td>

                <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[13].stateType[1].state==1?'rgb(241,118,112)':'#19E659')}" />
                <td class="td2">{{stateName[13].stateType[1].name}}</td>
                
              </tr>
              <tr>
                <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[3].stateType[7].state==1?'rgb(241,118,112)':'#19E659')}" />
                <td class="td2">BMS系统告警</td>
                <td class="iconfont icon-dian_blue td1" :style="{color:(stateName[3].stateType[8].state==1?'rgb(241,118,112)':'#19E659')}" />
                <td class="td2">BMS系统故障</td>
                
              </tr>
              <!-- <tr>
                
                
                
              </tr>
              <tr>
                
                
                
              </tr> -->
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import TableTe from '@/components/TableTe'
import charts2 from '../components/charts2'
import { getFarmcfginfoList, getChartVal, getCurrentData, getCurrentData1, getChartData } from '@/api/getCurChart'
import { mqttgyycyxList } from '@/api/hbvpp/mqtt/gyycyx'

export default {
  components: { TableTe, charts2 },
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
      list: [],
      tableData: [],
      bms1: [],
      stateColor: {
        '000': '#19E659',
        '100': 'rgb(244,231,42)',
        '010': 'rgb(211,95,23)',
        '001': 'rgb(251,0,21)'
      },
      stateName: [],
      stateName1: [
        { name: '电池组1', state: [], farmId: [bms1id], protocolType: 21, stateType: [
          { bit: 0, name: '组端欠压轻度告警', state: 0 },
          { bit: 1, name: '组端欠压中度告警', state: 0 },
          { bit: 2, name: '组端欠压重度告警', state: 0 },
          { bit: 3, name: '组端过压轻度告警', state: 0 },
          { bit: 4, name: '组端过压中度告警', state: 0 },
          { bit: 5, name: '组端过压重度告警', state: 0 },
          { bit: 6, name: '组端过流轻度告警', state: 0 },
          { bit: 7, name: '组端过流中度告警', state: 0 },
          { bit: 8, name: '组端过流重度告警', state: 0 },
          { bit: 9, name: '绝缘电阻低轻度告警', state: 0 },
          { bit: 10, name: '绝缘电阻低中度告警', state: 0 },
          { bit: 11, name: '绝缘电阻低重度告警', state: 0 },
          { bit: 12, name: '模块欠温轻度告警', state: 0 },
          { bit: 13, name: '模块欠温中度告警', state: 0 },
          { bit: 14, name: '模块欠温重度告警', state: 0 },
          { bit: 15, name: '模块过温轻度告警', state: 0 }
        ] },
        { name: '电池组1', state: [], farmId: [bms1id], protocolType: 60, stateType: [
          { bit: 0, name: '模块过温中度告警', state: 0 },
          { bit: 1, name: '模块过温重度告警', state: 0 },
          { bit: 2, name: '单体过压轻度告警', state: 0 },
          { bit: 3, name: '单体过压中度告警', state: 0 },
          { bit: 4, name: '单体过压重度告警', state: 0 },
          { bit: 5, name: '单体欠压轻度告警', state: 0 },
          { bit: 6, name: '单体欠压中度告警', state: 0 },
          { bit: 7, name: '单体欠压重度告警', state: 0 },
          { bit: 8, name: '单体压差轻度告警', state: 0 },
          { bit: 9, name: '单体压差中度告警', state: 0 },
          { bit: 10, name: '单体压差重度告警', state: 0 },
          { bit: 11, name: '单体欠温轻度告警', state: 0 },
          { bit: 12, name: '单体欠温中度告警', state: 0 },
          { bit: 13, name: '单体欠温重度告警', state: 0 },
          { bit: 14, name: '单体过温轻度告警', state: 0 },
          { bit: 15, name: '单体过温中度告警', state: 0 }
        ] },
        { name: '电池组1', state: [], farmId: [bms1id], protocolType: 61, stateType: [
          { bit: 0, name: '单体过温重度告警', state: 0 },
          { bit: 1, name: '单体温差轻度告警', state: 0 },
          { bit: 2, name: '单体温差中度告警', state: 0 },
          { bit: 3, name: '单体温差重度告警', state: 0 },
          { bit: 4, name: '单体SOC低轻度告警', state: 0 },
          { bit: 5, name: '单体SOC低中度告警', state: 0 },
          { bit: 6, name: '单体SOC低重度告警', state: 0 },
          { bit: 7, name: '单体SOC高轻度告警', state: 0 },
          { bit: 8, name: '单体SOC高中度告警', state: 0 },
          { bit: 9, name: '单体SOC高重度告警', state: 0 },
          { bit: 10, name: '单体SOH低轻度告警', state: 0 },
          { bit: 11, name: '单体SOH低中度告警', state: 0 },
          { bit: 12, name: '单体SOH低重度告警', state: 0 },
          { bit: 13, name: '单体SOH高轻度告警', state: 0 },
          { bit: 14, name: '单体SOH高中度告警', state: 0 },
          { bit: 15, name: '单体SOH高重度告警', state: 0 }
        ] },
        { name: '电池组1', state: [], farmId: [bms1id], protocolType: 62, stateType: [
          { bit: 0, name: '各主控失联', state: 0 },
          { bit: 1, name: '各从控失联告警', state: 0 },
          { bit: 2, name: '各组电压异常', state: 0 },
          { bit: 3, name: '接触器断开异常', state: 0 },
          { bit: 4, name: '接触器闭合异常', state: 0 },
          { bit: 5, name: '充电禁止', state: 0 },
          { bit: 6, name: '放电禁止', state: 0 },
          { bit: 7, name: 'BMS系统告警', state: 0 },
          { bit: 8, name: 'BMS系统故障', state: 0 }
        ] },

        { name: '1#储能箱空调', state: [], farmId: [hess1ktId], protocolType: 21, stateType: [
          { bits: 65535, name: '空调告警1', state: 0 }
        ] },
        { name: '1#储能箱空调', state: [], farmId: [hess1ktId], protocolType: 60, stateType: [
          { bits: 65535, name: '空调告警2', state: 0 }
        ] },
        { name: '1#储能箱空调', state: [], farmId: [hess1ktId], protocolType: 61, stateType: [
          { bit: 0, name: '空调告警3', state: 0 }
        ] },

        { name: '1#储能箱空调2', state: [], farmId: [hess1kt2Id], protocolType: 21, stateType: [
          { bits: 65535, name: '空调告警1', state: 0 }
        ] },
        { name: '1#储能箱空调2', state: [], farmId: [hess1kt2Id], protocolType: 60, stateType: [
          { bits: 65535, name: '空调告警2', state: 0 }
        ] },
        { name: '1#储能箱空调2', state: [], farmId: [hess1kt2Id], protocolType: 61, stateType: [
          { bit: 0, name: '空调告警3', state: 0 }
        ] },

        { name: '1#储能箱空调3', state: [], farmId: [hess1kt3Id], protocolType: 21, stateType: [
          { bits: 65535, name: '空调告警1', state: 0 }
        ] },
        { name: '1#储能箱空调3', state: [], farmId: [hess1kt3Id], protocolType: 60, stateType: [
          { bits: 65535, name: '空调告警2', state: 0 }
        ] },
        { name: '1#储能箱空调3', state: [], farmId: [hess1kt3Id], protocolType: 61, stateType: [
          { bit: 0, name: '空调告警3', state: 0 }
        ] },
        { name: '1#储能箱空调', state: [],farmId: [bms1id], protocolType: 119, stateType: [
          { bit: 0, name: 'BMS告警', state: 0 },
          { bit: 1, name: '消防告警', state: 0 }
        ] },
      ],
      stateXf:[
        { name: '1#储能箱消防', state: [],farmId: [hess1xfId], protocolType: 21, stateType: [
          { type: 1, name: '消防告警', state: 0 }
        ] },
        { name: '1#储能箱消防', state: [],farmId: [hess1xfId], protocolType: 60, stateType: [
          { type: 1, name: '消防告警', state: 0 }
        ] },
        { name: '1#储能箱消防', state: [],farmId: [hess1xfId], protocolType: 61, stateType: [
          { type: 1, name: '消防告警', state: 0 }
        ] },
        { name: '1#储能箱消防', state: [],farmId: [hess1xfId], protocolType: 62, stateType: [
          { type: 1, name: '消防告警', state: 0 }
        ] },
        { name: '1#储能箱消防', state: [],farmId: [hess1xfId], protocolType: 119, stateType: [
          { type: 1, name: '消防告警', state: 0 }
        ] },
        { name: '1#储能箱消防', state: [],farmId: [hess1xfId], protocolType: 132, stateType: [
          { type: 5, name: '消防告警', state: 0 }
        ] },
        { name: '1#储能箱消防', state: [],farmId: [hess1xfId], protocolType: 133, stateType: [
          { type: 3, name: '消防告警', state: 0 }
        ] }
      ],
      deviceId: '电池组1',
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
      TimeOut: '',
      TimeOutC: '',
      radio: '功率',
      showP: '功率',
      chartName: [],
      chartName1: [
        { deviceName: 'PCS1', data: {}, protocolType: 66 },
        { deviceName: 'PCS1', data: {}, protocolType: 67 },
        { data: {}, protocolType: 12 }
      ]
    }
  },
  computed: {
    ktgj1() {
      return this.stateName[4].stateType[0].state | this.stateName[5].stateType[0].state | this.stateName[6].stateType[0].state
    },
    ktgj2() {
      return this.stateName[7].stateType[0].state | this.stateName[8].stateType[0].state | this.stateName[9].stateType[0].state
    },
    ktgj3() {
      return this.stateName[10].stateType[0].state | this.stateName[11].stateType[0].state | this.stateName[12].stateType[0].state
    },
    // xfgj1() {
    //   return this.stateXf[0].stateType[0].state | this.stateXf[1].stateType[0].state| this.stateXf[2].stateType[0].state |
    //   this.stateXf[3].stateType[0].state | this.stateXf[4].stateType[0].state | this.stateXf[5].stateType[0].state |
    //   this.stateXf[6].stateType[0].state
    // },
    getStateColor() {
      return (a, b, c) => {
        let color = '#19E659'
        if (c.state == 1) { color = 'rgb(251,0,21)' } else if (b.state == 1) { color = 'rgb(211,95,23)' } else if (a.state == 1) { color = 'rgb(244,231,42)' }
        return color
      }
    },
    getStateName() {
      return (a, b, c) => {
        let name = ''
        if (c.state == 1) { name = c.name } else if (b.state == 1) { name = b.name } else if (a.state == 1) { name = a.name }
        return name
      }
    }
  },
  created() {
    if (this.$store.state.energyBattery.bms1Cur) { this.bms1 = this.$store.state.energyBattery.bms1Cur }
    if (this.$store.state.energyBattery.bms1Chart) { this.chartName1 = this.$store.state.energyBattery.bms1Chart }

    this.list = this.bms1
    this.stateName = this.stateName1
    this.chartName = this.chartName1
    this.reload()
    getChartData(this.chartName, { time: this.date }, this.deviceId)
    this.TimeOut = setInterval(this.reload, 1000 * sjzRealTime)
    this.TimeOutC = setInterval(this.reloadC, 1000 * 60)
  },
  beforeDestroy() {
    this.$store.dispatch('energyBattery/setBms1Cur', this.bms1)
    this.$store.dispatch('energyBattery/setBms1Chart', this.chartName1)
    clearInterval(this.TimeOut)
    clearInterval(this.TimeOutC)
  },
  methods: {
    reload() {
      const asdfg = this.list.reduce((pre, cur) => pre.concat(cur), []).concat([...this.stateName])
      getCurrentData1(asdfg, response => {
        const res = response
        this.list.forEach(value => {
          value.forEach(val => {
            if('protocolType' in val) {
              if ('separator' in val) {
                let asd = res[val.farmId[0] + '-' + val.protocolType[0]]
                let asd1 = res[val.farmId[0] + '-' + val.protocolType[1]]
                if (asd != undefined && asd1 != undefined) {
                  if (asd.toString().split('').length == 1) {
                    asd = '0' + asd
                  }
                  if (asd1.toString().split('').length == 1) {
                    asd1 = '0' + asd1
                  }
                  val.value = asd + val.separator + asd1
                }
              } else if ('stateQk' in val) {
                for (const j in val.stateQk) {
                  if (val.stateQk[j].type == res[val.farmId[0] + '-' + val.protocolType] && res[val.farmId[0] + '-' + val.protocolType] !== undefined) {
                    val.value = val.stateQk[j].name
                    break
                  }
                }
              } else if('isGetMax' in val) {
                if(res[hess1ktId + '-20']==1) {
                  val.value = res[val.farmId[0] + '-' + val.protocolType]
                } else if(res[hess1kt2Id + '-20']==1) {
                  val.value = res[val.farmId[1] + '-' + val.protocolType]
                } else if(res[hess1kt3Id + '-20']==1) {
                  val.value = res[val.farmId[2] + '-' + val.protocolType]
                } else {
                  val.value = 0
                }
              } else{
                if (res[val.farmId[0] + '-' + val.protocolType] != undefined) {
                  if ('coefficient' in val) { val.value = res[val.farmId[0] + '-' + val.protocolType] * val.coefficient } else { val.value = res[val.farmId[0] + '-' + val.protocolType] }
                }
              }
            }
          })
        })
        this.stateName.forEach(value => {
          if('protocolType' in value) {
            const states = []
            value.stateType.forEach(val => {
                if ('type' in val) {
                  if (val.type == res[value.farmId[0] + '-' + value.protocolType] && res[value.farmId[0] + '-' + value.protocolType] !== undefined) {
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
                } else if ('bits' in val) {
                  const type = val.bits
                  if ((type & Number(res[value.farmId[0] + '-' + value.protocolType])) != 0) {
                    states.push(val.name)
                    val.state = 1
                  } else {
                    val.state = 0
                  }
                }
            })
            value.state = states
          }
        })
        // this.stateXf.forEach(value => {
        //   if('protocolType' in value) {
        //     const states = []
        //     value.stateType.forEach(val => {
        //       if ('type' in val) {
        //         if (val.type == res[value.farmId[0] + '-' + value.protocolType] && res[value.farmId[0] + '-' + value.protocolType] !== undefined) {
        //           states.push(val.name)
        //           val.state = 1
        //         } else {
        //           val.state = 0
        //         }
        //       } else if ('bit' in val) {
        //         const type = Number((Math.pow(2, val.bit).toString(10)))
        //         if ((type & Number(res[value.farmId[0] + '-' + value.protocolType])) != 0) {
        //           states.push(val.name)
        //           val.state = 1
        //         } else {
        //           val.state = 0
        //         }
        //       } else if ('bits' in val) {
        //         const type = val.bits
        //         if ((type & Number(res[value.farmId[0] + '-' + value.protocolType])) != 0) {
        //           states.push(val.name)
        //           val.state = 1
        //         } else {
        //           val.state = 0
        //         }
        //       }
        //     })
        //     value.state = states
        //   }
        // })
      })
    },
    reloadC() {
      getChartData(this.chartName, { time: this.date }, this.deviceId)
    },
    showST(val) {
      this.showP = val
    },
    dataChange() {
      getChartData(this.chartName, { time: this.date }, this.deviceId)
    }
  }
}
</script>

<style scoped>
  .botContainer{
    height: calc(100% - 260px);
    display: flex;
    display: -webkit-flex;
    justify-content: space-around;
  }
  @media screen and (max-width: 1500px){
    .botContainer{
      height: calc(100% - 230px);
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
    .botContainer{
      height:400px;
    }
  }
  .tableA {
  width:100%;
  height:100%;
  /* margin-top:10px; */
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

<style lang="scss">
.el-tooltip__popper {
  max-width: 400px;
}
</style>
