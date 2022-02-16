<template>
  <div class="app-container">
    <div class="filter-container">

      <el-form :inline="true" @keyup.enter.native="handleFilter">
        <!-- <div style="float:left">
          <el-form-item>
            <el-select
              v-model="projectSelectValue"
              filterable
              clearable
              placeholder="项目名称"
              @change="projectSelectChange"
            >
              <el-option
                v-for="item in projectSelectOptionsDia"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div> -->
        <div style="float:left">
          <el-form-item>
            <el-select
              v-model="countrySelectValue"
              filterable
              clearable
              placeholder="设备模型名称"
            >
              <el-option
                v-for="(item,index) in stationSelectOptions"
                :key="'sta'+index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div style="float:left">
          <el-form-item>
            <el-select
              v-model="provinceSelectValue"
              filterable
              clearable
              placeholder="规约类型"
            >
              <el-option
                v-for="item in gyTypeSelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div style="float:left">
          <el-form-item>
            <el-select
              v-model="xieyiSelectValue"
              filterable
              clearable
              placeholder="采集点规约点号"
              v-el-select-lazy="loadMoreXieyi"
              :filter-method="xieyiFilterMethod"
            >
              <el-option
                v-for="item in xieyiSelect.select"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div style="float:left">
          <el-form-item>
            <el-select
              v-model="tablenameSelectValue"
              filterable
              clearable
              placeholder="数据存储表名"
            >
              <el-option
                v-for="item in tablenameSelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <div style="float:left">
          <el-button class="TablePageButtonSearch" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="TablePageButtonAdd" icon="el-icon-edit" @click="handleCreate">
            新增
          </el-button>
        </div>
      </el-form>

    </div>

    <el-table
      v-loading="listLoading"
      class="tableanalysis"
      :data="list"
      border
      fit
      style="width: 100%;"
      size="mini"
    >
      <el-table-column :label="$t('table.id')" width="50" type="index" :index="(currentPage-1)*pageSize+1" />
      <el-table-column label="设备模型名称" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.refDeviceInfoDeviceName }}({{ row.refDeviceInfoDeviceid }})</span>
        </template>
      </el-table-column>
      <el-table-column label="设备采集点名称" min-width="120" prop="name" show-overflow-tooltip />
      <el-table-column label="设备采集点类型" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.refProtocolTypeProtocolTypeName }}({{ row.refProtocolTypeProtocoltypeid }})</span>
        </template>
      </el-table-column>
      <el-table-column label="采集点规约点号" min-width="120" prop="protocolType" show-overflow-tooltip />
      <el-table-column label="单位" min-width="100" prop="unit" show-overflow-tooltip />
      <el-table-column label="数据存储表名" min-width="100" prop="tablename" show-overflow-tooltip />
      <el-table-column label="所属规则" min-width="100" prop="refFarmProtocolRuleId" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.refFarmProtocolRuleId | selectOptionFilter(ruleSelectOptions) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonEdit" @click="handleUpdate(row)">
            编辑
          </el-button>

          <el-button size="mini" class="TableButtonDelete" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :total="total"
      background
      :page-sizes="[5, 10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      popper-class="PaginationPageSize"
      class="TablePagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog v-if="dialogStatus==='create'||dialogStatus==='update'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr" class="dialogtyx">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="140px">
        <el-form-item label="设备采集点名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
        </el-form-item>
        <el-form-item label="设备模型名称" prop="refDeviceInfoDeviceid">
          <el-select
            v-model="temp[dialogStatus].refDeviceInfoDeviceid"
            filterable
            placeholder="设备模型名称"
          >
            <el-option
              v-for="(item,index) in stationSelectOptions"
              :key="'stas'+index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
import { mqttDeviceInfoList } from '@/api/mqtt/aipowerdeviceinfo'
import { selectOptionFilter } from '@/filters'

