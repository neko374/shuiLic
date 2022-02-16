<template>
  <div>
    <el-dialog v-if="dialogStatus=='deviceModel'" title="设备图模" :visible.sync="dialogFormVisible" custom-class="diaHistory">
      <div slot="title" class="dialog-title" align="center">
        <span class="title-text">{{deviceData.name}}</span>
        <span style="color:black">设备模型信息</span>
        <el-button style="margin-left:20px;" class="TableButtonEdit" @click="deviceInfoUpdate(deviceData)">基础信息编辑</el-button>
      </div>
      <div class="topContainer" style="border-bottom:1px solid #00C8FA;">
        <div style="float:left;width:150px;height:100%;">
          <div class="modelTitle" style="margin-bottom:3px;font-weight:bold;background:#0E9CA3;">设备图片</div>
          <el-image
            style="width:100%; height:calc(100% - 27px);"
            :src="deviceImgUrl"
            fit="contain">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
        </div>
        <div style="float:left;width:calc(100% - 150px);height:100%;">
          <div style="padding:0 5px;float:left;width:50%;height:100%;">
            <el-form ref="dataForm" status-icon size="mini" :model="temp" label-position="left" label-width="120px" class="jbs">
              <div class="modelTitle" style="margin-bottom:3px;font-weight:bold;">基础信息展示</div>
              <div style="padding:10px;height:calc(100% - 30px);overflow:auto;">
                <el-form-item label="设备名称">
                  <span>{{temp.name}}</span>
                </el-form-item>
                <el-form-item label="设备ID">
                  <span>{{temp.deviceId}}</span>
                </el-form-item>
                <el-form-item label="创建时间">
                  <span>{{temp.createtime}}</span>
                </el-form-item>
                <el-form-item label="采集器名称">
                  <span>{{temp.snid | selectOptionFilter(collectSelectOptions)}}</span>
                </el-form-item>
                <el-form-item label="采集器SNID">
                  <span>{{temp.snid}}</span>
                  <el-button type="primary" @click="collectView(temp.snid)">查看</el-button>
                </el-form-item>
                <el-form-item label="采集规约">
                  <span v-if="temp.snid">{{temp.snid.split('_')[0]}} {{temp.snid.split('_')[2]}}</span>
                  <el-button type="primary" @click="cjgyView(temp.snid)">查看</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div style="padding:0 5px;float:left;width:50%;height:100%;">
            <el-form ref="dataForm" status-icon size="mini" :model="temp" label-position="left" label-width="120px" class="jbs">
              <div class="modelTitle" style="margin-bottom:3px;font-weight:bold;">基础信息展示</div>
              <div style="padding:10px;height:calc(100% - 30px);overflow:auto;" >
                <el-form-item  v-for="(item,index) in deviceField" :key="index+'field'" :label="item.name" >
                  <span>{{temp.ext[item.fieldImd]}}</span>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <div class="botContainer" style="margin-top:5px;">
        <div class="modelTitle" style="font-weight:bold;width:100%;">动态数据信息</div>
        <div class="modeInfo">
          <div style="float:left;width:33%;height:97%;">
            <el-form ref="dataForm" status-icon size="mini" :model="temp" label-position="left" label-width="160px" class="jbs">
              <div style="color:#fff;padding:5px 0;margin-bottom: 18px;font-weight:bold;text-align:center;background-color:#9280E2">遥测量
                <el-button icon="el-icon-circle-plus-outline" style="float:right;margin-top:-6px;color: white;background-color: #4cb1d6;" @click="ycCreate">新增</el-button>
              </div>
              <div style="height:300px;overflow:auto;padding:10px">
                <el-form-item v-for="item in listTable.filter(v=>/^YC/.test(v.protocolType))" :key="item.id" :label="item.farmProtocolTypeName">
                  <!-- <span @click="ycUpdate(item)" style="color:blue;cursor:pointer;text-decoration:underline;">{{item.protocolType}}</span> -->
                  <span>{{item.protocolType}}</span>
                  <el-button style="float:right;margin-left:5px;" class="TableButtonDelete" @click="ycDelete(item)">删除</el-button>
                  <el-button style="float:right;" class="TableButtonEdit" @click="ycUpdate(item)">编辑</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div style="float:left;width:33%;height:97%;">
            <el-form ref="dataForm" status-icon size="mini" :model="temp" label-position="left" label-width="160px" class="jbs">
              <div style="color:#fff;padding:5px 0;margin-bottom: 18px;font-weight:bold;text-align:center;background-color:#53CCC5">状态量
                <el-button icon="el-icon-circle-plus-outline" style="float:right;margin-top:-6px;color: white;background-color: #4cb1d6;" @click="ztCreate">新增</el-button>
              </div>
              <div style="height:300px;overflow:auto;padding:10px">
                <el-form-item v-for="item in listTable.filter(v=>/^ZT/.test(v.protocolType))" :key="item.id" :label="item.farmProtocolTypeName">
                  <!-- <span @click="BITZtClick(item)" style="color:blue;cursor:pointer;text-decoration:underline;">{{item.protocolType}}</span> -->
                  <span>{{item.protocolType}}</span>
                  <el-button style="float:right;margin-left:5px;" class="TableButtonDelete" @click="ztDelete(item)">删除</el-button>
                  <el-button style="float:right;" class="TableButtonEdit" @click="ztUpdate(item)">编辑</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div style="float:left;width:33%;height:97%;">
            <el-form ref="dataForm" status-icon size="mini" :model="temp" label-position="left" label-width="160px" class="jbs">
              <div style="color:#fff;padding:5px 0;margin-bottom: 18px;font-weight:bold;text-align:center;background-color:#FFA73C">故障量
                <el-button icon="el-icon-circle-plus-outline" style="float:right;margin-top:-6px;color: white;background-color: #4cb1d6;" @click="gzCreate">新增</el-button>
              </div>
              <div style="height:300px;overflow:auto;padding:10px">
                <el-form-item v-for="item in listTable.filter(v=>/^GZ/.test(v.protocolType))" :key="item.id" :label="item.farmProtocolTypeName">
                  <!-- <span @click="BITWarnClick(item)" style="color:blue;cursor:pointer;text-decoration:underline;">{{item.protocolType}}</span> -->
                  <span>{{item.protocolType}}</span>
                  <el-button style="float:right;margin-left:5px;" class="TableButtonDelete" @click="gzDelete(item)">删除</el-button>
                  <el-button style="float:right;" class="TableButtonEdit" @click="gzUpdate(item)">编辑</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </el-dialog>

    <dialogWarn v-model="dialogWarnvalue" :abc.sync="innerdialogFormVisibleBit" />
    <dialogzt v-model="dialogZtvalue" :abc.sync="innerdialogFormVisibleZtBit" />
    <ycInfo :data="dialogYcValue" :abc.sync="innerdialogFormVisibleYc" :dialogStatusProp="dialogStatusYc" @update="updateYcList" :projectId="projectId"/>
    <collect :data="collectInfo" :abc.sync="collectdialogFormVisible"/>
    <gyInfo :data="ycdialogInfo" :abc.sync="ycdialogFormVisible" />
    <dialog-tree
      :dialog-status-tree="dialogStatusTreeInfo"
      :dialog-visible-tree.sync="dialogVisibleTreeInfo"
      :device-data="deviceInfoData"
      @changeTree="changeTree"
    />
  
  </div>
