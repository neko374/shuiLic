<template>
  <div style="width:100%;height:100%;">
    <div class="filter-container">

      <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
        <div style="float:left">
          <el-form-item>
            <el-select
              v-model="nbqSelectValue"
              filterable
              clearable
              placeholder="电芯名称"
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
      <el-table-column prop="name" label="电芯名称" min-width="100" show-overflow-tooltip />
      <el-table-column prop="componentInfoEntity.snId" label="电芯ID" min-width="100" show-overflow-tooltip />
      <el-table-column prop="pid" label="所属设备" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.pid | selectOptionFilter(stationSelectOptions) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="snid" label="采集器ID" min-width="100" show-overflow-tooltip />
      <el-table-column label="装机容量" min-width="80" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.rated | ratedFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
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
      />
      <el-table-column prop="uname" label="业主" min-width="80" show-overflow-tooltip />
      <el-table-column prop="contectname" label="联系人" min-width="80" show-overflow-tooltip />
      <el-table-column prop="contecttel" label="联系电话" min-width="100" show-overflow-tooltip />
      <el-table-column prop="contectaddr" label="联系地址" min-width="130" show-overflow-tooltip />
      <!-- <el-table-column label="并网电压等级" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.voltage | voltageFilter}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="componentInfoEntity.manufactorName" label="厂商名称" min-width="130" show-overflow-tooltip />
      <el-table-column prop="componentInfoEntity.manufactorContact" label="厂商联系方式" min-width="130" show-overflow-tooltip />
      <el-table-column prop="componentInfoEntity.model" label="型号" min-width="130" show-overflow-tooltip />
      <el-table-column prop="componentInfoEntity.installTime" label="安装时间" min-width="130" show-overflow-tooltip />
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

    <el-dialog v-if="dialogStatus==='create'||dialogStatus==='update'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="160px">
        <el-form-item label="电芯名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
        </el-form-item>
        <el-form-item label="电芯ID" prop="snId">
          <el-input v-model="temp[dialogStatus].componentInfoEntity.snId" />
        </el-form-item>
        <el-form-item label="所属设备" prop="pid">
          <el-select v-model="temp[dialogStatus].pid" placeholder="所属设备">
            <el-option
              v-for="item in stationSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="采集器" prop="snid">
          <!-- <el-input v-model="temp[dialogStatus].snid" /> -->
          <el-select v-model="temp[dialogStatus].snid" placeholder="采集器">
            <el-option
              v-for="item in collectSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="装机容量(kW)" prop="rated">
          <el-input v-model="temp[dialogStatus].rated" />
        </el-form-item>
        <!-- <el-form-item label="所属项目" prop="projectId">
          <el-select v-model="temp[dialogStatus].projectId" placeholder="所属项目">
            <el-option
              v-for="item in projectSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item prop="countryCascaderValue" label="城市">
          <el-cascader
            v-model="temp[dialogStatus].countryCascaderValue"
            :options="countryCascaderOptions"
          />
        </el-form-item>
        <el-form-item label="业主" prop="uname">
          <el-input v-model="temp[dialogStatus].uname" />
        </el-form-item>
        <el-form-item label="联系人" prop="contectname">
          <el-input v-model="temp[dialogStatus].contectname" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contecttel">
          <el-input v-model="temp[dialogStatus].contecttel" />
        </el-form-item>
        <el-form-item label="联系地址" prop="contectaddr">
          <el-input v-model="temp[dialogStatus].contectaddr" />
        </el-form-item>
        <!-- <el-form-item label="并网电压等级(kV)" prop="voltage">
          <el-input v-model="temp[dialogStatus].voltage" />
        </el-form-item>
        <el-form-item label="并网名称" prop="bname">
          <el-input v-model="temp[dialogStatus].bname" />
        </el-form-item> -->
        <el-form-item label="经度" prop="x">
          <el-input v-model="temp[dialogStatus].x" />
        </el-form-item>
        <el-form-item label="纬度" prop="y">
          <el-input v-model="temp[dialogStatus].y" />
        </el-form-item>
        <el-form-item label="厂商名称" prop="ds">
          <el-input v-model="temp[dialogStatus].componentInfoEntity.manufactorName" />
        </el-form-item>
        <el-form-item label="厂商联系方式" prop="ds">
          <el-input v-model="temp[dialogStatus].componentInfoEntity.manufactorContact" />
        </el-form-item>
        <el-form-item label="型号" prop="ds">
          <el-input v-model="temp[dialogStatus].componentInfoEntity.model" />
        </el-form-item>
        <!-- <el-form-item label="单片功率" prop="ds">
          <el-input v-model="temp[dialogStatus].componentInfoEntity.pv" />
        </el-form-item> -->
        <el-form-item label="安装时间" prop="ds">
          <el-date-picker
            ref="datepicker"
            v-model="temp[dialogStatus].componentInfoEntity.installTime"
            class="sjzsksj"
            style="width:200px;"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false"
            :picker-options="pickerOptions"
            placeholder="开始时间"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus=='create'?createData(temp[dialogStatus]):editData(temp[dialogStatus])">
          确认
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getFarmcfginfoList, getFarmcfginfoSave, getFarmcfginfoUpdate, getFarmcfginfoDelete } from '@/api/mqtt/dianzhan'
import { CountryList } from '@/api/CountryManagement'
import { mqttprojectInfoList } from '@/api/mqtt/projectInfo'
import { mqttprojectCollectorList } from '@/api/mqtt/projectCollector'
import { validateLon, validateLat, validatePhoneTwo } from '@/utils/validate'
import { selectOptionFilter } from '@/filters'

