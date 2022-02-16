<template>
  <div class="app-container">
    <div class="titlecont">
    <div class="TaTitle">
      <span class="iconfont icon-zidongmoshi" style="color:rgb(0,188,255);margin-right:0.5em;font-size:1.3em;" />
      <span class="title" style="color:rgb(0,188,255);">系统当前手自动模式</span>
      <span>{{ curNameC[0].value }}</span>
    </div>
    <div class="TaTitle">
      <span class="iconfont icon-zidongmoshi" style="color:rgb(0,188,255);margin-right:0.5em;font-size:1.3em;" />
      <span class="title" style="color:rgb(0,188,255);">系统手自动模式设置</span>
      <buttonYk :data="butYk" />
      <buttonYk :data="butYk1" />
    </div>
    </div>
    <div class="titlecont">
    <div class="TaTitle">
      <span class="iconfont icon--" style="color:rgb(0,188,255);margin-right:0.5em;font-size:1.3em;" />
      <span class="title" style="color:rgb(0,188,255);">系统当前状态</span>
      <span>{{ curNameC[1].value }}</span>
    </div>
    <div class="TaTitle">
      <span class="iconfont icon--" style="color:rgb(0,188,255);margin-right:0.5em;font-size:1.3em;" />
      <span class="title" style="color:rgb(0,188,255);">系统启停控制</span>
      <buttonYk :data="butYkb" :disabled="curNameC[0].value!='自动'" />
      <buttonYk :data="butYkb1" :disabled="curNameC[0].value!='自动'" />
      <buttonYk :data="butYkb2" :disabled="curNameC[0].value!='自动'" />
    </div>
    </div>
    <div class="titlecont">
    <div class="TaTitle">
      <span class="iconfont icon-zonggongshuai" style="color:rgb(0,188,255);margin-right:0.5em;font-size:1.3em;" />
      <span class="title" style="color:rgb(0,188,255);">光伏发电功率</span>
      <span>{{ pvkwInfo[0].value | numFilter }} kW</span>
    </div>
    <div class="TaTitle">
      <span class="iconfont icon-zonggongshuai" style="color:rgb(0,188,255);margin-right:0.5em;font-size:1.3em;" />
      <span class="title" style="color:rgb(0,188,255);">光伏发电功率上限设置</span>
      <buttonGz v-model="socList" :rules="rules" :disabled="curNameC[0].value!='手动'" />

      <!-- <span class="iconfont icon-zonggongshuai" style="color:rgb(0,188,255);margin-right:0.5em;font-size:1.3em;margin-left:0.5em;" />
      <span class="title" style="color:rgb(0,188,255);">光伏无功调节电压使能设置</span>
      <buttonGz v-model="socList1" :rules="rules" :disabled="curNameC[0].value!='手动'" /> -->
    </div>
    </div>
    <div class="bottomContainer tablecon" style="height:35%;">
      <div class="TaTitle">
        <span class="iconfont icon-chunengguankong" style="color:rgb(0,188,255);margin-right:0.5em;font-size:1.3em;" />
        <span style="color:rgb(0,188,255);">储能控制</span>
      </div>
      <div style="margin-left:10em;height:calc(100% - 40px);">
        <!-- <el-select v-model="value" placeholder="请选择" size="mini" style="width:300px;" @change="pcsChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
        <table class="tbClas1" style="height:calc(100% - 0px);">
          <tr>
            <td style="width:8em;">并离网设置状态</td>
            <td><span>{{ stateName1[0].value }}</span></td>
            <td style="width:100px;" />
            <td style="width:8em;">并离网模式设置</td>
            <td><buttonYk style="min-width:8em;" :data="butYk2" :device-id="deviceId" :disabled="curNameC[0].value!='手动'" /></td>
            <td><buttonYk style="min-width:8em;" :data="butYk3" :device-id="deviceId" :disabled="curNameC[0].value!='手动'" /></td>
          </tr>
          <tr>
            <td>设备运行状态</td>
            <td><span>{{ stateName1[1].value }}</span></td>
            <td />
            <td>本地控制</td>
            <td><buttonYk style="min-width:8em;" :data="butYk4" :device-id="deviceId" :disabled="curNameC[0].value!='手动'" /></td>
            <td><buttonYk style="min-width:8em;" :data="butYk11" :device-id="deviceId" :disabled="curNameC[0].value!='手动'" /></td>
            <td><buttonYk style="min-width:8em;" :data="butYk5" :device-id="deviceId" :disabled="curNameC[0].value!='手动'" /></td>
          </tr>
          <tr>
            <td>运行功率</td>
            <td><span>{{ stateName1[2].value | numFilter }} kW</span></td>
            <td />
            <td>功率设置</td>
            <td colspan="2"><buttonGz v-model="powerList" :disabled="curNameC[0].value!='手动'&&stateName1[0].value!='并网模式'" button-min-width="8em" :rules="rules" /></td>
          </tr>
          <!-- <tr>
            <td>并机使能</td>
            <td><span>{{ stateName1[3].value }}</span></td>
            <td />
            <td>并机使能设置</td>
            <td><buttonYk style="min-width:8em;" :data="butYk6" :device-id="deviceId" :disabled="curNameC[0].value!='手动'" /></td>
            <td><buttonYk style="min-width:8em;" :data="butYk7" :device-id="deviceId" :disabled="curNameC[0].value!='手动'" /></td>
          </tr>
          <tr>
            <td>设备号</td>
            <td><span>{{ stateName1[4].value }}</span></td>
            <td />
            <td>设备号设置</td>
            <td><buttonYk style="min-width:8em;" :data="butYk8" :device-id="deviceId" :disabled="curNameC[0].value!='手动'" /></td>
            <td><buttonYk style="min-width:8em;" :data="butYk9" :device-id="deviceId" :disabled="curNameC[0].value!='手动'" /></td>
            <td><buttonYk style="min-width:8em;" :data="butYk10" :device-id="deviceId" :disabled="curNameC[0].value!='手动'" /></td>
          </tr> -->
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import TableTe from '@/components/TableTe'
import { validateMath } from '@/utils/validate'
import { mqttyk, mqttyt } from '@/api/hbvpp/mqttyk'
import { mqttPublishGet, mqttPublishPublish } from '@/api/hbvpp/mqtt/publish'
import buttonGz from '../components/buttonGz'
import buttonYk from '../components/buttonYk'
import { getCurrentData } from '@/api/getCurChart'
import { getLogSave } from '@/api/hbvpp/log'

