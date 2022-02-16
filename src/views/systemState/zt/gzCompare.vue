<template>
  <div>
    <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
      <div style="float:left">
        <el-form-item label="开始时间" style="margin-bottom: 2px;">
          <el-date-picker
            ref="datepicker"
            v-model="date[0]"
            class="sjzsksj"
            style="width:180px;"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:05:00"
            size="mini"
            :clearable="false"
            :picker-options="pickerOptionsstart"
            placeholder="开始时间"
          />
        </el-form-item>
        <el-form-item label="结束时间" style="margin-bottom: 2px">
          <el-date-picker
            ref="datepicker1"
            v-model="date[1]"
            class="sjzsksj"
            style="width:180px;"
            size="mini"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            :clearable="false"
            :picker-options="pickerOptionsend"
            placeholder="结束时间"
          />
        </el-form-item>
      </div>
      <div style="float:left">
        <el-button class="TablePageButtonSearch" size="mini" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button
          size="mini"
          type="primary"
          class="el-icon-download"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          @click="handleDownloadDialog"
        >导出</el-button>
      </div>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      max-height="500"
      border
      fit
      style="width: 100%;"
      v-el-table-lazy="tableLoadMore"
      size="mini"
      @filter-change="filterChange"
    >
      <!-- <el-table-column label="序号" width="70" type="index" :index="(currentPage-1)*pageSize+1" /> -->
      <el-table-column prop="inTime" label="状态切换时间" min-width="150" show-overflow-tooltip />
      <el-table-column prop="snId" label="SNID" min-width="180" show-overflow-tooltip />
      <!-- <el-table-column prop="type" label="所属设备" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.type | selectOptionFilter(deviceSelectList) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="type" label="数据点" min-width="80" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="数据点含义" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.type | xsPidType(pidTypeComment) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="v1" label="状态值" min-width="70" show-overflow-tooltip />
      <el-table-column prop="gzstate" label="设备状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gzstate }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-if="dialogStatus==='download'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="failurediaCr" append-to-body>
      <div slot="title" class="dialog-title" style="text-align:center;">
        <span class="title-text">{{ data.type | xsPidType1(pidTypeComment) }}</span>
      </div>
      <el-form
        ref="dataForm"
        v-loading="downloadLoading"
        element-loading-text="告警数据下载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        status-icon
        :rules="rules"
        :model="temp[dialogStatus]"
        size="mini"
        label-position="left"
        label-width="140px"
      >
        <!-- <div style="margin-bottom: 2px;float:left;margin-right:1em;">
          <span style="font-weight:bold;">开始时间</span>
          <el-date-picker
            ref="datepicker2"
            v-model="temp[dialogStatus].date[0]"
            class="sjzsksj"
            style="width:180px;"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:05:00"
            size="mini"
            :clearable="false"
            :picker-options="pickerOptionsstartq"
            placeholder="开始时间"
          />
        </div>
        <div style="margin-bottom: 2px;float:left;margin-right:1em;">
          <span style="font-weight:bold;">结束时间</span>
          <el-date-picker
            ref="datepicker3"
            v-model="temp[dialogStatus].date[1]"
            class="sjzsksj"
            style="width:180px;"
            size="mini"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            :clearable="false"
            :picker-options="pickerOptionsendq"
            placeholder="结束时间"
          />
        </div> -->
        <el-button
          size="mini"
          type="primary"
          class="el-icon-download"
          style="float:right"
          @click="handleDownload(temp[dialogStatus])"
        >导出</el-button>

        <div style="margin: 15px 0;clear:both;" />
        <el-checkbox v-model="temp[dialogStatus].checkAll" :indeterminate="temp[dialogStatus].isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group
          v-model="temp[dialogStatus].ycyxcur"
          @change="checkChange"
        >
          <el-checkbox v-for="city in temp[dialogStatus].listTabl" :key="city" :label="city" style="width:180px;">{{ city }}</el-checkbox>
        </el-checkbox-group>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getYcePvZtDynamicsList } from '@/api/mqtt/ycepvzt'
import { mqttgyycyxList } from '@/api/mqtt/gyycyx'
import { selectOptionFilter } from '@/filters'

