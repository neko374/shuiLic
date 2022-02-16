<template>
  <div class="app-container">
    <div class="filter-container">

      <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
        <!-- <div style="float:left">
          <el-form-item>
            <el-select
              v-model="projectSelectValue"
              filterable
              clearable
              placeholder="项目名称"
            >
              <el-option
                v-for="item in projectSelectOptions"
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
              v-model="provinceSelectValue"
              filterable
              clearable
              placeholder="所属规约名称"
              @change="objNameSelectChange"
            >
              <el-option
                v-for="item in objSelectOptionsDia"
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
              v-model="countrySelectValue"
              filterable
              clearable
              placeholder="协议名称"
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
          <el-button class="TablePageButtonSearch" size="mini" icon="el-icon-search" @click="handleFilter">
            {{ $t('table.search') }}
          </el-button>
          <el-button class="TablePageButtonAdd" size="mini" icon="el-icon-edit" @click="handleCreate">
            {{ $t('table.add') }}
          </el-button>
          <!-- <el-button v-if="provinceSelectValue" size="mini" style="float:right;margin-left:10px;" :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
            导出
          </el-button>
          <el-upload
            v-if="provinceSelectValue"
            action="/"
            :on-change="onChange"
            :auto-upload="false"
            :show-file-list="false"
            accept=".xls, .xlsx"
            style="float:right;"
          >
            <el-button size="mini" type="success" icon="el-icon-upload2">导入</el-button>
            <div v-if="fileData" slot="tip">{{ fileData.name }}</div>
          </el-upload> -->
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
      <el-table-column :label="$t('table.id')" width="50" type="index" :index="(currentPage-1)*pageSize+1" />
      <el-table-column label="所属规约" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gyNameObjId | selectOptionFilter(objSelectOptionsDia) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规约ID" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gyNameId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="对象类型" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gyObjId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="协议名称" min-width="100" prop="pidType" show-overflow-tooltip />
      <el-table-column label="BIT" width="80">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonEdit" @click="BITClick(row)">
            BIT
          </el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="BIT" min-width="110" prop="bit" show-overflow-tooltip />
      <el-table-column label="描述" min-width="150" prop="info" show-overflow-tooltip /> -->

      <el-table-column label="操作" width="130">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonEdit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- <el-button size="mini" class="TableButtonView" @click="handleView(row)">
            查看
          </el-button> -->
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
      :page-sizes="[1,5, 10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      popper-class="PaginationPageSize"
      class="TablePagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog v-if="dialogStatus==='create'||dialogStatus==='update'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="140px">
        <el-form-item label="所属规约" prop="gyNameObjId">
          <el-select
            v-model="temp[dialogStatus].gyNameObjId"
            filterable
            placeholder="所属规约"
            @change="objSelectChange(temp[dialogStatus].gyNameObjId)"
          >
            <el-option
              v-for="item in objSelectOptionsDia"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="协议名称" prop="pidType">
          <el-select
            v-model="temp[dialogStatus].pidType"
            filterable
            placeholder="协议名称"
          >
            <el-option
              v-for="(item,index) in registerSelectOptionsDia"
              :key="'pidType'+index"
              :value="item.value"
              :label="item.value"
            >
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="BIT" prop="bit">
          <el-input v-model="temp[dialogStatus].bit" />
        </el-form-item>
        <el-form-item label="描述" prop="info">
          <el-input v-model="temp[dialogStatus].info" />
        </el-form-item> -->
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

    <dialogzt v-model="dialogztvalue" :abc.sync="innerdialogFormVisibleBit" />

    <div style="width:100%;height:50px" />
  </div>
</template>

<script>
import XLSX from 'xlsx'
import { validateEmail } from '@/utils/validate'
import { mqttgybitAlarmList, mqttgybitAlarmOnlyList, mqttgybitAlarmSave, mqttgybitAlarmUpdate, mqttgybitAlarmDelete, mqttgybitAlarmBatchSave, mqttgybitAlarmBatchUpdate } from '@/api/mqtt/gybitAlarm'
import { mqttgysnInfoList } from '@/api/mqtt/gysnInfo'
import { selectOptionFilter } from '@/filters'
import { mqttgyycyxList } from '@/api/mqtt/gyycyx'
import dialogzt from './components/dialogzt'

