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
              placeholder="设备名称"
            >
              <el-option
                v-for="item in countrySelectOptions"
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
              v-model="provinceSelectValue"
              filterable
              clearable
              placeholder="所属设备名称"
            >
              <el-option
                v-for="item in pidSelectOptions"
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
      <el-table-column label="设备名称" min-width="100" prop="name" show-overflow-tooltip />
      <el-table-column label="SNID" min-width="120" prop="snid" show-overflow-tooltip />
      <el-table-column label="装机容量" min-width="120" prop="rated" show-overflow-tooltip />
      <el-table-column label="所属设备名称" min-width="120" prop="pid" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.pid | selectOptionFilter(pidSelectOptions) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属项目" min-width="120" prop="projectName" show-overflow-tooltip />

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
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
        </el-form-item>
        <el-form-item label="SNID" prop="snid">
          <el-input v-model="temp[dialogStatus].snid" />
        </el-form-item>
        <el-form-item label="装机容量" prop="rated">
          <el-input v-model="temp[dialogStatus].rated" />
        </el-form-item>
        <el-form-item label="所属设备" prop="pid">
          <el-select
            v-model="temp[dialogStatus].pid"
            filterable
            placeholder="所属设备"
          >
            <el-option
              v-for="item in pidSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目" prop="projectId">
          <el-select
            v-model="temp[dialogStatus].projectId"
            filterable
            placeholder="所属项目"
          >
            <el-option
              v-for="item in projectSelectOptionsDia"
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

  </div>
</template>

<script>
import { validateuemail } from '@/utils/validate'
import { getFarmcfginfoList, getFarmcfginfoSave, getFarmcfginfoUpdate, getFarmcfginfoDelete } from '@/api/mqtt/dianzhan.js'
import { mqttprojectInfoList } from '@/api/mqtt/projectInfo'
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
      objDialogFormVisible: false,
      objDialogxmId: '',
      objDialogText: '',
      projectSelectValue: 4,
      projectSelectOptionsDia: [],
      projectBaseURL: $_hbvppIp
    }
  },
  async created() {
    const projectId = (await this.$store.dispatch('project/defaultProjectSGet')).id
    if (projectId) this.projectSelectValue = projectId
    if (this.$route.query.projectId !== undefined) {
      this.projectSelectValue = Number(this.$route.query.projectId)
    }
    this.getList()
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
        data.id = this.countrySelectValue
      }
      if (this.provinceSelectValue !== '') {
        data.pid = this.provinceSelectValue
      }
      getFarmcfginfoList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = response.page.list
        }
      })
      if (this.InitOptiList) {
        getFarmcfginfoList({}).then(response => {
          if (response.code === 0) {
            const data1 = { limit: response.page.totalCount.toString() }
            getFarmcfginfoList(data1).then(response => {
              if (response.code === 0) {
                this.getSelectOptions(response.page.list, 'countrySelectOptions', 'id', 'name')
                this.pidSelectOptions = [{ value: 0, label: '无' }].concat(this.countrySelectOptions)
                this.InitOptiList = false
              }
            })
          }
        })
      }
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
      mqttprojectInfoList({ id: this.projectSelectValue }).then(response => {
        mqttprojectInfoList({ limit: response.page.totalCount.toString(), id: this.projectSelectValue }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.projectSelectOptionsDia = []
            for (const i in res) {
              this.projectSelectOptionsDia.push({ value: res[i].id, label: res[i].name })
            }
          }
        })
      })
    },
    viewObject(row) {
      this.objDialogFormVisible = true
      this.objDialogxmId = row.id
      this.objDialogText = row.name
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
        getFarmcfginfoDelete(data).then(response => {
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
          // data.type = 0
          // data.createTime = new Date().format('yyyy-MM-dd HH:mm:ss');
          getFarmcfginfoSave(data).then(response => {
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
    updateData({ ...data }) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
    handleFilter() {
      this.currentPage = 1
      this.getList()
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
