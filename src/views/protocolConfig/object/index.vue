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
              default-first-option
              placeholder="对象类型"
              style="width:120px;"
            >
              <el-option
                v-for="item in nameSelectOptionsDia"
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
      <el-table-column label="规约名称" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gyName }}({{ row.gyNameId }})</span>
        </template>
      </el-table-column>
      <el-table-column label="对象类型" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gyObjId | selectOptionFilter(nameSelectOptionsDia) }}({{ row.gyObjId }})</span>
        </template>
      </el-table-column>
      <el-table-column label="对象地区" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gyAreaId | selectOptionFilter(areaSelectOptionsDia) }}({{ row.gyAreaId }})</span>
        </template>
      </el-table-column>
      <el-table-column label="全站/子站" min-width="90" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gyStationId=='01'?'全站':'子站' }}({{ row.gyStationId }})</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonEdit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" class="TableButtonDelete" @click="handleDelete(row)">
            删除
          </el-button>
          <!-- <el-button size="mini" style="backgroundColor:rgb(0,207,200);color:white;" @click="viewObject(row)">
            规约
          </el-button> -->
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
        <!-- <el-form-item label="规约名称" prop="gyNameId">
          <el-select
            v-model="temp[dialogStatus].gyNameId"
            filterable
            placeholder="规约名称"
          >
            <el-option
              v-for="item in protocolSelectOptionsDia"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="规约ID" prop="gyNameId">
          <el-input v-model="temp[dialogStatus].gyNameId" :disabled="dialogStatus!='create'" />
        </el-form-item>
        <el-form-item label="对象类型" prop="gyObjId">
          <el-select
            v-model="temp[dialogStatus].gyObjId"
            filterable
            placeholder="对象类型"
            :disabled="dialogStatus!='create'"
          >
            <el-option
              v-for="item in nameSelectOptionsDia"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规约名称" prop="gyName">
          <el-input v-model="temp[dialogStatus].gyName" />
        </el-form-item>
        <el-form-item label="对象地区" prop="gyAreaId">
          <el-select
            v-model="temp[dialogStatus].gyAreaId"
            filterable
            placeholder="对象地区"
          >
            <el-option
              v-for="item in areaSelectOptionsDia"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="全站/子站" prop="gyStationId">
          <el-select
            v-model="temp[dialogStatus].gyStationId"
            filterable
            placeholder="全站/子站"
          >
            <el-option
              v-for="item in stationSelectOptionsDia"
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

    <div style="width:100%;height:50px" />
  </div>
</template>

<script>
import { mqttgysnInfoList, mqttgysnInfoSave, mqttgysnInfoUpdate, mqttgysnInfoDelete } from '@/api/mqtt/gysnInfo'
import { mqttprojectInfoList, mqttprojectInfoInfo } from '@/api/mqtt/projectInfo'
import { mqttgyCreatorInfoList } from '@/api/mqtt/gyCreatorInfo'
import { mqttgysnAreaList } from '@/api/mqtt/gysnArea'
import { mqttgysnObjList } from '@/api/mqtt/gysnObj'
import { mqttgysnStationList } from '@/api/mqtt/gysnStation'
import { selectOptionFilter } from '@/filters'

