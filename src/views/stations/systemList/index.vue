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
              placeholder="系统名称"
              :label-in-value="true"
              @on-change="getItemName"
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
              placeholder="系统状态"
            >
              <el-option
                v-for="item in provinceSelectOptions"
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
            添加
          </el-button>
          <!-- <el-button class="TablePageButtonAdd" size="mini" icon="el-icon-edit" @click="handleCreate">
            添加定制平台
          </el-button>
          <el-button class="TablePageButtonAdd" size="mini" icon="el-icon-edit" @click="handleZuTai">
            添加组态平台
          </el-button> -->
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
      <el-table-column label="系统名称" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开发时间" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开发者" min-width="110" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.devuser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="云端地址" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口号" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否组态工具创建" min-width="150" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <el-button size="mini" class="TableButtonView" @click="zutaiButton(scope.row)">
            <span>{{ scope.row.pageType==1?'定制':'组态' }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="账号信息" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.uname }}/{{ scope.row.upassword }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 0">{{ '正常' }}</el-tag>
          <el-tag v-if="scope.row.state !== 0" type="danger">{{ '异常' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="项目列表" width="90">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonView" @click="viewObject(row)">
            查看
          </el-button>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="130">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonEdit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- <el-button size="mini" class="TableButtonDelete" @click="handleAddBug(row)">
            报BUG
          </el-button>
          <el-button size="mini" class="TableButtonDelete" @click="handleViewBug(row)">
            查BUG
          </el-button>
          <el-button size="mini" class="TableButtonView" @click="handleView(row)">
            查看
          </el-button> -->
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
        <el-form-item label="系统名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
        </el-form-item>
        <el-form-item label="开发时间" prop="time">
          <el-date-picker
            v-model="temp[dialogStatus].time"
            type="date"
            :clearable="false"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="开发者" prop="devuser">
          <el-input v-model="temp[dialogStatus].devuser" />
        </el-form-item>
        <el-form-item label="云端地址" prop="ip">
          <el-input v-model="temp[dialogStatus].ip" />
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="temp[dialogStatus].port" />
        </el-form-item>
        <el-form-item label="用户名" prop="uname">
          <el-input v-model="temp[dialogStatus].uname" />
        </el-form-item>
        <el-form-item label="密码" prop="upassword">
          <el-input v-model="temp[dialogStatus].upassword" />
        </el-form-item>
        <!-- <el-form-item label="所属项目" prop="refSystemid">
          <el-select
            v-model="temp[dialogStatus].refSystemid"
            filterable
            placeholder="所属项目"
            :label-in-value="true"
          >
            <el-option
              v-for="item in projectSelectOptionsDia"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="系统状态" prop="state">
          <el-select
            v-model="temp[dialogStatus].state"
            filterable
            placeholder="系统状态"
            :label-in-value="true"
          >
            <el-option
              v-for="item in provinceSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部署包路径">
          <el-input v-model="temp[dialogStatus].deployPackegePath" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData(temp[dialogStatus]):updateData(temp[dialogStatus])">
          {{ $t('table.confirm') }}
        </el-button>
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="dialogStatus==='zutai'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="140px">
        <el-form-item label="系统名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
        </el-form-item>
        <el-form-item label="开发时间" prop="time">
          <el-date-picker
            v-model="temp[dialogStatus].time"
            type="date"
            :clearable="false"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="开发者" prop="devuser">
          <el-input v-model="temp[dialogStatus].devuser" />
        </el-form-item>
        <el-form-item label="云端地址" prop="ip">
          <el-input v-model="temp[dialogStatus].ip" />
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="temp[dialogStatus].port" />
        </el-form-item>
        <el-form-item label="用户名" prop="uname">
          <el-input v-model="temp[dialogStatus].uname" />
        </el-form-item>
        <el-form-item label="密码" prop="upassword">
          <el-input v-model="temp[dialogStatus].upassword" />
        </el-form-item>
        <!-- <el-form-item label="所属项目" prop="refSystemid">
          <el-select
            v-model="temp[dialogStatus].refSystemid"
            filterable
            placeholder="所属项目"
            :label-in-value="true"
          >
            <el-option
              v-for="item in projectSelectOptionsDia"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="系统状态" prop="state">
          <el-select
            v-model="temp[dialogStatus].state"
            filterable
            placeholder="系统状态"
            :label-in-value="true"
          >
            <el-option
              v-for="item in provinceSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部署包路径">
          <el-input v-model="temp[dialogStatus].deployPackegePath" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createZutaiData(temp[dialogStatus])">
          {{ $t('table.confirm') }}
        </el-button>
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="dialogStatus==='addBug'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="diaTinymce">
      <tinymce />
    </el-dialog>

    <el-dialog v-if="dialogStatus==='viewBug'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr" />

    <el-dialog :title="objDialogText" :visible.sync="objDialogFormVisible" width="88%" height="90%" class="objectDialog">
      <xmList :pt-id="objDialogxmId" />
    </el-dialog>

    <div style="width:100%;height:50px" />
  </div>
</template>

<script>
import tinymce from '@/components/Tinymce'
import { mqttsoftwareInfoList, mqttsoftwareInfoSave, mqttsoftwareInfoUpdate, mqttsoftwareInfoDelete } from '@/api/mqtt/softwareInfo'
import { mqttprojectInfoList } from '@/api/mqtt/projectInfo'
import xmList from './components/xmList'

export default {
  components: {
    tinymce,
    xmList
  },
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      textMap: {
        update: '编辑',
        create: '定制创建',
        view: '查看',
        zutai: '组态创建',
        addBug: '报bug',
        viewBug: '查bug'
      },
      rules: {
        name: [{ required: true, message: '系统名称不能为空', trriger: 'blur' }],
        time: [{ required: true, message: '开发时间不能为空', trriger: ['blur', 'change'] }],
        devuser: [{ required: true, message: '开发者不能为空', trriger: 'blur' }],
        ip: [{ required: true, message: '云端地址不能为空', trriger: 'blur' }],
        port: [{ required: true, message: '端口号不能为空', trriger: 'blur' }],
        clientId: [{ required: true, message: '账号信息不能为空', trriger: 'blur' }],
        state: [{ required: true, message: '系统状态不能为空', trriger: 'blur', type: 'number' }],
        refSystemid: [{ type: 'number', required: true, message: '所属项目不能为空', trriger: ['blur', 'change'] }]
      },
      temp: {
        create: {},
        update: {},
        view: {},
        zutai: {}
      },
      InitOptiList: true,

      countrySelectValue: '',
      countrySelectOptions: '',
      provinceSelectValue: '',
      provinceSelectOptions: [
        { value: 0, label: '正常' },
        { value: 1, label: '异常' }
      ],
      projectSelectOptionsDia: [],
      objDialogFormVisible: false,
      objDialogxmId: '',
      objDialogText: ''
    }
  },
  async created() {
    if (this.$route.query.softwareId !== undefined) {
      this.countrySelectValue = Number(this.$route.query.softwareId)
    }
    const projectId = (await this.$store.dispatch('project/defaultProjectSGet')).softwareId
    if (projectId) this.countrySelectValue = Number(projectId)
    this.getList()
	  this.getItemList()
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
        data.state = this.provinceSelectValue
      }
      mqttsoftwareInfoList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = response.page.list
        }
      })
      if (this.InitOptiList) {
        const data1 = { limit: '1' }
        mqttsoftwareInfoList(data1).then(response => {
          if (response.code === 0) {
            data1.limit = response.page.totalCount + ''
            mqttsoftwareInfoList(data1).then(response => {
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
    // 项目item
    getItemList() {
      mqttprojectInfoList({}).then(response => {
        mqttprojectInfoList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.projectSelectOptionsDia = []
            for (const i in res) {
              this.projectSelectOptionsDia.push({ value: res[i].id, label: res[i].name })
            }
          }
        })
      })
    },
    viewObject(row) {
      this.objDialogFormVisible = true
      this.objDialogxmId = row.id
      this.objDialogText = row.name
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleZuTai() {
      this.dialogStatus = 'zutai'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate({ ...row }) {
      this.temp.update = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleView({ ...row }) {
      this.temp.view = row
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该电站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = [row.id]
        mqttsoftwareInfoDelete(data).then(response => {
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
      // console.log(data)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          data.pageType = 1
          mqttsoftwareInfoSave(data).then(response => {
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
    createZutaiData({ ...data }) {
      // console.log(data)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          data.pageType = 2
          mqttsoftwareInfoSave(data).then(response => {
            if (response.code === 0) {
              this.dialogFormVisible = false
              this.InitOptiList = true
              this.temp.create = {}
              this.currentPage = Math.ceil((this.total + 1) / this.pageSize)
              this.getList()
              this.$notify({
                title: 'Succeed',
                message: '创建成功!',
                type: 'success',
                duration: 2000
              })
              this.$router.push('/zutaimanage')
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
          mqttsoftwareInfoUpdate(data).then(response => {
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
    handleAddBug() {
      this.dialogStatus = 'addBug'
      this.dialogFormVisible = true
    },
    handleViewBug() {
      this.dialogStatus = 'viewBug'
      this.dialogFormVisible = true
    },
    getItemName(val) {
      this.countrySelectValue = val.label
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
    zutaiButton(val) {
      if (val.pageType != 1) {
        this.$router.push({ path: '/zutai/Home', query: { softwareId: val.id }})
      }
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
