<template>
  <div class="app-container">
    <div class="filter-container">

      <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
        <div style="float:left">
          <el-form-item label="开始时间" style="margin-bottom: 2px;">
            <el-date-picker
              ref="datepicker"
              v-model="date[0]"
              class="sjzsksj"
              style="width:180px;"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:05:00"
              size="mini"
              :clearable="false"
              :picker-options="pickerOptionsstart"
              placeholder="开始时间"
            />
          </el-form-item>
          <el-form-item label="结束时间" style="margin-bottom: 2px">
            <el-date-picker
              ref="datepicker1"
              v-model="date[1]"
              class="sjzsksj"
              style="width:180px;"
              size="mini"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
              :clearable="false"
              :picker-options="pickerOptionsend"
              placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="userSelectValue"
              filterable
              clearable
              placeholder="用户"
            >
              <el-option
                v-for="item in userSelectOptions"
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
              v-model="operateSelectValue"
              filterable
              clearable
              placeholder="操作详情"
            >
              <el-option
                v-for="item in operateSelectOptions"
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
      <el-table-column prop="username" label="用户名" min-width="100" show-overflow-tooltip />
      <el-table-column prop="operation" label="操作详情" min-width="100" show-overflow-tooltip />
      <el-table-column prop="method" label="执行的界面菜单" min-width="100" show-overflow-tooltip />
      <el-table-column prop="params" label="执行的操作" min-width="100" show-overflow-tooltip />
      <el-table-column prop="createDate" label="执行时间" min-width="100" show-overflow-tooltip />
      <!-- <el-table-column label="操作" width="140">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonEdit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" class="TableButtonDelete" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column> -->
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp[dialogStatus].username" />
        </el-form-item>
        <el-form-item label="操作详情" prop="operation">
          <el-input v-model="temp[dialogStatus].operation" />
        </el-form-item>
        <el-form-item label="执行的界面菜单" prop="method">
          <el-input v-model="temp[dialogStatus].method" />
        </el-form-item>
        <el-form-item label="执行的操作" prop="params">
          <el-input v-model="temp[dialogStatus].params" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus=='create'?createData(temp[dialogStatus]):updateData(temp[dialogStatus])">
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
import { getLogList, getLogSave } from '@/api/hbvpp/log'

export default {
  watch: {
    'date.0'(val) {
      this.$refs.datepicker.handleClose()
    },
    'date.1'(val) {
      this.$refs.datepicker1.handleClose()
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
        rated: [{ required: true, message: 'Rated is required', trigger: 'blur' }],
        accessType: [{ required: true, message: 'AccessType is required', trigger: ['blur', 'change'] }]
      },
      temp: {
        create: {},
        update: {}
      },
      tempEdit: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      pickerOptionsstart: {
        disabledDate: time => {
          return time.getTime() >= new Date(this.date[1].replace(/-/g, '/')).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000 || (new Date(this.date[1]).getTime() - time.getTime() > 30 * 24 * 3600 * 1000)
        }
      },
      pickerOptionsend: {
        disabledDate: time => {
          return time.getTime() <= new Date(this.date[0].replace(/-/g, '/')).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000 || (time.getTime() - new Date(this.date[0]).getTime() > 30 * 24 * 3600 * 1000)
        }
      },
      date: [new Date().format('yyyy-MM-dd 00:05:00'), new Date(Date.now() + 24 * 3600 * 1000).format('yyyy-MM-dd 00:00:00')],
      InitOptiList: true,

      userSelectValue: '',
      userSelectOptions: [],
      operateSelectValue: '',
      operateSelectOptions: [],
      countyTableFilter: [],
      tableFilters: {},
      powerstateSelectOptions: [
        { value: 1, label: '集中式' },
        { value: 2, label: '分布式' }
      ]
    }
  },
  created() {
    this.getList()
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
        createDate: this.date.join(','),
        orderBy:"createDate",
        ...this.tableFilters
      }
      if (this.userSelectValue !== '') {
        data.username = this.userSelectValue
      }
      if (this.operateSelectValue !== '') {
        data.operation = this.operateSelectValue
      }
      getLogList(data).then(response => {
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
            getLogList(data1).then(response => {
              if (response.code === 0) {
                this.getSelectOptions(response.page.list, 'userSelectOptions', 'username', 'username')
                this.getSelectOptions(response.page.list, 'operateSelectOptions', 'operation', 'operation')
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
      this.tempEdit = { ...row }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该日志, 是否继续?', '提示', {
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
    updateData({ ...data }) {
      this.$refs['dataFormu'].validate((valid) => {
        if (valid) {
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
<style lang="scss">
.el-tooltip__popper {
  max-width: 400px;
}
</style>
