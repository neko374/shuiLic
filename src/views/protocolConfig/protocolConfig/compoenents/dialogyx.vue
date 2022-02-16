<template>
  <div>
    <el-dialog :title="textMap[text] + '('+value.name+')'" :visible.sync="dialogFormVisible" width="88%" height="90%" class="ycdialog">
      <div slot="title">
        <span class="title">{{ textMap[text] }}</span>
        <span class="name">({{ value.gyName }})</span>
      </div>
      <el-button v-waves style="float:right;margin-left:10px;" :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-upload
        v-if="nameSelectValue"
        action="/"
        :on-change="onChange"
        :auto-upload="false"
        :show-file-list="false"
        accept=".xls, .xlsx"
        style="float:right;"
      >
        <el-button type="success" icon="el-icon-upload2">导入</el-button>
        <div v-if="fileData" slot="tip">{{ fileData.name }}</div>
      </el-upload>
      <el-form ref="ycForm" class="powerDiaTable" status-icon size="mini" inline-message :model="ycformmodel">
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          size="mini"
        >
          <el-table-column label="畅洋点序号(PID)" width="120" prop="pid" />
          <!-- <el-table-column label="对象类型" width="100" prop="gyObjId" /> -->
          <!-- <el-table-column label="序号" width="90">
          <template slot-scope="{row}">
            <el-input v-model="row.xuhao" />
          </template>
        </el-table-column> -->
          <el-table-column label="协议名称">
            <template slot-scope="{row}">
              <span>{{ row.pidType }}</span>
            <!-- <el-form-item prop="pidType" >
              <el-select
                v-model="row.pidType"
                filterable
                clearable
                allow-create
                placeholder="协议名称"
                style="width:calc(100% - 50px);"
              >
                <el-option
                  v-for="item in protocalSelectOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  <span style="float: left">{{ item.value }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
                </el-option>
              </el-select>
              <el-button type="primary" @click="addxieyi">新增</el-button>
            </el-form-item> -->
            </template>
          </el-table-column>
          <el-table-column label="字节类型">
            <template slot-scope="{row}">
              <span>{{ row.dataType }}</span>
            <!-- <el-form-item>
              <el-select
                v-model="row.dataType"
                filterable
                placeholder="字节类型"
              >
                <el-option
                  v-for="item in [{value:'double'},{value:'int'}]"
                  :key="item.value"
                  :value="item.value"
                />
              </el-select>
            </el-form-item> -->
            </template>
          </el-table-column>
          <el-table-column label="数据库名称">
            <template slot-scope="{row}">
              <span>{{ row.databaseName }}</span>
            <!-- <el-form-item>
              <el-select
                v-model="row.databaseName"
                filterable
                placeholder="数据库名称"
              >
                <el-option
                  v-for="item in databaseNameSelectOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  <span style="float: left">{{ item.value }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item> -->
            </template>
          </el-table-column>
          <el-table-column label="表名称">
            <template slot-scope="{row}">
              <span>{{ row.tableName }}</span>
            <!-- <el-form-item>
              <el-cascader
                v-model="row.tableName"
                :options="tableNameSelectOptions"
                filterable
                clearable
                separator="_"
                :props="{value:'value',label:'value'}"
                placeholder="请选择表名称"
                style="width:calc(100% - 50px);"
              >
                <template slot-scope="{ node, data }">
                  <span style="float: left">{{ data.value }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ data.label }}</span>
                </template>
              </el-cascader>
              <el-button type="primary" @click="addtName">新增</el-button>
            </el-form-item> -->
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="{row}">
              <span>{{ row.comment }}</span>
            <!-- <el-input v-model="row.comment" :style="{width:(row.tableName[3] === 'alarm' || row.tableName[3] === 'zt')?'calc(100% - 65px)':''}" /> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" :width="130">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="updateYcInfoDialog(scope.row)">编辑</el-button>
              <el-button v-if="(scope.$index+(currentPage-1)*pageSize) == (total - 1)" class="TableButtonDelete" size="mini" @click="ycdelete(scope.row,(scope.$index+(currentPage-1)*pageSize))">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :total="total"
          background
          :page-sizes="[10, 20,50,100]"
          layout="total, sizes, prev, pager, next, jumper"
          popper-class="PaginationPageSize"
          class="TablePagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitPro">
        确认
      </el-button> -->
        <el-button type="primary" @click="addYcInfoDialog">新增</el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="350px"
      title="新增表名称"
      :visible.sync="innerdialogFormVisible"
      style="margin-top:20%!important;"
      append-to-body
    >
      <el-form ref="tableNameform" :model="tableNameform" label-width="140px">
        <el-form-item label="请选择名称前缀:" prop="cascaderValue" :rules="{ required: true, message: '名称前缀不能为空', trigger: 'blur' }">
          <el-cascader
            v-model="tableNameform.cascaderValue"
            :options="cascaderOptions"
            filterable
            separator="_"
            :props="{value:'value',label:'value'}"
            placeholder="请选择名称前缀"
          >
            <template slot-scope="{ node, data }">
              <span style="float: left">{{ data.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ data.label }}</span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="请输入名称后缀:" prop="tableNameInput" :rules="[{ required: true, message: '名称后缀不能为空', trigger: 'blur' },{validator:validateNewPwd,trigger:['blur','change']}]">
          <el-input v-model="tableNameform.tableNameInput" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addTableName">
          确认
        </el-button>
        <el-button @click="innerdialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="410px"
      :title="ycaddtextMap[ycdialogstatus]"
      :visible.sync="innerdialogFormYcInfo"
      style="padding-top:5%!important;"
      append-to-body
    >
      <el-form ref="ycaddform" size="mini" :rules="rules" :model="ycaddform[ycdialogstatus]" label-position="left" label-width="130px">
        <el-form-item label="畅洋点序号(PID)" prop="pid">
          <el-input v-model.number="ycaddform[ycdialogstatus].pid" />
        </el-form-item>
        <el-form-item label="协议名称" prop="pidType">
          <el-select
            v-model="ycaddform[ycdialogstatus].pidType"
            filterable
            allow-create
            placeholder="协议名称"
          >
            <el-option
              v-for="item in protocalSelectOptions"
              :key="item.value"
              :value="item.value"
            >
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
            </el-option>
          </el-select>
          <el-button type="primary" @click="addxieyi">新增</el-button>
        </el-form-item>
        <el-form-item label="字节类型" prop="dataType">
          <el-select
            v-model="ycaddform[ycdialogstatus].dataType"
            filterable
            placeholder="字节类型"
          >
            <el-option
              v-for="item in valueTypeSelectoptions"
              :key="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据库名称" prop="databaseName">
          <el-select
            v-model="ycaddform[ycdialogstatus].databaseName"
            filterable
            placeholder="数据库名称"
          >
            <el-option
              v-for="item in databaseNameSelectOptions"
              :key="item.value"
              :value="item.value"
            >
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表名称" prop="tableName">
          <el-cascader
            v-model="ycaddform[ycdialogstatus].tableNamejx"
            :options="tableNameSelectOptions"
            filterable
            clearable
            separator="_"
            :props="{value:'value',label:'value'}"
            placeholder="请选择表名称"
          >
            <template slot-scope="{ node, data }">
              <span style="float: left">{{ data.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ data.label }}</span>
            </template>
          </el-cascader>
          <el-button type="primary" @click="addtName">新增</el-button>
        </el-form-item>
        <el-form-item label="描述" prop="comment">
          <el-input v-model="ycaddform[ycdialogstatus].comment" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ycdialogstatus==='create'?addYcInfoForm(ycaddform.create):updateYcInfoForm(ycaddform.update)">
          确认
        </el-button>
        <el-button @click="innerdialogFormYcInfo = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="350px"
      title="告警/状态信息"
      :visible.sync="innerdialogFormVisibleBit"
      style="padding-top:5%!important;"
      append-to-body
    >
      <el-form ref="Bitform" class="powerDiaTable" size="mini" :model="bitform" inline-message>
        <el-table size="mini" fit border :data="bitform.bitTable">
          <el-table-column type="index" label="BIT" width="50" :index="0" />
          <el-table-column label="描述">
            <template slot-scope="scope">
              <el-form-item :prop="'bitTable.' + scope.$index + '.info'" :rules="{ required: true, message: '描述不能为空！', trigger: 'blur' }">
                <el-input v-model="scope.row.info" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="75">
            <template slot-scope="scope">
              <el-button class="TableButtonDelete" @click="deleteBitForm(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addBit">
          确认
        </el-button>
        <el-button type="success" @click="addBitForm">
          新增
        </el-button>
        <el-button @click="innerdialogFormVisibleBit = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import waves from '@/directive/waves' // waves directive
