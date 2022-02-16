<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" width="50%" height="90%" class="ycdialog" append-to-body>
      <div slot="title">
        <span class="title">告警信息</span>
        <span class="name">({{ value.pidType }})</span>
      </div>
      <el-form ref="ycForm" class="powerDiaTable" status-icon size="mini" inline-message>
        <el-table
          :data="list"
          border
          fit
          size="mini"
        >
          <el-table-column label="BIT" min-width="80" prop="bit" />
          <el-table-column label="描述" min-width="100" prop="comment" />
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
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import XLSX from 'xlsx'
import waves from '@/directive/waves' // waves directive
import { mqttgybitAlarmList } from '@/api/mqtt/gybitAlarm'

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
      rules: {}
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
        gyNameId: this.value.gyNameId,
        pidType: this.value.pidType
      }
      mqttgybitAlarmList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = response.page.list
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
</style>
