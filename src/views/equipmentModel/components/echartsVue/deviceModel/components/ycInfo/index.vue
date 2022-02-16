<template>
  <div>
    <el-dialog v-if="dialogStatus==='create'||dialogStatus==='update'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr" class="dialogtyx">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="140px">
        <el-form-item label="设备采集点名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
        </el-form-item>
        <el-form-item label="设备模型名称">
          <span>{{temp[dialogStatus].refDeviceInfoDeviceName}}</span>
          <!-- <el-select
            v-model="temp[dialogStatus].refFarmId"
            filterable
            placeholder="设备模型名称"
          >
            <el-option
              v-for="item in stationSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="设备采集点类型" prop="refProtocolTypeProtocoltypeid">
          <el-select
            v-model="temp[dialogStatus].refProtocolTypeProtocoltypeid"
            filterable
            placeholder="设备采集点类型"
          >
            <el-option
              v-for="item in gyTypeSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button size="mini" class="TableButtonEdit" @click="addGyType">
            新增
          </el-button>
        </el-form-item>
        <el-form-item label="采集点规约点号" prop="protocolType">
          <el-input v-model="temp[dialogStatus].protocolType" />
        </el-form-item>
        <el-form-item label="单位" prop="protocolType">
          <el-input v-model="temp[dialogStatus].unit" />
        </el-form-item>
        <el-form-item label="数据存储表名" prop="tablename">
          <el-input v-model="temp[dialogStatus].tablename" />
        </el-form-item>
        <el-form-item label="所属规则" prop="refFarmProtocolRuleId">
          <el-select
            v-model="temp[dialogStatus].refFarmProtocolRuleId"
            filterable
            placeholder="所属规则"
          >
            <el-option
              v-for="item in ruleSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData(temp.create):updateData(temp.update)">
          确认
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="dialogStatusGyType==='create'" title="新增采集点类型" :visible.sync="dialogFormVisibleGyType" custom-class="user-management-diaCr" class="dialogtyx">
      <el-form ref="dataFormGyType" status-icon :rules="rules" :model="gyTypeCreate" size="mini" label-position="left" label-width="140px">
        <el-form-item label="采集点类型名称" prop="name">
          <el-input v-model="gyTypeCreate.name" />
        </el-form-item>
        <el-form-item label="采集点类型ID" prop="protocolTypeId">
          <el-input v-model="gyTypeCreate.protocolTypeId" />
        </el-form-item>
        <!-- <el-form-item label="采集点类型状态" prop="statu">
          <el-select
            v-model="gyTypeCreate.statu"
            filterable
            placeholder="采集点类型状态"
          >
            <el-option
              v-for="item in gyTypesSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createGyType(gyTypeCreate)">
          确认
        </el-button>
        <el-button @click="dialogFormVisibleGyType = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { validateuemail } from '@/utils/validate'
import { getFarmprotocolrulecfgList } from '@/api/mqtt/protocolrulecfg'
import { getEquipTypeList, getEquipTypeSave, getEquipTypeUpdate, getEquipTypeDelete } from '@/api/mqtt/equipType'
import { mqttprojectInfoList } from '@/api/mqtt/projectInfo'
import { getStationTypeList, getStationTypeSave } from '@/api/mqtt/stationType'
import { getFarmcfginfoList } from '@/api/mqtt/dianzhan.js'
import { selectOptionFilter } from '@/filters'

