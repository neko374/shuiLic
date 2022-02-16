<template>
  <div class="app-container">
    <!-- <deviceTree style="width:200px;float:left;height:100%;overflow:auto;"/> -->
    <!-- <tableWarn style="width:calc(100% - 200px);float:left;"/> -->
    <tableWarn />
  </div>
</template>

<script>
import deviceTree from './deviceTree'
import tableWarn from './tableWarn'

export default {
  components: {
    deviceTree,
    tableWarn
  },
  data() {
    return {

    }
  },
  created() {
  },
  methods: {
  }

}
</script>
<style lang="scss">
.el-tooltip__popper {
  max-width: 400px;
}
.failurediaCr .el-dialog__title{
    color:rgb(76, 177, 214);
  }
  @media screen and (min-width: 701px){
    .failurediaCr {
      width: 800px;
    }
    .failurediaCr .el-dialog__body {
      padding: 3% 10%;
  }
}
</style>
