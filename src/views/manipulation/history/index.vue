<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="margin-bottom:10px;">
        <el-select
          v-model="deviceSelectValue"
          filterable
          placeholder="设备列表"
          @change="deviceChange"
        >
          <el-option
            v-for="item in deviceSelectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div>
        <el-select
          v-model="hessSelectValue"
          filterable
          placeholder="设备列表"
          @change="hessChange"
        >
          <el-option
            v-for="item in hessSelectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
        <div style="float:left;margin-top:10px;">
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
      style="width:100%;height:calc(100% - 160px);clear:both;"
      :data="list"
      :data-title="listTabl"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    />
  </div>
</template>

<script>
import { getEquipTypeList } from '@/api/hbvpp/equipType'
import { getTableVal } from '@/api/hbvpp/pvMqttChart'
import { deviceList, hessList, pvList, deviceListData, deviceZTList, devicePvZTList } from '../components/deviceConfig.js'
import thTable from '../components/th-table'

export default {
  components: { thTable },
  watch: {
    'date.0'(val) {
      this.$refs.datepicker.handleClose()
      if((new Date(this.date[1]).getTime() - new Date(this.date[0]).getTime() > 30 * 24 * 3600 * 1000)){
        this.date[1] = new Date((new Date(this.date[0]).getTime() + 30 * 24 * 3600 * 1000)).format('yyyy-MM-dd HH:mm:ss')
      }
    },
    'date.1'(val) {
      this.$refs.datepicker1.handleClose()
    }
  },
  data() {
    return {
      list: [
        { time: '00:05:00', YC0: 1, YC1: 2 },
        { time: '00:10:00', YC0: 1, YC1: 2 }
      ],
      listTabl: [
        { label: 'YC0', prop: 'YC0' },
        { label: 'YC1', prop: 'YC1' }
      ],
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now() + 24 * 3600 * 1000
        }
      },
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
      downloadLoading: false,
      loading: false,

      hessSelectOptions: hessList,
      hessSelectValue: hessList[0].value,
      deviceSelectOptions: deviceList,
      deviceSelectValue: deviceList[0].value
    }
  },
  created() {
    this.getDeviceList()
    // this.getList()
  },
  methods: {
    getDeviceList() {
      const data = {
        refFarmId: deviceListData[this.hessSelectValue]
      }
      if (typeof data.refFarmId != 'object') {
        getEquipTypeList(data).then(response => {
          if (response.code === 0) {
            data.limit = response.page.totalCount.toString()
            getEquipTypeList(data).then(response => {
              if (response.code === 0) {
                const res = response.page.list
                const list = res
                  .reduce((pre, cur) => {
                    if (!(/ZT|GZ/.test(cur.protocolType))) {
                      pre.push(cur)
                    }
                    return pre
                  }, [])
                // console.log(list)
                this.listTabl = list.map(item => ({ label: item.name, prop: item.protocolType }))
                const abgh = list.reduce((pre, cur) => {
                  pre.farmId.push(cur.refFarmId)
                  pre.farmProtocolTypeId.push(cur.refFarmProtocolTypeId)
                  return pre
                }, { farmId: [], farmProtocolTypeId: [] })
                abgh.farmId = abgh.farmId.join(',')
                abgh.farmProtocolTypeId = abgh.farmProtocolTypeId.join(',')
                // console.log(abgh)
                // console.log(this.listTabl)
                this.getList(abgh)
              }
            })
          }
        })
      } else {
        const data1 = {}
        getEquipTypeList(data1).then(response => {
          if (response.code === 0) {
            data1.limit = response.page.totalCount.toString()
            getEquipTypeList(data1).then(response => {
              if (response.code === 0) {
                const res = response.page.list
                const list = res
                  .reduce((pre, cur) => {
                    if (!(/ZT|GZ/.test(cur.protocolType)) && data.refFarmId.indexOf(cur.refFarmId.toString()) != -1) {
                      pre.push(cur)
                    }
                    return pre
                  }, [])
                this.listTabl = list.map(item => ({ label: item.name, prop: item.protocolType }))
                const abgh = list.reduce((pre, cur) => {
                  pre.farmId.push(cur.refFarmId)
                  pre.farmProtocolTypeId.push(cur.refFarmProtocolTypeId)
                  return pre
                }, { farmId: [], farmProtocolTypeId: [] })
                abgh.farmId = abgh.farmId.join(',')
                abgh.farmProtocolTypeId = abgh.farmProtocolTypeId.join(',')
                // console.log(this.listTabl)
                this.getList(abgh)
              }
            })
          }
        })
      }
    },
    // 表格内容
    getList(cvbn) {
      const data = {
        farmId: cvbn.farmId,
        farmProtocolTypeId: cvbn.farmProtocolTypeId,
        stime: new Date(this.date[0].replace(/-/g, '/')).format(),
        etime: new Date(this.date[1].replace(/-/g, '/')).format(),
        type: '3',
        valueType: '1',
        dbName:'fsvpp'
      }
      // console.log(data)
      this.loading = true
      getTableVal(data).then(response => {
        if (response.code === 0) {
          const res = response.tableVal
          // console.log(res)
          const list = []
          let time = []
          // for(let j=new Date(new Date(data.stime).format('yyyy-MM-dd 00:05:00')).getTime();j<=new Date(new Date(data.etime).format('yyyy-MM-dd 00:00:00')).getTime();j+=1000*60*5){
          //   time.push(new Date(j).format('yyyy-MM-dd HH:mm:ss'))
          // }
          time = res.time
          time.forEach((value, index) => {
            const abc = {}
            abc.time = value
            this.listTabl.forEach(val => {
              if (this.deviceSelectValue == 'hess') {
                if (val.prop in deviceZTList) {
                  for (const j in deviceZTList[val.prop]) {
                    const ztval = deviceZTList[val.prop][j]
                    if ('value' in ztval) {
                      if (ztval.value == res[val.prop][index]) {
                        abc[val.prop] = ztval.name
                        break
                      }
                    } else if ('bit' in ztval) {
                      const itype = Number((Math.pow(2, ztval.bit).toString(10)))
                      if ((itype & Number(res[val.prop][index])) != 0) {
                        let iab = []
                        if (abc[val.prop] != undefined) { iab = abc[val.prop].split(',') }
                        iab.push(ztval.name)
                        iab = iab.join(',')
                        abc[val.prop] = iab
                      }
                    }
                  }
                } else {
                  if (res[val.prop][index] != -999) {
                    if (/SOC|SOH|效率$/.test(val.label)) {
                      abc[val.prop] = Number((res[val.prop][index] * 100).toFixed(2))
                    } else {
                      abc[val.prop] = Number(res[val.prop][index])
                    }
                  } else {
                    abc[val.prop] = ''
                  }
                }
              } else if (this.deviceSelectValue == 'pv') {
                if (val.prop in devicePvZTList) {
                  for (const j in devicePvZTList[val.prop]) {
                    const ztval = devicePvZTList[val.prop][j]
                    if (ztval.value == res[val.prop][index]) {
                      abc[val.prop] = ztval.name
                      break
                    }
                  }
                } else {
                  if (res[val.prop][index] != -999) {
                    abc[val.prop] = Number(res[val.prop][index])
                  } else {
                    abc[val.prop] = ''
                  }
                }
              }
            })
            list.push(abc)
          })

          this.list = list
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
    handleFilter() {
      this.getDeviceList()
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
            filename: this.hessSelectValue + `-list`
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
    },

    hessChange() {
      this.getDeviceList()
    },
    deviceChange(val) {
      if (val == 'hess') { this.hessSelectOptions = hessList } else if (val == 'pv') { this.hessSelectOptions = pvList }
      this.hessSelectValue = this.hessSelectOptions[0].value
      this.getDeviceList()
    }
  }

}
</script>
<style lang="scss">
.el-tooltip__popper {
  max-width: 400px;
}
</style>
