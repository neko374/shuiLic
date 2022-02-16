<template>
  <div>
    <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
      <div style="float:left">
        <el-form-item>
          <el-select
            v-model="stationSelectValue"
            filterable
            clearable
            placeholder="场站名称"
          >
            <el-option
              v-for="item in stationSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <div style="float:left">
        <el-button class="TablePageButtonSearch" size="mini" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button class="TablePageButtonAdd" size="mini" icon="el-icon-edit" @click="handleCreate">
          创建
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stationSelectValue: '',
      stationSelectOptions: []
    }
  },
  methods: {
    handleFilter() {},
    handleCreate() {}
  }
}
</script>
