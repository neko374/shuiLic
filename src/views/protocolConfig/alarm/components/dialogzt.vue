<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" width="70%" height="90%" class="ycdialog">
      <div slot="title">
        <span class="title">状态信息</span>
        <span class="name">({{ value.pidType }})</span>
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
          <el-table-column label="规约ID" min-width="40" prop="gyNameId" />
          <el-table-column label="对象类型" min-width="40" prop="gyObjId" />
          <el-table-column label="描述" min-width="100" prop="comment" />
          <el-table-column label="BIT" min-width="80" prop="bit" />
          <el-table-column label="进制" min-width="80" prop="bitType" >
            <template slot-scope="{row}">
              <span>{{ row.bitType | selectOptionFilter(jzSelectOptionsDia)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="36">
            <template slot-scope="{row}">
              <el-button type="primary" @click="ZTClick(row)">状态</el-button>
            </template>
          </el-table-column>
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
        <el-form-item label="进制" prop="bitType">
          <el-select
              v-model="temp[dialogStatus].bitType"
              filterable
              placeholder="进制"
            >
              <el-option
                v-for="item in jzSelectOptionsDia"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
        </el-form-item>
        <el-form-item label="BIT" prop="bit">
          <!-- <el-input v-model="temp[dialogStatus].bit" /> -->
          <el-checkbox-group
            v-if="temp[dialogStatus].bitType==0"
            v-model="temp[dialogStatus].checkedBits"
          >
            <el-checkbox v-for="city in BITs" :key="city" style="width:60px" :label="city">BIT{{ city }}</el-checkbox>
          </el-checkbox-group>
          <el-input  v-else v-model="temp[dialogStatus].bit" />
        </el-form-item>
        <el-form-item label="描述" prop="comment">
          <el-input v-model="temp[dialogStatus].comment" />
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

    <dialogztZt v-model="dialogztvalue" :abc.sync="innerdialogFormVisibleBit" />

  </div>
</template>

<script>
import XLSX from 'xlsx'
import waves from '@/directive/waves' // waves directive
import { mqttgybitAlarmList, mqttgybitAlarmSave, mqttgybitAlarmUpdate, mqttgybitAlarmDelete, mqttgybitAlarmBatchSave, mqttgybitAlarmBatchUpdate } from '@/api/mqtt/gybitAlarm'
import dialogztZt from './dialogztZt'

export default {
  components: {
    dialogztZt
  },
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
        create: {
          bitType:0
        },
        update: {}
      },
      rules: {},
      BITs: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
      dialogztvalue: {},
      innerdialogFormVisibleBit: false,
      jzSelectOptionsDia: [
        { value: 0, label: '二进制' },
        { value: 1, label: '十进制' }
      ]
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
    this.BITs = []
    for(let j=0;j<32;j++) {
      this.BITs.push(j+'')
    }
    this.getList()
  },
  methods: {
    ZTClick(row) {
      this.dialogztvalue = row
      this.innerdialogFormVisibleBit = true
    },
    getList() {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString(),
        gyNameId: this.value.gyNameId,
        gyObjId: this.value.gyObjId,
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
      }).catch(() => {
        this.list = []
      })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.$set(this.temp.create, 'checkedBits', [])
      this.indialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp.update = { ...row }
      this.$set(this.temp.update, 'checkedBits', row.bit.toString().split(','))
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
        mqttgybitAlarmDelete(data).then(response => {
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
          data.gyNameId = this.value.gyNameId
          data.gyObjId = this.value.gyObjId
          data.pidType = this.value.pidType
          if(data.bitType==0)
            data.bit = data.checkedBits.join(',')
          delete data.checkedBits
          mqttgybitAlarmSave(data).then(response => {
            if (response.code === 0) {
              this.indialogFormVisible = false
              this.InitOptiList = true
              this.temp.create = {
                bitType:0,
                checkedBits: []
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
    updateData({ ...data }) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(data.bitType==0)
            data.bit = data.checkedBits.join(',')
          delete data.checkedBits
          mqttgybitAlarmUpdate(data).then(response => {
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
    },
    // 文件选择回调
    onChange(file, fileList) {
      this.fileData = file // 保存当前选择文件
      this.importFileDemo(file) // 调用读取数据的方法
    },
    // 导入excle
    importFileDemo(obj) {
      // 2.如果没有选中文件则取消
      if (!obj) {
        return
      }
      // 3.获得选择的文件对象
      var f = obj.raw
      // 4.初始化新的文件读取对象，浏览器自带，不用导入
      var reader = new FileReader()
      // 5.绑定FileReader对象读取文件对象时的触发方法
      reader.onload = e => {
        // 7.获取文件二进制数据流
        var data = e.currentTarget.result
        // 8.利用XLSX解析二进制文件为xlsx对象
        var wb = XLSX.read(data, { type: 'binary' })
        // 9.利用XLSX把wb第一个sheet转换成JSON对象
        // wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        // wb.Sheets[Sheet名]获取第一个Sheet的数据
        var j_data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        // 10.在终端输出查看结果
        // console.log(j_data)
        mqttgybitAlarmList({ limit: '1', gyNameId: this.value.gyNameId, pidType: this.value.pidType }).then(response => {
          if (response.code !== 0) {
            this.$notify({
              title: 'Failed',
              message: response.msg,
              type: 'danger',
              duration: 2000
            })
            return
          }
          // if(response.page.totalCount != 0){
          mqttgybitAlarmList({ limit: response.page.totalCount.toString(), gyNameId: this.value.gyNameId, pidType: this.value.pidType }).then(response => {
            if (response.code === 0) {
              const list = response.page.list
              const listc = []; const listu = []
              j_data.forEach((value, j) => {
                const isindex = false
                if (j < list.length) {
                  const val = list[j]
                  listu.push({
                    id: val.id,
                    bit: value.BIT,
                    comment: value.COMMENT,
                    gyNameId: this.value.gyNameId,
                    gyObjId: this.value.gyObjId,
                    pidType: this.value.pidType
                  })
                } else {
                  listc.push({
                    bit: value.BIT,
                    comment: value.COMMENT,
                    gyNameId: this.value.gyNameId,
                    gyObjId: this.value.gyObjId,
                    pidType: this.value.pidType
                  })
                }
              })
              // console.log('listu',listu)
              // console.log('listc',listc)
              // return;
              // console.log(111)
              if (listc.length !== 0) {
                mqttgybitAlarmBatchSave(listc).then(response => {
                  if (response.code === 0) {
                    this.currentPage = 1
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
              if (listu.length !== 0) {
                mqttgybitAlarmBatchUpdate(listu).then(response => {
                  if (response.code === 0) {
                    this.currentPage = 1
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
            } else {
              this.$notify({
                title: 'Failed',
                message: response.msg,
                type: 'danger',
                duration: 2000
              })
            }
          })
        })
      }
      // 6.使用reader对象以二进制读取文件对象f，
      reader.readAsBinaryString(f)
    },
    // 导出excle
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        mqttgybitAlarmList({ limit: '1', gyNameId: this.value.gyNameId, pidType: this.value.pidType }).then(response => {
          if (response.code !== 0) {
            this.$notify({
              title: 'Failed',
              message: response.msg,
              type: 'danger',
              duration: 2000
            })
            return
          }
          // if(response.page.totalCount != 0){
          mqttgybitAlarmList({ limit: response.page.totalCount.toString(), gyNameId: this.value.gyNameId, pidType: this.value.pidType }).then(response => {
            if (response.code === 0) {
              const list = response.page.list.map((item, index) => { item.index = index + Number(this.switchValue); return item })
              const tHeader = ['BIT', 'COMMENT']
              const filterVal = ['bit', 'comment']
              const data = this.formatJson(filterVal, list)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: `alarm-list`
              })
              this.downloadLoading = false
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
          this.$notify({
            title: 'Failed',
            message: '下载失败！',
            type: 'danger',
            duration: 2000
          })
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