export default {
  props:{
    data:{
      type:Object,
      default:()=>{}
    },
    abc:{
      type:Boolean,
      default:false
    },
    dialogStatusProp:{
      type:String,
      default:''
    },
    projectId:{
      type:String|Number,
      default: ''
    }
  },
  watch: {
    abc(val) {
      if(val) {
        if(this.gyTypeSelectOptions.length==0||this.ruleSelectOptions.length==0) {
          this.getDiaSelect()
        }
        this.dialogFormVisible = val
        if(this.dialogStatusProp=='create') {
          this.handleCreate(this.data)
        } else if(this.dialogStatusProp=='update'){
          this.handleUpdate(this.data)
        } else if(this.dialogStatusProp=='delete') {
          this.handleDelete(this.data)
        }
      }
    },
    dialogFormVisible(val) {
      this.$emit('update:abc',val)
    },
    projectId(val) {
      this.projectSelectValue = val
    }
  },
  data() {
    return {
      list: null,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      total: 0,
      maxtotal: 0,
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        view: '查看'
      },
      rules: {
        protocolTypeId: [{ required: true, message: '不能为空', trriger: 'blur' }],
        // partyname: [{ required: true, message: '项目甲方不能为空', trriger: 'blur' }],
        // name: [{ required: true, message: '项目名称不能为空', trriger: 'blur' }],
        // areaname: [{ required: true, message: '项目地区不能为空', trriger: ['blur', 'change'] }],
        // utel: [{ required: true, message: '项目联系方式不能为空', trriger: 'blur' }],
        // softwareId: [{ required: true, message: '不能为空', trriger: 'blur' }],
        // uemail: [{ required: true, validator: validateuemail, trigger: 'blur' }],
        // intime: [{ required: true, message: '增加时间不能为空', trriger: ['blur', 'change'] }],
        // refHostid: [{ required: true, message: '不能为空', trriger: ['blur', 'change'], type: 'number' }],
        // x: [{ required: true, message: '经度不能为空', trriger: 'blur' }],
        // y: [{ required: true, message: '纬度不能为空', trriger: 'blur' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      temp: {
        create: {},
        update: {},
        view: {}
      },
      InitOptiList: true,

      countrySelectValue: '',
      countrySelectOptions: '',
      provinceSelectValue: '',
      provinceSelectOptions: '',
      hostSelectOptionsDia: [],
      pidSelectOptions: [],
      stationSelectOptions: [],
      gyTypeSelectOptions: [],
      xieyiSelect:{
        num:1,
        size:10,
        select:[],
        options:[]
      },
      xieyiSelectOptionsAll: [],
      tablenameSelectOptions: [],
      tablenameSelectValue: '',
      xieyiSelectValue: '',
      projectSelectValue: 4,
      projectSelectOptionsDia: [],
      ruleSelectOptions: [],
      selectPage: 1,
      dialogStatusGyType:'',
      dialogFormVisibleGyType:false,
      gyTypeCreate:{},
      gyTypesSelectOptions: [
        { value: '1', label: '可用' },
        { value: '0', label: '不可用' }
      ],
    }
  },
  async created() {
    // const projectId = await this.$store.dispatch('project/defaultProjectSGet')
    // if (projectId) this.projectSelectValue = projectId.id
  },
  methods: {
    getList() {
      this.$emit('update')
    },
    getDiaSelect() {
      // getFarmcfginfoList({ }).then(response => {
      //   getFarmcfginfoList({ limit: response.page.totalCount.toString() }).then(response => {
      //     if (response.code === 0) {
      //       const res = response.page.list
      //       this.stationSelectOptions = []
      //       for (const i in res) {
      //         this.stationSelectOptions.push({ value: res[i].id, label: res[i].name })
      //       }
      //     }
      //   })
      // })
      getStationTypeList({}).then(response => {
        getStationTypeList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.gyTypeSelectOptions = []
            for (const i in res) {
              this.gyTypeSelectOptions.push({ value: res[i].protocolTypeId, label: res[i].name ,id:res[i].id })
            }
          }
        })
      })
      // mqttprojectInfoList({}).then(response => {
      //   mqttprojectInfoList({ limit: response.page.totalCount.toString() }).then(response => {
      //     if (response.code === 0) {
      //       const res = response.page.list
      //       this.projectSelectOptionsDia = []
      //       for (const i in res) {
      //         this.projectSelectOptionsDia.push({ value: res[i].id, label: res[i].name })
      //       }
      //     }
      //   })
      // })
      getFarmprotocolrulecfgList({}).then(response => {
        getFarmprotocolrulecfgList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.ruleSelectOptions = []
            for (const i in res) {
              this.ruleSelectOptions.push({ value: res[i].id + '', label: res[i].name })
            }
          }
        })
      })
    },
    handleCreate(row) {
      row = row || {}
      this.getDiaSelect()
      this.temp.create = { ...row }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      // console.log(row)
      this.getDiaSelect()
      this.temp.update = { ...row }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleView(row) {
      this.temp.view = row
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      this.dialogStatus = 'delete'
      this.dialogFormVisible = true
      this.$confirm('此操作将永久删除该设备规约, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogFormVisible = false
        const data = [row.id]
        getEquipTypeDelete(data).then(response => {
          if (response.code === 0) {
            this.getList()
            this.$notify({
              title: 'Succeed',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: 'Failed',
              message: response.msg,
              type: 'danger',
              duration: 2000
            })
          }
        })
      }).catch(() => {
        this.dialogFormVisible = false
        this.$notify.info({
          title: '消息',
          message: '已取消删除',
          duration: 2000
        })
      })
    },
    createData({ ...data }) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const data1={
          //   protocolType:data.protocolType,
          //   refFarmId:data.refFarmId,
          //   projectId:this.projectSelectValue
          // }
          // getEquipTypeList(data1).then(response=>{
          //   if(response.page.list.length==0) {
              data.projectId = this.projectSelectValue
              data.refFarmProtocolTypeId = this.gyTypeSelectOptions.filter(v=>v.value==data.refProtocolTypeProtocoltypeid)[0].id
              getEquipTypeSave(data).then(response => {
                if (response.code === 0) {
                  this.dialogFormVisible = false
                  this.InitOptiList = true
                  this.temp.create = {}
                  this.getList()
                  this.$notify({
                    title: 'Succeed',
                    message: '创建成功!',
                    type: 'success',
                    duration: 2000
                  })
                } else if('message' in response){
                  this.$notify({
                    title: 'Failed',
                    message: '该设备规约已存在',
                    type: 'danger',
                    duration: 2000
                  })
                } else {
                  this.$notify({
                    title: 'Failed',
                    message: response.msg,
                    type: 'danger',
                    duration: 2000
                  })
                }
              })
          //   } else {
          //     this.$notify({
          //       title: 'Failed',
          //       message: '该设备规约已存在',
          //       type: 'danger',
          //       duration: 2000
          //     })
          //   }
          // })
        }
      })
    },
    updateData({ ...data }) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const data1={
          //   protocolType:data.protocolType,
          //   refFarmId:data.refFarmId,
          //   projectId:data.projectId
          // }
          // getEquipTypeList(data1).then(response=>{
          //   const res = response.page.list
          //   if(res.length==0||res[0].id==data.id) {
              data.refFarmProtocolTypeId = this.gyTypeSelectOptions.filter(v=>v.value==data.refProtocolTypeProtocoltypeid)[0].id
              getEquipTypeUpdate(data).then(response => {
                if (response.code === 0) {
                  this.dialogFormVisible = false
                  this.InitOptiList = true
                  this.getList()
                  this.$notify({
                    title: 'Succeed',
                    message: '编辑成功!',
                    type: 'success',
                    duration: 2000
                  })
                } else if('message' in response){
                  this.$notify({
                    title: 'Failed',
                    message: '该设备规约已存在',
                    type: 'danger',
                    duration: 2000
                  })
                } else {
                  this.$notify({
                    title: 'Failed',
                    message: response.msg,
                    type: 'danger',
                    duration: 2000
                  })
                }
              })
          //   } else {
          //     this.$notify({
          //       title: 'Failed',
          //       message: '该设备规约已存在',
          //       type: 'danger',
          //       duration: 2000
          //     })
          //   }
          // })
        }
      })
    },
    handleFilter() {
      this.currentPage = 1
      this.getList()
    },
    handleSizeChange() {
      this.getList()
    },
    handleCurrentChange() {
      this.getList()
    },
    addGyType() {
      this.getDiaSelect()
      this.dialogStatusGyType = 'create'
      this.dialogFormVisibleGyType = true
      this.$nextTick(() => {
        this.$refs['dataFormGyType'].clearValidate()
      })
    },
    createGyType(row) {
      let data = {...row}
      data.statu = 1
      this.$refs['dataFormGyType'].validate(async (valid) => {
        if (valid) {
          const gyresponse = await getStationTypeList({name:data.name})
          if(gyresponse.code===0&&gyresponse.page.list.length==0) {
            const gyresponse1 = await getStationTypeList({protocolTypeId:data.protocolTypeId})
          if(gyresponse1.code===0&&gyresponse1.page.list.length==0) {
            getStationTypeSave(data).then(response => {
              if (response.code === 0) {
                this.dialogStatusGyType = false
                this.gyTypeCreate = {}
                getStationTypeList({}).then(response => {
                  getStationTypeList({ limit: response.page.totalCount.toString() }).then(response => {
                    if (response.code === 0) {
                      const res = response.page.list
                      this.gyTypeSelectOptions = res.map(v=>({value:v.id,label:v.name}))
                    }
                  })
                })
                this.$notify({
                  title: 'Succeed',
                  message: '创建成功!',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify({
                  title: 'Failed',
                  message: response.msg,
                  type: 'danger',
                  duration: 2000
                })
              }
            })
          }else {
            this.$notify({
              title: 'Failed',
              message: '该采集点类型ID已存在',
              type: 'danger',
              duration: 2000
            })
          }
          } else {
            this.$notify({
              title: 'Failed',
              message: '该采集点类型已存在',
              type: 'danger',
              duration: 2000
            })
          }
        }
      })
    }
  }

}
</script>

<style lang="less">
  .tableanalysis tr,.tableanalysis th{
    background-color:transparent;
  }
  .container .tableanalysis tbody tr:hover>td {
    background-color:transparent;
  }
  /* 表格选中行高亮颜色 */
.tableanalysis .el-table__body tr.current-row>td {
  background:rgb(76,177,214);
  }
//   .el-pagination__total {
//   color:#fff;
// }
// .el-pagination__jump{
//   color:#fff;
// }
</style>