export default {
  components: {
    TableTe,
    buttonGz,
    buttonYk
  },
  data() {
    return {
      value: 'PCS1',
      socList: {
        name: '光伏发电功率上限', value: '0', unit: '%', msgType: 'yt_45_', snid: '004_0044_0017_02_FS0', protocolType: 108, deviceName: '储能集装箱终端', logName: '光伏发电功率上限设置'
      },
      socList1: {
        name: '光伏无功调节电压使能', value: '0', unit: '', msgType: 'yt_62_', snid: '004_0044_0017_02_FS0', protocolType: 151, deviceName: '储能集装箱终端', logName: '光伏无功调节电压使能设置'
      },
      powerList: {
        name: '功率', value: '0', unit: 'kW', msgType: 'yt_42_', snid: '004_0044_0017_02_FS0', protocolType: 7, logName: '1#PCS功率设置'
      },
      rules: {
        '光伏发电功率上限': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: 0, maxm: 100 }],
        '光伏无功调节电压使能': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: 0, maxm: 99 }],
        '功率': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: -500, maxm: 500 }]
      },
      butYk: { title: '系统手自动模式', value: 0, name: '手动', ykyt: 'yt_0_', nameyt: '0' },
      butYk1: { title: '系统手自动模式', value: 0, name: '自动', ykyt: 'yt_0_', nameyt: '1' },
      butYk2: { title: '并离网模式', value: 0, name: '并网模式', ykyt: 'yt_43_', nameyt: '2' },
      butYk3: { title: '并离网模式', value: 0, name: '离网模式', ykyt: 'yt_43_', nameyt: '1' },
      butYk4: { title: '远程控制', value: 0, name: '启动', ykyt: 'yt_44_', nameyt: '21845' },
      butYk11: { title: '远程控制', value: 0, name: '待机', ykyt: 'yt_44_', nameyt: '21930' },
      butYk5: { title: '远程控制', value: 0, name: '停机', ykyt: 'yt_44_', nameyt: '43690' },
      // butYk6: { title: '并机使能', value: 0, name: '使能', ykyt: 'yt_35_', nameyt: '1' },
      // butYk7: { title: '并机使能', value: 0, name: '未使能', ykyt: 'yt_35_', nameyt: '0' },
      // butYk8: { title: '设备号', value: 0, name: '0-主机', ykyt: 'yt_36_', nameyt: '0' },
      // butYk9: { title: '设备号', value: 0, name: '1-从机', ykyt: 'yt_36_', nameyt: '1' },
      // butYk10: { title: '设备号', value: 0, name: '2-从机', ykyt: 'yt_36_', nameyt: '2' },

      butYkb: { title: '系统启停控制', value: 0, name: '并网启动', ykyt: 'yt_41_', nameyt: '3' },
      butYkb1: { title: '系统启停控制', value: 0, name: '离网启动', ykyt: 'yt_41_', nameyt: '2' },
      butYkb2: { title: '系统启停控制', value: 0, name: '系统停机', ykyt: 'yt_41_', nameyt: '1' },

      pvkwInfo: [
        { deviceName: '光伏电站', protocolType: 7, name: '光伏发电功率', value: '0', unit: 'kW', icon: 'icon-icon-power-power' }
      ],
      TimeOut: '',
      curName: [
        { name: '储能集装箱终端', protocolType: 76, value: '' }
      ],
      stateName: [
        { protocolType: 64, value: '', stateType: [
          { bit: 8, name: '并网模式' },
          { unbit: 8, name: '离网模式' }
        ] }
      ],
      stateName1: [
        { protocolType: 64, value: '', stateType: [
          { bit: 8, name: '并网模式' },
          { unbit: 8, name: '离网模式' }
        ] },
        { value: '', state: [], protocolType: 64, stateType: [
          { str: [0], name: '停机状态', state: 0 },
          { str: [1], name: '软启动中', state: 0 },
          { str: [4], name: '离网放电', state: 0 },
          { str: [5], name: '并网运行', state: 0 },
          { str: [3], name: '并网放电', state: 0 },
          { str: [2], name: '并网充电', state: 0 },
          { str: [6], name: '待机状态', state: 0 },
          { str: [7], name: '离网充电', state: 0 }
        ] },
        { protocolType: 7, value: '' },
        // { protocolType: 109, value: '使能', stateQk: [
        //   { type: 0, name: '未使能' },
        //   { type: 1, name: '使能' }
        // ] },
        // { protocolType: 110, value: '0-主机', stateQk: [
        //   { type: 0, name: '0-主机' },
        //   { type: 1, name: '1-从机' },
        //   { type: 2, name: '2-从机' }
        // ] }
      ],
      curNameC: [
        { name: '储能集装箱终端', protocolType: 76, value: '', stateQk: [
          { type: 0, name: '手动' },
          { type: 1, name: '自动' }
        ] },
        { name: '储能集装箱终端', protocolType: 20, value: '', stateQk: [
          { type: 0, name: '系统初始化' },
          { type: 1, name: '系统停机' },
          { type: 2, name: '系统离网运行' },
          { type: 3, name: '系统并网运行' },
          { type: 4, name: '系统离网开机过程' },
          { type: 5, name: '系统并网开机过程' },
          { type: 6, name: '系统离网停机过程' },
          { type: 7, name: '系统并网停机过程' },
          { type: 11, name: '通讯异常' },
          { type: 12, name: '系统异常，等待关机指令' },
          { type: 13, name: '异常处理状态' }
        ] }
      ],
      deviceId: '1#PCS'
    }
  },
  created() {
    getCurrentData(this.curName)
    getCurrentData([this.socList])
    getCurrentData([this.powerList], this.value)

    this.reload()
    this.TimeOut = setInterval(this.reload, 1000 * sjzRealTime)
  },
  beforeDestroy() {
    clearInterval(this.TimeOut)
  },
  methods: {
    reload() {
      getCurrentData(this.pvkwInfo)
      getCurrentData(this.curNameC)
      getCurrentData(this.stateName1, this.value)
    },
    gexinProtocal(msgType, callback) {
      const data = {
        broker: hostIp,
        clientID: clientId,
        topic: 'ncyt_sub_yk_yt',
        msgType: msgType,
        snid: '004_0044_0017_02_FS0',
        manual: '1'
      }
      // console.log(data)
      mqttPublishPublish(data).then(response => {
        // console.log(response)
        if (response.controlResult == true) {
          if (callback) { callback() } else {
            this.$message({
              type: 'success',
              message: '下发成功!'
            })
          }
        } else {
          this.$message({
            type: 'info',
            message: '下发失败'
          })
        }
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '下发失败'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.app-container{
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: space-between;
  color:rgb(0,188,255);
  font-size:16px;
  // /*! autoprefixer: off */
  //   background:-webkit-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
  // /*! autoprefixer: off */
  // background:-moz-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
  // background:-o-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
  // background:-ms-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
}
.titlecont{
  height:16%;
  padding:1% 0;
  /*! autoprefixer: off */
    background:-webkit-linear-gradient(left, rgba(65, 165, 231, 0.075) , rgba(129, 235, 185, 0.075), rgba(232, 241, 151, 0.075));
  /*! autoprefixer: off */
  background:-moz-linear-gradient(left, rgba(65, 165, 231, 0.075) , rgba(129, 235, 185, 0.075), rgba(232, 241, 151, 0.075));
  background:-o-linear-gradient(left, rgba(65, 165, 231, 0.075) , rgba(129, 235, 185, 0.075), rgba(232, 241, 151, 0.075));
  background:-ms-linear-gradient(left, rgba(65, 165, 231, 0.075) , rgba(129, 235, 185, 0.075), rgba(232, 241, 151, 0.075));
  div:nth-child(1){
    padding-bottom:10px;
  }
}
.tablecon{
  /*! autoprefixer: off */
    background:-webkit-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
  /*! autoprefixer: off */
  background:-moz-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
  background:-o-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
  background:-ms-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
}

.TaTitle {
  height: 2em;
  font-size:16px;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  .title{
    font-size:1em;
    width: 13em;
  }
}
.frame {
  margin-left:12em;
  display: flex;
  display: -webkit-flex;
  align-items: center;
}
.socClass{
  margin-left:1em;
  text-align:center;
  width:6em;
  height:36px;
  display: inline-block;
  border:1px solid rgb(220,223,230);
  border-radius: 5px;
}
.tbCla{
  border-collapse:collapse;
  width:80%;
  text-align:center;
  tr{
    height:2em;
  }
}
.tbClas1{
  tr td{
    width:6em;
  }
}
.butclass{
  background-color: green;
  color: white;
}
</style>
