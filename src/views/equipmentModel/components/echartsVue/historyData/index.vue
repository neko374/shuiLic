<template>
  <div>
    <el-dialog v-if="dialogStatus=='history'" title="历史数据" :visible.sync="dialogFormVisible" custom-class="diaHistory1">
      <div slot="title" class="dialog-title" align="center">
        <span style="color:black">历史数据</span>
        <span class="title-text">({{deviceData.name}})</span>
      </div>
      <div style="margin-bottom:20px;">
        <!-- <el-checkbox-group v-model="checkedDeviceType" @change="handleCheckedCitiesChange" style="margin-bottom:20px;">
          <el-checkbox v-for="city in deviceType" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group> -->
        <span style="font-weight:bold;">采集点：</span>
        <el-select
        size="medium"
          v-model="listDeviceType"
          filterable
          placeholder="采集点名称"
          @change="listTableChange"
        >
          <el-option
            v-for="(item,index) in listDeviceOptions"
            :key="index+'yuw'"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-form size="mini" :inline="true">
          <el-form-item label="开始时间" style="margin-bottom: 2px;">
            <el-date-picker
              ref="datepicker"
              v-model="date[0]"
              class="sjzsksj"
              style="width:200px;"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:05:00"
              size="medium"
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
              style="width:200px;"
              size="medium"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
              :clearable="false"
              :picker-options="pickerOptionsend"
              placeholder="结束时间"
            />
          </el-form-item>
          <el-button class="TablePageButtonSearch" size="medium" icon="el-icon-search" @click="handleFilter">
            查询
          </el-button>
      </el-form>

      <div style="border:1px solid #00C8FA;border-radius:5px;height:450px;padding:0 5px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="曲线" name="first">
            <chart-graph :value="chartData" :nameOption="nameOption" style="height:360px"></chart-graph>
          </el-tab-pane>
          <!-- <el-tab-pane label="数据" name="second">
            <el-table
              v-loading="listLoading"
              :data="list"
              border
              fit
              style="width: 100%;"
              size="mini"
            >
              <el-table-column label="序号" width="70" type="index" :index="(currentPage-1)*pageSize+1" />
              <el-table-column v-for="(item,ind) in listTable" :key="'1'+ind" :label="item.name+'('+item.protocolType+')'" min-width="100" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <span>{{ row.id }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getEquipTypeList } from '@/api/mqtt/equipType'
import { getTableVal } from '@/api/mqtt/farmcfgInfo'
import { getChartVal } from '@/api/getCurChart'
import chartGraph from '../components/chartGraph'

