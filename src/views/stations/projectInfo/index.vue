<template>
  <div class="app-container">
    <div class="filter-container">

      <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
        <div style="float:left">
          <el-form-item>
            <el-select
              v-model="countrySelectValue"
              filterable
              clearable
              placeholder="项目名称"
            >
              <el-option
                v-for="item in countrySelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div style="float:left">
          <el-form-item>
            <el-select
              v-model="provinceSelectValue"
              filterable
              clearable
              placeholder="项目地区"
            >
              <el-option
                v-for="item in areaSelectOptionsDia"
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
            {{ $t('table.add') }}
          </el-button>
        </div>

        <div style="float:right;">
          默认项目：{{ $store.state.project.defaultProject?$store.state.project.defaultProject.name:'无' }}
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
      <el-table-column fixed :label="$t('table.id')" width="50" type="index" :index="(currentPage-1)*pageSize+1" />
      <el-table-column label="项目类型" min-width="70" prop="type" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.type | selectOptionFilter(proType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" width="100" prop="name" show-overflow-tooltip />

      <el-table-column label="所属平台" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.softwareId | selectOptionFilter(hostSelectOptionsDia) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="前端数据绑定" width="120">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonView" @click="xssjbd(row)">
            显示数据绑定
          </el-button>
        </template>
      </el-table-column> -->
      <el-table-column label="采集器列表" width="90">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonView" @click="viewObject(row)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="部署包" width="90">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonView" @click="bsbView(row)">
            下载
          </el-button>
        </template>
      </el-table-column> -->

      <el-table-column label="项目甲方" min-width="120" prop="partyname" show-overflow-tooltip />
      <el-table-column label="项目地区" min-width="110" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.areaname | selectOptionFilter(areaSelectOptionsDia) }}({{ row.areaname }})</span>
        </template>
      </el-table-column>
      <el-table-column label="甲方联系方式" min-width="150" prop="utel" show-overflow-tooltip />
      <el-table-column label="甲方邮箱地址" min-width="150" prop="uemail" show-overflow-tooltip />
      <el-table-column label="项目注册时间" min-width="150" prop="intime" show-overflow-tooltip />
      <el-table-column label="经纬度" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>({{ scope.row.x }},{{ scope.row.y }})</span>
        </template>
      </el-table-column>
      <el-table-column label="所属用户" min-width="110" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.refUserid | selectOptionFilter(userSelectOptionsDia) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否默认" min-width="110" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag :type="['info','success'][row.isDefault]">
            {{ ['不默认','默认'][row.isDefault] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="130">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonEdit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" class="TableButtonDelete" @click="handleDelete(row)">
            删除
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
        <el-form-item label="项目甲方" prop="partyname">
          <el-input v-model="temp[dialogStatus].partyname" />
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
        </el-form-item>
        <el-form-item label="项目地区" prop="areaname">
          <el-select
            v-model="temp[dialogStatus].areaname"
            filterable

            placeholder="项目地区"
          >
            <el-option
              v-for="item in areaSelectOptionsDia"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="甲方联系方式" prop="utel">
          <el-input v-model="temp[dialogStatus].utel" />
        </el-form-item>
        <el-form-item label="甲方邮箱地址" prop="uemail">
          <el-input v-model="temp[dialogStatus].uemail" />
        </el-form-item>
        <el-form-item label="增加时间" prop="intime">
          <el-date-picker
            v-model="temp[dialogStatus].intime"
            type="date"
            :clearable="false"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="项目类型" prop="type">
          <el-select
            v-model="temp[dialogStatus].type"
            filterable
            placeholder="项目类型"
          >
            <el-option
              v-for="item in proType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属平台" prop="softwareId">
          <el-select
            v-model="temp[dialogStatus].softwareId"
            filterable
            placeholder="所属平台"
          >
            <el-option
              v-for="item in hostSelectOptionsDia"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="经度" prop="x">
          <el-input v-model="temp[dialogStatus].x" />
        </el-form-item>
        <el-form-item label="纬度" prop="y">
          <el-input v-model="temp[dialogStatus].y" />
        </el-form-item>
        <el-form-item label="所属用户" prop="refUserid">
          <el-select
            v-model="temp[dialogStatus].refUserid"
            filterable
            placeholder="所属用户"
          >
            <el-option
              v-for="item in userSelectOptionsDia"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否默认" prop="isDefault">
          <el-radio v-model="temp[dialogStatus].isDefault" :label="1">默认</el-radio>
          <el-radio v-model="temp[dialogStatus].isDefault" :label="0">不默认</el-radio>
        </el-form-item>
        <!-- <el-form-item label="描述" prop="textarea">
          <el-input
            v-model="temp[dialogStatus].textarea"
            type="textarea"
            autosize
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData(temp.create):updateData(temp.update)">
          确认
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="dialogStatus==='bsb'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr1">
      <bsbFileDown :xm-id="bsbId" />
    </el-dialog>

    <el-dialog :title="objDialogText" :visible.sync="objDialogFormVisible" width="88%" height="90%" class="objectDialog">
      <object1 :xm-id="objDialogxmId" />
    </el-dialog>

    <div style="width:100%;height:50px" />
  </div>
</template>

<script>
import { validateuemail } from '@/utils/validate'
import { mqttprojectInfoList, mqttprojectInfoSave, mqttprojectInfoUpdate, mqttprojectInfoDelete } from '@/api/mqtt/projectInfo'
import { mqttsoftwareInfoList, mqttDownloadFile, mqttGetDownloadFiles } from '@/api/mqtt/softwareInfo'
import { mqttgysnAreaList } from '@/api/mqtt/gysnArea'
import { UserManagementGetList } from '@/api/UserManagement'
import { selectOptionFilter } from '@/filters'
import object1 from './components/object'
import bsbFileDown from './components/bsbFileDown'

export default {
  components: { object1, bsbFileDown },
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
        view: '查看',
        bsb: '文件下载'
      },
      rules: {
        partyname: [{ required: true, message: '项目甲方不能为空', trriger: 'blur' }],
        name: [{ required: true, message: '项目名称不能为空', trriger: 'blur' }],
        areaname: [{ required: true, message: '项目地区不能为空', trriger: ['blur', 'change'] }],
        utel: [{ required: true, message: '项目联系方式不能为空', trriger: 'blur' }],
        softwareId: [{ required: true, message: '不能为空', trriger: 'blur' }],
        uemail: [{ required: true, validator: validateuemail, trigger: 'blur' }],
        intime: [{ required: true, message: '增加时间不能为空', trriger: ['blur', 'change'] }],
        refHostid: [{ required: true, message: '不能为空', trriger: ['blur', 'change'], type: 'number' }],
        x: [{ required: true, message: '经度不能为空', trriger: 'blur' }],
        y: [{ required: true, message: '纬度不能为空', trriger: 'blur' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      temp: {
        create: {},
        update: {},
        view: {},
        bsb: {}
      },
      InitOptiList: true,

      countrySelectValue: '',
      countrySelectOptions: '',
      provinceSelectValue: '',
      provinceSelectOptions: '',
      hostSelectOptionsDia: [],
      proType: [
        { value: 0, label: '光伏' },
        { value: 1, label: '储能' },
        { value: 2, label: '微网' },
        { value: 3, label: '水电' }
      ],
      areaSelectOptionsDia: [],
      userSelectOptionsDia: [],
      objDialogFormVisible: false,
      objDialogxmId: '',
      objDialogText: '',
      bsbId: ''
    }
  },
  async created() {
    if (this.$route.query.projectId !== undefined) {
      this.countrySelectValue = Number(this.$route.query.projectId)
    }
    const projectId = (await this.$store.dispatch('project/defaultProjectSGet')).id
    if (projectId) this.countrySelectValue = projectId
    this.getList()
    this.getDiaSelect()
  },
  methods: {
    getList() {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString()
      }
      if (this.countrySelectValue !== '') {
        data.id = this.countrySelectValue
      }
      if (this.provinceSelectValue !== '') {
        data.areaname = this.provinceSelectValue
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
      if (this.InitOptiList) {
        mqttprojectInfoList({}).then(response => {
          if (response.code === 0) {
            const data1 = { limit: response.page.totalCount.toString() }
            mqttprojectInfoList(data1).then(response => {
              if (response.code === 0) {
                this.getSelectOptions(response.page.list, 'countrySelectOptions', 'id', 'name')
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
          pre.push({ value: cur[valueName], label: cur[labelName], text: cur[labelName] })
        }
        return pre
      }, [])
    },
    getDiaSelect() {
      mqttsoftwareInfoList({}).then(response => {
        if (response.code === 0) {
          mqttsoftwareInfoList({ limit: response.page.totalCount.toString() }).then(response => {
            if (response.code === 0) {
              const res = response.page.list
              this.hostSelectOptionsDia = res.map(item => ({ value: item.id.toString(), label: item.name }))
            }
          })
        }
      })
      mqttgysnAreaList({}).then(response => {
        if (response.code === 0) {
          mqttgysnAreaList({ limit: response.page.totalCount.toString() }).then(response => {
            if (response.code === 0) {
              const res = response.page.list
              this.areaSelectOptionsDia = res.map(item => ({ value: item.gyAreaId, label: item.gyAreaName }))
            }
          })
        }
      })
      UserManagementGetList({}).then(response => {
        if (response.code === 0) {
          UserManagementGetList({ limit: response.page.totalCount.toString() }).then(response => {
            if (response.code === 0) {
              const res = response.page.list
              // console.log(res)
              this.userSelectOptionsDia = res.map(item => ({ value: item.userId, label: item.username }))
            }
          })
        }
      })
    },
    viewObject(row) {
      this.objDialogFormVisible = true
      this.objDialogxmId = row.id
      this.objDialogText = row.name
    },
    handleCreate() {
      this.getDiaSelect()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.getDiaSelect()
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
    bsbView(row) {
      this.dialogStatus = 'bsb'
      this.dialogFormVisible = true
      this.bsbId = row.softwareId
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = [row.id]
        mqttprojectInfoDelete(data).then(response => {
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
          mqttprojectInfoSave(data).then(response => {
            if (response.code === 0) {
              this.dialogFormVisible = false
              this.InitOptiList = true
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
    },
    updateData({ ...data }) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          mqttprojectInfoUpdate(data).then(response => {
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
    },
    xssjbd(val) {
      this.$router.push({ path: '/valueManage/equipManage', query: { projectId: val.id }})
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
  .el-dialog__title,.title{
    font-size:30px;
    color:#4cb1d6;
  }
  }
}

</style>
