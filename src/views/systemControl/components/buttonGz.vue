<template>
  <div>
    <el-popover
      v-model="innerVisible"
      placement="bottom"
      width="200"
      :disabled="disabled"
      trigger="click"
    >
      <p>请输入修改后的数值</p>
      <el-form ref="dataForm" status-icon :rules="rules" :model="innerVisibleValue" size="mini" label-position="left">
        <el-form-item :prop="value.name">
          <el-input v-model="innerVisibleValue[value.name]" size="mini" />
        </el-form-item>
      </el-form>
      <div style="text-align: right; margin: 0;margin-top:5px;">
        <el-button size="mini" type="text" @click="innerVisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="conform(value)">下发</el-button>
      </div>
      <el-button slot="reference" :disabled="disabled" :style="{color:value.valueColor || value.color,minWidth:buttonMinWidth}" :size="buttonsize" @click="popoverChange(value.name)">{{ value.value | numFilter }}
        <span>{{ value.unit }}</span>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { mqttPublishGet, mqttPublishPublish } from '@/api/hbvpp/mqtt/publish'
import { getLogSave } from '@/api/hbvpp/log'

export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Object,
      default: () => {}
    },
    buttonsize: {
      type: String,
      default: ''
    },
    buttonMinWidth: {
      type: String,
      default: '6em'
    }
  },
  data() {
    return {
      innerVisible: false,
      innerVisibleValue: {}
    }
  },
  methods: {
    conform(item) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('是否将<span style="color:#00BCFF;">' + item.name + '</span>修改为<span style="color:red;">' + this.innerVisibleValue[item.name] + item.unit + '</span>?', '提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const data = {
              broker: hostIp,
              clientID: clientId,
              topic: 'ncyt_sub_yk_yt',
              msgType: item.msgType + this.innerVisibleValue[item.name],
              snid: item.snid,
              manual: '1'
            }
            // console.log(data)
            mqttPublishPublish(data).then(response => {
              // console.log(response)
              if (response.controlResult == true) {
                this.innerVisible = false
                item.value = this.innerVisibleValue[item.name]
                this.innerVisibleValue[item.name] = ''
                this.$message({
                  type: 'success',
                  message: '下发成功!'
                })
                const logData = {
                  operation: item.logName,
                  params: '将' + item.name + '修改为' + item.value + item.unit
                }
                // console.log(logData)
                getLogSave(logData).then(response => {
                  // console.log(response)
                })
              } else {
                this.$message({
                  type: 'info',
                  message: '下发失败'
                })
              }
            })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '下发失败'
                })
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      })
    },
    popoverChange(item) {
      this.$nextTick(() => {
        this.$set(this.innerVisibleValue, item, '')
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>
