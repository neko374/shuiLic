<template>
  <div style="width:100%;height:100%;">
    <div class="filter-container" />

    <table-list :data="list" @getList="getList" />
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

  </div>
</template>

<script>
import tableList from './tableList'
import { getFarmcfginfoList, getFarmcfginfoSave, getFarmcfginfoUpdate, getFarmcfginfoDelete } from '@/api/mqtt/dianzhan'
import { CountryList } from '@/api/CountryManagement'
import { mqttprojectInfoList } from '@/api/mqtt/projectInfo'
import { mqttprojectCollectorList } from '@/api/mqtt/projectCollector'
import { validateLon, validateLat, validatePhoneTwo } from '@/utils/validate'

export default {
  components: {
    tableList
  },
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
        rated: [{ required: true, message: 'Rated is required', trigger: 'blur' }],
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
        type: 2,
        pid: 0,
        state: 1,
        projectId: this.deviceId
      },

      citySelectValue: '',
      citySelectOptions: [],
      stationSelectValue: '',
      provinceSelectOptions: [],
      projectSelectOptions: [],
      collectSelectOptions: [],
      countyTableFilter: [],
      tableFilters: {},
      stationSelectOptions: [],
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
      if (this.stationSelectValue !== '') {
        data.id = this.stationSelectValue
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
        ...this.baseDataFilters
      }
      getFarmcfginfoList(dataFcg).then(response => {
        dataFcg.limit = response.page.totalCount.toString()
        getFarmcfginfoList(dataFcg).then(response => {
          const res = response.page.list
          this.stationSelectOptions = res.map(item => ({ value: item.id, label: item.name }))
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
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp.update = { ...row }
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
              this.temp = {}
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
