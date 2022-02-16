<template>
  <div class="app-container">
    <div class="TaTitle">
      <span class="iconfont icon-zidongmoshi" style="color:rgb(0,188,255);margin-right:0.5em;font-size:1.3em;" />
      <span class="title" style="color:rgb(0,188,255);">系统当前手自动模式</span>
      <span style="color:rgb(0,188,255);">{{ curNameC[0].value }}</span>
    </div>
    <div class="TaTitle">
      <span class="iconfont icon-zidongmoshi" style="color:rgb(0,188,255);margin-right:0.5em;font-size:1.3em;" />
      <span class="title" style="color:rgb(0,188,255);">系统手自动模式设置</span>
      <buttonYk :data="butYk" />
      <buttonYk :data="butYk1" />
      <!-- <el-radio-group v-model="radio" @change="confirm('radio','自动','手动')">
        <el-radio label="1" border>自动</el-radio>
        <el-radio label="0" border>手动</el-radio>
      </el-radio-group> -->
    </div>
    <div class="TaTitle">
      <span class="iconfont icon-kongzhicelve-daohang" style="color:rgb(0,188,255);margin-right:0.5em;font-size:1.3em;" />
      <span class="title" style="color:rgb(0,188,255);">当前并网控制策略</span>
      <span style="color:rgb(0,188,255);width:180px;">{{ curNameC[1].value }}</span>

      <span class="iconfont icon-kongzhicelve-daohang" style="color:rgb(0,188,255);margin-left:20px;margin-right:0.5em;font-size:1.3em;" />
      <span class="title" style="color:rgb(0,188,255);">电池维护周期(天)</span>
      <span style="color:rgb(0,188,255);">{{ curNameC[2].value }}</span>
    </div>
    <div class="TaTitle">
      <span class="iconfont icon-kongzhicelve-daohang" style="color:rgb(0,188,255);margin-right:0.5em;font-size:1.3em;" />
      <span class="title" style="color:rgb(0,188,255);">并网控制策略设置</span>
      <buttonYk :data="butYk2" />
      <buttonYk :data="butYk3" />

      <span class="iconfont icon-kongzhicelve-daohang" style="color:rgb(0,188,255);margin-left:20px;margin-right:0.5em;font-size:1.3em;" />
      <span class="title" style="color:rgb(0,188,255);">电池维护周期设置(天)</span>
      <buttonGz v-model="socList" :rules="rules" />
      <!-- <buttonYk :data="butYk4" /> -->
      <!-- <el-radio-group v-model="radio1" @change="confirm1('radio1','计划表','高备电')">
        <el-radio label="2" border>计划表</el-radio>
        <el-radio label="1" border>高备电</el-radio>
      </el-radio-group> -->
    </div>
    <div class="TaTitle1" v-if="jhbllx=='计划表'">
      <div class="aghjk" style="margin-top:1em;margin-bottom:1em;">
        <!-- <el-radio-group v-model="jhbllx">
          <el-radio-button label="计划表"></el-radio-button>
          <el-radio-button label="联络线"></el-radio-button>
        </el-radio-group> -->
        <span>储能充放电计划表(-充，+放)</span>
        <el-button style="margin-left:1em;color: white;background-color: #4cb1d6;" @click="jhTableClick">计划表下发</el-button>
      </div>
      <table class="tbCla" border>
        <tr>
          <td />
          <td v-for="(item,index) in hessChargList" :key="'hcl'+index" style="width:7.39%">{{ item.time }}</td>
        </tr>
        <tr>
          <td>当前值/kW</td>
          <td v-for="(item,index) in hessChargList" :key="'hcl'+index">
            <span v-if="!item.disinput">{{ item.value }}</span>
          </td>
        </tr>
        <tr>
          <td>设置值/kW</td>
          <td v-for="(item,index) in hessChargList" :key="'hcl'+index">
            <el-input v-if="!item.disinput" v-model="item.content1" style="width:90%;" @input="contenInput(item)" />
            <span v-if="item.validate" style="font-size:12px;color:red;">{{ item.validateMassage || '必须是数字' }}</span>
          </td>
        </tr>
        <tr>
          <td />
          <td v-for="(item,index) in hessChargList1" :key="'hcl1'+index">{{ item.time }}</td>
        </tr>
        <tr>
          <td>当前值/kW</td>
          <td v-for="(item,index) in hessChargList1" :key="'hcl1'+index">
            <span v-if="!item.disinput">{{ item.value }}</span>
          </td>
        </tr>
        <tr>
          <td>设置值/kW</td>
          <td v-for="(item,index) in hessChargList1" :key="'hcl1'+index">
            <el-input v-if="!item.disinput" v-model="item.content1" style="width:90%;" />
            <span v-if="item.validate" style="font-size:12px;color:red;">{{ item.validateMassage || '必须是数字' }}</span>
          </td>
        </tr>
      </table>
    </div>
    <!-- <div class="TaTitle1" v-if="jhbllx=='联络线'">
      <div style="margin-top:1em;margin-bottom:1em;">
        <el-radio-group v-model="jhbllx">
          <el-radio-button label="计划表"></el-radio-button>
          <el-radio-button label="联络线"></el-radio-button>
        </el-radio-group>
        <span>联络线功率设置</span>
      </div>
      <table class="tbCla">
        <tr>
          <td style="width:7.69%" />
          <td v-for="(item,index) in list1[0]" :key="'hcl1'+index" style="width:16.66%">{{ item.name }}</td>
        </tr>
        <tr>
          <td>当前值</td>
          <td v-for="(item,index) in list1[0]" :key="'hcl1'+index">
            <span v-if="!item.disinput">{{ item.value+item.butunit }}</span>
          </td>
        </tr>
        <tr>
          <td>设置值</td>
          <td v-for="(item,index) in list1[0]" :key="'hcl1'+index">
            <el-popover
              v-if="!item.disinput"
              v-model="innerVisible[item.name]"
              placement="bottom"
              width="200"
              trigger="click"
            >
              <p>请输入修改后的数值</p>
              <el-form :ref="'dataForm'+item.name" status-icon :rules="rules1" :model="innerVisibleValue" size="mini" label-position="left">
                <el-form-item :prop="item.name">
                  <el-input v-model="innerVisibleValue[item.name]" size="mini" />
                </el-form-item>
              </el-form>
              <div style="text-align: right; margin: 0;margin-top:5px;">
                <el-button size="mini" type="text" @click="innerVisible[item.name] = false">取消</el-button>
                <el-button type="primary" size="mini" @click="conform(item)">下发</el-button>
              </div>
              <el-button slot="reference" :style="{color:item.valueColor || item.color}" @click="popoverChange(item.name)">{{ item.content1 | numFilter(/时间$/.test(item.name)?-1:2) }}
                <span>{{ item.butunit }}</span>
              </el-button>
            </el-popover>
          </td>
        </tr>
      </table>
      <table class="tbCla">
        <tr>
          <td style="width:7.69%" />
          <td v-for="(item,index) in list2[0]" :key="'hcl2'+index" style="width:16.66%">{{ item.name }}</td>
        </tr>
        <tr>
          <td>当前值</td>
          <td v-for="(item,index) in list2[0]" :key="'hcl2'+index">
            <span v-if="!item.disinput">{{ item.value+item.butunit }}</span>
          </td>
        </tr>
        <tr>
          <td>设置值</td>
          <td v-for="(item,index) in list2[0]" :key="'hcl2'+index">
            <el-popover
              v-if="!item.disinput"
              v-model="innerVisible[item.name]"
              :disabled="item.disabled"
              placement="bottom"
              width="200"
              trigger="click"
            >
              <p>请输入修改后的数值</p>
              <el-form :ref="'dataForm'+item.name" status-icon :rules="rules1" :model="innerVisibleValue" size="mini" label-position="left">
                <el-form-item :prop="item.name">
                  <el-input v-model="innerVisibleValue[item.name]" size="mini" />
                </el-form-item>
              </el-form>
              <div style="text-align: right; margin: 0;margin-top:5px;">
                <el-button size="mini" type="text" @click="innerVisible[item.name] = false">取消</el-button>
                <el-button type="primary" size="mini" @click="conform(item)">下发</el-button>
              </div>
              <el-button :disabled="item.disabled" slot="reference" :style="{color:item.valueColor || item.color}" @click="popoverChange(item.name)">{{ item.content1 | numFilter(/时间$/.test(item.name)?-1:2) }}
                <span>{{ item.butunit }}</span>
              </el-button>
            </el-popover>
          </td>
        </tr>
      </table>
    </div> -->
    <div class="TaTitle1">
      <!-- <TableTe v-model="list" style="background:none;" :td-width="[10,10,10]" cellbottom="30px" :rules="rules" is-change :disabled="radio!='1'" /> -->
      <table class="tbCla">
        <tr>
          <td style="width:6.66%" />
          <td v-for="(item,index) in list[0]" :key="'hcl'+index" style="width:13.33%">{{ item.name }}</td>
        </tr>
        <tr>
          <td>当前值</td>
          <td v-for="(item,index) in list[0]" :key="'hcl'+index">
            <span v-if="!item.disinput">{{ item.value | listJs(item.name,list[0]) | numFilter}}{{item.butunit }}</span>
          </td>
        </tr>
        <tr>
          <td>设置值</td>
          <td v-for="(item,index) in list[0]" :key="'hcl'+index">
            <el-popover
              v-if="!item.disinput"
              v-model="innerVisible[item.name]"
              placement="bottom"
              width="200"
              trigger="click"
            >
              <p>请输入修改后的数值</p>
              <el-form :ref="'dataForm'+item.name" status-icon :rules="rules" :model="innerVisibleValue" size="mini" label-position="left">
                <el-form-item :prop="item.name">
                  <el-input v-model="innerVisibleValue[item.name]" size="mini" />
                </el-form-item>
              </el-form>
              <div style="text-align: right; margin: 0;margin-top:5px;">
                <el-button size="mini" type="text" @click="innerVisible[item.name] = false">取消</el-button>
                <el-button type="primary" size="mini" @click="conform(item)">下发</el-button>
              </div>
              <el-button slot="reference" :style="{color:item.valueColor || item.color}" @click="popoverChange(item.name)">{{ item.content1 | numFilter }}
                <span>{{ item.butunit }}</span>
              </el-button>
            </el-popover>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import TableTe from '@/components/TableTe'
