<template>
  <div class="app-container">
    <div class="filter-container">

      <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
        <div style="float:left">
          <el-form-item>
            <el-select
              v-model="countrySelectValue"
              filterable
              clearable
              placeholder="规约名称"
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
              placeholder="规约编辑人"
            >
              <el-option
                v-for="item in provinceSelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div style="float:left">
          <el-button class="TablePageButtonSearch" size="mini" icon="el-icon-search" @click="handleFilter">
            {{ $t('table.search') }}
          </el-button>
          <el-button class="TablePageButtonAdd" size="mini" icon="el-icon-edit" @click="handleCreate">
            {{ $t('table.add') }}
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
    >
      <el-table-column label="序号" width="50" type="index" :index="(currentPage-1)*pageSize+1" />
      <el-table-column label="规约名称" min-width="140" prop="gyName" show-overflow-tooltip />
      <el-table-column label="所属项目" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.refProjectId | selectOptionFilter(projectSelectOptionsDia) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规约ID" min-width="60" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gyNameId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="对象类型" min-width="70" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gyObjId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="增加时间" width="140" prop="time" show-overflow-tooltip />
      <el-table-column label="规约编辑人" width="90" prop="gyCreator" show-overflow-tooltip />
      <el-table-column label="联系电话" width="90" prop="phone" show-overflow-tooltip />
      <el-table-column label="四遥量规约" width="100">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonEdit" @click="handleYc(row)">规约查看</el-button>
          <!-- <el-button size="mini" class="TableButtonEdit" @click="handleYx(row)">遥信(YX)</el-button> -->
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

    <el-dialog v-if="dialogStatus==='create'||dialogStatus==='update'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="140px">
        <!-- <el-form-item label="规约ID" prop="gyNameId">
          <el-input v-model="temp[dialogStatus].gyNameId" />
        </el-form-item>
        <el-form-item label="规约名称" prop="gyName">
          <el-input v-model="temp[dialogStatus].gyName" />
        </el-form-item>
        <el-form-item label="对象类型" prop="gyObjId">
            <el-select
              v-model="temp[dialogStatus].gyObjId"
              filterable
              placeholder="对象类型"
            >
              <el-option
                v-for="item in nameSelectOptionsDia"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
        </el-form-item> -->
        <el-form-item label="规约名称" prop="gyNameObjId">
          <el-select
            v-model="temp[dialogStatus].gyNameObjId"
            filterable
            placeholder="规约名称"
          >
            <el-option
              v-for="(item,index) in protocolSelectOptionsDia"
              :key="'gy'+index"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.gyNameId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目" prop="refProjectId">
          <el-select
            v-model="temp[dialogStatus].refProjectId"
            filterable
            placeholder="所属项目"
          >
            <el-option
              v-for="(item,index) in projectSelectOptionsDia"
              :key="'gy'+index"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.gyNameId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规约编辑人" prop="gyCreator">
          <el-input v-model="temp[dialogStatus].gyCreator" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="temp[dialogStatus].phone" />
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

    <ycdialog v-if="dialogStatus==='yc'" v-model="ycdialogInfo" :abc.sync="dialogFormVisible" text="yc" />

    <div style="width:100%;height:50px" />
  </div>
</template>

<script>
import ycdialog from './compoenents/dialogyc'
import { mqttgyCreatorInfoList, mqttgyCreatorInfoSave, mqttgyCreatorInfoUpdate, mqttgyCreatorInfoDelete } from '@/api/mqtt/gyCreatorInfo'
import { mqttprojectInfoList } from '@/api/mqtt/projectInfo'
import { mqttgyycyxList, mqttgyycyxDelete } from '@/api/mqtt/gyycyx'
import { mqttgysnInfoList } from '@/api/mqtt/gysnInfo'
import { mqttgysnObjList } from '@/api/mqtt/gysnObj'