export default {
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
        create: {},
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
      gySelectOptionsDia: [],
      rules: {
        gyNameId: [{ required: true, message: '规约ID不能为空', trriger: ['blur', 'change'] }],
        gyName: [{ required: true, message: '规约名称不能为空', trriger: ['blur', 'change'] }],
        gyObjId: [{ required: true, message: '对象类型不能为空', trriger: ['blur', 'change'] }],
        gyAreaId: [{ required: true, message: '对象地区不能为空', trriger: ['blur', 'change'] }],
        gyStationId: [{ required: true, message: '不能为空', trriger: ['blur', 'change'] }]
      },
      nameSelectOptionsDia: [],
      areaSelectOptionsDia: [],
      projectSelectOptionsDia: [],
      protocolSelectOptionsDia: [],
      stationSelectOptionsDia: [],
      IdSelectOptionsDia: [
        { value: 1, label: 'GD0' },
        { value: 2, label: 'PSK0' },
        { value: 3, label: 'T1' }
      ],
      objDialogFormVisible: false,
      objDialogxmId: '',
      objDialogText: '',
      gyareaSelectValue:'',
      gyNameIdSelectValue:''
    }
  },
  async created() {
    if (this.$route.query.gyObjId !== undefined) {
      this.countrySelectValue = Number(this.$route.query.gyObjId)
    }
    if (this.$route.query.gyNameId !== undefined) {
      this.gyNameIdSelectValue = Number(this.$route.query.gyNameId)
    }
    const project = await this.$store.dispatch('project/defaultProjectSGet')
    if (project) this.gyareaSelectValue = project.areaname
	  this.getList()
	  this.getSelectOptionsList()
  },
  methods: {
    getList() {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString()
      }
      if (this.countrySelectValue !== '') {
        data.gyObjId = this.countrySelectValue
      }
      if (this.gyNameIdSelectValue !== '') {
        data.gyNameId = this.gyNameIdSelectValue
      }
      if (this.gyareaSelectValue !== '') {
        data.gyAreaId = this.gyareaSelectValue
      }
      mqttgysnInfoList(data).then(response => {
        if (response.code === 0) {
          this.currentPage = response.page.currPage
          this.pageSize = response.page.pageSize
          this.total = response.page.totalCount
          this.totalPage = response.page.totalPage
          this.list = response.page.list
        }
      })
      if (this.InitOptiList) {
        mqttgysnInfoList({}).then(response => {
          if (response.code === 0) {
            const data1 = { limit: response.page.totalCount.toString() }
            mqttgysnInfoList(data1).then(response => {
              if (response.code === 0) {
                // this.getSelectOptions(response.page.list, 'cjqSelectOptions', 'id', 'snid')
                // this.getSelectOptions(response.page.list, 'provinceSelectOptions', 'refSystemid', 'systemName')
                // this.getSelectOptions(response.page.list, 'gySelectOptions', 'refSystemProtocalid', 'systemProtocalName')
                this.InitOptiList = false
              }
            })
          }
        })
      }
    },
    // 项目item
    getSelectOptionsList() {
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
      mqttgyCreatorInfoList({}).then(response => {
        mqttgyCreatorInfoList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.protocolSelectOptionsDia = []
            for (const i in res) {
              this.protocolSelectOptionsDia.push({ value: res[i].gyNameId.toString(), label: res[i].gyName, gyObjId: res[i].gyObjId })
            }
          }
        })
      })
      mqttgysnAreaList({}).then(response => {
        mqttgysnAreaList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.areaSelectOptionsDia = []
            for (const i in res) {
              this.areaSelectOptionsDia.push({ value: res[i].gyAreaId, label: res[i].gyAreaName })
            }
          }
        })
      })
      mqttgysnObjList({}).then(response => {
        mqttgysnObjList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.nameSelectOptionsDia = []
            for (const i in res) {
              this.nameSelectOptionsDia.push({ value: res[i].gyObjId, label: res[i].gyObjName })
            }
          }
        })
      })
      mqttgysnStationList({}).then(response => {
        mqttgysnStationList({ limit: response.page.totalCount.toString() }).then(response => {
          if (response.code === 0) {
            const res = response.page.list
            this.stationSelectOptionsDia = []
            for (const i in res) {
              this.stationSelectOptionsDia.push({ value: res[i].gyStationId, label: res[i].gyStationName })
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
      this.temp.update = row
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
      this.objDialogxmId = row.refSystemProtocalid
      this.objDialogText = row.snid
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该采集器对象, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = [row.id]
        mqttgysnInfoDelete(data).then(response => {
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
          // for(let j in this.protocolSelectOptionsDia) {
          //   if(this.protocolSelectOptionsDia[j].value == data.gyNameId) {
          //     data.gyName = this.protocolSelectOptionsDia[j].label
          //     data.gyObjId = this.protocolSelectOptionsDia[j].gyObjId
          //     break;
          //   }
          // }
          mqttgysnInfoList({ gyNameId: data.gyNameId, gyObjId: data.gyObjId }).then(response => {
            if (response.page.list.length == 0) {
              mqttgysnInfoSave(data).then(response => {
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
        }
      })
    },
    updateData({ ...data }) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // for(let j in this.protocolSelectOptionsDia) {
          //   if(this.protocolSelectOptionsDia[j].value == data.gyNameId) {
          //     data.gyName = this.protocolSelectOptionsDia[j].label
          //     data.gyObjId = this.protocolSelectOptionsDia[j].gyObjId
          //     break;
          //   }
          // }
          mqttgysnInfoUpdate(data).then(response => {
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
    handleSizeChange() {
      this.getList()
    },
    handleCurrentChange() {
      this.getList()
    }
  }
}
</script>

