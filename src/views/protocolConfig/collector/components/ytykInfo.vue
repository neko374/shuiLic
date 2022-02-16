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
      <el-table-column
        :label="$t('table.id')"
        width="50"
        type="index"
        :index="(currentPage-1)*pageSize+1"
      />
      <el-table-column label="项目" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.modeId | selectOptionFilter(xmSelectOptionsDia) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="采集器" min-width="140" prop="snId" show-overflow-tooltip /> -->
      <el-table-column label="功能" min-width="110" prop="funComment" show-overflow-tooltip />
      <el-table-column label="规约文本" min-width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.modeProtocal }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="60">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonView" @click="$router.push({path:'/ytyk',query:{ytykId:row.id}})">
            查看
          </el-button>
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
import { mqttgyykytList } from '@/api/mqtt/gyykyt'
import { mqttprojectInfoList } from '@/api/mqtt/projectInfo'
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
      },
      xmSelectOptionsDia: []
    }
  },
  watch: {
    xmId(val) {
      this.currentPage = 1
      this.getList()
      this.getSelectOptionsDia()
    }
  },
  created() {
    this.getList()
    this.getSelectOptionsDia()
  },
  methods: {
    getList() {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString(),
        snId: this.xmId
      }
      mqttgyykytList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = response.page.list
        }
      })
    },
    getSelectOptionsDia() {
      mqttprojectInfoList({}).then(response => {
        mqttprojectInfoList({ limit: response.page.totalCount.toString() }).then(
          response => {
            if (response.code === 0) {
              const res = response.page.list
              this.xmSelectOptionsDia = res.map(item => {
                return { value: item.id.toString(), label: item.name }
              })
            }
          }
        )
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

<style ang="scss">
.el-tooltip__popper {
  max-width: 400px;
}
</style>