export default {
  filters: {
    ratedFilter(val) {
      let resd = val
      if (val) {
        resd = val + 'kW'
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
  props: ['deviceId'],
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
        type: 12,
        state: 1,
        projectId: this.deviceId
      },

      citySelectValue: '',
      citySelectOptions: [],
      nbqSelectValue: '',
      nbqSelectOptions: [],
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
      provinceId: ''
    }
  },
  watch: {
    deviceId(val) {
      this.baseDataFilters.projectId = this.deviceId
      this.getList()
    }
  },
  created() {
    this.getList()
    this.getCountryCascader()
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
      getFarmcfginfoList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = response.page.list.reduce((pre, cur) => {
            pre.push({ ...cur, countryCascaderValue: [cur.cityId, cur.countyId] })
            return pre
          }, [])
          this.listLoading = false
        } else {
          this.listLoading = false
        }
      }).catch(() => { this.listLoading = false })
    },
    // 城市级联列表
    getCountryCascader() {
      CountryList({}).then(response => {
        if (response.code === 0) {
          CountryList({ limit: response.page.totalCount.toString() }).then(response => {
            const res = response.page.list
            let countryPid
            for (const j in res) {
              if (res[j].value === '河北') {
                countryPid = res[j].id
                this.provinceId = countryPid
                break
              }
            }
            function xunh(_pid, _res) {
              return _res.reduce((pre, cur, index, arr) => {
                if (cur.pid == _pid) {
                  pre.push({ value: cur.id, label: cur.value })
                  if (cur.level != 3) {
                    const child = xunh(cur.id, arr)
                    if (child.length !== 0) { pre[pre.length - 1].children = child }
                  }
                }
                return pre
              }, [])
            }
            this.countryCascaderOptions = xunh(countryPid, res)
          })
        }
      })
    },
    getOtherSelectOptions() {
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
        type: 8,
        projectId: this.deviceId
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
      if(!this.temp.create.componentInfoEntity)
        this.temp.create.componentInfoEntity = {
          "manufactorName": "",
          "manufactorContact": "",
          "model": "",
          "pv": "",
          "snId": '',
          "installTime": "",
        }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp.update = { ...row,componentInfoEntity:{...row.componentInfoEntity} }
      if(!this.temp.update.componentInfoEntity)
        this.temp.update.componentInfoEntity = {
          "manufactorName": "",
          "manufactorContact": "",
          "model": "",
          "pv": "",
          "snId": null,
          "installTime": "",
        }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