</template>

<script>
import { mqttDeviceInfoList } from '@/api/mqtt/aipowerdeviceinfo'
import { getEquipTypeList } from '@/api/mqtt/equipType'
import { getTableVal } from '@/api/mqtt/farmcfgInfo'
import dialogWarn from './components/warnState/dialogzt'
import dialogzt from './components/ztState/dialogzt'
import ycInfo from './components/ycInfo'
import collect from './components/collect'
import gyInfo from './components/gyInfo'
import dialogTree from '../dialogTree'
import { mqttprojectCollectorList } from '@/api/mqtt/projectCollector'
import { selectOptionFilter } from '@/filters'

export default {
  components: {
    dialogWarn,
    dialogzt,
    ycInfo,
    collect,
    gyInfo,
    dialogTree
  },
  props: {
    dialogStatusTree: {
      type: String,
      default: ''
    },
    dialogVisibleTree: {
      type: Boolean,
      default: false
    },
    deviceData: {
      type: Object,
      default: {}
    },
    projectId:{
      type:String|Number,
      default: ''
    }
  },
  data() {
    return {
      pickerOptionsstart: {
        disabledDate: time => {
          // return time.getTime() >= new Date(this.date[1]).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000 || (new Date(this.date[1]).getTime() - time.getTime() > 30 * 24 * 3600 * 1000)
          return time.getTime() >= new Date(this.date[1]).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000
        }
      },
      pickerOptionsend: {
        disabledDate: time => {
          return time.getTime() <= new Date(this.date[0]).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000 || (time.getTime() - new Date(this.date[0]).getTime() > 30 * 24 * 3600 * 1000)
        }
      },
      date: [new Date().format('yyyy-MM-dd 00:05:00'), new Date(Date.now() + 24 * 3600 * 1000).format('yyyy-MM-dd 00:00:00')],
      dialogFormVisible: false,
      dialogStatus: '',
      list: [],
      listYun: [],
      listTable: [],
      listLoading: false,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      total: 0,
      temp:{},
      innerdialogFormVisibleBit:false,
      dialogStatusBit:'',
      dialogWarnvalue:{},
      dialogZtvalue:{},
      innerdialogFormVisibleZtBit:false,
      dialogStatusZtBit:'',
      dialogYcValue:{},
      innerdialogFormVisibleYc:false,
      dialogStatusYc:'',
      deviceField:[],
      collectInfo:'',
      collectdialogFormVisible:false,
      ycdialogInfo:'',
      ycdialogFormVisible:false,
      collectSelectOptions:[],
      deviceInfoData:{},
      dialogStatusTreeInfo: '',
      dialogVisibleTreeInfo: false,
    }
  },
  computed:{
    deviceImgUrl() {
      // console.log(this.temp)
      if(this.temp.picurl)
        return $_imgUrl + this.temp.picurl
      else
        return ''
    }
  },
  watch: {
    'date.0'(val) {
      this.$refs.datepicker.handleClose()
      if ((new Date(this.date[1]).getTime() - new Date(this.date[0]).getTime() > 365 * 24 * 3600 * 1000)) {
        this.date[1] = new Date((new Date(this.date[0]).getTime() + 365 * 24 * 3600 * 1000)).format('yyyy-MM-dd HH:mm:ss')
      }
    },
    'date.1'(val) {
      this.$refs.datepicker1.handleClose()
    },
    dialogVisibleTree(val) {
      if (val) {
        this.dialogFormVisible = true
        this.getListYun()
        if(this.collectSelectOptions.length==0)
          this.getCollect()
      }
    },
    dialogFormVisible(val) {
      this.$emit('update:dialogVisibleTree', val)
    },
    dialogStatusTree(val) {
      this.dialogStatus = val
    },
    deviceData:{
      handler(val) {
        let data = {...val}
        this.getDeviceList(data)
      },
      deep:true
    }
  },
  // created() {
  //   this.getCollect()
  // },
  methods: {
    getDeviceList(data) {
      mqttDeviceInfoList({id:data.id}).then(response=>{
        const res = response.page.list
        let dataTem = res[0] || {}
        if(dataTem.ext==null||dataTem.ext==undefined) {
          dataTem.ext = {}
        } else{
          dataTem.ext = JSON.parse(dataTem.ext)
          // console.log(dataTem.ext)
          this.deviceField = []
          for(let key in dataTem.ext) {
            const comkey = dataTem.ext[key]
            let nhgj = []
            if(dataTem.aipowerDeviceTypeEntity.aipowerDeviceColumnEntities)
              nhgj = dataTem.aipowerDeviceTypeEntity.aipowerDeviceColumnEntities.filter(v=>v.ename==key)
            let name = ''
            if(nhgj.length>0) name = nhgj[0].name
            this.deviceField.push({
              fieldImd:key,
              name:name
            })
          }
        }
        this.temp = dataTem
      }).catch(()=>{
        this.temp = {}
      })
    },
    getListYun() {
      const data = {
        refFarmId: this.deviceData.id
      }
      getEquipTypeList(data).then(response => {
        if (response.code === 0) {
          data.limit = response.page.totalCount + ''
          getEquipTypeList(data).then(response => {
            const res = response.page.list
            this.listTable = res
          })
        }
      })
    },
    changeTree() {
      const data = {
        id:this.deviceData.id
      }
      mqttDeviceInfoList(data).then(response => {
        const res = response.page.list
        for(let key in res[0]) {
          this.$set(this.deviceData,key,res[0][key])
        }
      })
    },
    getCollect() {
      mqttprojectCollectorList({ limit: '1' }).then(response => {
        mqttprojectCollectorList({
          limit: response.page.totalCount.toString()
        }).then(response => {
          const res = response.page.list
          this.collectSelectOptions = res.map(item => ({ value: item.snId, label: item.name }))
        })
      })
    },
    getList() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      this.list = this.listYun.slice(start, end)
    },
    handleFilter() {},
    handleSizeChange() {
      this.getList()
    },
    handleCurrentChange() {
      this.getList()
    },
    collectView(val) {
      this.collectInfo = val
      this.collectdialogFormVisible = true
      // this.$router.push({path:'/protocolConfig/collector',query:{objectId:val}})
    },
    cjgyView(val) {
      this.ycdialogInfo = val
      this.ycdialogFormVisible = true
      // this.$router.push({path:'/protocolConfig/object',query:{gyObjId:val.split('_')[0],gyNameId:val.split('_')[2]}})
    },
    updateYcList() {
      this.getListYun()
    },
    deviceInfoUpdate(data) {
      this.deviceInfoData = _.cloneDeep(data)
      this.dialogStatusTreeInfo = 'update'
      this.dialogVisibleTreeInfo = true
    },
    ycClick(row) {
      this.dialogYcValue = row
      // {pidType:row.protocolType, gyNameId:this.temp.snid.split('_')[2],gyObjId:this.temp.snid.split('_')[0]}
      this.innerdialogFormVisibleYc = true
    },
    BITWarnClick(row) {
      this.dialogWarnvalue = {pidType:row.protocolType, gyNameId:this.temp.snid.split('_')[2],gyObjId:this.temp.snid.split('_')[0]}
      this.innerdialogFormVisibleBit = true
    },
    BITZtClick(row) {
      this.dialogZtvalue = {pidType:row.protocolType, gyNameId:this.temp.snid.split('_')[2],gyObjId:this.temp.snid.split('_')[0]}
      this.innerdialogFormVisibleZtBit = true
    },
    ycCreate() {
      mqttDeviceInfoList({id:this.deviceData.id}).then(response=>{
        const res = response.page.list[0]
        this.dialogStatusYc = 'create'
        this.innerdialogFormVisibleYc = true
        this.dialogYcValue = {
          refFarmId:res.id,
          farmName:res.name,
          refDeviceInfoDeviceid: res.deviceId,
          refDeviceInfoDeviceName: res.name
        }
      })
    },
    ycUpdate(row) {
      this.dialogStatusYc = 'update'
      this.innerdialogFormVisibleYc = true
      this.dialogYcValue = row
    },
    ycDelete(row) {
      this.dialogStatusYc = 'delete'
      this.innerdialogFormVisibleYc = true
      this.dialogYcValue = row
    },
    ztCreate() {
      this.ycCreate()
    },
    ztUpdate(row) {
      this.ycUpdate(row)
    },
    ztDelete(row) {
      this.ycDelete(row)
    },
    gzCreate() {
      this.ycCreate()
    },
    gzUpdate(row) {
      this.ycUpdate(row)
    },
    gzDelete(row) {
      this.ycDelete(row)
    },
  }
}
</script>

