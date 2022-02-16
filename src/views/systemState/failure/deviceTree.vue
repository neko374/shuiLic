<template>
  <div>
    <el-tree
      :data="dataTree"
      :props="defaultProps"
      :expand-on-click-node="false"
      highlight-current
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
import { getFarmcfginfoList, getFarmcfginfoSave, getFarmcfginfoUpdate, getFarmcfginfoDelete } from '@/api/mqtt/dianzhan'

export default {
  data() {
    return {
      dataTree: [],
      projectId: '',
      projectInfo: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      baseDataFilters: {
        state: 1
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
        projectId: this.projectId
      }
      const seriesData = []
      // seriesData.push({
      //   name:this.projectInfo.name,
      //   children:[]
      // })
      getFarmcfginfoList(data).then(response => {
        data.limit = response.page.totalCount + ''
        getFarmcfginfoList(data).then(response => {
          const res = response.page.list
          if (res.length > 0) {
            res.forEach(val => {
              if (val.pid == 0) {
                const acd = { name: val.name, id: val.id, type: val.type }
                this.getListFilter(acd, res)
                seriesData.push(acd)
              }
            })
            this.dataTree = seriesData
          } else {
            this.dataTree = []
          }
        })
      })
    },
    getListFilter(data, res) {
      res.forEach(val => {
        if (data.id == val.pid) {
          const acd = { name: val.name, id: val.id, type: val.type }
          if (!data.children) data.children = []
          data.children.push(acd)
          this.getListFilter(acd, res)
        }
      })
    },
    handleNodeClick(data) {
      console.log(data)
      this.$emit('', data.id)
    }
  }
}
</script>

<style lang="scss">
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: #58ffff;
  }
</style>
