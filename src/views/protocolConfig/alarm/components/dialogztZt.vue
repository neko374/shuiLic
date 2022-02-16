<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" width="70%" height="90%" class="ycdialog">
      <div slot="title">
        <span class="title">状态变量值</span>
        <span class="name">(BIT{{ value.bit }})</span>
      </div>
      <!-- <el-button v-waves style="float:right;margin-left:10px;" :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-upload
        action="/"
        :on-change="onChange"
        :auto-upload="false"
        :show-file-list="false"
        accept=".xls, .xlsx"
        style="float:right;"
      >
        <el-button type="success" icon="el-icon-upload2">导入</el-button>
        <div v-if="fileData" slot="tip">{{ fileData.name }}</div>
      </el-upload> -->
      <el-form ref="ycForm" class="powerDiaTable" status-icon size="mini" inline-message>
        <el-table
          :data="list"
          border
          fit
          size="mini"
        >
          <el-table-column label="规约ID" min-width="80" prop="gyNameId">
            <template>
              <span>{{ value.gyNameId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="对象类型" min-width="80" prop="gyObjId">
            <template>
              <span>{{ value.gyObjId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属状态描述" min-width="80" prop="ztComment" />
          <el-table-column label="状态值" min-width="40" prop="value" />
          <el-table-column label="状态信息" min-width="100" prop="comment" />
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
              <!-- <el-button v-if="(scope.$index+(currentPage-1)*pageSize) == (total - 1)" class="TableButtonDelete" size="mini" @click="handleDelete(scope.row)">删除</el-button> -->
              <el-button class="TableButtonDelete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :total="total"
          background
          :page-sizes="[5,10]"
          layout="total, sizes, prev, pager, next, jumper"
          popper-class="PaginationPageSize"
          class="TablePagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="dialogStatus==='create'||dialogStatus==='update'" :title="textMap[dialogStatus]" :visible.sync="indialogFormVisible" custom-class="user-management-diaCrT">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="140px">
        <el-form-item label="状态值" prop="value">
          <el-input v-model="temp[dialogStatus].value" />
        </el-form-item>
        <el-form-item label="状态信息" prop="type">
          <!-- <el-input v-model="temp[dialogStatus].comment" /> -->
          <el-select v-model="temp[dialogStatus].type" filterable placeholder="请选择">
            <el-option
              v-for="item in alarmTypeOptions"
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
        <el-button @click="indialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import XLSX from 'xlsx'
import waves from '@/directive/waves' // waves directive
import { mqttgybitAlarmList, mqttgybitAlarmSave, mqttgybitAlarmUpdate, mqttgybitAlarmDelete, mqttgybitAlarmBatchSave, mqttgybitAlarmBatchUpdate } from '@/api/mqtt/gybitAlarm'
import { mqttgybitAlarmvalList, mqttgybitAlarmvalSave, mqttgybitAlarmvalUpdate, mqttgybitAlarmvalDelete } from '@/api/mqtt/gybitAlarmval'

export default {
  directives: { waves },
  props: {
    text: String,
    value: Object,
    abc: Boolean
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      total: 0,
      list: [],
      dialogFormVisible: this.abc,
      indialogFormVisible: false,
      downloadLoading: false,
      fileData: '',
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      temp: {
        create: {},
        update: {}
      },
      alarmTypeOptions:[
        {value:1,label:'告警'},
        {value:0,label:'正常'},
      ],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'blur' }],
      },
      BITs: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
    }
  },
  watch: {
    value: {
      handler(val) {
        this.getList()
      },
      deep: true
    },
    abc(val) {
      this.dialogFormVisible = val
      this.list = []
      this.currentPage = 1
	  this.getList()
    },
    dialogFormVisible(val) {
      this.$emit('update:abc', val)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString(),
        refZtId: this.value.id
        // gyNameId: this.value.gyNameId,
        // pidType: this.value.pidType
      }
      mqttgybitAlarmvalList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = response.page.list
        }
      }).catch(() => {
        this.list = []
      })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.indialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp.update = { ...row }
      this.dialogStatus = 'update'
      this.indialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = [row.id]
        mqttgybitAlarmvalDelete(data).then(response => {
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
          data.refZtId = this.value.id
          data.comment = this.alarmTypeOptions.filter(v=>v.value==data.type)[0].label
          mqttgybitAlarmvalSave(data).then(response => {
            if (response.code === 0) {
              this.indialogFormVisible = false
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
          data.comment = this.alarmTypeOptions.filter(v=>v.value==data.type)[0].label
          mqttgybitAlarmvalUpdate(data).then(response => {
            if (response.code === 0) {
              this.indialogFormVisible = false
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
    handler() {
      this.getList()
    },
    handleSizeChange() {
      this.handler()
    },
    handleCurrentChange() {
      this.handler()
    }
  }
}
</script>
<style>
  .powerDiaTable .el-form-item--mini.el-form-item {
    margin-bottom:0;
  }
  .ycdialog .el-dialog__header{
    text-align:center;
  }
  .ycdialog .el-dialog__title,.title{
    font-size:30px;
    color:#4cb1d6;
  }
  .name{
    font-size:30px;
    color:black;
  }
  @media screen and (min-width: 701px){
    .user-management-diaCrT {
      width: 630px;
    }
    .user-management-diaCrT .el-dialog__body {
      padding: 3% 10%;
  }
  }
</style>
