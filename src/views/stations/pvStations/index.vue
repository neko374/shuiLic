<template>
  <div class="container">
    <!-- 顶部项目选择区 -->
    <!-- <el-form size="mini" :inline="true" @keyup.enter.native="handleFilter">
          <div style="float:left;margin-top:10px;">
            <el-form-item>
              <el-select
                v-model="projectSelectValue"
                filterable
                clearable
                placeholder="项目列表"
              >
                <el-option
                  v-for="item in projectSelectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div style="float:left;margin-top:10px;">
            <el-button class="TablePageButtonSearch" size="mini" icon="el-icon-search" @click="handleFilter">
              搜索
            </el-button>
          </div>
          <div style="float:left;margin:12px 0 0 25% ;">
            {{projectSelectValue | selectOptionFilter(projectSelectOptions)}}
          </div>
          <div style="clear:both;"></div>
        </el-form>
        <hr> -->
    <div class="showScreen" style="padding:10px 10px 0 10px;">
      <div class="filter-container">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="场站列表" name="first">
            <MaintenanceEquipmentStations :device-id="projectSelectValue" />
          </el-tab-pane>
          <el-tab-pane label="汇流箱列表" name="second">
            <MaintenanceCombiner :device-id="projectSelectValue" />
          </el-tab-pane>
          <el-tab-pane label="逆变器列表" name="third">
            <MaintenanceInverter :device-id="projectSelectValue" />
          </el-tab-pane>
          <el-tab-pane label="组件列表" name="fourth">
            <MaintenanceComponents :device-id="projectSelectValue" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import MaintenanceEquipmentStations from './MaintenanceEquimentComponents/MaintenanceStations'
import MaintenanceCombiner from './MaintenanceEquimentComponents/MaintenanceCombiner'
import MaintenanceInverter from './MaintenanceEquimentComponents/MaintenanceInverter'
import MaintenanceComponents from './MaintenanceEquimentComponents/MaintenanceComponents'
import { mqttprojectInfoList, mqttprojectInfoSave, mqttprojectInfoUpdate, mqttprojectInfoDelete } from '@/api/mqtt/projectInfo'
import { selectOptionFilter } from '@/filters'

export default {
  components: {
    MaintenanceEquipmentStations,
    MaintenanceCombiner,
    MaintenanceInverter,
    MaintenanceComponents
  },
  data() {
    return {
      activeName: 'first',
      projectSelectValue: '',
      projectSelectOptions: ''
    }
  },
  async created() {
    this.getOtherSelectOptions()
    const projectId = (await this.$store.dispatch('project/defaultProjectSGet')).id
    if (projectId) this.projectSelectValue = projectId
    if (this.$route.query.projectId !== undefined) {
      this.projectSelectValue = Number(this.$route.query.projectId)
    }
  },
  methods: {
    handleClick() {},
    // 项目查询
    handleFilter() {

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
    getOtherSelectOptions() {
      mqttprojectInfoList({}).then(response => {
        if (response.code === 0) {
          const data1 = { limit: response.page.totalCount.toString() }
          mqttprojectInfoList(data1).then(response => {
            if (response.code === 0) {
              this.getSelectOptions(response.page.list, 'projectSelectOptions', 'id', 'name')
            }
          })
        }
      })
    }
  }

}
</script>

<style scoped>
    .container{color:black;position: relative;width:100%;height:100%;
    }

    /* 中间表格展示区 */
    .showScreen{
        height:100%;
        background-size:100% 100%;
    }
    .showScreen .xiaobiaoti{
            float:left;
            font-size: 16px;
            margin:10px 1em 0 1em;
            color:#333;
            font-weight: bold;
        }
</style>

<style>
.tableanalysis {
  color:#333;
  background-color:transparent
}
  .tableanalysis tr,.tableanalysis th{
    background-color:transparent;
  }
.container .tableanalysis tbody tr:hover>td {
    background-color:rgb(76,177,214);
  }
  /* 表格选中行高亮颜色 */
.tableanalysis .el-table__body tr.current-row>td {
  background:rgb(76,177,214);
  }
  .el-tabs__item.is-active{
    color:#46A6FF;
  }
  .el-tabs__item{
    color:#333;
  }
</style>