export default {
  filters: {
    xsPidType(val, comments) {
      for (const j in comments) {
        if (comments[j].pidType.slice(2) == val.slice(2)) {
          return comments[j].comment
        }
      }
    },
    xsPidType1(val, comments) {
      let resd = val
      for (const j in comments) {
        if (comments[j].pidType.slice(2) == val.slice(2)) {
          resd = val + '(' + comments[j].comment + ')'
          break
        }
      }
      return resd
    },
    bitTypeComment(val, comments) {
      let resd = val
      if (comments[val]) resd = val + '(' + comments[resd] + ')'
      return resd
    }
  },
  props: {
    data: Object,
    alarmInfoList: Array,
    alarmValInfoList: Array,
    dateP: Array,
    queryBasicInfo:Object
  },
  data() {
    return {
      list: [],
      listAll:[],
      currentPage: 1,
      pageSize: 50,
      totalPage: 0,
      total: 0,
      listLoading: false,
      dialogFormVisible: false,
      innerVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        download: '导出',
        GZView: '查看'
      },
      rules: {
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        snid: [{ required: true, message: 'Id is required', trigger: 'blur' }],
        rated: [{ required: true, message: 'Rated is required', trigger: 'blur' }],
        accessType: [{ required: true, message: 'AccessType is required', trigger: ['blur', 'change'] }]
      },
      temp: {
        create: {},
        update: {},
        download: {
          date: [new Date().format('yyyy-MM-dd 00:05:00'), new Date(Date.now() + 24 * 3600 * 1000).format('yyyy-MM-dd 00:00:00')],
          listTabl: [],
          ycyxcur: [],
          isIndeterminate: false,
          checkAll: true
        }
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      InitOptiList: true,
      pickerOptionsstart: {
        disabledDate: time => {
          return time.getTime() >= new Date(this.date[1].replace(/-/g, '/')).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000
        }
      },
      pickerOptionsend: {
        disabledDate: time => {
          return time.getTime() <= new Date(this.date[0].replace(/-/g, '/')).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000
        }
      },
      pickerOptionsstartq: {
        disabledDate: time => {
          return time.getTime() >= new Date(this.temp.download.date[1].replace(/-/g, '/')).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000
        }
      },
      pickerOptionsendq: {
        disabledDate: time => {
          return time.getTime() <= new Date(this.temp.download.date[0].replace(/-/g, '/')).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000
        }
      },
      date: [new Date().format('yyyy-MM-dd 00:05:00'), new Date(Date.now() + 24 * 3600 * 1000).format('yyyy-MM-dd 00:00:00')],

      userSelectValue: '',
      userSelectOptions: [],
      operateSelectValue: '',
      operateSelectOptions: [],
      countyTableFilter: [],
      ztSelectValue: '',
      ztSelectOptions: [],
      tableFilters: {},
      powerstateSelectOptions: [
        { value: 1, label: '集中式' },
        { value: 2, label: '分布式' }
      ],
      pidTypeComment: [],
      deviceSelectList: [],
      listTbaleHeader: [
        { value: 'inTime', label: '状态切换时间' },
        { value: 'snId', label: 'SNID' },
        { value: 'type', label: '数据点' },
        { value: 'pidTypeName', label: '数据点含义' },
        { value: 'v1', label: '状态值' },
        { value: 'gzstate', label: '设备状态' },
      ],
      downloadLoading: false,
      tableHeader: {}
    }
  },
  watch: {
    'date.0'(val) {
      this.$refs.datepicker.handleClose()
      if ((new Date(this.date[1]).getTime() - new Date(this.date[0]).getTime() > 30 * 24 * 3600 * 1000)) {
        this.date[1] = new Date((new Date(this.date[0]).getTime() + 30 * 24 * 3600 * 1000)).format('yyyy-MM-dd 00:00:00')
      }
    },
    'date.1'(val) {
      this.$refs.datepicker1.handleClose()
      if ((new Date(this.date[1]).getTime() - new Date(this.date[0]).getTime() > 30 * 24 * 3600 * 1000)) {
        this.date[0] = new Date((new Date(this.date[1]).getTime() - 30 * 24 * 3600 * 1000)).format('yyyy-MM-dd 00:00:00')
      }
    },
    'temp.download.date.0'(val) {
      if (!this.$refs.datepicker2) return
      this.$refs.datepicker2.handleClose()
      if ((new Date(this.temp.download.date[1]).getTime() - new Date(this.temp.download.date[0]).getTime() > 30 * 24 * 3600 * 1000)) {
        this.temp.download.date[1] = new Date((new Date(this.temp.download.date[0]).getTime() + 30 * 24 * 3600 * 1000)).format('yyyy-MM-dd HH:mm:ss')
      }
    },
    'temp.download.date.1'(val) {
      if (!this.$refs.datepicker3) return
      this.$refs.datepicker3.handleClose()
      if ((new Date(this.temp.download.date[1]).getTime() - new Date(this.temp.download.date[0]).getTime() > 30 * 24 * 3600 * 1000)) {
        this.temp.download.date[0] = new Date((new Date(this.temp.download.date[1]).getTime() - 30 * 24 * 3600 * 1000)).format('yyyy-MM-dd HH:mm:ss')
      }
    },
    data: {
      handler() {
        this.getListAll()
        this.getOtherList()
      },
      deep: true
    },
    dateP: {
      handler(val) {
        this.date = val
        this.getListAll()
      },
      deep: true
    }
  },
  created() {
    this.date = this.dateP
    this.getListAll()
    this.getOtherList()
  },
  methods: {
    filterChange(row) {
      const key = Object.keys(row)[0]
      // console.log(row,key)
      if (row[key].length === 0) {
        delete this.tableFilters[key]
      } else {
        this.tableFilters[key] = row[key][0]
      }
      this.getListAll()
    },
    // 表格内容
    getListAll() {
      // this.listLoading = true
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString(),
        stime:this.date[0],
        etime:this.date[1],
        orderRule:"desc",
        type: this.data.type,
        ...this.queryBasicInfo,
        ...this.tableFilters
      }
      if (this.ztSelectValue !== '') {
        data.type = this.ztSelectValue
      }
        data.tableName = data.tableName + '_' + new Date(data.etime).format('yyyy')
      getYcePvZtDynamicsList(data).then(response => {
        if (response.code === 0) {
          let list = response.list
          const alarmInfoList =this.alarmInfoList
        const alarmValInfoList =this.alarmValInfoList
        list = list.map(v => {
          const resd = v
          if(v.v1==-99) {
            resd.gzstate = ''
            resd.v1 = ''
            return resd
          }
          resd.gzstate = []
          const abc = alarmInfoList.filter(m => m.pidType == v.type)
          abc.forEach(item => {
            const alarmValA = alarmValInfoList.filter(v => v.refZtId == item.id)
            if(alarmValA.length == 0) {
              // const type = Number((Math.pow(2, item.bit).toString(10)))
              // if ((type & v.v1) != 0) {
              //   resd.gzstate.push('bit' + item.bit + '(' + item.comment + ')')
              // }

              const type = item.bit
              if(type==v.v1) {
                resd.gzstate.push(item.comment)
              }
            } else {
              const type = Number((Math.pow(2, item.bit).toString(10)))
              const typev1 = ((type & v.v1) != 0) ? 1 : 0
              for (const j in alarmValA) {
                if (alarmValA[j].value == typev1) {
                  // resd.gzstate.push('bit' + item.bit + '(' + item.comment + ')')
                  resd.gzstate.push(item.comment + '(' + alarmValA[j].comment + ')')
                }
              }
            }
          })
          if (resd.gzstate.length > 0) { resd.gzstate = resd.gzstate.join(',') } else { resd.gzstate = '' }
          return resd
        })
          this.total = list.length
          this.totalPage = Math.ceil(this.total/this.pageSize)
          this.listAll = list
          this.currentPage = 1
          this.list = []
          this.getList()
          // console.log(this.list)
          this.listLoading = false
        } else {
          this.listLoading = false
        }
      }).catch(() => { this.listLoading = false })
    },
    getList() {
      const data = {
        page:this.currentPage,
        limit:this.pageSize
      }
      let list = _.cloneDeep(this.listAll)
      list = list.slice((data.page-1)*data.limit,data.page*data.limit)
      this.list.push.apply(this.list,list)
    },
    tableLoadMore() {
      if(this.list.length < this.listAll.length) {
        this.currentPage++
        this.getList()
      }
    },
    getOtherList() {
      const data = {
        gyNameId: '0007',
        gyObjId: this.data.snId.split('_')[0]
      }
      mqttgyycyxList(data).then(response => {
        if (response.code === 0) {
          data.limit = response.page.totalCount + ''
          mqttgyycyxList(data).then(response => {
            if (response.code === 0) {
              const res = response.page.list
              this.pidTypeComment = res.map(item => ({ gyNameId: item.gyNameId, gyObjId: item.gyObjId, pidType: item.pidType, comment: item.comment }))
            }
          })
        }
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
    handleFilter() {
      this.InitOptiList = true
      this.getListAll()
    },
    handleDownloadDialog() {
      this.temp.download.date = this.date
      if (this.temp.download.listTabl.length == 0) {
        this.temp.download.listTabl = this.listTbaleHeader.map(v => v.label)
        this.temp.download.ycyxcur = this.temp.download.listTabl
      }
      this.dialogStatus = 'download'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    checkChange(value) {
      this.temp.download.ycyxcur = value
      const checkedCount = value.length
      this.temp.download.checkAll = checkedCount === this.temp.download.listTabl.length
      this.temp.download.isIndeterminate = checkedCount > 0 && checkedCount < this.temp.download.listTabl.length
    },
    handleCheckAllChange(val) {
      if (val) {
        this.temp.download.ycyxcur = this.temp.download.listTabl
      } else {
        this.temp.download.ycyxcur = []
      }
      this.temp.download.isIndeterminate = false
    },
    // 导出excle
    handleDownload({ ...row }) {
      this.downloadLoading = true
      setTimeout(() => {
        const data = {
          stime:this.temp.download.date[0],
          etime:this.temp.download.date[1],
          orderRule:"asc",
          type: this.data.type,
          ...this.queryBasicInfo
        }
        data.tableName = data.tableName + '_' + new Date(data.etime).format('yyyy')
        getYcePvZtDynamicsList(data).then(response => {
          if (response.code === 0) {
            import('@/vendor/Export2Excel').then(excel => {
              let list = response.list.map(item => {
                let pidTypeName = ''
                for (const j in this.pidTypeComment) {
                  if (this.pidTypeComment[j].pidType.slice(2) == item.type.slice(2)) {
                    pidTypeName = this.pidTypeComment[j].comment
                  }
                }
                return { ...item, pidTypeName: pidTypeName }
              })
              const the = {}
              list = list.map(v => {
                const resd = v
                if(v.v1==-99) {
                  resd.gzstate = ''
                  resd.v1 = ''
                  return resd
                }
                resd.gzstate = []
                const abc = this.alarmInfoList.filter(m => m.pidType == v.type)
                abc.forEach(item => {
                  const alarmValA = this.alarmValInfoList.filter(v => v.refZtId == item.id)
                  if(alarmValA.length == 0) {
                    const type = item.bit
                    if(type==v.v1) {
                      resd.gzstate.push(item.comment)
                    }
                  } else {
                    const type = Number((Math.pow(2, item.bit).toString(10)))
                    const typev1 = ((type & v.v1) != 0) ? 1 : 0
                    for (const j in alarmValA) {
                      if (alarmValA[j].value == typev1) {
                        // resd.gzstate.push('bit' + item.bit + '(' + item.comment + ')')
                        resd.gzstate.push(item.comment + '(' + alarmValA[j].comment + ')')
                      }
                    }
                  }
                })
                if (resd.gzstate.length > 0) { resd.gzstate = resd.gzstate.join(',') } else { resd.gzstate = '故障恢复' }
                return resd
              })
              // const tHeader = ['故障时间', 'SNID', '故障点', '故障点含义', '值', (the.bit0 || 'bit0'),
              //   (the.bit1 || 'bit1'), (the.bit2 || 'bit2'), (the.bit3 || 'bit3'), (the.bit4 || 'bit4'), (the.bit5 || 'bit5'),
              //   (the.bit6 || 'bit6'), (the.bit7 || 'bit7'), (the.bit8 || 'bit8'), (the.bit9 || 'bit9'), (the.bit10 || 'bit10'),
              //   (the.bit11 || 'bit11'), (the.bit12 || 'bit12'), (the.bit13 || 'bit13'), (the.bit14 || 'bit14'), (the.bit15 || 'bit15')]
              // const filterVal = ['inTime', 'snId', 'type', 'pidTypeName', 'v1', 'bit0',
              //   'bit1', 'bit2', 'bit3', 'bit4', 'bit5', 'bit6', 'bit7', 'bit8', 'bit9',
              //   'bit10', 'bit11', 'bit12', 'bit13', 'bit14', 'bit15']
              const thfiltV = this.listTbaleHeader.filter(v => this.temp.download.ycyxcur.includes(v.label))
              const tHeader = thfiltV.map(v => {
                if (v.label in the) return the[v.label]
                else return v.label
              })
              const filterVal = thfiltV.map(v => v.value)
              const data = this.formatJson(filterVal, list)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: `zt-list`
              })
              this.downloadLoading = false
            })
          }
        }).catch(() => { this.downloadLoading = false })
      }, 200)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