<style lang="scss">
  .diaHistory{
    width:95%;
  }
.el-dialog__body {
  padding: 30px 20px;
}
</style>

<style lang="scss" scoped>
/deep/{
  .image-slot{
    background: #f5f7fa;
    color: #909399;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size:30px;
    height:100%;
  }
}
  .topContainer{
    height:260px;
  }
  .botContainer{
    height:380px;
  }
  .modelTitle {
    background-color: #3db3ff;
    color: #FFF;
    padding:5px 0;
    text-align:center;
  }
  .modeInfo{
    display: flex;
    display: -webkit-flex;
    -webkit-justify-content: space-around;
    justify-content: space-around;
  }
  .jbs{
    height:100%;
            /*! autoprefixer: off */
    background:-webkit-linear-gradient(left, rgba(4, 183, 243, 0.075) , rgba(30, 223, 210, 0.075), rgba(74, 41, 221, 0.075));
    background:-moz-linear-gradient(left, rgba(4, 183, 243, 0.075) , rgba(30, 223, 210, 0.075), rgba(74, 41, 221, 0.075));
    background:-o-linear-gradient(left, rgba(4, 183, 243, 0.075) , rgba(30, 223, 210, 0.075), rgba(74, 41, 221, 0.075));
    background:-ms-linear-gradient(left, rgba(4, 183, 243, 0.075) , rgba(30, 223, 210, 0.075), rgba(74, 41, 221, 0.075));
  }
</style>