import { validateMath } from '@/utils/validate'
import { mqttPublishPublish } from '@/api/hbvpp/mqtt/publish'
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
  filters:{
    listJs(value,name,list) {
      if(name=='备电SOC下限') {
        return Number(list[2].value) - Number(value)
      }
      return value
    }
  },
  data() {
    return {
      radio: '1',
      radio1: '2',
      jhbllx:'计划表',
      innerVisible: {},
      innerVisibleValue: {},
      hessChargList: [
        { time: '0', value: '', content1: '', disinput: false, msgType: 'yt_11_', name: '储能集装箱终端', protocolType: 78 },
        { time: '1', value: '', content1: '', disinput: false, msgType: 'yt_12_', name: '储能集装箱终端', protocolType: 79 },
        { time: '2', value: '', content1: '', disinput: false, msgType: 'yt_13_', name: '储能集装箱终端', protocolType: 80 },
        { time: '3', value: '', content1: '', disinput: false, msgType: 'yt_14_', name: '储能集装箱终端', protocolType: 81 },
        { time: '4', value: '', content1: '', disinput: false, msgType: 'yt_15_', name: '储能集装箱终端', protocolType: 82 },
        { time: '5', value: '', content1: '', disinput: false, msgType: 'yt_16_', name: '储能集装箱终端', protocolType: 83 },
        { time: '6', value: '', content1: '', disinput: false, msgType: 'yt_17_', name: '储能集装箱终端', protocolType: 84 },
        { time: '7', value: '', content1: '', disinput: false, msgType: 'yt_18_', name: '储能集装箱终端', protocolType: 85 },
        { time: '8', value: '', content1: '', disinput: false, msgType: 'yt_19_', name: '储能集装箱终端', protocolType: 86 },
        { time: '9', value: '', content1: '', disinput: false, msgType: 'yt_20_', name: '储能集装箱终端', protocolType: 87 },
        { time: '10', value: '', content1: '', disinput: false, msgType: 'yt_21_', name: '储能集装箱终端', protocolType: 88 },
        { time: '11', value: '', content1: '', disinput: false, msgType: 'yt_22_', name: '储能集装箱终端', protocolType: 89 }
      ],
      hessChargList1: [
        { time: '12', value: '', content1: '', disinput: false, msgType: 'yt_23_', name: '储能集装箱终端', protocolType: 90 },
        { time: '13', value: '', content1: '', disinput: false, msgType: 'yt_24_', name: '储能集装箱终端', protocolType: 91 },
        { time: '14', value: '', content1: '', disinput: false, msgType: 'yt_25_', name: '储能集装箱终端', protocolType: 92 },
        { time: '15', value: '', content1: '', disinput: false, msgType: 'yt_26_', name: '储能集装箱终端', protocolType: 93 },
        { time: '16', value: '', content1: '', disinput: false, msgType: 'yt_27_', name: '储能集装箱终端', protocolType: 94 },
        { time: '17', value: '', content1: '', disinput: false, msgType: 'yt_28_', name: '储能集装箱终端', protocolType: 95 },
        { time: '18', value: '', content1: '', disinput: false, msgType: 'yt_29_', name: '储能集装箱终端', protocolType: 96 },
        { time: '19', value: '', content1: '', disinput: false, msgType: 'yt_30_', name: '储能集装箱终端', protocolType: 97 },
        { time: '20', value: '', content1: '', disinput: false, msgType: 'yt_31_', name: '储能集装箱终端', protocolType: 98 },
        { time: '21', value: '', content1: '', disinput: false, msgType: 'yt_32_', name: '储能集装箱终端', protocolType: 99 },
        { time: '22', value: '', content1: '', disinput: false, msgType: 'yt_33_', name: '储能集装箱终端', protocolType: 100 },
        { time: '23', value: '', content1: '', disinput: false, msgType: 'yt_34_', name: '储能集装箱终端', protocolType: 101 }
      ],
      list: [operateLs],
      list1: [
        [
          { name: '联络线功率上限', value: '0.00', content1: '0', butunit: 'kW', icon: 'icon-Soclowalarm', msgType: 'yt_54_', snid: '004_0044_0017_02_FS0', protocolType: 140 },
          { name: '联络线功率下限', value: '0.00', content1: '0', butunit: 'kW', icon: 'icon-Soclowalarm', msgType: 'yt_55_', snid: '004_0044_0017_02_FS0', protocolType: 141 },
          { name: '削峰策略充电起始时间', value: '0', content1: '0', butunit: 'h', icon: 'icon-yougonggongshuai', msgType: 'yt_56_', snid: '004_0044_0017_02_FS0', protocolType: 142 },
          { name: '削峰策略充电终止时间', value: '0', content1: '0', butunit: 'h', icon: 'icon-yougonggongshuai', msgType: 'yt_57_', snid: '004_0044_0017_02_FS0', protocolType: 143 },
          {disinput:true}
        ]
      ],
      list2: [
        [
          { name: '削峰策略充电功率', value: '0.00', content1: '0', butunit: 'kW', icon: 'icon-Soclowalarm', msgType: 'yt_58_', snid: '004_0044_0017_02_FS0', protocolType: 146,disabled:true },
          { name: '削峰策略放电起始时间', value: '0', content1: '0', butunit: 'h', icon: 'icon-Soclowalarm', msgType: 'yt_59_', snid: '004_0044_0017_02_FS0', protocolType: 144 },
          { name: '削峰策略放电终止时间', value: '0', content1: '0', butunit: 'h', icon: 'icon-yougonggongshuai', msgType: 'yt_60_', snid: '004_0044_0017_02_FS0', protocolType: 145 },
          { name: '削峰策略放电功率', value: '0.00', content1: '0', butunit: 'kW', icon: 'icon-yougonggongshuai', msgType: 'yt_61_', snid: '004_0044_0017_02_FS0', protocolType: 147 },
          {disinput:true}
        ]
      ],
      rules: {
        '保护SOC上限': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: 0, maxm: 100 }],
        '保护SOC下限': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: 0, maxm: 100 }],
        '最大充电倍率': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: 0, maxm: 1 }],
        '最大放电倍率': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: 0, maxm: 1 }],
        '备电SOC上限': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: 0, maxm: 100 }],
        '备电SOC下限': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'],  maxm: 100 }],
        '电池维护周期': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: 0 }],
        '备电功率': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'] , minm:-400, maxm:0}]
      },
      rules1: {
        '联络线功率上限': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'] }],
        '联络线功率下限': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'] }],
        '削峰策略充电起始时间': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: 0, maxm: 23 }],
        '削峰策略充电终止时间': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: 0, maxm: 23 }],
        '削峰策略充电功率': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: 0 }],
        '削峰策略放电起始时间': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: 0, maxm: 23 }],
        '削峰策略放电终止时间': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: 0, maxm: 23 }],
        '削峰策略放电功率': [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMath, trigger: ['blur', 'change'], minm: 0 }]
      },

      butYk: { title: '系统手自动模式', value: 0, name: '手动', ykyt: 'yt_0_', nameyt: '0' },
      butYk1: { title: '系统手自动模式', value: 0, name: '自动', ykyt: 'yt_0_', nameyt: '1' },

      butYk2: { title: '并网控制策略', value: 0, name: '计划表', ykyt: 'yt_9_', nameyt: '2' },
      butYk3: { title: '并网控制策略', value: 0, name: '高备电', ykyt: 'yt_9_', nameyt: '1' },
      // butYk4: { title: '并网控制策略', value: 0, name: '联络线削峰', ykyt: 'yt_6_', nameyt: '3' },
      socList: {
        name: '电池维护周期', value: '0', unit: '天', msgType: 'yt_47_', snid: '004_0044_0017_02_FS0', deviceName: '储能集装箱终端', logName: '电池维护周期设置'
      },
      TimeOut: '',
      curName: [
        { name: '储能集装箱终端', protocolType: 76, value: '', stateQk: [
          { type: 0, name: '手动' },
          { type: 1, name: '自动' }
        ] },
        { name: '储能集装箱终端', protocolType: 77, value: '', stateQk: [
          { type: 1, name: '高备电' },
          { type: 2, name: '计划表' }
        ] }
      ],
      curNameC: [
        { name: '储能集装箱终端', protocolType: 76, value: '', stateQk: [
          { type: 0, name: '手动' },
          { type: 1, name: '自动' }
        ] },
        { name: '储能集装箱终端', protocolType: 77, value: '', stateQk: [
          { type: 1, name: '高备电' },
          { type: 2, name: '充放电计划表' },
          { type: 3, name: '联络线削峰' }
        ] },
        { name: '储能集装箱终端', protocolType: 135, value: ''}
      ]
    }
  },
  watch: {
    list: {
      handler(val) {
        this.rules['保护SOC上限'][1].minm = Number(val[0][1].value)
        this.rules['保护SOC下限'][1].maxm = Number(val[0][0].value)
        this.rules['备电SOC上限'][1].minm = Number(val[0][2].value) - Number(val[0][3].value)
        // this.rules['备电SOC上限'][1].maxm = Number(val[0][0].value)
        this.rules['备电SOC下限'][1].maxm = Number(val[0][2].value)
      },
      deep: true
    },
    list1: {
      handler(val) {
        this.rules1['联络线功率上限'][1].minm = Number(val[0][1].value)
        this.rules1['联络线功率下限'][1].maxm = Number(val[0][0].value)
        this.rules1['削峰策略充电起始时间'][1].maxm = Number(val[0][3].value)
        this.rules1['削峰策略充电终止时间'][1].minm = Number(val[0][2].value)
        this.rules1['削峰策略放电起始时间'][1].minm = Number(val[0][3].value)
      },
      deep: true
    },
    list2: {
      handler(val) {
        this.rules1['削峰策略充电终止时间'][1].maxm = Number(val[0][1].value)
        this.rules1['削峰策略放电起始时间'][1].maxm = Number(val[0][2].value)
        this.rules1['削峰策略放电终止时间'][1].minm = Number(val[0][1].value)
      },
      deep: true
    },
    curName: {
      handler(val) {
        if (val[0].value == '手动') { this.radio = '0' } else if (val[0].value == '自动') { this.radio = '1' }
        if (val[1].value == '高备电') { this.radio1 = '1' } else if (val[1].value == '计划表') { this.radio1 = '2' }
      },
      deep: true
    }
  },
  created() {
    // getCurrentData(this.curName)
    this.list[0].forEach(value=>{
      if(value.rules) {
        this.rules[value.name] = [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: validateMath, trigger: ['blur', 'change'],minm:value.rules.minm,maxm:value.rules.maxm }
        ]
      }
    })
    this.reload()
    this.TimeOut = setInterval(this.reload, 1000 * sjzRealTime)
  },
  beforeDestroy() {
    clearInterval(this.TimeOut)
  },
  methods: {
    reload() {
      getCurrentData(this.list[0], '储能集装箱终端')
      getCurrentData(this.list1[0], '联络线')
      getCurrentData(this.list2[0], '联络线')
      getCurrentData(this.hessChargList)
      getCurrentData(this.hessChargList1)
      getCurrentData(this.curNameC)
    },
    confirm(value, active, inactive) {
      const val = this[value]
      let actd = false
      if (active == '自动') { this[value] = (1 - this[value]).toString(); actd = 0 }
      this.$confirm('是否将系统手自动模式设置成<span style="color:red;">' + (this[value] == actd ? active : inactive) + '</span>?', '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const abc = () => {
          this[value] = val
          this.$message({
            type: 'success',
            message: '下发成功!'
          })
          const logData = {
            operation: '系统手自动模式设置',
            params: '将系统手自动模式设置成' + (this[value] == actd ? active : inactive)
          }
          // console.log(logData)
          getLogSave(logData).then(response => {
            // console.log(response)
          })
        }
        this.gexinProtocal('yt_0_' + val, abc)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    confirm1(value, active, inactive) {
      const val = this[value]
      let actd = false
      if (active == '计划表') { this[value] = (3 - this[value]).toString(); actd = 1 }
      this.$confirm('是否将并网控制策略设置成<span style="color:red;">' + (this[value] == actd ? active : inactive) + '</span>?', '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const abc = () => {
          this[value] = val
          this.$message({
            type: 'success',
            message: '下发成功!'
          })
          const logData = {
            operation: '并网控制策略设置',
            params: '将并网控制策略设置成' + (this[value] == actd ? active : inactive)
          }
          // console.log(logData)
          getLogSave(logData).then(response => {
            // console.log(response)
          })
        }
        this.gexinProtocal('yt_6_' + val, abc)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    conform(item) {
      this.$refs['dataForm' + item.name][0].validate((valid) => {
        if (valid) {
          this.$confirm('是否将<span style="color:#00BCFF;">' + item.name + '</span>修改为<span style="color:red;">' + this.innerVisibleValue[item.name] + item.butunit + '</span>?', '提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const data = {
              broker: hostIp,
              clientID: clientId,
              topic: 'ncyt_sub_yk_yt',
              msgType: item.msgType + this.innerVisibleValue[item.name] / (item.coefficient || 1),
              snid: item.snid,
              manual: '1'
            }
            if(item.name=='备电SOC下限') {
              data.msgType = item.msgType + (Number(this.list[0][2].value) - Number(this.innerVisibleValue[item.name])) / (item.coefficient || 1)
            }
            // console.log(data)
            mqttPublishPublish(data).then(response => {
              // console.log(response)
              if (response.controlResult == true) {
                this.innerVisible[item.name] = false
                // item.value = this.innerVisibleValue[item.name]
                item.content1 = this.innerVisibleValue[item.name]
                this.innerVisibleValue[item.name] = ''
                this.$message({
                  type: 'success',
                  message: '下发成功!'
                })
                const logData = {
                  operation: item.name + '设置',
                  params: '将' + item.name + '设置成' + item.content1 + item.butunit
                }
                // console.log(logData)
                getLogSave(logData).then(response => {
                  // console.log(response)
                })
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
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      })
    },
    popoverChange(item) {
      this.$nextTick(() => {
        this.$set(this.innerVisibleValue, item, '')
        this.$refs['dataForm' + item][0].clearValidate()
      })
    },
    contenInput(value) {
      if (value.content1 != '') {
        if (!/^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/.test(value.content1)) {
          this.$set(value, 'validateMassage', '必须是数字')
          this.$set(value, 'validate', true)
        } else {
          if (Number(value.content1) > 1500) {
            this.$set(value, 'validateMassage', '数值必须小于1500')
            this.$set(value, 'validate', true)
          } else if (Number(value.content1) < -1500) {
            this.$set(value, 'validateMassage', '数值必须大于-1500')
            this.$set(value, 'validate', true)
          } else { this.$set(value, 'validate', false) }
        }
      } else {
        this.$set(value, 'validate', false)
      }
    },
    jhTableClick() {
      let abcd = false
      this.hessChargList.forEach(value => {
        if (value.content1 != '') {
          if (!/^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/.test(value.content1)) {
            this.$set(value, 'validateMassage', '必须是数字')
            this.$set(value, 'validate', true)
            abcd = true
          } else {
            if (Number(value.content1) > 630) {
              this.$set(value, 'validateMassage', '数值必须小于630')
              this.$set(value, 'validate', true)
              abcd = true
            } else if (Number(value.content1) < -630) {
              this.$set(value, 'validateMassage', '数值必须大于-630')
              this.$set(value, 'validate', true)
              abcd = true
            } else { this.$set(value, 'validate', false) }
          }
        }
      })
      this.hessChargList1.forEach(value => {
        if (value.content1 != '') {
          if (!/^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/.test(value.content1)) {
            this.$set(value, 'validateMassage', '必须是数字')
            this.$set(value, 'validate', true)
            abcd = true
          } else {
            if (Number(value.content1) > 630) {
              this.$set(value, 'validateMassage', '数值必须小于630')
              this.$set(value, 'validate', true)
              abcd = true
            } else if (Number(value.content1) < -630) {
              this.$set(value, 'validateMassage', '数值必须大于-630')
              this.$set(value, 'validate', true)
              abcd = true
            } else { this.$set(value, 'validate', false) }
          }
        }
      })
      if (abcd) return
      // return
      this.$confirm('是否下发' + '<span style="color:#00BCFF">储能充放电计划表</span>', '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let msgType = []
        this.hessChargList.forEach(value => {
          if (value.content1 != '') {
            msgType.push(value.msgType + value.content1)
          }
        })
        this.hessChargList1.forEach(value => {
          if (value.content1 != '') {
            msgType.push(value.msgType + value.content1)
          }
        })
        const abc = () => {
          this.hessChargList.forEach(value => {
            if (value.content1 != '') {
              // value.value = value.content1
              value.content1 = ''
            }
          })
          this.hessChargList1.forEach(value => {
            if (value.content1 != '') {
              // value.value = value.content1
              value.content1 = ''
            }
          })
          this.$message({
            type: 'success',
            message: '下发成功!'
          })
          const logData = {
            operation: '储能充放电计划表下发',
            params: '下发储能充放电计划表'
          }
          // console.log(logData)
          getLogSave(logData).then(response => {
            // console.log(response)
          })
        }
        msgType = msgType.join(',')
        if (msgType != '') {
          this.gexinProtocal(msgType, abc)
          // let absc = msgType=> {
          //   const adfg = msgType
          //   if(adfg.length<=5) {
          //     let ahj = adfg.join(',')
          //     this.gexinProtocal(ahj, abc)
          //   }
          //   else{
          //     let ahj = adfg.splice(0,5).join(',')
          //     this.gexinProtocal(ahj, abc)
          //     setTimeout(()=>{
          //       absc(adfg)
          //     },1000)
          //   }
          // }
          // absc(msgType.split(','))
        } else {
          this.$message({
            type: 'info',
            message: '下发失败'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
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
          if (callback != undefined) { callback() } else {
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
  font-size:15px;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: space-between;
  /*! autoprefixer: off */
    background:-webkit-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
  /*! autoprefixer: off */
  background:-moz-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
  background:-o-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
  background:-ms-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
}

.TaTitle {
  font-size:1.1em;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  .title{
    font-size:1em;
    width: 11em;
  }
}
.TaTitle1 {
  font-size:1.1em;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  align-items: left;
}
.frame {
  margin-left:10em;
  display: flex;
  display: -webkit-flex;
  align-items: center;
}
.socClass{
  margin-left:1em;
  display: inline-block;
}
.tbCla{
  border-collapse:collapse;
  width:100%;
  // margin-left:5%;
  text-align:center;
  tr{
    height:2em;
  }
  @media screen and (max-width:1400px){
    tr{
    height:1.5em;
  }
  }
  tr:nth-child(3n-2){
    background:rgb(239,237,251);
  }
}
@media screen and (max-width:1400px){
    .aghjk{
      margin-top:0!important;
    }
  }
</style>

<style lang="less">
  .tbCla .el-input--medium .el-input__inner{
    height:1.9em;
    color:black;
    // line-height:1.9em;
  }
</style>
