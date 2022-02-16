<template>
  <div class="hiscontainer">
    <div style="width:300px;">
      <el-form>
        <el-form-item label="实时服务器">
          <el-select v-model="severSelect" placeholder="实时服务器" style="width:calc(100% - 83px);" @change="protocolChange">
            <el-option
              v-for="item in severSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="采集器ID">
          <el-select v-model="collectSelect" placeholder="采集器ID" style="width:calc(100% - 83px);float:right;" @change="collectChange">
            <el-option
              v-for="item in collectSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="采集点">
          <el-input
            v-model="agreementSelect"
            placeholder="采集点"
            style="width:calc(100% - 80px);margin-left:26px;"
            clearable
            @input="agreeInputChange"
          />
        </el-form-item>
        <!-- <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox> -->
        <div style="margin: 15px 0;" />
        <el-checkbox-group
          v-model="ycyxcur"
          style="height:calc(100vh - 270px);overflow:auto;"
          @change="checkChange"
        >
          <el-checkbox v-for="city in ycyxs" :key="city" :label="city" style="width:180px;">{{ city }}{{ city | xsPidType(pidTypeComment) }}</el-checkbox>
        </el-checkbox-group>
      </el-form>
    </div>
    <div style="width:calc(100% - 210px);height:100%;">
      <div>
        <el-checkbox v-model="checkedRefresh" style="float:right;" @change="Refreshchange">自动刷新(/{{sjzRealTime}}s)</el-checkbox>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        style="width: 100%;"
        size="mini"
      >
        <el-table-column :label="$t('table.id')" width="50" type="index" :index="(currentPage-1)*pageSize+1" />
        <el-table-column label="键" min-width="150" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.key | keyFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="值" min-width="100" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column label="协议名称" min-width="100" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.xieyi }}{{ row.xieyi | xsPidType(pidTypeComment) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- <el-pagination
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :total="total"
        background
        :page-sizes="[1,5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        popper-class="PaginationPageSize"
        class="TablePagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      /> -->
    </div>
  </div>
</template>

<script>
import { mqttredisPoolList } from '@/api/hbvpp/mqtt/redisPool'
import { mqttprojectCollectorList } from '@/api/hbvpp/mqtt/projectCollector'
import { mqttgyycyxList } from '@/api/hbvpp/mqtt/gyycyx'
import { mqttredisPoolValGet } from '@/api/hbvpp/mqtt/redisPool'

export default {
  filters: {
    keyFilter(val) {
      let resault
      if (/catchtime/.test(val)) {
        resault = '数据采集时间'
      } else if (/msgstattime/.test(val)) {
        resault = '当地采集器时间'
      } else if (/msgtype/.test(val)) {
        resault = '数据类型'
      } else if (/_q/.test(val)) {
        resault = '数据质量'
      } else if (/colnum/.test(val)) {
        resault = '历史库列数'
      } else if (/tablename/.test(val)) {
        resault = '数据库名称'
      } else if (/poolname/.test(val)) {
        resault = '连接池名称'
      } else if (/updatetime/.test(val)) {
        resault = '实时库更新时间'
      } else if (/collectorid/.test(val)) {
        resault = '采集器ID'
      } else if (/datatype/.test(val)) {
        resault = '采集点号'
      } else if (/data/.test(val)) {
        resault = '数据值'
      }
      if (resault != undefined) { return val + '（' + resault + '）' } else { return val }
    },
    xsPidType(val, comments) {
      for (const j in comments) {
        if (comments[j].pidType == val) {
          return '(' + comments[j].comment + ')'
        }
      }
    }
  },
  props: {
    activeName: {
      type: String,
      default: 'history'
    }
  },
  data() {
    return {
      sjzRealTime:sjzRealTime,
      activeNameH: this.activeName,
      severSelect: '',
      severSelectOptions: [],
      agreementSelect: '',
      agreementSelectOptions: [],
      collectSelect: '',
      collectSelectOptions: [],
      list: [],
      list1: [],
      listLoading: false,
      currentPage: 1,
      pageSize: 20,
      totalPage: 0,
      total: 0,
      maxtotal: 0,
      ycyxcur: [],
      ycyxs: [],
      citiesAll: [],
      loading: false,
      listTabl: [],
      stat: true,
      isIndeterminate: true,
      checkAll: false,
      pidTypeComment: [],
      checkedRefresh:false,
      TimeOut:''
    }
  },
  watch: {
    activeNameH(val) {
      this.$emit('update:activeName', this.activeNameH)
    },
    activeName(val) {
      this.activeNameH = val
    }
  },
  created() {
    // this.getList()
    this.getOtherList()
    this.TimeOut = setInterval(this.reload, 1000 * sjzRealTime)
  },
  beforeDestroy() {
    clearInterval(this.TimeOut)
  },
  methods: {
    reload() {
      if(this.checkedRefresh)
        this.getList()
    },
    getList() {
      const data = {
        snId: this.collectSelect,
        ycId: this.ycyxcur.join(','),
        page: this.currentPage,
        limit: this.pageSize.toString()
      }
      if (data.ycId == '' || data.snId == '') { this.list = []; return }
      mqttredisPoolValGet(data).then(response => {
        if (response.code === 0) {
          // console.log(response)
          const res = response.pvInfoSingal
          const list = []
          for (const key in res) {
            for (const key1 in res[key]) {
              list.push({
                key: key1,
                value: res[key][key1],
                xieyi: key
              })
            }
          }
          this.list1 = list
          this.getListfen()
        }
      })
    },
    Refreshchange(val) {

    },
    getListfen() {
      this.list = this.list1.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      this.total = this.list1.length
      this.totalPage = Math.ceil(this.total / this.pageSize)
    },
    getOtherList() {
      const data = {  }
      mqttredisPoolList(data).then(response => {
        if (response.code === 0) {
          data.limit = response.page.totalCount.toString()
          mqttredisPoolList(data).then(response => {
            if (response.code === 0) {
              const res = response.page.list
              this.severSelectOptions = res.map(item => ({ value: item.gyObjName + item.gyObjId, label: item.redisCnName }))
              if (this.severSelectOptions.length > 0) {
                this.severSelect = this.severSelectOptions[0].value
                this.protocolChange(this.severSelect)
              }
            }
          })
        }
      })
      // const data1 = {
      //   gyNameId: '0007',
      //   gyObjId: '004'
      // }
      // mqttgyycyxList(data1).then(response => {
      //   if (response.code === 0) {
      //     data.limit = response.page.totalCount.toString()
      //     mqttgyycyxList(data).then(response => {
      //       if (response.code === 0) {
      //         const res = response.page.list
      //         this.pidTypeComment = res.map(item => ({ gyNameId: item.gyNameId, gyObjId: item.gyObjId, pidType: item.pidType, comment: item.comment }))
      //       }
      //     })
      //   }
      // })
    },
    protocolChange(val) {
      const data = {
        gyNameId: val.substring(0, 4),
        gyObjId: val.substring(4, 7)
      }
      mqttprojectCollectorList(data).then(response => {
        if (response.code === 0) {
          data.limit = response.page.totalCount.toString()
          mqttprojectCollectorList(data).then(response => {
            if (response.code === 0) {
              const res = response.page.list
              this.collectSelectOptions = res.map(item => ({ value: item.snId, label: item.snId }))
              this.collectSelect = this.collectSelectOptions.length > 0 ? this.collectSelectOptions[0].value : ''
            }
          })
        }
      })
      const data1 = {
        gyNameId: val.substring(0, 4),
        gyObjId: val.substring(4, 7)
      }
      mqttgyycyxList(data1).then(response => {
        if (response.code === 0) {
          data1.limit = response.page.totalCount.toString()
          mqttgyycyxList(data1).then(response => {
            if (response.code === 0) {
              const res = response.page.list
              // console.log(res)
              if (res.length > 0) { this.tableName = res[0].tableName } else { this.tableName = '' }
              this.ycyxs = res.map(item => item.pidType)
              this.citiesAll = res.map(item => item.pidType)
              // const listtab = this.listTabl.reduce((pre, cur) => { if (!cur.disable) pre.push(cur.prop); return pre }, [])
              // this.listTabl = this.ycyxs.map(item => ({ prop: item, label: item, disable: true }))
              // this.listTabl.forEach(val => {
              //   if (listtab.indexOf(val.prop) != -1) {
              //     val.disable = false
              //   } else {
              //     val.disable = true
              //   }
              // })
              this.ycyxcur = [this.ycyxs[0]]
              this.getList()
              this.pidTypeComment = res.map(item => ({ gyNameId: item.gyNameId, gyObjId: item.gyObjId, pidType: item.pidType, comment: item.comment }))
            }
          })
        }
      })
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    handleSizeChange() {
      this.getList()
    },
    handleCurrentChange() {
      this.getList()
    },
    collectChange(val) {
      this.getList()
    },
    agreeInputChange(val) {
      this.ycyxs = this.citiesAll.reduce((pre, cur) => {
        if (cur.indexOf(val) != -1) { pre.push(cur) }
        return pre
      }, [])
    },
    checkChange(value) {
      if (value.length > 1) { value.shift() }
      // this.listTabl.forEach(val => {
      //   if (value.indexOf(val.prop) != -1) {
      //     val.disable = false
      //   } else {
      //     val.disable = true
      //   }
      // })
      this.ycyxcur = value
      this.getList()
      const checkedCount = value.length
      this.checkAll = checkedCount === this.ycyxs.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.ycyxs.length
    },
    handleCheckAllChange(val) {
      if (val) {
        this.ycyxcur = this.ycyxs
        // this.listTabl.forEach(val => {
        //   // if(this.ycyxs.indexOf(val.prop)!=-1) {
        //   val.disable = false
        //   // }
        // })
        this.getList()
      } else {
        // this.listTabl.forEach(val => {
        //   val.disable = true
        // })
        this.ycyxcur = []
        // this.list = []
      }
      this.checkedCities = val ? this.ycyxs : []
      this.isIndeterminate = false
    }
  }
}
</script>

<style lang="scss">
  .hiscontainer{
    display: -webkit-flex;
    display: flex;
    justify-content:space-between;
    height:100%;
    padding:20px;
  }
</style>
