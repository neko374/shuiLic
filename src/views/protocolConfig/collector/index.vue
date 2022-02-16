<template>
  <div class="app-container">
    <div class="filter-container">

      <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
        <div style="float:left">
          <el-form-item>
            <el-select
              v-model="cjqSelectValue"
              filterable
              clearable
              default-first-option
              style="width:200px;"
              placeholder="采集器SNID"
            >
              <el-option
                v-for="item in cjqSelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <!-- <div style="float:left">
          <el-form-item>
            <el-select
              v-model="provinceSelectValue"
              filterable
              clearable
              placeholder="所属项目"
            >
              <el-option
                v-for="item in projectSelectOptionsDia"
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
              v-model="gySelectValue"
              filterable
              clearable
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
        </div>
        <div style="float:left">
          <el-button class="TablePageButtonSearch" size="mini" icon="el-icon-search" @click="handleFilter">
            {{ $t('table.search') }}
          </el-button>
          <el-button class="TablePageButtonAdd" size="mini" icon="el-icon-edit" @click="handleCreate">
            新增
          </el-button>
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
      <el-table-column label="序号" width="50" type="index" :index="(currentPage-1)*pageSize+1" />
      <el-table-column label="采集器名称" min-width="120" prop="name" show-overflow-tooltip />
      <el-table-column label="采集器SNID" min-width="180" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.snId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采集器对象ID" min-width="120" prop="collectorId" show-overflow-tooltip />
      <el-table-column label="网络模块" min-width="80" prop="netMode" show-overflow-tooltip />
      <el-table-column label="规约方式" min-width="80" show-overflow-tooltip >
        <template slot-scope="{row}">
          <span>{{ row.masterSwitch==1?'小规约':'基础规约' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属项目" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="color:blue;cursor:pointer;" @click="$router.push({path:'/stations/projectInfo',query:{projectId:row.projectId}})">{{ row.projectId | selectOptionFilter(projectSelectOptionsDia) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联遥测遥信名称" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gyNameObjId | selectOptionFilter(protocolSelectOptionsDia) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采集器型号" min-width="90" prop="aipowerProjectCollectorDeviceInfoEntity.type" show-overflow-tooltip />
      <el-table-column label="采集器品牌" min-width="90" prop="aipowerProjectCollectorDeviceInfoEntity.brand" show-overflow-tooltip />
      <el-table-column label="采集器厂家名称" min-width="120" prop="aipowerProjectCollectorDeviceInfoEntity.factoryName" show-overflow-tooltip />
      <el-table-column label="厂家联系方式" min-width="100" prop="aipowerProjectCollectorDeviceInfoEntity.tel" show-overflow-tooltip />

      <el-table-column label="操作" width="190">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonEdit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" class="TableButtonDelete" @click="handleDelete(row)">
            删除
          </el-button>
          <el-button size="mini" style="backgroundColor:rgb(0,207,200);color:white;" @click="viewObject(row)">
            规约
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

    <el-dialog v-if="dialogStatus==='create'||dialogStatus==='update'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="140px">
        <el-form-item label="采集器名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" style="width:185px;" />
        </el-form-item>
        <el-form-item label="采集器对象ID" prop="collectorId">
          <el-select
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
          </el-select>
        </el-form-item>
        <el-form-item label="网络模块" prop="netMode">
          <el-input v-model="temp[dialogStatus].netMode" style="width:185px;" />
        </el-form-item>
        <el-form-item label="所属项目" prop="projectId">
          <el-select
            v-model="temp[dialogStatus].projectId"
            filterable
            placeholder="所属项目"
          >
            <el-option
              v-for="item in projectSelectOptionsDia"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        <el-form-item label="采集器型号" prop="name">
          <el-input v-model="temp[dialogStatus].aipowerProjectCollectorDeviceInfoEntity.type" style="width:185px;" />
        </el-form-item>
        <el-form-item label="采集器品牌" prop="name">
          <el-input v-model="temp[dialogStatus].aipowerProjectCollectorDeviceInfoEntity.brand" style="width:185px;" />
        </el-form-item>
        <el-form-item label="采集器厂家名称" prop="name">
          <el-input v-model="temp[dialogStatus].aipowerProjectCollectorDeviceInfoEntity.factoryName" style="width:185px;" />
        </el-form-item>
        <el-form-item label="厂家联系方式" prop="name">
          <el-input v-model="temp[dialogStatus].aipowerProjectCollectorDeviceInfoEntity.tel" style="width:185px;" />
        </el-form-item>
        <el-form-item label="是否启用小规约" prop="masterSwitch">
          <el-switch
            v-model="temp[dialogStatus].masterSwitch"
            active-text="启用小规约"
            inactive-text="不启用小规约"
            :active-value="1"
            :inactive-value="0"
            >
          </el-switch>
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

    <el-dialog :title="objDialogText" :visible.sync="objDialogFormVisible" width="88%" height="90%" class="objectDialog">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="遥测" name="first">
          <ycInfo :xm-id="objDialogxmId" />
        </el-tab-pane>
        <el-tab-pane label="遥信" name="second">
          <yxInfo :xm-id="objDialogxmId" />
        </el-tab-pane>
        <el-tab-pane label="遥调遥控" name="third">
          <ytykInfo :xm-id="objDialogText" />
        </el-tab-pane>
        <el-tab-pane label="状态量" name="fourth">
          <ztInfo :xm-id="objDialogxmId" />
        </el-tab-pane>
        <el-tab-pane label="告警量" name="firth">
          <alarmInfo :xm-id="objDialogxmId" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <div style="width:100%;height:50px" />
  </div>
</template>

<script>
import { mqttprojectCollectorList, mqttprojectCollectorSave, mqttprojectCollectorUpdate, mqttprojectCollectorDelete } from '@/api/mqtt/projectCollector'
import { mqttprojectInfoList, mqttprojectInfoInfo } from '@/api/mqtt/projectInfo'
import { mqttgysnInfoList } from '@/api/mqtt/gysnInfo'
import { selectOptionFilter } from '@/filters'
import ycInfo from './components/ycInfo'
import yxInfo from './components/yxInfo'
import ytykInfo from './components/ytykInfo'
import ztInfo from './components/ztInfo'
import alarmInfo from './components/alarmInfo'

export default {
  components: { ycInfo, yxInfo, ytykInfo, ztInfo, alarmInfo },
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
      rules: {},
      InitOptiList: true,
      temp: {
        create: {
          aipowerProjectCollectorDeviceInfoEntity:{}
        },
        update: {},
        view: {}
      },
      activeName: 'first',

      countrySelectValue: '',
      countrySelectOptions: '',
      provinceSelectValue: '',
      provinceSelectOptions: '',
      cjqSelectValue: '',
      cjqSelectOptions: '',
      gySelectValue: '',
      gySelectOptions: '',
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
      },
      projectSelectOptionsDia: [],
      protocolSelectOptionsDia: [],
      IdSelectOptionsDia: [
        { value: 1, label: 'GD0' },
        { value: 2, label: 'PSK0' },
        { value: 3, label: 'T1' }
      ],
      objDialogFormVisible: false,
      objDialogxmId: '',
      objDialogText: ''
    }
  },
  async created() {
    if (this.$route.query.objectId !== undefined) {
      this.cjqSelectValue = this.$route.query.objectId
    }
    const projectId = (await this.$store.dispatch('project/defaultProjectSGet')).id
    if (projectId) this.provinceSelectValue = projectId + ''
	  this.getList()
	  this.getItemList()
  },
  methods: {
    getList() {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString()
      }
      if (this.cjqSelectValue !== '') {
        data.snId = this.cjqSelectValue
      }
      if (this.provinceSelectValue !== '') {
        data.projectId = this.provinceSelectValue
      }
      if (this.gySelectValue !== '') {
        data.gyNameId = this.gySelectValue.slice(0, 4)
        data.gyObjId = this.gySelectValue.slice(4, 7)
      }
      mqttprojectCollectorList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = response.page.list.map(item => { item.gyNameObjId = item.gyNameId + item.gyObjId; return item })
          this.list = this.list.map(v=>({...v}))
        }
      })
      if (this.InitOptiList) {
        mqttprojectCollectorList({}).then(response => {
          if (response.code === 0) {
            const data1 = { limit: response.page.totalCount.toString() }
            mqttprojectCollectorList(data1).then(response => {
              if (response.code === 0) {
                this.getSelectOptions(response.page.list, 'cjqSelectOptions', 'snId', 'snId')
                this.getSelectOptions(response.page.list, 'provinceSelectOptions', 'projectId', 'projectId')
                this.getSelectOptions(response.page.list, 'gySelectOptions', 'gyNameId', 'gyNameId')
                this.InitOptiList = false
              }
            })
          }
        })
      }
    },
    // 项目item
    getItemList() {
      mqttprojectInfoList({}).then(response => {
        mqttprojectInfoList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.projectSelectOptionsDia = []
            for (const i in res) {
              this.projectSelectOptionsDia.push({ value: res[i].id.toString(), label: res[i].name })
            }
          }
        })
      })
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
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    handleFilter() {
      this.currentPage = 1
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp.update = _.cloneDeep(row)
      if(!this.temp.update.aipowerProjectCollectorDeviceInfoEntity)
        this.temp.update.aipowerProjectCollectorDeviceInfoEntity={
          type:'',
          brand:'',
          factoryName:'',
          tel:''
        }
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
    viewObject(row) {
      this.objDialogFormVisible = true
      this.objDialogxmId = row.gyNameObjId
      this.objDialogText = row.snId
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该采集器对象, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = [row.id]
        mqttprojectCollectorDelete(data).then(response => {
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
          mqttgysnInfoList({ gyNameId: data.gyNameId, gyObjId: data.gyObjId }).then(response => {
            if (response.code === 0) {
              const res = response.page.list[0]
              data.snId = [res.gyObjId, res.gyAreaId, res.gyNameId, res.gyStationId, data.collectorId]
              data.snId = data.snId.join('_')
              mqttprojectCollectorSave(data).then(response => {
                if (response.code === 0) {
                  this.dialogFormVisible = false
                  this.InitOptiList = true
                  this.temp.create = {
                    aipowerProjectCollectorDeviceInfoEntity:{}
                  }
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
    },
    updateData({ ...data }) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          for (const j in this.protocolSelectOptionsDia) {
            if (this.protocolSelectOptionsDia[j].value == data.gyNameObjId) {
              data.gyNameId = this.protocolSelectOptionsDia[j].gyNameId
              data.gyObjId = this.protocolSelectOptionsDia[j].gyObjId
              break
            }
          }
          mqttgysnInfoList({ gyNameId: data.gyNameId, gyObjId: data.gyObjId }).then(response => {
            if (response.code === 0) {
              const res = response.page.list[0]
              data.snId = [res.gyObjId, res.gyAreaId, res.gyNameId, res.gyStationId, data.collectorId]
              data.snId = data.snId.join('_')
              mqttprojectCollectorUpdate(data).then(response => {
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

<style lang="scss" scoped>
.objectDialog{
  /deep/{
  .el-dialog__header{
    text-align:center;
  }
  .el-dialog__title{
    font-size:30px;
    color:#4cb1d6;
  }
  }
}
</style>