export default {
  components: { dialogzt },
  data() {
    return {
      list: [],
      list1: null,
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
        gyNameObjId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        pidType: [{ required: true, message: '不能为空', trigger: 'blur' }],
        bit: [{ required: true, message: '不能为空', trigger: 'blur' }],
        info: [{ required: true, message: '不能为空', trigger: 'blur' }]
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
      downloadLoading: false,
      fileData: '',

      countrySelectValue: '',
      countrySelectOptions: '',
      provinceSelectValue: '',
      provinceSelectOptions: '',
      projectSelectValue: '',
      projectSelectOptions: [
        { value: '1', label: '滨海零能耗项目' },
        { value: '2', label: '云南微网项目' },
        { value: '3', label: '河北虚拟电站项目' },
        { value: '4', label: '南京质检院项目' }
      ],
      objSelectOptionsDia: [],
      registerSelectOptionsDia: [],
      ztSelectValue: '',
      innerdialogFormVisibleBit: false,
      dialogztvalue: {}
    }
  },
  created() {
    if (this.$route.query.gyid !== undefined) {
      this.provinceSelectValue = this.$route.query.gyid
      this.countrySelectValue = this.$route.query.xyid
    }
    this.getList()
    this.getSelectOptionsDia()
  },
  methods: {
    getList() {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString()
      }
      if (this.countrySelectValue !== '') {
        data.pidType = this.countrySelectValue
      }
      if (this.provinceSelectValue !== '') {
        data.gyNameId = this.provinceSelectValue.slice(0, 4)
        data.gyObjId = this.provinceSelectValue.slice(4, 7)
      }
      mqttgybitAlarmOnlyList(data).then(response => {
        if (response.code === 0) {
              this.currentPage = response.page.currPage
              // this.pageSize = response.page.pageSize
              this.total = response.page.totalCount
              this.totalPage = response.page.totalPage
              const list = response.page.list.map(item => { item.gyNameObjId = item.gyNameId + item.gyObjId; return item })
              this.list = response.page.list
              // const list = response.page.list.map(item => { item.gyNameObjId = item.gyNameId + item.gyObjId; return item })
              // const snId = []; const register = []; const list1 = []
              // for (const j in list) {
              //   if (!(snId.includes(list[j].gyNameId) && register.includes(list[j].pidType))) {
              //     snId.push(list[j].gyNameId)
              //     register.push(list[j].pidType)
              //     list1.push(list[j])
              //   }
              // }
              // this.total = list1.length
              // this.totalPage = Math.ceil(this.total / this.pageSize)
              // this.list = list1.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        }
      })
      if (this.InitOptiList) {
        this.objNameSelectChange()
      }
    },
    objNameSelectChange() {
      const data = {}
      if (this.provinceSelectValue !== '') {
        data.gyNameId = this.provinceSelectValue.slice(0, 4)
        data.gyObjId = this.provinceSelectValue.slice(4, 7)
      }
      mqttgybitAlarmList(data).then(response => {
        if (response.code === 0) {
          data.limit = response.page.totalCount.toString()
          mqttgybitAlarmList(data).then(response => {
            if (response.code === 0) {
              this.getSelectOptions(response.page.list, 'countrySelectOptions', 'pidType', 'pidType')
              this.InitOptiList = false
            }
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
    getSelectOptionsDia() {
      mqttgysnInfoList({}).then(response => {
        mqttgysnInfoList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.objSelectOptionsDia = res.map(item => { return { value: item.gyNameId + item.gyObjId, label: item.gyName, gyObjId: item.gyObjId, gyNameId: item.gyNameId } })
          }
        })
      })
    },
    objSelectChange(val, disable) {
      const data = { gyNameObjId: val, dataType: 'int' }
      for (const j in this.objSelectOptionsDia) {
        if (this.objSelectOptionsDia[j].value == val) {
          data.gyNameId = this.objSelectOptionsDia[j].gyNameId
          data.gyObjId = this.objSelectOptionsDia[j].gyObjId
          break
        }
      }
      mqttgyycyxList(data).then(response => {
        data.limit = response.page.totalCount.toString()
        mqttgyycyxList(data).then(response => {
          const res = response.page.list
          if (!disable) { this.$set(this.temp[this.dialogStatus], 'pidType', '') }
          this.registerSelectOptionsDia = res.filter(v => /^GZ/.test(v.pidType)).map(item => { return { value: item.pidType, label: item.comment } })
        })
      })
    },
    handleCreate() {
      if(this.provinceSelectValue!='') {
        this.temp.create.gyNameObjId = this.provinceSelectValue
        this.objSelectChange(this.temp.create.gyNameObjId)
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.getSelectOptionsDia()
      this.objSelectChange(row.gyNameObjId, true)
      this.temp.update = { ...row }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    BITClick(row) {
      this.dialogztvalue = row
      this.innerdialogFormVisibleBit = true
    },
    handleView(row) {
      this.temp.view = row
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        mqttgybitAlarmList({}).then(response => {
          mqttgybitAlarmList({ limit: response.page.totalCount.toString(), gyNameId: row.gyNameId, pidType: row.pidType }).then(response => {
            const res = response.page.list
            const data = res.map(item => item.id)
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
        })
      })
    },
    createData({ ...data }) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          for (const j in this.objSelectOptionsDia) {
            if (this.objSelectOptionsDia[j].value == data.gyNameObjId) {
              data.gyNameId = this.objSelectOptionsDia[j].gyNameId
              data.gyObjId = this.objSelectOptionsDia[j].gyObjId
              break
            }
          }
          delete data.gyNameObjId
          mqttgybitAlarmList(data).then(response=>{
            if(response.code==0) {
              const resz = response.page.list
              if(resz.length==0) {
                data.bit = 0
                data.bitType = 0
                data.comment = ''
                mqttgybitAlarmSave(data).then(response => {
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
              } else {
                this.$notify({
                  title: 'Failed',
                  message: '该告警量已录入',
                  type: 'danger',
                  duration: 2000
                })
              }
            }
          })
        }
      })
    },
    updateData({ ...data }) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          for (const j in this.objSelectOptionsDia) {
            if (this.objSelectOptionsDia[j].value == data.gyNameObjId) {
              data.gyNameId = this.objSelectOptionsDia[j].gyNameId
              data.gyObjId = this.objSelectOptionsDia[j].gyObjId
              break
            }
          }
          mqttgybitAlarmUpdate(data).then(response => {
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
        const gynameid = this.provinceSelectValue
        mqttgybitAlarmList({ limit: '1', gyNameId: gynameid }).then(response => {
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
          mqttgybitAlarmList({ limit: response.page.totalCount.toString(), gyNameId: gynameid }).then(response => {
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
                    gyNameId: gynameid,
                    pidType: value.PIDTYPE
                  })
                } else {
                  listc.push({
                    bit: value.BIT,
                    comment: value.COMMENT,
                    gyNameId: gynameid,
                    pidType: value.PIDTYPE
                  })
                }
              })
              console.log('listu', listu)
              console.log('listc', listc)
              return
              console.log(111)
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
        const gynameid = this.provinceSelectValue
        mqttgybitAlarmList({ limit: '1', gyNameId: gynameid }).then(response => {
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
          mqttgybitAlarmList({ limit: response.page.totalCount.toString(), gyNameId: gynameid }).then(response => {
            if (response.code === 0) {
              const list = response.page.list
              const tHeader = ['PIDTYPE', 'BIT', 'COMMENT']
              const filterVal = ['pidType', 'bit', 'comment']
              const data = this.formatJson(filterVal, list)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: `zt-list`
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
    margin-bottom: 0;
}
</style>
