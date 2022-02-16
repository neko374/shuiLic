<template>
  <el-button :disabled="disabled" @click="butClick(data)">{{ data.name }}</el-button>
</template>

<script>
import { mqttPublishGet, mqttPublishPublish } from '@/api/hbvpp/mqtt/publish'
import { getLogSave } from '@/api/hbvpp/log'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({
        value: ''
      })
    },
    deviceId: {
      type: String,
      default: undefined
    }
  },
  methods: {
    butClick(dat) {
      this.$confirm('是否将' + dat.title + '设置成<span style="color:red;">' + dat.name + '</span>?', '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.gexinProtocal(dat.ykyt + dat.nameyt, () => {
          this.$message({
            type: 'success',
            message: '设置成功!'
          })
          const logData = {
            operation: dat.title + '设置',
            params: dat.title + '设置成' + dat.name
          }
          if (this.deviceId) { logData.operation = this.deviceId + logData.operation }
          // console.log(logData)
          getLogSave(logData).then(response => {
            // console.log(response)
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    gexinProtocal(msgType, callback) {
      const data = {
        broker: hostIp,
        clientID: clientId,
        topic: 'ncyt_sub_yk_yt',
        msgType: msgType,
        snid: '004_0044_0017_02_FS0',
        manual: '1'
      }
      // console.log(data)
      mqttPublishPublish(data).then(response => {
        // console.log(response)
        if (response.controlResult == true) {
          if (callback) { callback() } else {
            this.$message({
              type: 'success',
              message: '下发成功!'
            })
          }
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
    }
  }
}
</script>
