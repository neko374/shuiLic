<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
      size="mini"
    >
      <el-table-column label="畅洋点序号(PID)" width="120" prop="pid" />
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
      :page-sizes="[5, 10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      popper-class="PaginationPageSize"
      class="TablePagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { mqttgyycyxList } from '@/api/mqtt/gyycyx'
import { selectOptionFilter } from '@/filters'

export default {
  props: ['xmId'],
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
      textMap: {
        update: '编辑',
        create: '创建',
        view: '查看'
      },
      InitOptiList: true,
      temp: {
        create: {},
        update: {},
        view: {}
      }
    }
  },
  watch: {
    xmId(val) {
      this.currentPage = 1
      this.getList()
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
        gyNameId: this.xmId.slice(0, 4),
        gyObjId: this.xmId.slice(4, 7),
        msgType: 'yx'
      }
      mqttgyycyxList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = response.page.list
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

