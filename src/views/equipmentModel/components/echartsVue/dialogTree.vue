<template>
  <div class="container">
    <device-info
      :dialog-status-tree="dialogStatusTree"
      :dialog-visible-tree.sync="dialogVisibleTree1"
      :device-data="deviceData"
      @changeTree="changeTree"
      :projectId="projectId"
    />
  </div>
</template>

<script>
import deviceInfo from './deviceInfo'

export default {
  components: {
    deviceInfo
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
    },
    echtreeflag: {
      type: Boolean,
      default: false
    },
    projectId:{
      type:String|Number,
      default:''
    }
  },
  data() {
    return {
      dialogVisibleTree1: false
    }
  },
  watch: {
    dialogVisibleTree1(val) {
      this.$emit('update:dialogVisibleTree', val)
    },
    dialogVisibleTree(val) {
      this.dialogVisibleTree1 = val
    }
  },
  created() {

  },
  methods: {
    changeTree() {
      this.$emit('changeTree')
    }
  }

}
</script>
