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
      <el-table-column label="所属规约名称" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gyNameId | selectOptionFilter(xmSelectOptionsDia) }}</span>
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

      <el-table-column label="操作" width="60">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonView" @click="$router.push({path:'/protocolConfig/zt',query:{gyid:row.gyNameId+row.gyObjId,xyid:row.pidType}})">
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

    <dialogzt v-model="dialogztvalue" :abc.sync="innerdialogFormVisibleBit" />
  </div>
</template>

<script>
import { mqttgybitZtList } from '@/api/mqtt/gybitZt'
import { mqttgyCreatorInfoList } from '@/api/mqtt/gyCreatorInfo'
import { selectOptionFilter } from '@/filters'
import dialogzt from './dialogzt'

export default {
  components: { dialogzt },
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
      xmSelectOptionsDia: [],
      dialogztvalue: {},
      innerdialogFormVisibleBit: false
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
        gyNameId: this.xmId.slice(0, 4),
        gyObjId: this.xmId.slice(4, 7)
      }
      mqttgybitZtList(data).then(response => {
        if (response.code === 0) {
          data.limit = response.page.totalCount.toString()
          mqttgybitZtList(data).then(response => {
            if (response.code === 0) {
              // this.currentPage = response.page.currPage
              // this.pageSize = response.page.pageSize
              // this.total = response.page.totalCount
              // this.totalPage = response.page.totalPage
              // this.list = response.page.list
              const list = response.page.list
              const snId = []; const register = []; const list1 = []
              for (const j in list) {
                if (!(snId.includes(list[j].gyNameId) && register.includes(list[j].pidType))) {
                  snId.push(list[j].gyNameId)
                  register.push(list[j].pidType)
                  list1.push(list[j])
                }
              }
              this.total = list1.length
              this.totalPage = Math.ceil(this.total / this.pageSize)
              this.list = list1.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
            }
          })
        }
      })
    },
    getSelectOptionsDia() {
      mqttgyCreatorInfoList({}).then(response => {
        mqttgyCreatorInfoList({ limit: response.page.totalCount.toString() }).then(
          response => {
            if (response.code === 0) {
              const res = response.page.list
              this.xmSelectOptionsDia = res.map(item => {
                return { value: item.gyNameId.toString(), label: item.gyName }
              })
            }
          }
        )
      })
    },
    BITClick(row) {
      this.dialogztvalue = row
      this.innerdialogFormVisibleBit = true
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
