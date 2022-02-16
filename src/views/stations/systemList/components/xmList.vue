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
      <el-table-column label="序号" width="50" type="index" :index="(currentPage-1)*pageSize+1" />
      <el-table-column label="项目甲方" min-width="120" prop="partyname" show-overflow-tooltip />
      <el-table-column label="项目名称" min-width="100" prop="name" show-overflow-tooltip />
      <el-table-column label="项目地区" min-width="110" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.areaname | selectOptionFilter(areaSelectOptionsDia) }}({{ row.areaname }})</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="甲方联系方式" min-width="150" prop="utel" show-overflow-tooltip /> -->
      <!-- <el-table-column label="甲方邮箱地址" min-width="150" prop="uemail" show-overflow-tooltip /> -->
      <el-table-column label="项目注册时间" min-width="150" prop="intime" show-overflow-tooltip />
      <!-- <el-table-column label="经纬度" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>({{ scope.row.x }},{{ scope.row.y }})</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="60">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonView" @click="$router.push({path:'/stations/projectInfo',query:{projectId:row.id}})">
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
import { mqttprojectInfoList } from '@/api/mqtt/projectInfo'
import { selectOptionFilter } from '@/filters'

export default {
  props: ['ptId'],
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

      countrySelectValue: '',
      countrySelectOptions: '',
      provinceSelectValue: '',
      provinceSelectOptions: '',
      nameSelectOptionsDia: [
        { value: '001', label: '光伏' },
        { value: '002', label: '微电网' },
        { value: '003', label: '水电' },
        { value: '004', label: '储能' },
        { value: '005', label: '风电' },
        { value: '020', label: '测光塔（自动气象站）' },
        { value: '021', label: '测风塔' }
      ],
      areaSelectOptionsDia: [
        { value: '0011', label: '北京市' },
        { value: '0012', label: '天津市' },
        { value: '0013', label: '河北省' },
        { value: '0014', label: '山西省' },
        { value: '0015', label: '内蒙古' },
        { value: '0021', label: '辽宁省' },
        { value: '0022', label: '吉林省' },
        { value: '0023', label: '黑龙江' },
        { value: '0031', label: '上海市' },
        { value: '0032', label: '江苏省' },
        { value: '0033', label: '浙江省' },
        { value: '0034', label: '安徽省' },
        { value: '0035', label: '福建省' },
        { value: '0036', label: '江西省' },
        { value: '0037', label: '山东省' },
        { value: '0041', label: '河南省' },
        { value: '0042', label: '湖北省' },
        { value: '0043', label: '湖南省' },
        { value: '0044', label: '广东省' },
        { value: '0045', label: '广西' },
        { value: '0046', label: '海南省' },
        { value: '0050', label: '重庆市' },
        { value: '0051', label: '四川省' },
        { value: '0052', label: '贵州省' },
        { value: '0053', label: '云南省' },
        { value: '0054', label: '西藏' },
        { value: '0061', label: '陕西省' },
        { value: '0062', label: '甘肃' },
        { value: '0063', label: '青海' },
        { value: '0064', label: '宁夏' },
        { value: '0065', label: '新疆' }
      ],
      projectSelectOptionsDia: [],
      protocolSelectOptionsDia: [],
      dbnameSelectOptionsDia: [
        { value: '01', label: '全站' },
        { value: '02', label: '子站' }
      ],
      IdSelectOptionsDia: [
        { value: 1, label: 'GD0' },
        { value: 2, label: 'PSK0' },
        { value: 3, label: 'T1' }
      ]
    }
  },
  watch: {
    ptId(val) {
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
        softwareId: this.ptId
      }
      mqttprojectInfoList(data).then(response => {
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

