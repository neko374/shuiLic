<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
      size="mini"
      @filter-change="filterChange"
    >
      <el-table-column label="序号" width="70" type="index" :index="(currentPage-1)*pageSize+1" />
      <el-table-column prop="name" label="场站名称" min-width="100" show-overflow-tooltip />
      <el-table-column prop="snid" label="采集器ID" min-width="100" show-overflow-tooltip />
      <el-table-column label="装机容量" min-width="80" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.rated | ratedFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="市"
        min-width="80"
        show-overflow-tooltip
        :filters="citySelectOptions"
        :filter-multiple="false"
        :column-key="'cityId'"
        filter-placement="bottom-end"
      />
      <el-table-column
        prop="countyName"
        label="县"
        min-width="80"
        show-overflow-tooltip
        :filters="countyTableFilter"
        :filter-multiple="false"
        :column-key="'countyId'"
        filter-placement="bottom-end"
      />
      <el-table-column prop="uname" label="业主" min-width="80" show-overflow-tooltip />
      <el-table-column prop="contectname" label="联系人" min-width="80" show-overflow-tooltip />
      <el-table-column prop="contecttel" label="联系电话" min-width="100" show-overflow-tooltip />
      <el-table-column prop="contectaddr" label="联系地址" min-width="130" show-overflow-tooltip />
      <el-table-column label="并网电压等级" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.voltage | voltageFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
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
  </div>
</template>

<script>
export default {
  filters: {
    ratedFilter(val) {
      let resd = val
      if (val) {
        resd = val + 'kW'
      }
      return resd
    },
    voltageFilter(val) {
      let resd = val
      if (val) {
        resd = val + 'kV'
      }
      return resd
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      list: null,
      listLoading: false,
      tableFilters: {}
    }
  },
  watch: {
    data: {
      handler(val) {
        this.list = val
      },
      deep: true
    }
  },
  created() {
    this.list = this.data
  },
  methods: {
    getList() {
      this.$emit('getList')
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
    }
  }
}
</script>
