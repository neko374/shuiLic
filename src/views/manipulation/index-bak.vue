<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="snIdSelectValue"
        filterable
        placeholder="SNID"
        @change="snIdChange"
      >
        <el-option
          v-for="item in snIdSelectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div>
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="checkedCities" style="height:200px;overflow:auto;" @change="handleCheckedCitiesChange">
          <!-- <div v-for="(item,index) in ycyxsArray" :key="'ycyx'+index">
            <el-checkbox v-for="city in item" :label="city" :key="city">{{city}}</el-checkbox>
          </div> -->
          <el-checkbox v-for="city in ycyxs" :key="city" :label="city">{{ city }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
        <div style="float:left;margin-top:10px;">
          <!-- <el-form-item label="时间" style="margin-bottom: 2px">
            <el-date-picker
              v-model="date"
              :clearable="false"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              size="medium"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              align="left"
            />
          </el-form-item> -->
          <el-form-item label="开始时间" style="margin-bottom: 2px;">
            <el-date-picker
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
        </div>
        <div style="margin-top:10px;float:left">
          <el-button class="TablePageButtonSearch" size="medium" icon="el-icon-search" @click="handleFilter">
            查询
          </el-button>
          <el-button
            v-loading.fullscreen.lock="downloadLoading"
            size="medium"
            type="primary"
            class="el-icon-download"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            @click="handleDownload"
          >导出</el-button>
        </div>
      </el-form>

    </div>

    <th-table
      v-loading="loading"
      style="width:100%;height:400px;clear:both;"
      :data="list"
      :data-title="listTabl"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    />
  </div>
</template>

<script>
import { getLogList, getLogSave } from '@/api/hbvpp/log'
import { mqttgyycyxList } from '@/api/hbvpp/mqtt/gyycyx'
import { getTableVal } from '@/api/hbvpp/pvMqttChart'
import thTable from './components/th-table'
const cityOptions = ['YC0', 'YC1', 'YC2', 'YC3', 'YC4', 'YC5', 'YC6', 'YC7', 'YC8', 'YC9', 'YC10', 'YC11', 'YC12', 'YC13', 'YC14', 'YC15']

export default {
  components: { thTable },
  data() {
    return {
      list: [
        { time: '00:05:00', YC0: 1, YC1: 2 },
        { time: '00:10:00', YC0: 1, YC1: 2 }
      ],
      list1: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      total: 0,
      listLoading: false,
      listTabl: [
        { label: 'YC0', prop: 'YC0' },
        { label: 'YC1', prop: 'YC1' }
      ],
      dialogFormVisible: false,
      innerVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        snid: [{ required: true, message: 'Id is required', trigger: 'blur' }],
        rated: [{ required: true, message: 'Rated is required', trigger: 'blur' }],
        accessType: [{ required: true, message: 'AccessType is required', trigger: ['blur', 'change'] }]
      },
      temp: {
        create: {},
        update: {}
      },
      tempEdit: {},
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now() + 24 * 3600 * 1000
        }
      },
      pickerOptionsstart: {
        disabledDate: time => {
          return time.getTime() >= new Date(this.date[1]).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000 || (new Date(this.date[1]).getTime() - time.getTime() > 30 * 24 * 3600 * 1000)
        }
      },
      pickerOptionsend: {
        disabledDate: time => {
          return time.getTime() <= new Date(this.date[0]).getTime() || time.getTime() > Date.now() + 24 * 3600 * 1000 || (time.getTime() - new Date(this.date[0]).getTime() > 30 * 24 * 3600 * 1000)
        }
      },
      InitOptiList: true,

      userSelectValue: '',
      userSelectOptions: [],
      operateSelectValue: '',
      operateSelectOptions: [],
      countyTableFilter: [],
      snIdSelectValue: '004_0013_0007_02_SJZ0',
      snIdSelectOptions: [
        { value: '004_0013_0007_02_SJZ0', name: '储能集装箱终端' },
        { value: '001_0013_0007_02_SJZ1', name: '光伏电站1' },
        { value: '001_0013_0007_02_SJZ2', name: '光伏电站2' },
        { value: '001_0013_0007_02_SJZ3', name: '光伏电站3' },
        { value: '001_0013_0007_02_SJZ4', name: '光伏电站4' },
        { value: '001_0013_0007_02_SJZ5', name: '光伏电站5' }
      ],
      tableFilters: {},
      powerstateSelectOptions: [
        { value: 1, label: '集中式' },
        { value: 2, label: '分布式' }
      ],
      // date: [new Date().format(), new Date(Date.now() + 24 * 3600 * 1000).format()],
      date: [new Date().format('yyyy-MM-dd 00:05:00'), new Date(Date.now() + 24 * 3600 * 1000).format('yyyy-MM-dd 00:00:00')],

      checkAll: false,
      checkedCities: ['YC0', 'YC1'],
      ycyxs: cityOptions,
      ycyxcur: ['YC0', 'YC1'],
      isIndeterminate: true,
      downloadLoading: false,
      startIndex: 0,
      stat: true,
      loading: false
    }
  },
  computed: {
    ycyxsArray() {
      const iconsArr = [] // 声明数组
      const num = 10
      this.ycyxs.forEach((item, index) => {
        const page = Math.floor(index / num) // 计算该元素为第几个素组内
        if (!iconsArr[page]) { // 判断是否存在
          iconsArr[page] = []
        }
        iconsArr[page].push(item)
      })
      return iconsArr
    }
  },
  created() {
    this.getList()
    this.getYcYx()
  },
  methods: {
    // 表格内容
    getList() {
      const data = {
        tableName: 'yc_e_battery_shijiaz_2020',
        farmId: this.snIdSelectValue,
        columns: this.ycyxcur.join(','),
        stime: new Date(this.date[0]).format(),
        etime: new Date(this.date[1]).format(),
        type: '3',
        valueType: '1'
      }
      if (this.snIdSelectValue.split('_')[0] == '001') { data.tableName = 'yc_e_pv_shijiaz_2020' }
      this.loading = true
      getTableVal(data).then(response => {
        if (response.code === 0) {
          const res = response.tableVal
          const list = []
          const time = []
          for (let j = new Date(new Date(data.stime).format('yyyy-MM-dd 00:05:00')).getTime(); j <= new Date(new Date(data.etime).format('yyyy-MM-dd 00:00:00')).getTime(); j += 1000 * 60 * 5) {
            time.push(new Date(j).format('yyyy-MM-dd HH:mm:ss'))
          }
          time.forEach((value, index) => {
            const abc = {}
            abc.time = value
            this.ycyxcur.forEach(val => {
              abc[val] = res[val][index]
            })
            list.push(abc)
          })

          list.forEach(value => {
            for (const j in value) {
              if (j != 'time') {
                value[j] = Math.ceil(Math.random() * 80000 + 10000)
              }
            }
          })

          this.list = list
          this.list1 = this.list.slice(this.startIndex, this.startIndex + this.limitCount)
          this.loading = false
        } else {
          this.loading = false
          this.$notify.error({
            title: '提示',
            message: '加载失败',
            duration: 2000
          })
        }
      }).catch(() => {
        this.loading = false
        this.$notify.error({
          title: '提示',
          message: '加载失败',
          duration: 2000
        })
      })
    },
    getYcYx(gyNameId, gyObjId) {
      const data = {
        gyNameId: gyNameId || '0007',
        gyObjId: gyObjId || '004',
        limit: '1'
      }
      mqttgyycyxList(data).then(response => {
        if (response.code === 0) {
          data.limit = response.page.totalCount.toString()
          mqttgyycyxList(data).then(response => {
            const res = response.page.list
            this.ycyxs = res.map(item => item.pidType)
            const listtab = this.listTabl.reduce((pre, cur) => { if (!cur.disable) pre.push(cur.prop); return pre }, [])
            this.listTabl = this.ycyxs.map(item => ({ prop: item, label: item, disable: true }))
            this.listTabl.forEach(val => {
              if (listtab.indexOf(val.prop) != -1) {
                val.disable = false
              } else {
                val.disable = true
              }
            })
            if (this.stat) {
              this.listTabl = this.ycyxs.map(item => ({ prop: item, label: item, disable: true }))
              this.listTabl[0].disable = false
              this.listTabl[1].disable = false
              this.stat = false
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
    snIdChange(val) {
      const gyNameId = this.snIdSelectValue.split('_')[2]
      const gyObjId = this.snIdSelectValue.split('_')[0]
      this.getYcYx(gyNameId, gyObjId)
      this.getList()
    },
    handleFilter() {
      this.getList()
    },
    handleCheckAllChange(val) {
      if (val) {
        this.ycyxcur = this.ycyxs
        this.listTabl.forEach(val => {
          // if(this.ycyxs.indexOf(val.prop)!=-1) {
          val.disable = false
          // }
        })
        this.getList()
      } else {
        this.listTabl.forEach(val => {
          val.disable = true
        })
        this.ycyxcur = []
        this.list = []
      }
      this.checkedCities = val ? this.ycyxs : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      this.listTabl.forEach(val => {
        if (value.indexOf(val.prop) != -1) {
          val.disable = false
        } else {
          val.disable = true
        }
      })
      this.ycyxcur = value
      this.getList()
      const checkedCount = value.length
      this.checkAll = checkedCount === this.ycyxs.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.ycyxs.length
    },
    // 导出excle
    handleDownload() {
      this.downloadLoading = true
      setTimeout(() => {
        import('@/vendor/Export2Excel').then(excel => {
          const list = this.list
          const listTabl = this.listTabl.reduce((pre, cur) => { if (!cur.disable) pre.push(cur); return pre }, [])
          const tHeader = ['时间'].concat(listTabl.map(item => item.label))
          const filterVal = ['time'].concat(listTabl.map(item => item.prop))
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `yc-list`
          })
          this.downloadLoading = false
        })
      }, 200)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }

}
</script>
<style lang="scss">
.el-tooltip__popper {
  max-width: 400px;
}
</style>
