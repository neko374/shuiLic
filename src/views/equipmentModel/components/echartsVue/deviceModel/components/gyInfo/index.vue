<template>
  <div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="88%" height="90%" class="ycdialog">
      <!-- <div slot="title">
        <span class="name">{{ value.gyName }}</span>
      </div> -->
      <el-select
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
      </el-select>
      <!-- <el-button v-waves style="float:right;margin-left:10px;" :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button> -->
      <el-form ref="ycForm" class="powerDiaTable" status-icon size="mini" inline-message :model="ycformmodel">
        <el-table
          v-loading="listLoading"
          :data="list"
          max-height="500"
          border
          fit
          size="mini"
        >
          <el-table-column label="畅洋点序号(PID)" width="120" prop="pid" />
          <el-table-column label="规约ID">
            <template slot-scope="{row}">
              <span>{{ row.gyNameId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="对象类型">
            <template slot-scope="{row}">
              <span>{{ row.gyObjId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="协议名称">
            <template slot-scope="{row}">
              <span>{{ row.pidType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="字节类型">
            <template slot-scope="{row}">
              <span>{{ row.dataType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数据库名称">
            <template slot-scope="{row}">
              <span>{{ row.databaseName }}</span>
            </template>
          </el-table-column>
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
    </el-dialog>
  </div>
</template>

<script>
import { mqttgyycyxList, mqttgyycyxSave, mqttgyycyxUpdate, mqttgyycyxDelete, mqttgyycyxBatchSave, mqttgyycyxBatchUpdate } from '@/api/mqtt/gyycyx'
import { selectOptionFilter } from '@/filters'

export default {
  props: {
    data: {
      type: String,
      default: ''
    },
    abc:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      total: 0,
      list:[],
      listLoading:false,
      dialogFormVisible: false,
      dialogStatus: 'view',
      textMap: {
        update: '编辑',
        create: '创建',
        view: '规约查看'
      },
      temp: {
        create: {},
        update: {},
        view: {}
      },
      ycformmodel: {},
      rules: {},
      gyCommentSelectValue:'',
      gycommentSelectOptionsDia:[],
      gyNameSelectValue:'',
      gyNameSelectOptionsDia:[]
    }
  },
  watch:{
    data:{
      handler(val) {
        this.getList()
        this.getItemList()
      },
      deep:true
    },
    abc(val) {
      if(val) {
        this.dialogFormVisible = val
      }
    },
    dialogFormVisible(val) {
      this.$emit('update:abc',val)
    }
  },
  // created() {
  //   this.getItemList()
  // },
  methods: {
    getList() {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString(),
        gyNameId: this.data.split('_')[2],
        gyObjId: this.data.split('_')[0]
      }
      if (this.nameSelectValue !== '') {
        data.gyObjId = this.nameSelectValue
      }
      if (this.gyCommentSelectValue !== '') {
        data.comment = this.gyCommentSelectValue
      }
      if (this.gyNameSelectValue !== '') {
        data.pidType = this.gyNameSelectValue
      }
      mqttgyycyxList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          let list = response.page.list
          this.list = list
        }
      })
    },
    getItemList() {
      const data = {
        gyNameId: this.data.split('_')[2],
        gyObjId: this.data.split('_')[0]
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
    handler() {
      this.getList()
    },
    handleSizeChange() {
      this.handler()
    },
    handleCurrentChange() {
      this.handler()
    },
  }
}
</script>

<style lang="scss">
  .powerDiaTable .el-form-item--mini.el-form-item {
    margin-bottom:0;
  }
  .ycdialog .el-dialog__header{
    text-align:center;
  }
  .ycdialog .el-dialog__title{
    font-size:30px;
    color:#4cb1d6;
  }
</style>