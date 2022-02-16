<template>
  <div style="width:100%;height:100%;">
    <div class="filter-container">

      <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
         
        <div class="block" style="float:left">
          <el-cascader
            v-model="sblxSelectValue"
            :options="sblxSelectOptions"
            :props="sblxProps"
            placeholder="设备类型"
            :show-all-levels="false"
            ></el-cascader>
        </div>
        <div style="float:left">
          <el-form-item>
            <el-select
              v-model="nbqSelectValue"
              filterable
              clearable
              placeholder="逆变器名称"
            >
              <el-option
                v-for="item in nbqSelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div style="float:left">
          <el-button class="TablePageButtonSearch" size="mini" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="TablePageButtonAdd" size="mini" icon="el-icon-edit" @click="handleCreate">
            创建
          </el-button>
        </div>
      </el-form>

    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
      size="mini"
      @filter-change="filterChange"
    >
      <el-table-column label="序号" width="70" type="index" :index="(currentPage-1)*pageSize+1" />
      <el-table-column prop="name" label="名称" min-width="100" show-overflow-tooltip />
      <el-table-column prop="snId" label="采集器ID" min-width="100" show-overflow-tooltip />
      <el-table-column prop="deviceId" label="设备ID" min-width="100" show-overflow-tooltip />
      <el-table-column v-for="item in listTableColumn" :key="item.id" :label="item.name" min-width="130" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.ext[item.ename] }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="cityName"
        label="市"
        min-width="80"
        show-overflow-tooltip
        :filters="citySelectOptions"
        :filter-multiple="false"
        :column-key="'cityId'"
        filter-placement="bottom-end"
      />
      <el-table-column
        prop="countyName"
        label="县"
        min-width="80"
        show-overflow-tooltip
        :filters="countyTableFilter"
        :filter-multiple="false"
        :column-key="'countyId'"
        filter-placement="bottom-end"
      /> -->
      <el-table-column prop="uname" label="业主" min-width="80" show-overflow-tooltip />
      <el-table-column prop="contectname" label="联系人" min-width="80" show-overflow-tooltip />
      <el-table-column prop="contecttel" label="联系电话" min-width="100" show-overflow-tooltip />
      <el-table-column prop="contectaddr" label="联系地址" min-width="130" show-overflow-tooltip />
      <el-table-column label="操作" width="140">
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

    <device-info
      :dialog-status-tree="dialogStatus"
      :dialog-visible-tree.sync="dialogFormVisible"
      :device-data.sync="temp[dialogStatus]"
      :projectId="baseDataFilters.refProjectId"
      @changeTree="changeTree"
    />
    
  </div>
</template>

<script>
import { getFarmcfginfoList, getFarmcfginfoSave, getFarmcfginfoUpdate, getFarmcfginfoDelete } from '@/api/mqtt/dianzhan'
import { mqttDeviceInfoList, mqttDeviceInfoSave, mqttDeviceInfoUpdate, mqttDeviceInfoDelete } from '@/api/mqtt/aipowerdeviceinfo'
import { mqttDeviceTypeList, mqttDeviceTypeSave, mqttDeviceTypeUpdate, mqttDeviceTypeDelete } from '@/api/mqtt/aipowerdevicetype'
import { CountryList } from '@/api/CountryManagement'
import { mqttprojectInfoList } from '@/api/mqtt/projectInfo'
import { mqttprojectCollectorList } from '@/api/mqtt/projectCollector'
import { validateLon, validateLat, validatePhoneTwo } from '@/utils/validate'
import { selectOptionFilter } from '@/filters'
import deviceInfo from '@/views/equipmentModel/components/echartsVue/deviceInfo'

