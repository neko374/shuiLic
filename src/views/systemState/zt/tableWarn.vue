<template>
  <div style="height:100%;padding:10px;" class="tableWarn">
    <div ref="tabWarn">

      <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
        <el-form-item label="开始时间" style="margin-bottom: 2px;">
          <el-date-picker
            ref="datepicker"
            v-model="date[0]"
            class="sjzsksj"
            style="width:180px;"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
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
        <el-form-item>
          <el-select
            v-model="deviceTypeSelectValue"
            filterable
            placeholder="对象类型"
            :loading="selectLoading"
            style="width:100px"
            @change="selectChangeObj"
          >
            <el-option
              v-for="item in deviceTypeSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="ztSelectValue"
            filterable
            clearable
            placeholder="数据点"
            :loading="selectLoading"
            @change="selectChange"
          >
            <el-option
              v-for="item in ztSelectOptions"
              :key="item.value"
              :label="getztLabel(item.label)"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label | xsPidType(pidTypeComment) }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="deviceSelectValue"
            filterable
            clearable
            placeholder="设备筛选"
            :loading="selectLoading"
            @change="selectChange"
          >
            <el-option
              v-for="item in deviceSelectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="handleFilter">
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
      </el-form>

    </div>

    <el-table
      v-if="tableHeight"
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
      :height="tableHeight"
      size="mini"
      @filter-change="filterChange"
    >
      <!-- <el-table-column label="序号" width="70" type="index" :index="(currentPage-1)*pageSize+1" /> -->
      <el-table-column prop="inTime" label="状态切换时间" min-width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span :style="{color:getgzstatecolor(row.comment)}">{{ row.inTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="snId" label="SNID" min-width="180" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span :style="{color:getgzstatecolor(row.comment)}">{{ row.snId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="farmName" label="所属设备" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span :style="{color:getgzstatecolor(row.comment)}">{{ row.farmName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="数据点" min-width="80" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span :style="{color:getgzstatecolor(row.comment)}">{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="farmProtocolName" label="数据点含义" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span :style="{color:getgzstatecolor(row.comment)}">{{ row.farmProtocolName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="v1" label="状态值" min-width="70" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span :style="{color:getgzstatecolor(row.comment)}">{{ row.v1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="设备状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span :style="{color:getgzstatecolor(row.comment)}">{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="状态内容" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonView" @click="GZView(row)">查看</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="comment" label="状态点查看" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonView" @click="GZCompare(row)">查看</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <el-pagination
      ref="warnPag"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :total="total"
      background
      :page-sizes="[5, 10, 20,50,100]"
      layout="total, sizes, prev, pager, next, jumper"
      popper-class="PaginationPageSize"
      class="TablePagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog v-if="dialogStatus==='download'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="failurediaCr">
      <el-form
        ref="dataForm"
        v-loading="downloadLoading"
        element-loading-text="故障数据下载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        style="padding-bottom:30px;"
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
            default-time="00:00:00"
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

        <div style="margin: 15px 0;clear:both" />
        <el-checkbox v-model="temp[dialogStatus].checkAll" :indeterminate="temp[dialogStatus].isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group
          v-model="temp[dialogStatus].ycyxcur"
          @change="checkChange"
        >
          <el-checkbox v-for="city in temp[dialogStatus].listTabl" :key="city" :label="city" style="width:180px;">{{ city }}</el-checkbox>
        </el-checkbox-group>
      </el-form>

      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDownload(temp[dialogStatus])">
          确认
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div> -->
    </el-dialog>

    <el-dialog v-if="dialogStatus==='GZView'" align="center" :title="temp.GZView.type+'('+temp.GZView.farmProtocolName+')'" :visible.sync="dialogFormVisible" custom-class="operateZt">
      <el-table
        :data="temp.GZView.list"
        border
        fit
        style="width: 100%;"
        size="mini"
      >
        <el-table-column prop="bit" label="bit" min-width="50" show-overflow-tooltip />
        <el-table-column prop="value" label="值" min-width="50" show-overflow-tooltip />
        <el-table-column prop="bitComment" label="bit定义" min-width="100" show-overflow-tooltip />
        <el-table-column prop="valComment" label="状态" min-width="70" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.valComment }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-if="dialogStatus==='GZCompare'" align="center" :title="temp.GZCompare.type+'('+temp.GZCompare.farmProtocolName+')'" :visible.sync="dialogFormVisible" custom-class="operateZt">
      <!-- <div slot="title" class="dialog-title">
        <span class="title-text">{{ temp.GZCompare.type+'('+temp.GZCompare.farmProtocolName+')' }}</span>
      </div> -->
      <gzCompare
        :data="temp.GZCompare"
        :alarm-info-list="alarmInfoList"
        :alarm-val-info-list="alarmValInfoList"
        :date-p="date"
        :query-basic-info="queryBasicInfo"
      />
    </el-dialog>

  </div>
</template>

<script>
import { getYcePvZtDynamics, getYcePvZtDynamicsList } from '@/api/mqtt/ycepvzt'
import { mqttgyycyxList } from '@/api/mqtt/gyycyx'
import { mqttgybitZtList } from '@/api/mqtt/gybitZt'
import { mqttgybitZtvalList } from '@/api/mqtt/gybitZtval'
import { selectOptionFilter } from '@/filters'
import gzCompare from './gzCompare'
import ResizeListener from 'element-resize-detector'

export default {
  components: {
    gzCompare
  },
  filters: {
    xsPidType(val, comments) {
      if (!val) return ''
      for (const j in comments) {
        if (comments[j].pidType.slice(2) == val.slice(2)) {
          return comments[j].comment
        }
      }
    },
    xsPidType1(val, comments) {
      if (!val) return ''
      let resd = val
      for (const j in comments) {
        if (comments[j].pidType.slice(2) == val.slice(2)) {
          resd = val + '(' + comments[j].comment + ')'
          break
        }
      }
      return resd
    },
    gzstate(row, alarmInfoList, alarmValInfoList) {
      if (alarmInfoList != null && alarmValInfoList != null) {
        const resd = {}
        resd.gzstate = []
        const abc = alarmInfoList.filter(m => m.pidType == row.type)
        if (abc.length == 0) resd.gzstate = ['状态量']
        abc.forEach(item => {
          const alarmValA = alarmValInfoList.filter(v => v.refZtId == item.id)
          if (alarmValA.length == 0) {
            const type = Number((Math.pow(2, item.bit).toString(10)))
            if ((type & row.v1) != 0) {
              resd.gzstate.push('bit' + item.bit + '(' + item.comment + ')')
            }
          } else {
            const type = Number((Math.pow(2, item.bit).toString(10)))
            const typev1 = ((type & row.v1) != 0) ? 1 : 0
            for (const j in alarmValA) {
              if (alarmValA[j].value == typev1) {
                if (alarmValA[j].comment == '告警') resd.gzstate.push('bit' + item.bit + '(' + item.comment + ')')
                break
              }
            }
          }
        })
        if (resd.gzstate.length > 0) { resd.gzstate = resd.gzstate.join(',') } else { resd.gzstate = '故障恢复' }
        return resd.gzstate
      }
    }
  },
  data() {
    return {
      list: null,
      listAll: null,
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
          date: [new Date().format('yyyy-MM-dd 00:00:00'), new Date(Date.now() + 24 * 3600 * 1000).format('yyyy-MM-dd 00:00:00')],
          listTabl: [],
          ycyxcur: [],
          isIndeterminate: false,
          checkAll: true
        },
        GZView: {}
      },
      listTbaleHeader: [
        { value: 'inTime', label: '状态切换时间' },
        { value: 'snId', label: 'SNID' },
        { value: 'farmName', label: '所属设备' },
        { value: 'type', label: '状态点' },
        { value: 'farmProtocolName', label: '状态点含义' },
        { value: 'v1', label: '状态值' },
        { value: 'comment', label: '设备状态' }
        // { value: 'bit0', label: 'bit0' },
        // { value: 'bit1', label: 'bit1' },
        // { value: 'bit2', label: 'bit2' },
        // { value: 'bit3', label: 'bit3' },
        // { value: 'bit4', label: 'bit4' },
        // { value: 'bit5', label: 'bit5' },
        // { value: 'bit6', label: 'bit6' },
        // { value: 'bit7', label: 'bit7' },
        // { value: 'bit8', label: 'bit8' },
        // { value: 'bit9', label: 'bit9' },
        // { value: 'bit10', label: 'bit10' },
        // { value: 'bit11', label: 'bit11' },
        // { value: 'bit12', label: 'bit12' },
        // { value: 'bit13', label: 'bit13' },
        // { value: 'bit14', label: 'bit14' },
        // { value: 'bit15', label: 'bit15' }
      ],
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
      date: [new Date().format('yyyy-MM-dd 00:00:00'), new Date(Date.now() + 24 * 3600 * 1000).format('yyyy-MM-dd 00:00:00')],
      dataChange: false,
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
      deviceSelectValue: '',
      deviceSelectList: [],
      downloadLoading: false,
      ztStateSelectValue: '',
      ztStateSelectOptions: [
        { value: 1, label: '故障状态' },
        { value: 2, label: '故障恢复' }
      ],
      tableHeight: null,
      queryBasicInfo: {
        dbName: 'fsvpp',
        tableName: 'yc_e_battery_zt',
        projectId: '16'
      },
      ztInfoList: null,
      ztValInfoList: null,
      alarmInfoList: null,
      alarmValInfoList: null,
      selectLoading: false,
      TimeOutList: null,
      TimeOutListAll: null,
      deviceTypeSelectValue: '004',
      deviceTypeSelectOptions: [
        { value: '004', label: '储能', table:'battery' },
        { value: '002', label: '光伏', table:'pv' },
        // { value: '00402', label: 'BMS', table:'bms' },
        // { value: '00403', label: 'BMSDCDC', table:'dcdc' },
        // { value: '001', label: '光伏', table:'pv' },
        // { value: '00501', label: '风机', table:'fanconverter' },
        // { value: '00702', label: 'AMC数采', table:'amc' },
        // { value: '00703', label: '开关', table:'switch' },
        // { value: '00704', label: '保护', table:'protector' },
        // { value: '00803', label: '空调', table:'airconditioner' },
        // { value: '00801', label: '交流AC-MGCC', table:'ac' },
      ]
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
        this.temp.download.date[1] = new Date((new Date(this.temp.download.date[0]).getTime() + 30 * 24 * 3600 * 1000)).format('yyyy-MM-dd 00:00:00')
      }
    },
    'temp.download.date.1'(val) {
      if (!this.$refs.datepicker3) return
      this.$refs.datepicker3.handleClose()
      if ((new Date(this.temp.download.date[1]).getTime() - new Date(this.temp.download.date[0]).getTime() > 30 * 24 * 3600 * 1000)) {
        this.temp.download.date[0] = new Date((new Date(this.temp.download.date[1]).getTime() - 30 * 24 * 3600 * 1000)).format('yyyy-MM-dd 00:00:00')
      }
    },
    date: {
      handler() {
        this.dataChange = true
      }
    }
  },
  async created() {
    const project = await this.$store.dispatch('project/defaultProjectSGet')
    if (project) this.queryBasicInfo.projectId = project.id + ''
    // this.getList()
    this.getOtherList()
    this.getListAll()
    this.getAlarmList()
  },
  mounted() {
    this.getTableHeight()
    this.addChartResizeListener()
  },
  beforeDestroy() {
    this.getTableHeight = () => {}
  },
  methods: {
    getTableHeight() {
      const tableH = 280
      const tableHeightDetil = this.$el.offsetHeight - 40 - this.$refs.tabWarn.offsetHeight - this.$refs.warnPag.$el.offsetHeight
      if (tableHeightDetil <= tableH) {
        this.tableHeight = tableH
      } else {
        this.tableHeight = tableHeightDetil
      }
    },
    addChartResizeListener() {
      const instance = ResizeListener({
        strategy: 'scroll',
        callOnAdd: true
      })

      instance.listenTo(this.$el, () => {
        return _.debounce(() => {
          this.getTableHeight()
        }, 200)()
      })
    },
    filterChange(row) {
      const key = Object.keys(row)[0]
      // console.log(row,key)
      if (row[key].length === 0) {
        delete this.tableFilters[key]
      } else {
        this.tableFilters[key] = row[key][0]
      }
      this.getList()
    },
    getgzstatecolor(data) {
      return ''
    },
    // 表格内容
    getList() {
      const data = {
        limit: this.pageSize.toString(),
        page: this.currentPage.toString()
      }
      let list = _.clone(this.listAll) || []
      // if (this.deviceTypeSelectValue !== '') {
      //   data.gyObjId = this.deviceTypeSelectValue
      //   list = list.filter(v => v.smallObjId == data.gyObjId)
      // }
      if (this.ztSelectValue !== '') {
        data.type = this.ztSelectValue
        list = list.filter(v => v.type == data.type)
      }
      if (this.deviceSelectValue !== '') {
        data.farmName = this.deviceSelectValue
        list = list.filter(v => v.farmName == data.farmName)
      }
      this.total = list.length
      this.totalPage = Math.ceil(this.total / this.pageSize)
      list = list.slice((data.page - 1) * data.limit, data.page * data.limit)
      this.list = list
      this.listLoading = false
    },
    getListAll() {
      this.listLoading = true
      const data = {
        // inTime: this.date.join(','),
        stime: this.date[0],
        etime: this.date[1],
        orderRule: 'desc',
        ...this.queryBasicInfo
      }
      data.tableName = data.tableName + '_' + new Date(data.stime).format('yyyy')
      getYcePvZtDynamicsList(data, 60 * 1000).then(response => {
        if (response.code === 0) {
          const res = response.list
          this.listAll = res
          this.selectChange()
          this.getList()
          this.dataChange = false
          this.selectLoading = false
        } else {
          this.getList()
          this.listAll = []
          this.listLoading = false
          this.selectLoading = false
        }
      }).catch(() => {
        this.getList()
        this.listAll = []
        this.listLoading = false
        this.selectLoading = false
      })
    },
    getAlarmList() {
      const data1 = {
        gyNameId: '0017',
        gyObjId: '004'
        // gyObjId: this.deviceTypeSelectValue
      }
      mqttgybitZtList(data1).then(response => {
        data1.limit = response.page.totalCount + ''
        mqttgybitZtList(data1).then(response => {
          const res = response.page.list
          this.alarmInfoList = res
        })
      })
      const data2 = {
        gyNameId: '0017',
        gyObjId: '004'
        // gyNameId: '0001',
        // gyObjId: this.deviceTypeSelectValue
      }
      mqttgybitZtvalList(data2).then(response => {
        data2.limit = response.page.totalCount + ''
        mqttgybitZtvalList(data2).then(response => {
          const res = response.page.list
          this.alarmValInfoList = res
        })
      })
    },
    getOtherList() {
      // const data = {
      //   gyNameId: '0007',
      //   gyObjId: this.deviceTypeSelectValue
      // }
      // mqttgyycyxList(data).then(response => {
      //   if (response.code === 0) {
      //     data.limit = response.page.totalCount + ''
      //     mqttgyycyxList(data).then(response => {
      //       if (response.code === 0) {
      //         const res = response.page.list
      //         this.pidTypeComment = res.map(item => ({ gyNameId: item.gyNameId, gyObjId: item.gyObjId, pidType: item.pidType, comment: item.comment }))
      //       }
      //     })
      //   }
      // })
    },
    selectChangeObj(val) {
      this.getAlarmList()
      const devicetypetable = this.deviceTypeSelectOptions.filter(v=>v.value==val)
      this.ztSelectValue = ''
      this.deviceSelectValue = ''
      this.queryBasicInfo.tableName = 'yc_e_'+devicetypetable[0].table+'_zt'
      this.selectChange()
    },
    selectChange() {
      const data = {}
      let list = _.clone(this.listAll)
      // if (this.deviceTypeSelectValue !== '') {
      //   data.gyObjId = this.deviceTypeSelectValue
      //   list = list.filter(v => v.smallObjId == data.gyObjId)
      // }
      if (this.ztSelectValue !== '') {
        data.type = this.ztSelectValue
        list = list.filter(v => v.type == data.type)
      }
      if (this.deviceSelectValue !== '') {
        data.farmName = this.deviceSelectValue
        list = list.filter(v => v.farmName == data.farmName)
      }
      if (this.ztSelectValue == '') {
        this.getSelectOptions(list, 'ztSelectOptions', 'type', 'type')
      }
      if (this.deviceSelectValue == '') {
        this.getSelectOptions(list, 'deviceSelectList', 'farmName', 'farmName')
      }
    },
    // 选择框选项
    getSelectOptions(data, options, valueName, labelName) {
      const values = []
      this[options] = data.reduce((pre, cur) => {
        if (values.indexOf(cur[valueName]) === -1 && cur[valueName] != null) {
          values.push(cur[valueName])
          pre.push({ value: cur[valueName], label: cur[labelName], text: cur[labelName] })
        }
        return pre
      }, [])
    },
    getztLabel(val) {
      const comments = this.pidTypeComment
      for (const j in comments) {
        if (comments[j].pidType == val) {
          return val + '(' + comments[j].comment + ')'
        }
      }
    },
    handleFilter() {
      this.currentPage = 1
      this.getListAll()
      // if(this.dataChange)
      //   this.getListAll()
      // else
      //   this.getList()
    },
    handleSizeChange() {
      this.getList()
    },
    handleCurrentChange() {
      this.getList()
    },
    GZView(row) {
      this.temp.GZView = _.cloneDeep(row)
      const data = []
      const abc = this.alarmInfoList.filter(m => m.pidType == row.type)
      if (abc.length > 0) {
        abc.forEach(item => {
          const resd = {}
          resd.ztalarm = true
          const type = Number((Math.pow(2, item.bit).toString(10)))
          resd.bit = item.bit
          resd.bitComment = item.comment
          if (item.bitType == 0 || item.bitType == undefined) {
            const types = this.binary(row.v1, 32).split('').reverse().join('')
            const bit = item.bit.split(',')
            const bitMax = Math.max(...bit)
            const bitMin = Math.min(...bit)
            const type = parseInt(types.slice(bitMin, bitMax + 1), 2).toString(10)
            const ztValA = this.alarmValInfoList.filter(v => v.refZtId == item.id)
            if (ztValA.length > 0) {
              ztValA.forEach(ztv => {
                if (type == ztv.value) {
                  resd.value = ztv.value
                  resd.valComment = ztv.comment
                }
              })
            }
            data.push(resd)
          }
          // else {
          //   const alarmValA = this.alarmValInfoList.filter(v => v.refZtId == item.id)
          //   if (alarmValA.length > 0) {
          //     const typev1 = ((type & row.v1) != 0) ? 1 : 0
          //     resd.value = typev1
          //     for (const j in alarmValA) {
          //       if (alarmValA[j].value == typev1) {
          //         resd.valComment = alarmValA[j].comment
          //         break
          //       }
          //     }
          //     data.push(resd)
          //   }
          // }
        })
        if (data.length == 0) {
          for (const j in abc) {
            const resd = {}
            if (abc[j].bit == row.v1) {
              resd.bit = abc[j].bit
              resd.bitComment = abc[j].comment
              resd.value = row.v1
              resd.valComment = abc[j].comment
              data.push(resd)
              break
            }
          }
        }
      }
      this.temp.GZView.list = data
      this.dialogStatus = 'GZView'
      this.dialogFormVisible = true
    },
    binary(num, Bits) {
      var resArry = []
      var xresArry = []
      let i = 0
      let j = 0
      let r
      // 除2取余
      for (; num > 0;) {
        resArry.push(num % 2)
        num = parseInt(num / 2)
        i++
      }
      // 倒序排列
      for (j = i - 1; j >= 0; j--) {
        xresArry.push(resArry[j])
      }
      // 报错
      if (Bits < xresArry.length) {
        console.log('控制位小于转换位数')
      }
      // 补0操作
      if (Bits) {
        for (r = xresArry.length; r < Bits; r++) {
          xresArry.unshift('0')
        }
      }
      return xresArry.join().replace(/,/g, '')
    },
    tagType(row) {
      let resd = ''
      if (/告警/.test(row.valComment)) { resd = 'danger' }
      return resd
    },
    GZCompare(row) {
      this.temp.GZCompare = _.cloneDeep(row)
      this.dialogStatus = 'GZCompare'
      this.dialogFormVisible = true
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
    // 导出excle
    handleDownload({ ...row }) {
      this.downloadLoading = true
      setTimeout(() => {
        const data = {
          // inTime: row.date.join(','),
          stime: this.temp.download.date[0],
          etime: this.temp.download.date[1],
          orderRule: 'asc',
          ...this.queryBasicInfo
          // orderBy: 'inTime'
        }
        data.tableName = data.tableName + '_' + new Date(data.stime).format('yyyy')
        getYcePvZtDynamicsList(data, 60 * 1000).then(response => {
          if (response.code === 0) {
            import('@/vendor/Export2Excel').then(excel => {
              let list = response.list
                // .map(item => {
                //   let pidTypeName = ''
                //   for (const j in this.pidTypeComment) {
                //     if (this.pidTypeComment[j].pidType.slice(2) == item.type.slice(2)) {
                //       pidTypeName = this.pidTypeComment[j].comment
                //     }
                //   }
                //   return { ...item, pidTypeName: pidTypeName }
                // })
              // list = list.map(v => {
              //   const resd = v
              //   if (v.v1 == -99) {
              //     resd.gzstate = ''
              //     resd.v1 = ''
              //     return resd
              //   }
              //   resd.gzstate = []
              //   const abc = this.alarmInfoList.filter(m => m.pidType == v.type)
              //   abc.forEach(item => {
              //     const alarmValA = this.alarmValInfoList.filter(v => v.refZtId == item.id)
              //     if (alarmValA.length == 0) {
              //       const type = item.bit
              //       if (type == v.v1) {
              //         resd.gzstate.push(item.comment)
              //       }
              //     } else {
              //       const type = Number((Math.pow(2, item.bit).toString(10)))
              //       const typev1 = ((type & v.v1) != 0) ? 1 : 0
              //       for (const j in alarmValA) {
              //         if (alarmValA[j].value == typev1) {
              //           // resd.gzstate.push('bit' + item.bit + '(' + item.comment + ')')
              //           resd.gzstate.push(item.comment + '(' + alarmValA[j].comment + ')')
              //         }
              //       }
              //     }
              //   })
              //   if (resd.gzstate.length > 0) { resd.gzstate = resd.gzstate.join(',') } else { resd.gzstate = '故障恢复' }
              //   return resd
              // })
              const datayu = {}
              // if (this.deviceTypeSelectValue !== '') {
              //   datayu.gyObjId = this.deviceTypeSelectValue
              //   list = list.filter(v => v.smallObjId == datayu.gyObjId)
              // }
              if (this.ztSelectValue !== '') {
                datayu.type = this.ztSelectValue
                list = list.filter(v => v.type == datayu.type)
              }
              if (this.deviceSelectValue !== '') {
                datayu.farmName = this.deviceSelectValue
                list = list.filter(v => v.farmName == datayu.farmName)
              }
              const thfiltV = this.listTbaleHeader.filter(v => this.temp.download.ycyxcur.includes(v.label))
              const tHeader = thfiltV.map(v => v.label)
              const filterVal = thfiltV.map(v => v.value)
              const data = this.formatJson(filterVal, list)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: `zt-list`
              })
              this.downloadLoading = false
            })
          } else {
            this.downloadLoading = false
            this.$notify({
              title: 'Failed',
              message: '导出失败',
              type: 'danger',
              duration: 2000
            })
          }
        }).catch(() => {
          this.downloadLoading = false
          this.$notify({
            title: 'Failed',
            message: '导出失败',
            type: 'danger',
            duration: 2000
          })
        })
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
<style lang="scss" scoped>
  .tableWarn{
  }
</style>
<style lang="scss">
.el-tooltip__popper {
  max-width: 400px;
}
.operateZt .el-dialog__title{
    // color:#fff;
  }
  @media screen and (min-width: 701px){
    .operateZt {
      width: 800px;
    }
  //   .operateZt .el-dialog__body {
  //     padding: 3% 10%;
  // }
}

</style>