export default {
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
        protocolTypeId: [{ required: true, message: '采集点类型ID不能为空', trriger: 'blur' }],
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
    if (this.$route.query.projectId !== undefined) {
      this.projectSelectValue = Number(this.$route.query.projectId)
    }
    const projectId = (await this.$store.dispatch('project/defaultProjectSGet')).id
    if (projectId) this.projectSelectValue = projectId
    this.getList()
    this.getSelectOptionsList()
    this.getDiaSelect()
  },
  methods: {
    getList(page) {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString()
      }
      if (page)data.page = page.toString()
      if (this.countrySelectValue !== '') {
        data.refDeviceInfoDeviceid = this.countrySelectValue
      }
      if (this.provinceSelectValue !== '') {
        data.refProtocolTypeProtocoltypeid = this.provinceSelectValue
      }
      if (this.xieyiSelectValue !== '') {
        data.protocolType = this.xieyiSelectValue
      }
      if (this.tablenameSelectValue !== '') {
        data.tablename = this.tablenameSelectValue
      }
      if (this.projectSelectValue !== '') {
          data.projectId = this.projectSelectValue
        }
      getEquipTypeList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = response.page.list
          // if (this.InitOptiList) {
          //   this.getSelectOptionsList()
          // }
        }
      })
    },
    getSelectOptionsList() {
      getEquipTypeList({projectId:this.projectSelectValue}).then(response => {
        if (response.code === 0) {
          const data1 = { limit: response.page.totalCount.toString(),projectId:this.projectSelectValue }
          getEquipTypeList(data1,30000).then(response => {
            if (response.code === 0) {
              // this.getSelectOptions(response.page.list, 'countrySelectOptions', 'id', 'name')
              this.getSelectOptions(response.page.list, 'xieyiSelectOptionsAll', 'protocolType', 'protocolType')
              this.xieyiSelect.options = this.xieyiSelectOptionsAll
              this.loadMoreXieyi()
              this.getSelectOptions(response.page.list, 'tablenameSelectOptions', 'tablename', 'tablename')
              this.InitOptiList = false
            }
          })
        }
      })
    },
    // 选择框选项
    getresSelectOptions(data, valueName, labelName) {
      const values = []
      const options = data.reduce((pre, cur) => {
        if (values.indexOf(cur[valueName]) === -1) {
          values.push(cur[valueName])
          pre.push({ value: cur[valueName], label: cur[labelName], text: cur[labelName] })
        }
        return pre
      }, [])
      return options
    },
    // 选择框选项
    getSelectOptions(data, options, valueName, labelName) {
      const values = []
      this[options] = data.reduce((pre, cur) => {
        if (values.indexOf(cur[valueName]) === -1) {
          values.push(cur[valueName])
          pre.push({ value: cur[valueName], label: cur[labelName], text: cur[labelName] })
        }
        return pre
      }, [])
    },
    getDiaSelect() {
      mqttDeviceInfoList({refProjectId:this.projectSelectValue}).then(response => {
        mqttDeviceInfoList({ refProjectId:this.projectSelectValue,limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.stationSelectOptions = []
            for (const i in res) {
              this.stationSelectOptions.push({ value: res[i].deviceId, label: res[i].name, id: res[i].id })
            }
          }
        })
      })
      getStationTypeList({}).then(response => {
        getStationTypeList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.gyTypeSelectOptions = []
            for (const i in res) {
              this.gyTypeSelectOptions.push({ value: res[i].protocolTypeId, label: res[i].name, id:res[i].id })
            }
          }
        })
      })
      mqttprojectInfoList({}).then(response => {
        mqttprojectInfoList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.projectSelectOptionsDia = []
            for (const i in res) {
              this.projectSelectOptionsDia.push({ value: res[i].id, label: res[i].name })
            }
          }
        })
      })
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
    loadMoreXieyi() {
      if(this.xieyiSelect.options.length>(this.xieyiSelect.num-1)*this.xieyiSelect.size) {
        const data = this.xieyiSelect.options.slice((this.xieyiSelect.num-1)*this.xieyiSelect.size,this.xieyiSelect.num*this.xieyiSelect.size)
        this.xieyiSelect.num++
        this.xieyiSelect.select.push.apply(this.xieyiSelect.select,data)
      }
    },
    xieyiFilterMethod(val) {
      if(val=='') this.xieyiSelect.options = this.xieyiSelectOptionsAll
      else this.xieyiSelect.options = this.xieyiSelectOptionsAll.filter(v=>v.label.indexOf(val)!=-1)
      this.xieyiSelect.num = 1
      this.xieyiSelect.select = []
      this.loadMoreXieyi()
    },
    handleCreate() {
      this.getDiaSelect()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
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
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = [row.id]
        getEquipTypeDelete(data).then(response => {
          if (response.code === 0) {
            this.InitOptiList = true
            this.currentPage = Math.min(this.currentPage, Math.ceil((this.total - 1) / this.pageSize))
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
              data.refFarmId = this.stationSelectOptions.filter(v=>v.value==data.refDeviceInfoDeviceid)[0].id
              getEquipTypeSave(data).then(response => {
                if (response.code === 0) {
                  this.dialogFormVisible = false
                  this.InitOptiList = true
                  this.temp.create = {}
                  const page = Math.ceil((this.total + 1) / this.pageSize)
                  this.getList(page)
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
              data.refFarmId = this.stationSelectOptions.filter(v=>v.value==data.refDeviceInfoDeviceid)[0].id
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
                }
                else {
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
      this.$refs['dataForm'].validate(async (valid) => {
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
          } else {
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
