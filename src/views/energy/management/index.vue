<template>
  <div class="app-container">
    <div class="filter-container">

      <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
        <!-- <div style="float:left">
          <el-form-item>
            <el-select
              v-model="provinceSelectValue"
              filterable
              clearable
              placeholder="电站类型"
            >
              <el-option
                v-for="item in powerstateSelectOptions"
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
              v-model="citySelectValue"
              filterable
              clearable
              placeholder="县"
            >
              <el-option
                v-for="item in countyTableFilter"
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
      <el-table-column prop="snid" label="电站ID" min-width="100" show-overflow-tooltip />
      <el-table-column label="装机容量" min-width="80" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.rated }}kWh</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="电站类型"
        min-width="80"
        :filters="[{text:'集中式',value:'1'},{value:'2',text:'分布式'}]"
        :column-key="'accessType'"
        :filter-multiple="false"
        filter-placement="bottom-end"
      >
        <template slot-scope="{row}">
          <span>{{ {'1':'集中式','2':'分布式'}[row.accessType] }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="provinceName" label="省份" min-width="80" show-overflow-tooltip/>
      <el-table-column prop="cityName" label="城市" min-width="80" show-overflow-tooltip /> -->
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
      <el-table-column label="并网电压等级" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.voltage }}kV</span>
        </template>
      </el-table-column>
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

    <el-dialog v-if="dialogStatus==='create'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataFormc" status-icon :rules="rules" :model="temp" size="mini" label-position="left" label-width="160px">
        <el-form-item label="电站名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="电站编号" prop="snid">
          <el-input v-model="temp.snid" />
        </el-form-item>
        <el-form-item label="装机容量(kWh)" prop="rated">
          <el-input v-model="temp.rated" />
        </el-form-item>
        <!-- <el-form-item prop="accessType" label="电站类型">
          <el-select v-model="temp.accessType" filterable placeholder="电站类型">
            <el-option
              v-for="item in powerstateSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item prop="countryCascaderValue" label="城市">
          <el-cascader
            v-model="temp.countryCascaderValue"
            :options="countryCascaderOptions"
          />
        </el-form-item>
        <el-form-item label="业主" prop="uname">
          <el-input v-model="temp.uname" />
        </el-form-item>
        <el-form-item label="联系人" prop="contectname">
          <el-input v-model="temp.contectname" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contecttel">
          <el-input v-model="temp.contecttel" />
        </el-form-item>
        <el-form-item label="联系地址" prop="contectaddr">
          <el-input v-model="temp.contectaddr" />
        </el-form-item>
        <el-form-item label="并网电压等级(kV)" prop="voltage">
          <el-input v-model="temp.voltage" />
        </el-form-item>
        <el-form-item label="并网名称" prop="bname">
          <el-input v-model="temp.bname" />
        </el-form-item>
        <el-form-item label="经度" prop="x">
          <el-input v-model="temp.x" />
        </el-form-item>
        <el-form-item label="纬度" prop="y">
          <el-input v-model="temp.y" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createData(temp)">
          确认
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="dialogStatus==='update'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataFormu" status-icon :rules="rules" :model="tempEdit" size="mini" label-position="left" label-width="160px">
        <el-form-item label="电站名称" prop="name">
          <el-input v-model="tempEdit.name" />
        </el-form-item>
        <el-form-item label="电站编号" prop="snid">
          <el-input v-model="tempEdit.snid" />
        </el-form-item>
        <el-form-item label="装机容量(kWh)" prop="rated">
          <el-input v-model="tempEdit.rated" />
        </el-form-item>
        <el-form-item prop="countryCascaderValue" label="城市">
          <el-cascader
            v-model="tempEdit.countryCascaderValue"
            :options="countryCascaderOptions"
          />
        </el-form-item>
        <el-form-item label="业主" prop="uname">
          <el-input v-model="tempEdit.uname" />
        </el-form-item>
        <el-form-item label="联系人" prop="contectname">
          <el-input v-model="tempEdit.contectname" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contecttel">
          <el-input v-model="tempEdit.contecttel" />
        </el-form-item>
        <el-form-item label="联系地址" prop="contectaddr">
          <el-input v-model="tempEdit.contectaddr" />
        </el-form-item>
        <el-form-item label="并网电压等级(kV)" prop="voltage">
          <el-input v-model="tempEdit.voltage" />
        </el-form-item>
        <el-form-item label="并网名称" prop="bname">
          <el-input v-model="tempEdit.bname" />
        </el-form-item>
        <el-form-item label="经度" prop="x">
          <el-input v-model="tempEdit.x" />
        </el-form-item>
        <el-form-item label="纬度" prop="y">
          <el-input v-model="tempEdit.y" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editData(tempEdit)">
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
import { pvList, pvSave, pvUpdate, pvDelete } from '@/api/pv/powerStation'
import { CountryList } from '@/api/CountryManagement'
import { validateLon, validateLat, validatePhoneTwo } from '@/utils/validate'

export default {
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
        bname: [{ required: true, message: 'Grid Voltage Name is required', trigger: 'blur' }],
        x: [{ required: true, validator: validateLon, trigger: 'blur' }],
        y: [{ required: true, validator: validateLat, trigger: 'blur' }]
      },
      temp: {},
      tempEdit: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      InitOptiList: true,

      citySelectValue: '',
      citySelectOptions: [],
      provinceSelectValue: '',
      provinceSelectOptions: [],
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
  created() {
    this.getList()
    this.getCountryCascader()
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
        accessType: 2
      }
      if (this.provinceSelectValue !== '') {
        data.accessType = this.provinceSelectValue
      }
      if (this.citySelectValue !== '') {
        data.countyId = this.citySelectValue
      }
      pvList(data).then(response => {
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
          if (this.InitOptiList) {
            const data1 = { ...data, limit: this.total.toString() }
            pvList(data1).then(response => {
              if (response.code === 0) {
                // this.getSelectOptions(this.list, 'provinceSelectOptions', 'provinceId', 'provinceName')
                // this.getSelectOptions(this.list, 'citySelectOptions', 'cityId', 'cityName')
                this.getSelectOptions(response.page.list, 'countyTableFilter', 'countyId', 'countyName')
                this.InitOptiList = false
              }
            })
          } else {
            this.listLoading = false
          }
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
              if (res[j].value === '广东') {
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
        this.$refs['dataFormc'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.tempEdit = { ...row }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataFormu'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该电站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = [row.id]
        pvDelete(data).then(response => {
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
      this.$refs['dataFormc'].validate((valid) => {
        if (valid) {
          data.areaId = 0
          data.provinceId = this.provinceId
          data.cityId = data.countryCascaderValue[0]
          data.countyId = data.countryCascaderValue[1]
          data.accessType = 2
          delete data.countryCascaderValue
          pvSave(data).then(response => {
            if (response.code === 0) {
              this.dialogFormVisible = false
              this.InitOptiList = true
              this.temp = {}
              this.currentPage = ((this.total + 1) / this.pageSize) | 0
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
      this.$refs['dataFormu'].validate((valid) => {
        if (valid) {
          data.cityId = data.countryCascaderValue[0]
          data.countyId = data.countryCascaderValue[1]
          delete data.countryCascaderValue
          pvUpdate(data).then(response => {
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
