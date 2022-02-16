<template>
  <div>
    <el-button size="mini" class="TablePageButtonAdd" style="float:right;" @click="handleCreate">
      添加
    </el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
      size="mini"
    >
      <el-table-column label="序号" width="50" type="index" :index="(currentPage-1)*pageSize+1" />
      <el-table-column label="采集器规约SNID" min-width="180" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.snId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联规约ID" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gyNameId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="60">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonView" @click="$router.push({path:'/protocolConfig/collector',query:{objectId:row.snId}})">
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

    <el-dialog v-if="dialogStatus==='create'||dialogStatus==='update'" append-to-body :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="140px">
        <el-form-item label="采集器对象ID" prop="collectorId">
          <el-input v-model="temp[dialogStatus].collectorId" style="width:178px;" />
          <!-- <el-select
            v-model="temp[dialogStatus].collectorId"
            filterable
            allow-create
            placeholder="采集器对象ID"
          >
            <el-option
              v-for="item in IdSelectOptionsDia"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="网络模块" prop="netMode">
          <el-input v-model="temp[dialogStatus].netMode" style="width:178px;" />
        </el-form-item>
        <el-form-item label="关联规约" prop="gyNameObjId">
          <el-select
            v-model="temp[dialogStatus].gyNameObjId"
            filterable
            placeholder="关联规约"
          >
            <el-option
              v-for="item in protocolSelectOptionsDia"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="采集器状态" prop="state">
          <el-select
            v-model="temp[dialogStatus].state"
            filterable
            placeholder="采集器状态"
          >
            <el-option
              v-for="item in [{value:0,label:'不可用'},{value:1,label:'可用'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData(temp[dialogStatus]):updateData(temp[dialogStatus])">
          确认
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mqttprojectCollectorList, mqttprojectCollectorSave } from '@/api/mqtt/projectCollector'
import { selectOptionFilter } from '@/filters'
import { mqttgysnInfoList } from '@/api/mqtt/gysnInfo'

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
        { value: '11', label: '北京市' },
        { value: '12', label: '天津市' },
        { value: '13', label: '河北省' },
        { value: '14', label: '山西省' },
        { value: '15', label: '内蒙古' },
        { value: '21', label: '辽宁省' },
        { value: '22', label: '吉林省' },
        { value: '23', label: '黑龙江' },
        { value: '31', label: '上海市' },
        { value: '32', label: '江苏省' },
        { value: '33', label: '浙江省' },
        { value: '34', label: '安徽省' },
        { value: '35', label: '福建省' },
        { value: '36', label: '江西省' },
        { value: '37', label: '山东省' },
        { value: '41', label: '河南省' },
        { value: '42', label: '湖北省' },
        { value: '43', label: '湖南省' },
        { value: '44', label: '广东省' },
        { value: '45', label: '广西' },
        { value: '46', label: '海南省' },
        { value: '50', label: '重庆市' },
        { value: '51', label: '四川省' },
        { value: '52', label: '贵州省' },
        { value: '53', label: '云南省' },
        { value: '54', label: '西藏' },
        { value: '61', label: '陕西省' },
        { value: '62', label: '甘肃' },
        { value: '63', label: '青海' },
        { value: '64', label: '宁夏' },
        { value: '65', label: '新疆' }
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
      ],
      rules: {
        collectorId: [{ required: true, message: '不能为空', trriger: ['blur', 'change'] }],
        projectId: [{ required: true, message: '不能为空', trriger: ['blur', 'change'] }],
        gyNameObjId: [{ required: true, message: '不能为空', trriger: ['blur', 'change'] }],
        netMode: [{ required: true, message: '不能为空', trriger: ['blur', 'change'] }],
        dbname: [{ required: true, message: '不能为空', trriger: ['blur', 'change'] }],
        projId: [{ required: true, message: '报文类型不能为空', trriger: 'blur' }],
        poolName: [{ required: true, message: '报文类型名称不能为空', trriger: 'blur' }],
        objName: [{ required: true, message: '采集器对象ID不能为空' }],
        protocolname: [{ required: true, message: '规约负责人不能为空', trriger: 'blur' }],
        state: [{ required: true, message: '不能为空', trriger: 'blur', type: 'number' }]
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
    this.getItemList()
  },
  methods: {
    getList() {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString(),
        projectId: this.xmId
      }
      mqttprojectCollectorList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = response.page.list
        }
      })
    },
    getItemList() {
      mqttgysnInfoList({}).then(response => {
        mqttgysnInfoList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.protocolSelectOptionsDia = []
            for (const i in res) {
              this.protocolSelectOptionsDia.push({ value: res[i].gyNameId + res[i].gyObjId, label: res[i].gyName, gyObjId: res[i].gyObjId, gyNameId: res[i].gyNameId })
            }
          }
        })
      })
    },
    handleSizeChange() {
      this.getList()
    },
    handleCurrentChange() {
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData({ ...data }) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          for (const j in this.protocolSelectOptionsDia) {
            if (this.protocolSelectOptionsDia[j].value == data.gyNameObjId) {
              data.gyNameId = this.protocolSelectOptionsDia[j].gyNameId
              data.gyObjId = this.protocolSelectOptionsDia[j].gyObjId
              break
            }
          }
          data.projectId = this.xmId
          mqttgysnInfoList({ gyNameId: data.gyNameId, gyObjId: data.gyObjId }).then(response => {
            if (response.code === 0) {
              const res = response.page.list[0]
              data.snId = [res.gyObjId, res.gyAreaId, res.gyNameId, res.gyStationId, data.collectorId]
              data.snId = data.snId.join('_')
              mqttprojectCollectorSave(data).then(response => {
                if (response.code === 0) {
                  this.dialogFormVisible = false
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
            }
          })
        }
      })
    }
  }
}
</script>