export default {
  components: { ycdialog },
  data() {
    return {
      list: null,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      total: 0,
      maxtotal: 0,
      currentPaged: 1,
      pageSized: 10,
      totalPaged: 0,
      totald: 0,
      maxtotald: 0,
      listLoading: false,
      dialogFormVisible: false,
      innerVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        view: '查看'
      },
      rules: {
        gyNameId: [{ required: true, message: '不能为空', trriger: 'blur' }],
        gyName: [{ required: true, message: '不能为空', trriger: 'blur' }],
        gyNameObjId: [{ required: true, message: '不能为空', trriger: 'blur' }],
        gyObjId: [{ required: true, message: '不能为空', trriger: 'blur' }],
        gyCreator: [{ required: true, message: '不能为空', trriger: 'blur' }],
        phone: [{ required: true, message: '不能为空', trriger: 'blur' }]
      },
      temp: {
        create: {},
        update: {},
        view: {}
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      InitOptiList: true,

      countrySelectValue: '',
      countrySelectOptions: '',
      provinceSelectValue: '',
      provinceSelectOptions: '',
      nameSelectOptionsDia: [],
      tableData: [
        {
          type: 'yx',
          v0: 'v0'
        }
      ],
      tableY: [
        { label: 'v0' }
      ],
      tableEdit: {},
      ycdialogInfo: {},
      yxdialogInfo: {},
      ytdialogInfo: {},
      ykdialogInfo: {},
      projectSelectOptionsDia: [],
      objectSelectOptionsDia: [],
      protocolSelectOptionsDia: [],
      projectSelectValue: ''
    }
  },
  async created() {
    if (this.$route.query.protocolId !== undefined) {
      this.countrySelectValue = this.$route.query.protocolId
    }
    const project = await this.$store.dispatch('project/defaultProjectSGet')
    if (project) this.projectSelectValue = project.id
	  this.getList()
	  // this.getItemList()
	  this.getObjectList()
  },
  methods: {
    getList() {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString()
      }
      if (this.countrySelectValue !== '') {
        data.gyNameId = this.countrySelectValue.slice(0, 4)
        data.gyObjId = this.countrySelectValue.slice(4, 7)
      }
      if (this.provinceSelectValue !== '') {
        data.gyCreator = this.provinceSelectValue
      }
      if (this.projectSelectValue !== '') {
        data.refProjectId = this.projectSelectValue
      }
      mqttgyCreatorInfoList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = response.page.list.map(item => { item.gyNameObjId = item.gyNameId + item.gyObjId; return item })
        }
      })
      if (this.InitOptiList) {
        mqttgyCreatorInfoList({}).then(response => {
          const data1 = { limit: response.page.totalCount.toString() }
          mqttgyCreatorInfoList(data1).then(response => {
            if (response.code === 0) {
              this.getSelectOptions(response.page.list.map(item => { item.gyNameObjId = item.gyNameId + item.gyObjId; return item }), 'countrySelectOptions', 'gyNameObjId', 'gyName')
              this.getSelectOptions(response.page.list, 'provinceSelectOptions', 'gyCreator', 'gyCreator')
              this.InitOptiList = false
            }
          })
        })
      }
    },
    getObjectList() {
      mqttgysnInfoList({}).then(response => {
        mqttgysnInfoList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.objectSelectOptionsDia = []
            for (const i in res) {
              this.objectSelectOptionsDia.push({ value: res[i].gyNameId, label: res[i].gyName })
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
    handleYc(row) {
      this.dialogStatus = 'yc'
      this.dialogFormVisible = true
      this.ycdialogInfo = row
    },
    handleYx(row) {
      this.dialogStatus = 'yx'
      this.dialogFormVisible = true
      this.yxdialogInfo = { ...row }
    },
    handleYt(row) {
      this.dialogStatus = 'yt'
      this.dialogFormVisible = true
      this.ytdialogInfo = { ...row }
    },
    handleYk(row) {
      this.dialogStatus = 'yk'
      this.dialogFormVisible = true
      this.ykdialogInfo = { ...row }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp.update = {...row}
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
      this.$confirm('此操作将永久删除该规约, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = [row.id]
        mqttgyCreatorInfoDelete(data).then(response => {
          if (response.code === 0) {
            // mqttgyycyxList({}).then(response=>{
            //   mqttgyycyxList({gyNameId:row.gyNameId,limit:response.page.totalCount.toString()}).then(response=>{
            //     const idarray = response.page.list.map(item=>{return item.id})
            //     mqttgyycyxDelete(idarray)
            //   })
            // })
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
      data.time = new Date().format('yyyy-MM-dd HH:mm:ss')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          for (const j in this.protocolSelectOptionsDia) {
            if (this.protocolSelectOptionsDia[j].value == data.gyNameObjId) {
              data.gyNameId = this.protocolSelectOptionsDia[j].gyNameId
              data.gyName = this.protocolSelectOptionsDia[j].label
              data.gyObjId = this.protocolSelectOptionsDia[j].gyObjId
              break
            }
          }
          mqttgyCreatorInfoSave(data).then(response => {
            if (response.code === 0) {
              this.dialogFormVisible = false
              this.InitOptiList = true
              this.temp.create = {}
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
    updateData({ ...data }) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          for (const j in this.protocolSelectOptionsDia) {
            if (this.protocolSelectOptionsDia[j].value == data.gyNameObjId) {
              data.gyNameId = this.protocolSelectOptionsDia[j].gyNameId
              data.gyName = this.protocolSelectOptionsDia[j].label
              data.gyObjId = this.protocolSelectOptionsDia[j].gyObjId
              break
            }
          }
          mqttgyCreatorInfoUpdate(data).then(response => {
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

<style>
  .powerDiaTable .el-form-item--mini.el-form-item {
    margin-bottom:0;
  }
</style>