export default {
  components:{
    chartGraph
  },
  props: {
    dialogStatusTree: {
      type: String,
      default: ''
    },
    dialogVisibleTree: {
      type: Boolean,
      default: false
    },
    deviceData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      pickerOptionsstart: {
        disabledDate: time => {
          // return time.getTime() >= new Date(this.date[1]).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000 || (new Date(this.date[1]).getTime() - time.getTime() > 30 * 24 * 3600 * 1000)
          return time.getTime() >= new Date(this.date[1]).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000
        }
      },
      pickerOptionsend: {
        disabledDate: time => {
          return time.getTime() <= new Date(this.date[0]).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000 || (time.getTime() - new Date(this.date[0]).getTime() > 30 * 24 * 3600 * 1000)
        }
      },
      date: [new Date().format('yyyy-MM-dd 00:05:00'), new Date(Date.now() + 24 * 3600 * 1000).format('yyyy-MM-dd 00:00:00')],
      dialogFormVisible: false,
      dialogStatus: '',
      list: [],
      listYun: [],
      listTable: [],
      deviceType:[],
      checkedDeviceType:[],
      listLoading: false,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      total: 0,
      activeName:'first',
      chartData:[],
      nameOption:{
        legend:'',
        unit:'',
        yAxisName:''
      },
      listDeviceType:'',
      listDeviceOptions:[],
      deviceUnitName:[
        {name:'温度',unit:'℃'},
        {name:'电压',unit:'V'},
        {name:'电流',unit:'A'},
        {name:'SOC',unit:'%'},
        {name:'SOH',unit:'%'},
        {name:'效率',unit:'%'},
        {name:'湿度',unit:'%RH'},
        {name:'电量',unit:'kWh'},
        {name:'无功功率',unit:'kvar'},
        {name:'功率',unit:'kW'},
        {name:'有功功率',unit:'kW'},
        {name:'',unit:''},
      ]
    }
  },
  watch: {
    'date.0'(val) {
      this.$refs.datepicker.handleClose()
      if ((new Date(this.date[1]).getTime() - new Date(this.date[0]).getTime() > 365 * 24 * 3600 * 1000)) {
        this.date[1] = new Date((new Date(this.date[0]).getTime() + 365 * 24 * 3600 * 1000)).format('yyyy-MM-dd HH:mm:ss')
      }
    },
    'date.1'(val) {
      this.$refs.datepicker1.handleClose()
    },
    dialogVisibleTree(val) {
      if (val) {
        this.dialogFormVisible = true
        this.getListYun()
      }
    },
    dialogFormVisible(val) {
      this.$emit('update:dialogVisibleTree', val)
    },
    dialogStatusTree(val) {
      this.dialogStatus = val
    }
  },
  methods: {
    getListYun() {
      const data = {
        refFarmId: this.deviceData.id
      }
      getEquipTypeList(data).then(response => {
        if (response.code === 0) {
          data.limit = response.page.totalCount + ''
          getEquipTypeList(data).then(response => {
            const res = response.page.list
            this.listTable = res.filter(v=>/^YC/.test(v.protocolType))
            this.listDeviceOptions = this.listTable.map(v=>({value:v.name,label:v.name}))
            // console.log(this.listDeviceOptions)
            if(this.listDeviceOptions.length>0) {
              this.listDeviceType = this.listDeviceOptions[0].value
              this.listTableChange(this.listDeviceType)
            }
            // this.deviceType = res.map(v=>v.name)
            // if(this.deviceType.length>0) {
            //   this.checkedDeviceType.push(this.deviceType[0])
            //   this.handleCheckedCitiesChange([this.deviceType[0]])
            // }
          })
        }
      })
    },
    getList() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      this.list = this.listYun.slice(start, end)
    },
    handleFilter() {
      // this.handleCheckedCitiesChange(this.checkedDeviceType)
      this.listTableChange(this.listDeviceType)
    },
    handleSizeChange() {
      this.getList()
    },
    handleCurrentChange() {
      this.getList()
    },
    handleCheckedCitiesChange(value) {
      if(this.checkedDeviceType.length>1) {
        this.checkedDeviceType.shift()
      }
      this.nameOption.legend = value
      const litab = this.listTable.filter(v=>value.includes(v.name))
      
      const data = {
        farmId: litab[0].refFarmId,
        farmProtocolTypeId: litab[0].refFarmProtocolTypeId,
        stime: new Date(this.date[0].replace(/-/g, '/')).format(),
        etime: new Date(this.date[1].replace(/-/g, '/')).format(),
        type: '3',
        valueType:'3'
      }
      getChartVal(data).then(response=>{
        if(response.code===0) {
          const res = response.chartVal
          const b = Object.keys(res)
          res[b].series = res[b].series.map(item => { return item == -99 ? '' : item })
          this.chartData = [{data:res[b]}]
        } else {
          this.chartData = [
            {data:{xAxis:[],series:[]}}
          ]
        }
      })

      for(let j in this.deviceUnitName) {
        const v= this.deviceUnitName[j]
        const vsd = new RegExp(''+v.name+'')
        if(vsd.test(value)){
          // this.nameOption.unit = v.unit
          this.nameOption.yAxisName = v.name
          break
        }
      }
    },
    listTableChange(value) {
      const litab = this.listTable.filter(v=>value==v.name)
      this.nameOption.legend = [litab[0].name]
      
      const data = {
        farmId: litab[0].refDeviceInfoDeviceid,
        farmProtocolTypeId: litab[0].refProtocolTypeProtocoltypeid,
        stime: new Date(this.date[0].replace(/-/g, '/')).format(),
        etime: new Date(this.date[1].replace(/-/g, '/')).format(),
        type: '3',
        valueType:'3'
      }
      getChartVal(data).then(response=>{
        if(response.code===0) {
          const res = response.chartVal
          const b = Object.keys(res)
          res[b].series = res[b].series.map(item => { return item == -99 ? '' : item })
          this.chartData = [{data:res[b]}]
        } else {
          this.chartData = [
            {data:{xAxis:[],series:[]}}
          ]
        }
      })

      for(let j in this.deviceUnitName) {
        const v= this.deviceUnitName[j]
        const vsd = new RegExp(''+v.name+'')
        if(vsd.test(value)){
          // this.nameOption.unit = v.unit
          this.nameOption.yAxisName = v.name
          break
        }
      }
      this.nameOption.unit = litab[0].unit
    },
    handleClick(val) {}
  }
}
</script>

<style lang="scss">
  .diaHistory1{
    width:80%;
  }
</style>
