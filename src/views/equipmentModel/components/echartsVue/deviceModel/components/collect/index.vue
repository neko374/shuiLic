<template>
  <div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="140px">
        <el-form-item label="采集器名称" prop="name">
          <span class="wenzi">{{temp[dialogStatus].name}}</span>
        </el-form-item>
        <el-form-item label="采集器对象ID" prop="collectorId">
          <span class="wenzi">{{temp[dialogStatus].collectorId}}</span>
        </el-form-item>
        <el-form-item label="网络模块" prop="netMode">
          <span class="wenzi">{{temp[dialogStatus].netMode}}</span>
        </el-form-item>
        <el-form-item label="所属项目" prop="projectId">
          <span class="wenzi">{{temp[dialogStatus].projectId | selectOptionFilter(projectSelectOptionsDia)}}</span>
        </el-form-item>
        <el-form-item label="关联规约" prop="gyNameObjId">
          <span class="wenzi">{{temp[dialogStatus].gyNameObjId | selectOptionFilter(protocolSelectOptionsDia)}}</span>
        </el-form-item>
        <!-- <el-form-item label="采集器型号" prop="name">
          <el-input v-model="temp[dialogStatus].aipowerProjectCollectorDeviceInfoEntity.type" style="width:185px;" />
        </el-form-item> -->
        <el-form-item label="采集器品牌" prop="name">
          <span  class="wenzi" v-if="temp[dialogStatus].aipowerProjectCollectorDeviceInfoEntity">{{temp[dialogStatus].aipowerProjectCollectorDeviceInfoEntity.brand}}</span>
        </el-form-item>
        <!-- <el-form-item label="采集器厂家名称" prop="name">
          <el-input v-model="temp[dialogStatus].aipowerProjectCollectorDeviceInfoEntity.factoryName" style="width:185px;" />
        </el-form-item>
        <el-form-item label="厂家联系方式" prop="name">
          <el-input v-model="temp[dialogStatus].aipowerProjectCollectorDeviceInfoEntity.tel" style="width:185px;" />
        </el-form-item> -->
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mqttprojectCollectorList, mqttprojectCollectorSave, mqttprojectCollectorUpdate, mqttprojectCollectorDelete } from '@/api/mqtt/projectCollector'
import { mqttprojectInfoList, mqttprojectInfoInfo } from '@/api/mqtt/projectInfo'
import { mqttgysnInfoList } from '@/api/mqtt/gysnInfo'
import { selectOptionFilter } from '@/filters'

export default {
  props: {
    data: {
      type: String,
      default: ''
    },
    abc:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: 'view',
      textMap: {
        update: '编辑',
        create: '创建',
        view: '采集器查看'
      },
      temp: {
        create: {},
        update: {},
        view: {}
      },
      rules: {},
      projectSelectOptionsDia: [],
      protocolSelectOptionsDia: [],
    }
  },
  watch:{
    data:{
      handler(val) {
        this.getList()
        if(this.projectSelectOptionsDia.length==0||this.protocolSelectOptionsDia.length==0)
          this.getItemList()
      },
      deep:true
    },
    abc(val) {
      if(val) {
        this.dialogFormVisible = val
      }
    },
    dialogFormVisible(val) {
      this.$emit('update:abc',val)
    }
  },
  // created() {
  //   this.getItemList()
  // },
  methods: {
    getList() {
      const data = {
        limit: '1',
        page: '1',
        snId:this.data
      }
      mqttprojectCollectorList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          let list = response.page.list.map(item => { item.gyNameObjId = item.gyNameId + item.gyObjId; return item })
          this.temp.view = list[0] || {}
        }
      })
    },
    getItemList() {
      mqttprojectInfoList({}).then(response => {
        mqttprojectInfoList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.projectSelectOptionsDia = []
            for (const i in res) {
              this.projectSelectOptionsDia.push({ value: res[i].id.toString(), label: res[i].name })
            }
          }
        })
      })
      mqttgysnInfoList({}).then(response => {
        mqttgysnInfoList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.protocolSelectOptionsDia = []
            for (const i in res) {
              this.protocolSelectOptionsDia.push({ value: res[i].gyNameId + res[i].gyObjId, label: res[i].gyName, gyObjId: res[i].gyObjId, gyNameId: res[i].gyNameId })
            }
          }
        })
      })
    }
  },
}
</script>

<style lang="scss" scoped>
  .wenzi{
    color:#654BDB;
  }
</style>