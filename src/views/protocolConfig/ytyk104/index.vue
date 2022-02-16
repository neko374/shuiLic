<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
        <div style="float:left">
          <el-form-item>
            <el-select v-model="countrySelectValue" filterable clearable placeholder="功能">
              <el-option
                v-for="(item,index) in countrySelectOptions"
                :key="'gn'+index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <div style="float:left">
          <el-button
            class="TablePageButtonSearch"
            size="mini"
            icon="el-icon-search"
            @click="handleFilter"
          >{{ $t('table.search') }}</el-button>
          <el-button
            class="TablePageButtonAdd"
            size="mini"
            icon="el-icon-edit"
            @click="handleCreate"
          >{{ $t('table.add') }}</el-button>
        </div>
      </el-form>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit style="width: 100%;" size="mini">
      <el-table-column
        :label="$t('table.id')"
        width="50"
        type="index"
        :index="(currentPage-1)*pageSize+1"
      />
      <el-table-column label="采集器" min-width="140" prop="snId" show-overflow-tooltip />
      <el-table-column label="遥调点" min-width="140" prop="pidName" show-overflow-tooltip />
      <el-table-column label="事务处理标识符" min-width="120" show-overflow-tooltip prop="actionflagword" />
      <el-table-column label="协议码" min-width="120" show-overflow-tooltip prop="protocalflagword" />
      <el-table-column label="报文字节长度" min-width="120" show-overflow-tooltip prop="lengthbyteword" />
      <el-table-column label="从机Id" min-width="120" show-overflow-tooltip prop="slaveaddressbyte" />
      <el-table-column label="功能码" min-width="120" show-overflow-tooltip prop="functioncodebyte" />
      <el-table-column label="地址起始码" min-width="120" show-overflow-tooltip prop="startregaddressword" />
      <el-table-column label="数字字节数" min-width="120" show-overflow-tooltip prop="databytenumbyte" />
      <el-table-column label="寄存器个数" min-width="120" show-overflow-tooltip prop="readdatanumword" />
      <el-table-column label="自动/手动取数" min-width="120" show-overflow-tooltip prop="manual">
        <template slot-scope="{row}">
          <span>{{ row.manual | selectOptionFilter(manualSelect) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="自动取数遥测量" min-width="120" show-overflow-tooltip prop="ycPidName" />
      <el-table-column label="自动取数遥测SNID" min-width="140" show-overflow-tooltip prop="ycSnId" />

      <el-table-column label="操作" width="130">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonEdit" @click="handleUpdate(row)">编辑</el-button>
          <!-- <el-button size="mini" class="TableButtonView" @click="handleView(row)">
            查看
          </el-button>-->
          <el-button size="mini" class="TableButtonDelete" @click="handleDelete(row)">删除</el-button>
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

    <el-dialog
      v-if="dialogStatus==='create'||dialogStatus==='update'"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      custom-class="user-management-diaCr"
    >
      <el-form
        ref="dataForm"
        status-icon
        :rules="rules"
        :model="temp[dialogStatus]"
        size="mini"
        label-position="left"
        label-width="140px"
      >
        <el-form-item label="项目">
          <el-select
            v-model="temp[dialogStatus].modeId"
            filterable
            placeholder="项目"
            style="width:200px;"
            @change="xmSelectChange(temp[dialogStatus].modeId)"
          >
            <el-option
              v-for="item in xmSelectOptionsDia"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="采集器" prop="snId">
          <el-select
            v-model="temp[dialogStatus].snId"
            filterable
            placeholder="采集器"
            style="width:200px;"
          >
            <el-option
              v-for="(item,index) in objSelectOptionsDia"
              :key="index+'1'"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="遥调点" prop="pidName">
          <el-input v-model="temp[dialogStatus].pidName" />
        </el-form-item>
        <el-form-item label="事务处理标识符" prop="actionflagword">
          <el-input v-model="temp[dialogStatus].actionflagword" />
        </el-form-item>
        <el-form-item label="协议码" prop="protocalflagword">
          <el-input v-model="temp[dialogStatus].protocalflagword" />
        </el-form-item>
        <el-form-item label="报文字节长度" prop="lengthbyteword">
          <el-input v-model="temp[dialogStatus].lengthbyteword" />
        </el-form-item>
        <el-form-item label="从机Id" prop="slaveaddressbyte">
          <el-input v-model="temp[dialogStatus].slaveaddressbyte" />
        </el-form-item>
        <el-form-item label="功能码" prop="functioncodebyte">
          <el-input v-model="temp[dialogStatus].functioncodebyte" />
        </el-form-item>
        <el-form-item label="地址起始码" prop="startregaddressword">
          <el-input v-model="temp[dialogStatus].startregaddressword" />
        </el-form-item>
        <el-form-item label="数字字节数" prop="databytenumbyte">
          <el-input v-model="temp[dialogStatus].databytenumbyte" />
        </el-form-item>
        <el-form-item label="寄存器个数" prop="readdatanumword">
          <el-input v-model="temp[dialogStatus].readdatanumword" />
        </el-form-item>
        <el-form-item label="自动/手动取数" prop="manual">
          <el-select
            v-model="temp[dialogStatus].manual"
            filterable
            placeholder="自动/手动取数"
            style="width:200px;"
          >
            <el-option
              v-for="(item,index) in manualSelect"
              :key="index+'1'"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="自动取数遥测量" prop="ycPidName">
          <el-input v-model="temp[dialogStatus].ycPidName" />
        </el-form-item>
        <el-form-item label="自动取数遥测SNID" prop="ycSnId">
          <el-input v-model="temp[dialogStatus].ycSnId" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData(temp.create):updateData(temp.update)"
        >保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="textMap[dialogStatusy]"
      :visible.sync="dialogFormVisibley"
      custom-class="user-management-diaCr"
      append-to-body
    >
      <el-form
        ref="dataFormy"
        status-icon
        :rules="rules"
        :model="temp[dialogStatusy]"
        size="mini"
        label-position="left"
        label-width="140px"
      >
        <el-form-item label="pId" prop="pId">
          <el-input v-model.number="temp[dialogStatusy].pId" />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="temp[dialogStatusy].value" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="writey(temp[dialogStatusy],dialogStatusy)">确认</el-button>
        <el-button @click="dialogFormVisibley = false">取消</el-button>
      </div>
    </el-dialog>

    <div style="width:100%;height:50px" />
  </div>
</template>

<script>
import { validateEmail } from '@/utils/validate'
import {
  modbusgyykytList,
  modbusgyykytSave,
  modbusgyykytUpdate,
  modbusgyykytDelete
} from '@/api/mqtt/modbusykyt'
import { mqttprojectInfoList, mqttprojectInfoInfo } from '@/api/mqtt/projectInfo'
import { mqttprojectCollectorList } from '@/api/mqtt/projectCollector'
import { mqttPublishGet, mqttPublishPublish } from '@/api/mqtt/publish'
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
      dialogFormVisibley: false,
      dialogStatusy: 'yt',
      textMap: {
        update: '编辑',
        create: '创建',
        view: '查看',
        yt: '遥调',
        yk: '遥控'
      },
      rules: {
        modeId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        snId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        pidName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        actionflagword: [{ required: true, message: '不能为空', trigger: 'blur' }],
        protocalflagword: [{ required: true, message: '不能为空', trigger: 'blur' }],
        lengthbyteword: [{ required: true, message: '不能为空', trigger: 'blur' }],
        slaveaddressbyte: [{ required: true, message: '不能为空', trigger: 'blur' }],
        functioncodebyte: [{ required: true, message: '不能为空', trigger: 'blur' }],
        startregaddressword: [{ required: true, message: '不能为空', trigger: 'blur' }],
        databytenumbyte: [{ required: true, message: '不能为空', trigger: 'blur' }],
        readdatanumword: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      temp: {
        create: {
          msgType: ''
        },
        update: {},
        view: {},
        yt: {},
        yk: {}
      },
      InitOptiList: true,

      countrySelectValue: '',
      countrySelectOptions: '',
      provinceSelectValue: '',
      provinceSelectOptions: '',
      objSelectOptionsDia: [],
      xmSelectOptionsDia: [],
      ytykIdSelectValue: '',
      manualSelect: [
        { value: '0', label: '自动' },
        { value: '1', label: '手动' }
      ]
    }
  },
  created() {
    if (this.$route.query.ytykId !== undefined) {
      this.ytykIdSelectValue = Number(this.$route.query.ytykId)
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
      if (this.ytykIdSelectValue !== '') {
        data.id = this.ytykIdSelectValue
      }
      if (this.countrySelectValue !== '') {
        data.pidName = this.countrySelectValue
      }
      modbusgyykytList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = response.page.list
          // console.log(this.list)
          // console.log(this.list[0].modeProtocal)
          // this.list[0].modeProtocal +='<br><br>'
        }
      })
      if (this.InitOptiList) {
        modbusgyykytList({}).then(response => {
          if (response.code === 0) {
            const data1 = { limit: response.page.totalCount.toString() }
            modbusgyykytList(data1).then(response => {
              if (response.code === 0) {
                this.getSelectOptions(
                  response.page.list,
                  'countrySelectOptions',
                  'pidName',
                  'pidName'
                )
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
          pre.push({
            value: cur[valueName],
            label: cur[labelName],
            text: cur[labelName]
          })
        }
        return pre
      }, [])
    },
    getSelectOptionsDia() {
      mqttprojectInfoList({}).then(response => {
        mqttprojectInfoList({ limit: response.page.totalCount.toString() }).then(
          response => {
            if (response.code === 0) {
              const res = response.page.list
              this.xmSelectOptionsDia = res.map(item => {
                return { value: item.id, label: item.name }
              })
            }
          }
        )
      })
    },
    xmSelectChange(data, disable) {
      disable = disable || false
      mqttprojectCollectorList({ projectId: data }).then(response => {
        if (response.code === 0) {
          mqttprojectCollectorList({
            projectId: data,
            limit: response.page.totalCount.toString()
          }).then(response => {
            if (response.code === 0) {
              const res = response.page.list
              if (!disable) {
                this.$set(this.temp[this.dialogStatus], 'snId', '')
              }
              this.objSelectOptionsDia = res.map(item => {
                return {
                  value: item.snId,
                  label: item.snId
                }
              })
            }
          })
        }
      })
    },
    addytyk(text) {
      this.dialogStatusy = text
      this.dialogFormVisibley = true
      this.$nextTick(() => {
        this.$refs['dataFormy'].clearValidate()
      })
    },
    writey(row, text) {
      this.$refs['dataFormy'].validate(valid => {
        if (valid) {
          if (
            this.temp[this.dialogStatus].msgType !== '' &&
            this.temp[this.dialogStatus].msgType !== undefined
          ) {
            this.temp[
              this.dialogStatus
            ].msgType += `,${text}_${row.pId}_${row.value}`
          } else {
            this.temp[
              this.dialogStatus
            ].msgType = `${text}_${row.pId}_${row.value}`
          }
          this.dialogFormVisibley = false
          this.temp[this.dialogStatusy] = {}
        }
      })
    },
    geprotocal(row) {
      if (row.msgType !== '') {
        const data = {
          msgType: row.msgType,
          id: row.snId
        }
        mqttPublishGet(data).then(response => {
          if (response.code == 0) {
            const res = response.getMsg
            this.$set(row, 'modeProtocal', res.content)
          } else {
            this.$notify({
              title: 'Failed',
              message: '所传值结构错误',
              type: 'danger',
              duration: 2000
            })
          }
        })
      }
    },
    testProtocal(row) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const modeProtocal = row.modeProtocal.match(/<Session id="(\S*?)"\/>/)[1]
          const data = {
            broker: $_hostIp,
            clientID: 'aipower_zx',
            topic: 'ncyt_sub_yk_yt',
            msgType: row.msgType,
            snid: row.snId,
            sessionid: modeProtocal
          }
          mqttPublishPublish(data).then(response => {
            // console.log(response)
            if (response.publishMsg.state == 'success') {
              this.$notify({
                title: 'Succeed',
                message: '发布成功!',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: 'Failed',
                message: '发布失败!',
                type: 'success',
                duration: 2000
              })
            }
          })
            .catch(() => {
              this.$notify({
                title: 'Failed',
                message: '发布失败!',
                type: 'success',
                duration: 2000
              })
            })
        }
      })
    },
    handleCreate() {
      this.getSelectOptionsDia()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.getSelectOptionsDia()
      this.xmSelectChange(row.modeId, true)
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
      this.$confirm('此操作将永久删除该策略, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = [row.id]
          modbusgyykytDelete(data).then(response => {
            if (response.code === 0) {
              this.InitOptiList = true
              this.currentPage = Math.min(
                this.currentPage,
                Math.ceil((this.total - 1) / this.pageSize)
              )
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
        })
        .catch(() => {
          this.$notify.info({
            title: '消息',
            message: '已取消删除',
            duration: 2000
          })
        })
    },
    createData({ ...data }) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // for (const j in this.objSelectOptionsDia) {
          //   if ((this.objSelectOptionsDia[j].value = data.modeId)) {
          //     data.snId = this.objSelectOptionsDia[j].label;
          //     break;
          //   }
          // }
          // console.log(data)
          modbusgyykytSave(data).then(response => {
            if (response.code === 0) {
              this.dialogFormVisible = false
              this.InitOptiList = true
              this.temp.create = { msgType: '' }
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // for (const j in this.objSelectOptionsDia) {
          //   if ((this.objSelectOptionsDia[j].value = data.modeId)) {
          //     data.snId = this.objSelectOptionsDia[j].label;
          //     break;
          //   }
          // }
          // console.log(data)
          modbusgyykytUpdate(data).then(response => {
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

<style ang="scss">
.el-tooltip__popper {
  max-width: 400px;
}
</style>

