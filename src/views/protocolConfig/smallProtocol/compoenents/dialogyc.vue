<template>
  <div>
    <el-dialog :title="textMap[text] + '('+value.name+')'" :visible.sync="dialogFormVisible" width="88%" height="90%" class="ycdialog">
      <div slot="title">
        <!-- <span class="title">{{ textMap[text] }}</span> -->
        <span class="name">{{ value.gyName }}</span>
      </div>
      <!-- <el-select
        style="float:left;"
        v-model="gyNameSelectValue"
        filterable
        clearable
        placeholder="协议名称"
        @change="getList"
      >
        <el-option
          v-for="item in gyNameSelectOptionsDia"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        style="float:left;"
        v-model="gyCommentSelectValue"
        filterable
        clearable
        placeholder="规约描述"
        @change="getList"
      >
        <el-option
          v-for="item in gycommentSelectOptionsDia"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->
      <el-button type="primary" @click="xmWzGy" style="float:right;">项目完整规约</el-button>
      <el-form ref="ycForm" class="powerDiaTable" status-icon size="mini" inline-message :model="ycformmodel">
        <el-table
          v-loading="listLoading"
          :data="listx"
          max-height="500"
          border
          fit
          size="mini"
        >
          <el-table-column label="项目规约ID" min-width="80">
            <template slot-scope="{row}">
              <span>{{ row.masterGyNameId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="对象名称" min-width="80">
            <template slot-scope="{row}">
              <span>{{ row.masterGyObjId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="基础规约ID" min-width="90">
            <template slot-scope="{row}">
              <span>{{ row.slaveGyNameId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="基础规约对象名称" min-width="120">
            <template slot-scope="{row}">
              <span>{{ row.slaveGyObjId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规约顺序" min-width="80">
            <template slot-scope="{row}">
              <span>{{ row.slaveGyIndex }}</span>
            </template>
          </el-table-column>
          <el-table-column label="基础规约规约起始PID" min-width="140">
            <template slot-scope="{row}">
              <span>{{ row.slaveGyStartPid }}</span>
            </template>
          </el-table-column>
          <el-table-column label="基础规约结束PID" min-width="120">
            <template slot-scope="{row}">
              <span>{{ row.slaveGyEndPid }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" min-width="180">
            <template slot-scope="{row}">
              <span>{{ row.comment }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" :width="130">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="updateYcInfoDialog(scope.row)">编辑</el-button>
              <el-button v-if="(scope.$index+(currentPagex-1)*pageSizex) == (totalx - 1)" class="TableButtonDelete" size="mini" @click="ycdelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="currentPagex"
          :page-size.sync="pageSizex"
          :total="totalx"
          background
          :page-sizes="[10, 20,50,100]"
          layout="total, sizes, prev, pager, next, jumper"
          popper-class="PaginationPageSize"
          class="TablePagination"
          @size-change="handleSizeChangex"
          @current-change="handleCurrentChangex"
        />
      </el-form>

    <el-dialog append-to-body title="项目完整规约" :visible.sync="dialogFormVisibleXmGy" width="88%" height="90%" class="ycdialog">
      <el-form ref="ycForm" class="powerDiaTable" status-icon size="mini" inline-message :model="ycformmodelXmGy">
        <el-table
          v-loading="listLoading"
          :data="list"
          max-height="400"
          border
          fit
          size="mini"
        >
          <!-- <el-table-column label="畅洋点序号(PID)" width="120" prop="pid" /> -->
          <!-- <el-table-column label="序号" width="50" type="index" :index="(currentPage-1)*pageSize+1" /> -->
          <el-table-column label="序号">
            <template slot-scope="{row}">
              <span>{{ row.xgyPidIndex }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规约PID">
            <template slot-scope="{row}">
              <span>{{ row.xgyPidType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="从规约NAMEID">
            <template slot-scope="{row}">
              <span>{{ row.gyNameId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="从规约对象ID">
            <template slot-scope="{row}">
              <span>{{ row.gyObjId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="从规约PID">
            <template slot-scope="{row}">
              <span>{{ row.pidType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="字节类型">
            <template slot-scope="{row}">
              <span>{{ row.dataType }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="数据库名称">
            <template slot-scope="{row}">
              <span>{{ row.databaseName }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="表名称">
            <template slot-scope="{row}">
              <span>{{ row.tableName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="{row}">
              <span>{{ row.comment }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" :width="130">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="updateYcInfoDialog(scope.row)">编辑</el-button>
              <el-button v-if="(scope.$index+(currentPage-1)*pageSize) == (total - 1)" class="TableButtonDelete" size="mini" @click="ycdelete(scope.row,(scope.$index+(currentPage-1)*pageSize))">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :total="total"
          background
          :page-sizes="[10, 20,50,100]"
          layout="total"
          popper-class="PaginationPageSize"
          class="TablePagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-form>
    </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addYcInfoDialog">新增</el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="500px"
      :title="ycaddtextMap[ycdialogstatus]"
      :visible.sync="innerdialogFormYcInfo"
      style="padding-top:5%!important;"
      append-to-body
    >
      <el-form ref="ycaddform" size="mini" :rules="rules" :model="ycaddform[ycdialogstatus]" label-position="left" label-width="130px">
        <!-- <el-form-item label="采集点序号(PID)" prop="pid">
          <el-input v-model.number="ycaddform[ycdialogstatus].pid" />
        </el-form-item> -->
        <el-form-item label="基础规约选择" prop="xgySelectValue">
          <el-select
            style="float:left;"
            v-model="ycaddform[ycdialogstatus].xgySelectValue"
            filterable
            placeholder="基础规约选择"
            @change="xgySelectOptions"
          >
            <el-option
              v-for="item in gymapSelectOptionsDia"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="基础规约PID选择" prop="checkedXgy">
          <!-- <el-input v-model.number="ycaddform[ycdialogstatus].pidType11" /> -->
          <el-checkbox-group style="max-height:200px;overflow:auto;" v-model="ycaddform[ycdialogstatus].checkedXgy" @change="handleCheckedXgyChange">
            <el-checkbox style="width:calc(100% - 40px);" v-for="city in xgyCheckBox" :label="city.pid" :key="city.id">{{city.pidType+'('+city.comment+')'}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="起始采集点" prop="pidType1">
          <el-input v-model.number="ycaddform[ycdialogstatus].pidType1" />
        </el-form-item>
        <el-form-item label="结束采集点" prop="pidType2">
          <el-input v-model.number="ycaddform[ycdialogstatus].pidType2" />
        </el-form-item> -->
        <!-- <el-form-item label="规约顺序" prop="slaveGyIndex">
          <el-input v-model.number="ycaddform[ycdialogstatus].slaveGyIndex" />
        </el-form-item> -->
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
  </div>
</template>

<script>
import XLSX from 'xlsx'
import { mqttgyycyxList, mqttgyycyxSave, mqttgyycyxUpdate, mqttgyycyxDelete } from '@/api/mqtt/gyycyx'
import { mqttProjectGyMapList, mqttProjectGyMapSave, mqttProjectGyMapUpdate, mqttProjectGyMapDelete, mqttProjectGyMapComList } from '@/api/mqtt/aipowerprojectgymap'
import { mqtthisdbNameList } from '@/api/mqtt/hisdbName'
import { mqttgysnInfoList } from '@/api/mqtt/gysnInfo'

export default {
  props: {
    text: String,
    value: Object,
    abc: Boolean
  },
  data() {
    return {
      list:null,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      total: 0,
      listx:null,
      currentPagex: 1,
      pageSizex: 10,
      totalPagex: 0,
      totalx: 0,
      dialogFormVisible: this.abc,
      lastIndex: -1,
      ycformmodel: {},
      valueTypeSelectoptions: [{ value: 'double' }, { value: 'int' }],
      gymapSelectOptionsDia: [
        {value:'001',label:'光伏'},
        {value:'00401',label:'PCS'},
        {value:'00402',label:'BMS'},
        {value:'00501',label:'风机变流器'},
        {value:'006',label:'柴发'},
        {value:'00701',label:'电表'},
        {value:'00702',label:'AMC数采'},
        {value:'00703',label:'开关模块'},
        {value:'00803',label:'空调'},
        {value:'00704',label:'保护'},
        {value:'00801',label:'交流AC-MGCC'},
        {value:'00802',label:'直流DC-MGCC'},
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
        create: {
          checkedXgy:[]
        },
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
      InitOptiList: true,
      nameSelectValue: '',
      rules: {
        // pidType: [{ required: true, message: '不能为空', trriger: 'blur' }],
        // dataType: [{ required: true, message: '不能为空', trriger: 'blur' }],
        // databaseName: [{ required: true, message: '不能为空', trriger: 'blur' }],
        // // tableName:[{required:true,message:'不能为空',trriger:'blur'}],
        // comment: [{ required: true, message: '不能为空', trriger: 'blur' }],
        // pid: [{ type: 'number', message: '必须为整数', trriger: ['blur', 'change'] }, { required: true, message: '不能为空', trriger: ['blur', 'change'], type: 'number' }]
      },
      fileData: '',
      xztj: {
        msgType: this.text,
        gyNameId: this.value.gyNameId
      },
      gyTypeSelectValue:'',
      gyTypeSelectOptionsDia:[
        {value:'yc',label:'遥测量'},
        {value:'zt',label:'状态量'},
        {value:'gz',label:'故障量'},
      ],
      gyCommentSelectValue:'',
      gycommentSelectOptionsDia:[],
      gyNameSelectValue:'',
      gyNameSelectOptionsDia:[],
      checkedXgy:[],
      xgyCheckBox:[],
      dialogFormVisibleXmGy:false,
      ycformmodelXmGy: {}
    }
  },
  watch: {
    value: {
      handler(val) {
        this.xztj.gyNameId = val.gyNameId
        this.nameSelectValue = val.gyObjId
        this.getListx()
        this.selectOptions()
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
    this.getListx()
    this.selectOptions()
  },
  methods: {
    getListx() {
      const data = {
        limit: this.pageSizex.toString(),
        page: this.currentPagex.toString(),
        masterGyNameId: this.value.gyNameId
      }
      if (this.nameSelectValue !== '') {
        data.masterGyObjId = this.nameSelectValue
      }
      if (this.gyCommentSelectValue !== '') {
        data.comment = this.gyCommentSelectValue
      }
      if (this.gyNameSelectValue !== '') {
        data.pidType = this.gyNameSelectValue
      }
      // console.log(data)
      mqttProjectGyMapList(data).then(response => {
        if (response.code === 0) {
          // this.currentPagex = response.page.currPage
          // this.pageSizex = response.page.pageSize
          this.totalx = response.page.totalCount
          this.totalPagex = response.page.totalPage
          this.listx = response.page.list
          // const data1 = {
          //   limit: response.page.totalCount.toString(),
          //   page: '1',
          //   gyNameId: this.value.gyNameId,
          //   gyObjId: this.value.gyObjId
          // }
          // mqttgyycyxList(data1).then(response => {
          //   console.log(response)
          //   if (response.page.list.length != 0) { this.lastIndex = response.page.list[response.page.list.length - 1].slaveGyIndex } else { this.lastIndex = -1 }
          // })
        }
      }).catch(()=>{
        this.listx = []
      })
    },
    getList() {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString(),
        masterGyNameId: this.value.gyNameId,
        masterGyObjId: this.value.gyObjId
      }
      mqttProjectGyMapComList(data).then(response => {
        if (response.code === 0) {
          // this.currentPage = response.page.currPage
          // this.pageSize = response.page.pageSize
          // this.total = response.page.totalCount
          // this.totalPage = response.page.totalPage
          this.list = response.aipowerMqttGyYcyxs.map((v,i)=>({
            ...v,xgyPidIndex:i,xgyPidType:v.pidType.substring(0,2)+i
          }))
          this.total = this.list.length
          this.pageSize = this.total
        }
      }).catch(()=>{
        this.list = []
      })
    },
    xmWzGy() {
      this.getList()
      this.dialogFormVisibleXmGy = true
    },
    handleCheckedXgyChange(val) {
      let checkedXgy = []
      if(val.length==2&&this.ycaddform[this.ycdialogstatus].checkedXgyLsh.length<2) {
        for(let i = Math.min(...val);i<=Math.max(...val);i++) {
          checkedXgy.push(i)
        }
      } else if(val.length>2||(val.length==2&&this.ycaddform[this.ycdialogstatus].checkedXgyLsh.length>2)) {
        let a = this.ycaddform[this.ycdialogstatus].checkedXgy
        let b = this.ycaddform[this.ycdialogstatus].checkedXgyLsh
        checkedXgy = a.concat(b).filter(v => (a.includes(v) && !b.includes(v))||(!a.includes(v) && b.includes(v)))
      } else {
        checkedXgy = val
      }
      this.ycaddform[this.ycdialogstatus].checkedXgy = checkedXgy
      this.ycaddform[this.ycdialogstatus].checkedXgyLsh = checkedXgy
    },
    selectOptions() {
      const data = {
        msgType: this.text,
        gyNameId: this.value.gyNameId,
        gyObjId:this.value.gyObjId
      }
      mqttgyycyxList(data).then(response=>{
        if(response.code===0) {
          data.limit = response.page.totalCount+''
          mqttgyycyxList(data).then(response=>{
            if(response.code===0) {
              const res = response.page.list
              this.gycommentSelectOptionsDia = res.reduce((pre,v)=>{
                let resd={value:v.comment,label:v.comment}
                const sbg=pre.find(l=>l.label==resd.label)
                if(!sbg)
                  pre.push(resd)
                return pre
              },[])
              this.gyNameSelectOptionsDia = res.reduce((pre,v)=>{
                let resd={value:v.pidType,label:v.pidType}
                const sbg=pre.find(l=>l.label==resd.label)
                if(!sbg)
                  pre.push(resd)
                return pre
              },[])
            }
          })
        }
      })
    },
    xgySelectOptions(val) {
      const data = {
        gyNameId: '0001',
        gyObjId:val
      }
      mqttgyycyxList(data).then(response=>{
        if(response.code===0) {
          data.limit = response.page.totalCount+''
          mqttgyycyxList(data).then(response=>{
            if(response.code===0) {
              const res = response.page.list
              this.xgyCheckBox = res
              this.ycaddform[this.ycdialogstatus].checkedXgy = []
            }
          })
        }
      })
    },
    xgySelectOptionsx(val) {
      const data = {
        gyNameId: '0001',
        gyObjId:val
      }
      mqttgyycyxList(data).then(response=>{
        if(response.code===0) {
          data.limit = response.page.totalCount+''
          mqttgyycyxList(data).then(response=>{
            if(response.code===0) {
              const res = response.page.list
              this.xgyCheckBox = res
            }
          })
        }
      })
    },
    handler() {
    },
    handleSizeChange() {
      this.getList()
    },
    handleCurrentChange() {
      this.getList()
    },
    handleSizeChangex() {
      this.getListx()
    },
    handleCurrentChangex() {
      this.getListx()
    },
    addYcInfoDialog() {
      if(!this.ycaddform.create.xgySelectValue) {
        this.ycaddform.create.xgySelectValue = '001'
        this.xgySelectOptions(this.ycaddform.create.xgySelectValue)
      }
      this.innerdialogFormYcInfo = true
      this.ycdialogstatus = 'create'
      this.$nextTick(() => {
        this.$refs['ycaddform'].clearValidate()
      })
    },
    updateYcInfoDialog({ ...row }) {
      let checkedXgy = []
      for(let i = row.slaveGyStartPid;i<=row.slaveGyEndPid;i++) {
        checkedXgy.push(i)
      }
      this.ycaddform.update = {
        ...row,
        xgySelectValue:row.slaveGyObjId,
        checkedXgy:checkedXgy,
        checkedXgyLsh:checkedXgy
      }
      this.xgySelectOptionsx(this.ycaddform.update.xgySelectValue)
      this.innerdialogFormYcInfo = true
      this.ycdialogstatus = 'update'
      this.$nextTick(() => {
        this.$refs['ycaddform'].clearValidate()
      })
    },
    addYcInfoForm({ ...data }) {
      this.$refs['ycaddform'].validate((valid) => {
        if (valid) {
          data.masterGyNameId = this.value.gyNameId
          data.masterGyObjId = this.value.gyObjId
          data.slaveGyNameId = '0001'
          data.slaveGyObjId = data.xgySelectValue
          data.slaveGyStartPid = Math.min(...data.checkedXgy)
          data.slaveGyEndPid = Math.max(...data.checkedXgy)
          data.slaveGyIndex = this.totalx + 1
          delete data.xgySelectValue
          delete data.checkedXgy
          delete data.checkedXgyLsh
          // console.log(data);return;
          mqttProjectGyMapSave(data).then(response => {
            if (response.code === 0) {
              this.innerdialogFormYcInfo = false
              this.InitOptiList = true
              this.ycaddform.create = {
                checkedXgy:[],
                checkedXgyLsh:[]
              }
              this.currentPagex = Math.ceil(((this.totalx + 1) / this.pageSizex))
              this.getListx()
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
          data.slaveGyNameId = '0001'
          data.slaveGyObjId = data.xgySelectValue
          data.slaveGyStartPid = Math.min(...data.checkedXgy)
          data.slaveGyEndPid = Math.max(...data.checkedXgy)
          delete data.xgySelectValue
          delete data.checkedXgy
          delete data.checkedXgyLsh
          // console.log(data);return;
          mqttProjectGyMapUpdate(data).then(response => {
            if (response.code === 0) {
              this.innerdialogFormYcInfo = false
              this.InitOptiList = true
              this.getListx()
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
    ycdelete(row) {
      this.$confirm('此操作将永久删除该规约, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = [row.id]
        mqttProjectGyMapDelete(data).then(response => {
          if (response.code === 0) {
            this.InitOptiList = true
            this.currentPage = Math.min(this.currentPage, Math.ceil(((this.total - 1) / this.pageSize)))
            this.getListx()
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
