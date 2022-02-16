<template>
  <div class="app-container">
    <div class="filter-container">

      <el-form :inline="true" @keyup.enter.native="handleFilter">
        <div style="float:left">
          <el-form-item>
            <el-select
              v-model="projectSelectValue"
              filterable
              clearable
              placeholder="项目名称"
            >
              <el-option
                v-for="item in projectSelectOptionsDia"
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
      <el-table-column label="规则名称" min-width="100" prop="name" show-overflow-tooltip />
      <!-- <el-table-column label="规则ID" min-width="100" prop="protocolType" show-overflow-tooltip /> -->
      <el-table-column label="项目名称" min-width="120" prop="projectNames" show-overflow-tooltip />
      <el-table-column label="设备名称" min-width="120" prop="farmNames" show-overflow-tooltip />
      <!-- <el-table-column label="所属项目名称" min-width="100" prop="projectName" show-overflow-tooltip /> -->
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
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
        </el-form-item>
        <!-- <el-form-item label="规则ID" prop="refFarmId">
          <el-select
            v-model="temp[dialogStatus].refFarmId"
            filterable
            placeholder="规则ID"
          >
            <el-option
              v-for="item in []"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="项目名称" prop="refProjectId">
          <el-select
            v-model="temp[dialogStatus].refProjectId"
            style="width:calc(100% - 70px);"
            filterable
            collapse-tags
            multiple
            placeholder="项目名称"
          >
            <el-option
              v-for="item in projectSelectOptionsDia"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button size="mini" class="TableButtonEdit" @click="handleViewProject(temp[dialogStatus])">
            编辑
          </el-button>
        </el-form-item>
        <el-form-item label="设备名称" prop="refFarmId">
          <el-select
            v-model="temp[dialogStatus].refFarmId"
            style="width:calc(100% - 70px);"
            filterable
            collapse-tags
            multiple
            placeholder="设备名称"
          >
            <el-option
              v-for="item in stationSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button size="mini" class="TableButtonEdit" @click="handleViewDevice(temp[dialogStatus])">
            编辑
          </el-button>
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

    <el-dialog :title="textMap[dialogStatusView]" :visible.sync="dialogFormVisibleView" custom-class="user-management-diaC" class="dialogtyx">
      <el-form ref="dataForm" status-icon :rules="rules" :model="tempView" size="mini" label-position="top" label-width="140px">
        <el-form-item prop="view">
          <el-checkbox v-model="tempView[dialogStatusView].checkAll" :indeterminate="tempView[dialogStatusView].isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="tempView[dialogStatusView].checkId" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in tempView[dialogStatusView].options" :key="city.value" style="width:12em;" :label="city.value">{{ city.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handUpdaview(tempView[dialogStatusView].checkId)">
          确认
        </el-button>
        <el-button @click="dialogFormVisibleView = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { validateuemail } from '@/utils/validate'
import { getFarmprotocolrulecfgList, getFarmprotocolrulecfgSave, getFarmprotocolrulecfgUpdate, getFarmprotocolrulecfgDelete } from '@/api/mqtt/protocolrulecfg'
import { mqttprojectInfoList } from '@/api/mqtt/projectInfo'
import { getStationTypeList } from '@/api/mqtt/stationType'
import { getFarmcfginfoList } from '@/api/mqtt/dianzhan.js'
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
        view: '查看',
        refProjectId: '项目列表',
        refFarmId: '设备列表'
      },
      rules: {

      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      temp: {
        create: {
          refProjectId: [],
          refFarmId: []
        },
        update: {},
        view: {}
      },
      InitOptiList: true,

      countrySelectValue: '',
      countrySelectOptions: '',
      provinceSelectValue: '',
      stationSelectOptions: [],
      gyTypeSelectOptions: [],
      xieyiSelectOptions: [],
      tablenameSelectOptions: [],
      tablenameSelectValue: '',
      xieyiSelectValue: '',
      projectSelectValue: 4,
      projectSelectOptionsDia: [],
      projectBaseURL: $_hbvppIp,
      dialogFormVisibleView: false,
      tempView: {
        refProjectId: {
          isIndeterminate: true,
          checkAll: false,
          checkId: []
        },
        refFarmId: {
          isIndeterminate: true,
          checkAll: false,
          checkId: []
        }
      },
      dialogStatusView: 'refProjectId'
    }
  },
  async created() {
    if (this.$route.query.projectId !== undefined) {
      this.projectSelectValue = Number(this.$route.query.projectId)
    }
    const projectId = (await this.$store.dispatch('project/defaultProjectSGet')).id
    if (projectId) this.projectSelectValue = projectId
    this.getList()
    this.getDiaSelect()
  },
  methods: {
    getList(page) {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString(),
        type: 0
      }
	  if (page)data.page = page.toString()
      if (this.countrySelectValue !== '') {
        data.refFarmId = this.countrySelectValue
      }
      if (this.provinceSelectValue !== '') {
        data.refFarmProtocolTypeId = this.provinceSelectValue
      }
	  if (this.xieyiSelectValue !== '') {
        data.protocolType = this.xieyiSelectValue
      }
	  if (this.tablenameSelectValue !== '') {
        data.tablename = this.tablenameSelectValue
      }
	  if (this.projectSelectValue !== '') {
        data.refProjectId = this.projectSelectValue
      }
      getFarmprotocolrulecfgList(data, this.projectBaseURL).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = response.page.list
        }
      })
      if (this.InitOptiList) {
        getFarmprotocolrulecfgList({}, this.projectBaseURL).then(response => {
          if (response.code === 0) {
            const data1 = { limit: response.page.totalCount.toString() }
            getFarmprotocolrulecfgList(data1, this.projectBaseURL).then(response => {
              if (response.code === 0) {
                this.getSelectOptions(response.page.list, 'countrySelectOptions', 'id', 'name')
                this.getSelectOptions(response.page.list, 'xieyiSelectOptions', 'protocolType', 'protocolType')
                this.getSelectOptions(response.page.list, 'tablenameSelectOptions', 'tablename', 'tablename')
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
      getFarmcfginfoList({ projectId: this.projectSelectValue }).then(response => {
        getFarmcfginfoList({ limit: response.page.totalCount.toString(), projectId: this.projectSelectValue }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.stationSelectOptions = []
            for (const i in res) {
              this.stationSelectOptions.push({ value: res[i].id, label: res[i].name })
            }
          }
        })
      })
      // getStationTypeList({}).then(response => {
      //   getStationTypeList({ limit: response.page.totalCount.toString() }).then(response => {
      //     if (response.code === 0) {
      //       const res = response.page.list
      //       this.gyTypeSelectOptions = []
      //       for (const i in res) {
      //         this.gyTypeSelectOptions.push({ value: res[i].id+'', label: res[i].name })
      //       }
      //     }
      //   })
      // })
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
      this.temp.update = {
        ...row,
        refProjectId: row.refProjectId.split(',').filter(_ => _).map(item => Number(item)),
        refFarmId: row.refFarmId.split(',').filter(_ => _).map(item => Number(item))
      }
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
        getFarmprotocolrulecfgDelete(data, this.projectBaseURL).then(response => {
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
          data.refProjectId = data.refProjectId.join(',')
          data.refFarmId = data.refFarmId.join(',')
          getFarmprotocolrulecfgSave(data, this.projectBaseURL).then(response => {
            if (response.code === 0) {
              this.dialogFormVisible = false
              this.InitOptiList = true
              this.temp.create = {
                refProjectId: [],
                refFarmId: []
              }
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
          data.refProjectId = data.refProjectId.join(',')
          data.refFarmId = data.refFarmId.join(',')
          getFarmprotocolrulecfgUpdate(data, this.projectBaseURL).then(response => {
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
    },
    handleViewProject(row) {
      this.dialogStatusView = 'refProjectId'
      this.tempView[this.dialogStatusView].checkId = row.refProjectId
      this.tempView[this.dialogStatusView].options = this.projectSelectOptionsDia
      this.dialogFormVisibleView = true
    },
    handleViewDevice(row) {
      this.dialogStatusView = 'refFarmId'
      this.tempView[this.dialogStatusView].checkId = row.refFarmId
      this.tempView[this.dialogStatusView].options = this.stationSelectOptions
      this.dialogFormVisibleView = true
    },
    handUpdaview(row) {
      this.temp[this.dialogStatus][this.dialogStatusView] = [...row]
      this.dialogFormVisibleView = false
    },
    handleCheckAllChange(val) {
      this.tempView[this.dialogStatusView].checkId = val ? this.tempView[this.dialogStatusView].options : []
      this.tempView[this.dialogStatusView].isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.tempView[this.dialogStatusView].checkAll = checkedCount === this.tempView[this.dialogStatusView].options.length
      this.tempView[this.dialogStatusView].isIndeterminate = checkedCount > 0 && checkedCount < this.tempView[this.dialogStatusView].options.length
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

<style lang="scss">
  .user-management-diaC{
    width:80%;
  }
</style>