export default {
  components:{
    deviceInfo
  },
  filters: {
    ratedFilter(val) {
      let resd = val
      if (val) {
        resd = val + 'kWp'
      }
      return resd
    },
    voltageFilter(val) {
      let resd = val
      if (val) {
        resd = val + 'kV'
      }
      return resd
    }
  },
  props: {
    projectBase:{
      type:Object,
      default:()=>({})
    }
  },
  data() {
    return {
      list: null,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      total: 0,
      listLoading: false,
      dialogFormVisible: false,
      innerVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        snid: [{ required: true, message: 'Id is required', trigger: 'blur' }],
        // rated: [{ required: true, message: 'Rated is required', trigger: 'blur' }],
        accessType: [{ required: true, message: 'AccessType is required', trigger: ['blur', 'change'] }],
        provinceId: [{ required: true, message: 'Province is required', trigger: ['blur', 'change'] }],
        countryCascaderValue: [{ required: true, message: 'Country is required', trigger: ['blur', 'change'] }],
        cityId: [{ required: true, message: 'City is required', trigger: ['blur', 'change'] }],
        countyId: [{ required: true, message: 'County is required', trigger: ['blur', 'change'] }],
        uname: [{ required: true, message: 'Username is required', trigger: 'blur' }],
        contectname: [{ required: true, message: 'Contact is required', trigger: 'blur' }],
        contecttel: [{ required: true, message: 'Phone Number is required', trigger: 'blur' }, { validator: validatePhoneTwo, trigger: 'blur' }],
        contectaddr: [{ required: true, message: 'Address is required', trigger: 'blur' }],
        voltage: [{ required: true, message: 'Grid Voltage Level is required', trigger: 'blur' }],
        bname: [{ required: true, message: 'Grid Voltage Name is required', trigger: 'blur' }]
        // x: [{ required: true, validator: validateLon, trigger: 'blur' }],
        // y: [{ required: true, validator: validateLat, trigger: 'blur' }]
      },
      temp: {
        create: {},
        update: {}
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      InitOptiList: true,
      baseDataFilters: {
        state: 1,
        refProjectId: ''
      },

      citySelectValue: '',
      citySelectOptions: [],
      nbqSelectValue: '',
      nbqSelectOptions: [],
      sblxSelectValue: 1,
      sblxSelectOptions: [],
      projectSelectOptions: [],
      collectSelectOptions: [],
      stationSelectOptions: [],
      countyTableFilter: [],
      tableFilters: {},
      powerstateSelectOptions: [
        { value: 1, label: '集中式' },
        { value: 2, label: '分布式' }
      ],
      countryCascaderOptions: [],
      provinceId: '',
      sblxProps: {
        value: 'id',
        label: 'name',
        multiple: false,
        checkStrictly: true,
        emitPath: false
      },
      listTableColumn:''
    }
  },
  watch: {
    'projectBase.projectId'(val) {
      this.baseDataFilters.refProjectId = this.projectBase.projectId
      this.getList()
    }
  },
  async created() {
    const projectId = (await this.$store.dispatch('project/defaultProjectSGet')).id
    if (projectId) this.baseDataFilters.refProjectId = Number(projectId)
    this.getList()
    this.getOtherSelectOptions()
  },
  methods: {
    filterChange(row) {
      const key = Object.keys(row)[0]
      // console.log(row,key)
      if (row[key].length === 0) {
        delete this.tableFilters[key]
      } else {
        this.tableFilters[key] = row[key][0]
      }
      this.getList()
    },
    // 表格内容
    getList() {
      this.listLoading = true
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString(),
        ...this.tableFilters,
        ...this.baseDataFilters
      }
      if (this.nbqSelectValue !== '') {
        data.id = this.nbqSelectValue
      }
      if (this.sblxSelectValue !== '') {
        data.refDeviceTypeId = this.sblxSelectValue
      } else {this.listLoading = false;return;}
      mqttDeviceInfoList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          const list = response.page.list
          this.list = list.map(v=>({...v,ext:JSON.parse(v.ext)}))

          const listTableColumn = this.sblxSelectOptions.filter(v=>v.id==this.sblxSelectValue)
          this.listTableColumn = listTableColumn[0].aipowerDeviceColumnEntities
          // console.log('listTableColumn',this.listTableColumn)

          this.listLoading = false
        } else {
          this.listLoading = false
        }
      }).catch(() => { this.listLoading = false })
    },
    ArrayToTree(data, res) {
      res.forEach(val => {
        if (data.id == val.pid) {
          const acd = {...val,pidName:data.name}
          if (!data.children) data.children = []
          data.children.push(acd)
          this.ArrayToTree(acd, res)
        }
      })
    },
    getOtherSelectOptions() {
      mqttDeviceTypeList({ limit: '1' }).then(response => {
        if (response.code === 0) {
          const data1 = { limit: response.page.totalCount.toString() }
          mqttDeviceTypeList(data1).then(response => {
            if (response.code === 0) {
              const res = response.page.list
              let TopicTypeTree = []
              res.forEach(val => {
                if (val.pid == 0) {
                  const acd = val
                  this.ArrayToTree(acd, res)
                  TopicTypeTree.push(acd)
                }
              })
              this.sblxSelectOptions = TopicTypeTree
            }
          })
        }
      })
      mqttprojectInfoList({ limit: '1' }).then(response => {
        if (response.code === 0) {
          const data1 = { limit: response.page.totalCount.toString() }
          mqttprojectInfoList(data1).then(response => {
            if (response.code === 0) {
              const res = response.page.list
              this.projectSelectOptions = res.map(item => ({ value: item.id, label: item.name }))
            }
          })
        }
      })
      mqttprojectCollectorList({ limit: '1' }).then(response => {
        mqttprojectCollectorList({
          limit: response.page.totalCount.toString()
        }).then(response => {
          const res = response.page.list
          this.collectSelectOptions = res.map(item => ({ value: item.snId, label: item.name }))
        })
      })
      const dataFcg = {
        limit: '1',
        type: 5,
        projectId: this.projectBase.projectId
      }
      getFarmcfginfoList(dataFcg).then(response => {
        dataFcg.limit = response.page.totalCount.toString()
        getFarmcfginfoList(dataFcg).then(response => {
          const res = response.page.list
          this.stationSelectOptions = res.map(item => ({ value: item.id, label: item.name }))
        })
      })
      const dataFcg1 = {
        limit: '1',
        ...this.baseDataFilters
      }
      getFarmcfginfoList(dataFcg1).then(response => {
        dataFcg1.limit = response.page.totalCount.toString()
        getFarmcfginfoList(dataFcg1).then(response => {
          const res = response.page.list
          this.nbqSelectOptions = res.map(item => ({ value: item.id, label: item.name }))
          this.getSelectOptions(res, 'citySelectOptions', 'cityId', 'cityName')
          this.getSelectOptions(res, 'countyTableFilter', 'countyId', 'countyName')
        })
      })
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
    handleFilter() {
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    handleUpdate(row) {
      this.temp.update = { ...row }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    changeTree() {
      this.getList()
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该电站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = [row.id]
        getFarmcfginfoDelete(data).then(response => {
          if (response.code === 0) {
            this.InitOptiList = true
            this.currentPage = Math.min(this.currentPage, ((this.total - 1) / this.pageSize) | 0)
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
          data.areaId = 0
          data.provinceId = this.provinceId
          data.cityId = data.countryCascaderValue[0]
          data.countyId = data.countryCascaderValue[1]
          data = { ...data, ...this.baseDataFilters }
          delete data.countryCascaderValue
          getFarmcfginfoSave(data).then(response => {
            if (response.code === 0) {
              this.dialogFormVisible = false
              this.InitOptiList = true
              this.temp.create = {
                componentInfoEntity:{}
              }
              this.total = this.total + 1
              this.totalPage = Math.ceil(this.total / this.pageSize)
              this.currentPage = Math.ceil(this.total / this.pageSize)
              this.getList()
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
        }
      })
    },
    editData({ ...data }) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          data.cityId = data.countryCascaderValue[0]
          data.countyId = data.countryCascaderValue[1]
          delete data.countryCascaderValue
          getFarmcfginfoUpdate(data).then(response => {
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
            } else {
              this.$notify({
                title: 'Failed',
                message: response.msg,
                type: 'danger',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleSizeChange() {
      this.getList()
    },
    handleCurrentChange() {
      this.getList()
    }
  }
}
</script>
