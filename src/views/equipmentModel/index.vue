<template>
  <div class="app-container">
    <echartsTree :series-data="chartData" @changeTree="getList" :projectId="projectId"/>
  </div>
</template>

<script>
import echartsTree from './components/echartsVue'
import { mqttDeviceInfoPortionList } from '@/api/mqtt/aipowerdeviceinfo'

export default {
  components: {
    echartsTree
  },
  data() {
    return {
      chartData: [],
      projectId: '',
      projectInfo: {},
      baseDataFilters: {
        // state: 1
      }
    }
  },
  async created() {
    this.projectInfo = await this.$store.dispatch('project/defaultProjectSGet')
    const projectId = this.projectInfo.id
    if (projectId) this.projectId = projectId
    this.getList()
  },
  methods: {
    getList() {
      const data = {
        ...this.baseDataFilters,
        refProjectId: this.projectId
      }
      mqttDeviceInfoPortionList(data).then(response=>{
        const res =response.maps
        this.chartData = res.map(v=>({...v,projectId:v.id,id:0}))
      })
    }
  }
}
</script>