import { mqttgyycyxList, mqttgyycyxSave, mqttgyycyxUpdate, mqttgyycyxDelete, mqttgyycyxBatchSave, mqttgyycyxBatchUpdate } from '@/api/mqtt/gyycyx'
import { mqtthisdbNameList } from '@/api/mqtt/hisdbName'
import { mqttgysnInfoList } from '@/api/mqtt/gysnInfo'

export default {
  directives: { waves },
  props: {
    text: String,
    value: Object,
    abc: Boolean
  },
  data() {
    var validateNewPwd = (rule, value, callback) => {
      const data = [...this.tableNameform.cascaderValue, value]
      function jy(xhdata, [...val]) {
        for (const j in xhdata) {
          if (xhdata[j].children) {
            if (xhdata[j].value === val[0]) {
              val.shift()
              return jy(xhdata[j].children, val)
              break
            }
          } else {
            if (xhdata[j].value === val[0]) {
              return true
              break
            }
          }
        }
        return false
      }
      if (jy(this.tableNameSelectOptions, data)) {
        callback(new Error('该名称后缀已存在！'))
      }
      callback()
    }
    return {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      total: 0,
      validateNewPwd,
      dialogFormVisible: this.abc,
      lastIndex: -1,
      ycformmodel: {},
      protocalSelectOptions: [
        { value: 'va', label: 'a相电压' },
        { value: 'vb', label: 'b相电压' },
        { value: 'vc', label: 'c相电压' }
      ],
      valueTypeSelectoptions: [{ value: 'double' }, { value: 'int' }],
      databaseNameSelectOptions: [
        { value: 'main', label: '石家庄' },
        { value: 'microgrid', label: '云南微网' }
      ],
      tableNameSelectOptions: [
        { value: this.text, label: '遥测',
          children: [
            { value: 'e', label: '电气量', children: [
              { value: 'pv', label: '光伏', children: [
                { value: 'rtload', label: '功率、电量表' },
                { value: 'voltage', label: '电压' },
                { value: 'current', label: '电流' },
                { value: 'alarm', label: '告警' },
                { value: 'zt', label: '状态' }
              ] },
              { value: 'battery', label: '储能', children: [
                { value: 'rtload', label: '功率、电量表' },
                { value: 'voltage', label: '电压' },
                { value: 'current', label: '电流' },
                { value: 'alarm', label: '告警' },
                { value: 'zt', label: '状态' }
              ] },
              { value: 'hydro', label: '水电', children: [
                { value: 'rtload', label: '功率、电量表' },
                { value: 'voltage', label: '电压' },
                { value: 'current', label: '电流' },
                { value: 'alarm', label: '告警' },
                { value: 'zt', label: '状态' }
              ] },
              { value: 'micro', label: '微网', children: [
                { value: 'rtload', label: '功率、电量表' },
                { value: 'voltage', label: '电压' },
                { value: 'current', label: '电流' },
                { value: 'alarm', label: '告警' },
                { value: 'zt', label: '状态' }
              ] }
            ] },
            { value: 'q', label: '气象环境量', children: [
              { value: 'pv', label: '光伏', children: [
                { value: 'temperature', label: '温度' }
              ] },
              { value: 'battery', label: '储能', children: [
                { value: 'temperature', label: '温度' }
              ] },
              { value: 'hydro', label: '水电', children: [
                { value: 'waterlevel', label: '水位' }
              ] },
              { value: 'micro', label: '微网', children: [
                { value: 'rttower', label: '气象站' }
              ] }
            ] }] }
      ],
      ycInfo: [],
      list: [],
      ycInfo1: [],
      textMap: {
        yc: '遥测',
        yx: '遥信',
        yt: '遥调',
        yk: '遥控'
      },
      switchValue: '0',
      innerdialogFormVisible: false,
      innerdialogFormYcInfo: false,
      innerdialogFormVisibleBit: false,
      downloadLoading: false,
      listLoading: false,
      ycdialogstatus: 'create',
      ycaddform: {
        create: {},
        update: {}
      },
      ycaddtextMap: {
        create: '新建',
        update: '编辑'
      },
      bitform: {
        bitTable: [
          { info: '' }
        ]
      },
      tableNameform: {
        cascaderValue: [this.text, 'e', 'pv'],
        tableNameInput: ''
      },
      cascaderOptions: [
        { value: this.text, label: '遥测',
          children: [{ value: 'e', label: '电气量', children: [
            { value: 'pv', label: '光伏' },
            { value: 'battery', label: '储能' },
            { value: 'hydro', label: '水电' },
            { value: 'micro', label: '微网' }
          ] },
          { value: 'q', label: '气象环境量', children: [
            { value: 'pv', label: '光伏' },
            { value: 'battery', label: '储能' },
            { value: 'hydro', label: '水电' },
            { value: 'micro', label: '微网' }
          ] }] }
      ],
      InitOptiList: true,
      nameSelectOptions: [],
      nameSelectValue: '',
      rules: {
        pidType: [{ required: true, message: '不能为空', trriger: 'blur' }],
        dataType: [{ required: true, message: '不能为空', trriger: 'blur' }],
        databaseName: [{ required: true, message: '不能为空', trriger: 'blur' }],
        // tableName:[{required:true,message:'不能为空',trriger:'blur'}],
        comment: [{ required: true, message: '不能为空', trriger: 'blur' }],
        pid: [{ type: 'number', message: '必须为整数', trriger: ['blur', 'change'] }, { required: true, message: '不能为空', trriger: ['blur', 'change'], type: 'number' }]
      },
      fileData: '',
      xztj: {
        msgType: this.text,
        gyNameId: this.value.gyNameId
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.xztj.gyNameId = val.gyNameId
        this.nameSelectValue = val.gyObjId
        this.getList()
      },
      deep: true
    },
    nameSelectValue(val) {
      this.xztj.gyObjId = val
    },
    text(val) {
      this.xztj.msgType = this.text
    },
    abc(val) {
      this.dialogFormVisible = val
      this.currentPage = 1
    },
    dialogFormVisible(val) {
      this.$emit('update:abc', val)
    }
  },
  created() {
    this.nameSelectValue = this.value.gyObjId
    this.cascaderOptions[0].label = this.textMap[this.text]
    this.tableNameSelectOptions[0].label = this.textMap[this.text]
    this.getList()
    this.getOptions()
  },
  methods: {
    getList() {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString(),
        msgType: this.text,
        gyNameId: this.value.gyNameId
      }
      if (this.nameSelectValue !== '') {
        data.gyObjId = this.nameSelectValue
      }
      // console.log(data)
      mqttgyycyxList(data).then(response => {
        // console.log(response)
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = []
          this.list = response.page.list.map(item => { item.tableNamejx = item.tableName == undefined ? '' : item.tableName.split('_'); return item })
          const data1 = {
            limit: response.page.totalCount.toString(),
            page: '1',
            msgType: this.text,
            gyNameId: this.value.gyNameId
          }
          mqttgyycyxList(data1).then(response => {
            if (response.page.list.length != 0) { this.lastIndex = response.page.list[response.page.list.length - 1].pid } else { this.lastIndex = -1 }
          })
        }
      })
    },
    getOptions() {
      mqtthisdbNameList({}).then(response => {
        mqtthisdbNameList({ limit: response.page.totalCount.toString() }).then(response => {
          const res = response.page.list
          this.databaseNameSelectOptions = res.map(item => ({ value: item.tableName, label: item.comment }))
        })
      })
      mqttgysnInfoList({}).then(response => {
        mqttgysnInfoList({ limit: response.page.totalCount.toString(), gyNameId: this.value.gyNameId }).then(response => {
          const res = response.page.list
          this.nameSelectOptions = res.map(item => ({ value: item.gyObjId, label: item.gyObjId }))
        })
      })
    },
    addYcInfo(item) {
      this.list.push({ pidType: '', dataType: 'double', databaseName: 'main', tableName: '', comment: '', refSystemProtocalid: this.value.id, msgType: this.text })
      this.currentPage = Math.ceil((this.total + 1) / this.pageSize)
      this.handler()
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
    addYcInfoDialog() {
      this.innerdialogFormYcInfo = true
      this.ycdialogstatus = 'create'
      this.$nextTick(() => {
        this.$refs['ycaddform'].clearValidate()
      })
    },
    updateYcInfoDialog({ ...row }) {
      this.ycaddform.update = row
      const jydata = jy(this.tableNameSelectOptions, row.tableNamejx)
      if (!jydata) {
        row.tableName = ''
        row.tableNamejx = ''
      }
      this.innerdialogFormYcInfo = true
      this.ycdialogstatus = 'update'
      this.$nextTick(() => {
        this.$refs['ycaddform'].clearValidate()
      })
      function jy(xhdata, [...val]) {
        for (const j in xhdata) {
          if (xhdata[j].children) {
            if (xhdata[j].value === val[0]) {
              val.shift()
              return jy(xhdata[j].children, val)
              break
            }
          } else {
            if (xhdata[j].value === val[0]) {
              return true
              break
            }
            if (j == xhdata.length - 1) {
              xhdata.push({
                value: val[0]
              })
              return true
              break
            }
          }
        }
        return false
      }
    },
    addYcInfoForm({ ...data }) {
      this.$refs['ycaddform'].validate((valid) => {
        if (valid) {
          data.tableName = typeof data.tableNamejx === 'object' ? data.tableNamejx.join('_') : ''
          data.gyNameId = this.value.gyNameId
          data.gyObjId = this.value.gyObjId
          data.msgType = this.text
          data.dchg = 'F'
          mqttgyycyxSave(data).then(response => {
            if (response.code === 0) {
              this.innerdialogFormYcInfo = false
              this.InitOptiList = true
              this.ycaddform.create = {}
              this.currentPage = Math.ceil(((this.total + 1) / this.pageSize))
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
    updateYcInfoForm({ ...data }) {
      this.$refs['ycaddform'].validate((valid) => {
        if (valid) {
          data.tableName = data.tableNamejx.join('_')
          mqttgyycyxUpdate(data).then(response => {
            if (response.code === 0) {
              this.innerdialogFormYcInfo = false
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
    addxieyi() {
      this.$prompt('请输入协议名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: val => {
          if (val === '' || val === undefined || val === null) { return false }
          for (const j in this.protocalSelectOptions) {
            if (this.protocalSelectOptions[j].value === val) {
              return '该协议名称已存在'
              break
            }
          }
        },
        inputErrorMessage: '协议名称不能为空'
      }).then(({ value }) => {
        this.protocalSelectOptions.push({ value: value })
        this.$message({
          type: 'success',
          message: '新增协议名称是: ' + value
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    addtName() {
      this.innerdialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['tableNameform'].clearValidate()
      })
    },
    addTableName() {
      this.$refs['tableNameform'].validate((valid) => {
        if (valid) {
          const data = [...this.tableNameform.cascaderValue, this.tableNameform.tableNameInput]
          function xh(xhdata, [...val]) {
            for (const j in xhdata) {
              if (xhdata[j].children) {
                if (xhdata[j].value === val[0]) {
                  val.shift()
                  xh(xhdata[j].children, val)
                  break
                }
              } else {
                xhdata.push({
                  value: val[0]
                })
                break
              }
            }
          }
          xh(this.tableNameSelectOptions, data)
          this.innerdialogFormVisible = false
          this.tableNameform.tableNameInput = ''
          this.tableNameform.cascaderValue = [this.text, 'e', 'pv']
        }
      })
    },
    switchValuechange(val) {
      // console.log(val)
    },
    BitClick() {
      this.innerdialogFormVisibleBit = true
      this.$nextTick(() => {
        this.$refs['Bitform'].clearValidate()
      })
    },
    addBit() {
      this.$refs['Bitform'].validate((valid) => {
        if (valid) {}
      })
    },
    addBitForm() {
      this.bitform.bitTable.push({ info: '' })
    },
    deleteBitForm(index) {
      this.bitform.bitTable.splice(index, 1)
    },
    addYcInfo12(val) {
      this.protocalSelectOptions.push({ value: val })
    },
    submitPro() {
      this.$refs['ycForm'].validate((valid) => {
        if (valid) {
        }
      })
    },
    ycdelete(row, index) {
      if (!('id' in row)) {
        this.list.splice(index, 1)
        this.currentPage = Math.min(this.currentPage, Math.ceil(((this.total - 1) / this.pageSize)))
        this.handler()
        return
      }
      this.$confirm('此操作将永久删除该规约, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = [row.id]
        mqttgyycyxDelete(data).then(response => {
          if (response.code === 0) {
            this.InitOptiList = true
            this.currentPage = Math.min(this.currentPage, Math.ceil(((this.total - 1) / this.pageSize)))
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
    jyvalueType(val, options) {
      for (const j in options) {
        if (options[j].value == val) { return true }
      }
      return false
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
        mqttgyycyxList({ limit: '1', ...this.xztj }).then(response => {
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
          mqttgyycyxList({ limit: response.page.totalCount.toString(), ...this.xztj }).then(response => {
            if (response.code === 0) {
              const list = response.page.list.map((item, index) => { item.index = index + Number(this.switchValue); return item })
              const listc = []; const listu = []
              j_data.forEach((value, j) => {
                const isindex = false
                if (('畅洋点序号' in value) && ('协议名称' in value) && ('字节类型' in value) && ('数据库名称' in value) && ('描述' in value)) {
                  if (this.jyvalueType(value.字节类型, this.valueTypeSelectoptions) && this.jyvalueType(value.数据库名称, this.databaseNameSelectOptions) && value.畅洋点序号 !== undefined) {
                    if (j < list.length) {
                      const val = list[j]
                      listu.push({
                        id: val.id,
                        pid: value.畅洋点序号,
                        pidType: value.协议名称,
                        dataType: value.字节类型,
                        databaseName: value.数据库名称,
                        tableName: value.表名称,
                        tableNamejx: value.表名称 == undefined ? '' : value.表名称.trim().split('_'),
                        comment: value.描述,
                        gyNameId: this.value.gyNameId,
                        gyObjId: this.nameSelectValue,
                        msgType: this.text,
                        dchg: 'F'
                      })
                      const jydata = jy(this.tableNameSelectOptions, listu[listu.length - 1].tableNamejx)
                      if (!jydata) {
                        listu[listu.length - 1].tableName = ''
                        listu[listu.length - 1].tableNamejx = ''
                      }
                    } else {
                      if (value.畅洋点序号 !== undefined && value.畅洋点序号 !== '' && value.畅洋点序号 !== null) {
                        listc.push({
                          pid: value.畅洋点序号,
                          pidType: value.协议名称,
                          dataType: value.字节类型,
                          databaseName: value.数据库名称,
                          tableName: value.表名称,
                          tableNamejx: value.表名称 == undefined ? '' : value.表名称.trim().split('_'),
                          comment: value.描述,
                          gyNameId: this.value.gyNameId,
                          gyObjId: this.nameSelectValue,
                          msgType: this.text,
                          dchg: 'F'
                        })
                        const jydata = jy(this.tableNameSelectOptions, listc[listc.length - 1].tableNamejx)
                        if (!jydata) {
                          listc[listc.length - 1].tableName = ''
                          listc[listc.length - 1].tableNamejx = ''
                        }
                      }
                    }
                  }
                }
              })
              // console.log('listu',listu)
              // console.log('listc',listc)
              // return;
              // console.log(111)
              if (listc.length !== 0) {
                mqttgyycyxBatchSave(listc).then(response => {
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
                mqttgyycyxBatchUpdate(listu).then(response => {
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
        function jy(xhdata, [...val]) {
          for (const j in xhdata) {
            if (xhdata[j].children) {
              if (xhdata[j].value === val[0]) {
                val.shift()
                return jy(xhdata[j].children, val)
                break
              }
            } else {
              if (xhdata[j].value === val[0]) {
                return true
                break
              }
              if (j == xhdata.length - 1) {
                xhdata.push({
                  value: val[0]
                })
                return true
                break
              }
            }
          }
          return false
        }
      }
      // 6.使用reader对象以二进制读取文件对象f，
      reader.readAsBinaryString(f)
    },
    // 导出excle
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        mqttgyycyxList({ limit: '1', ...this.xztj }).then(response => {
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
          mqttgyycyxList({ limit: response.page.totalCount.toString(), ...this.xztj }).then(response => {
            if (response.code === 0) {
              const list = response.page.list.map((item, index) => { item.index = index + Number(this.switchValue); return item })
              const tHeader = ['畅洋点序号', '协议名称', '字节类型', '数据库名称', '表名称', '描述']
              const filterVal = ['pid', 'pidType', 'dataType', 'databaseName', 'tableName', 'comment']
              const data = this.formatJson(filterVal, list)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: `${this.text}-list`
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
</style>
