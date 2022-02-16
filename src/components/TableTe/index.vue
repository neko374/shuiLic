<template>
  <table class="tableOne" :cellspacing="cellspacing">
    <tr v-for="(data,index1) in value" :key="'TR'+index1">
      <td v-for="(item,index) in data" :key="'TD'+index" :style="{color:color[index],'padding-bottom':cellbottom}" :width="item.tdWidth">
        <div class="div1" :style="{color:item.color}">
          <div v-if="item.icon" class="TaTitle" style="margin-right:0.5em;"><span :class="'iconfont '+item.icon" :style="{color:item.iconColor}" /></div>
          <div v-if="item.name" class="TaTitle" :style="{width:(tdWidth[index] || '')+'em',color:item.nameColor}"><span>{{ item.name }}</span></div>
          <div class="frame">
            <span v-if="!isChange&&('value' in item)" :style="{color:item.valueColor}">{{ item.value | numFilter(/次数|编号|状态|模式$/.test(item.name)?-1:2) }}</span>
            <el-popover
              v-if="isChange && item.value!==undefined"
              v-model="innerVisible[item.name]"
              placement="bottom"
              width="200"
              :disabled="disabled"
              trigger="click"
            >
              <p>请输入修改后的数值</p>
              <el-form :ref="'dataForm'+item.name" status-icon :rules="rules" :model="innerVisibleValue" size="mini" label-position="left">
                <el-form-item :prop="item.name">
                  <el-input v-model="innerVisibleValue[item.name]" size="mini" />
                </el-form-item>
              </el-form>
              <div style="text-align: right; margin: 0;margin-top:5px;">
                <el-button size="mini" type="text" @click="innerVisible[item.name] = false">取消</el-button>
                <el-button type="primary" size="mini" @click="conform(item)">下发</el-button>
              </div>
              <el-button slot="reference" :disabled="disabled" :style="{color:item.valueColor || item.color}" :size="buttonsize" @click="popoverChange(item.name)">{{ item.value | numFilter }}
                <span>{{ item.butunit }}</span>
              </el-button>
            </el-popover>
            <span v-if="item.unit" :style="{color:item.unitColor}">{{ item.unit }}</span>
            <el-switch
              v-if="item.switch!==undefined"
              v-model="item.switch"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="100"
              inactive-value="0"
              :disabled="disabled"
              :active-text="item.active || '启动'"
              :inactive-text="item.inactive|| '停止'"
              @change="confirm('switch',item.active || '启动',item.inactive || '停止',index1,index,item.name.substring(0,4))"
            />
            <el-radio-group v-if="item.radio!==undefined" v-model="item.radio" :disabled="disabled" size="mini" @change="radioChange(item)">
              <el-radio-button :label="0">开机</el-radio-button>
              <el-radio-button :label="2">待机</el-radio-button>
              <el-radio-button :label="1">关机</el-radio-button>
            </el-radio-group>
            <el-button v-if="item.button" :size="buttonsize" :disabled="disabled" :class="{'butclass':item.butclass}" @click="blackStart(item)">{{ item.button }}</el-button>
          </div>
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
import { mqttyk, mqttyt } from '@/api/hbvpp/mqttyk'
import { mqttPublishGet, mqttPublishPublish } from '@/api/hbvpp/mqtt/publish'
import { getLogSave } from '@/api/hbvpp/log'

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    tdWidth: {
      type: Array,
      default: () => []
    },
    color: {
      type: Array,
      default: () => ['blue', 'green', 'rgb(101,75,216)', '#005eaa']
    },
    cellspacing: {
      type: String,
      default: '10'
    },
    isChange: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    cellbottom: {
      type: String,
      defalut: ''
    },
    trWidth: {
      type: String,
      default: ''
    }
  },
  data() {
    var validateLen = (rule, value, callback) => {
      if (value) {
        callback(new Error('数值不能为空'))
      }
    }
    return {
      innerVisible: {},
      innerVisibleValue: {},
      value3: '100',
      value4: '100',
      value5: '100',
      buttonsize: ''
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    this.$_resizeHandler()
  },
  methods: {
    conform(item) {
      this.$refs['dataForm' + item.name][0].validate((valid) => {
        if (valid) {
          this.$confirm('是否将<span style="color:#00BCFF;">' + item.name + '</span>修改为<span style="color:red;">' + this.innerVisibleValue[item.name] + '</span>?', '提示', {
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
                this.innerVisible[item.name] = false
                item.value = this.innerVisibleValue[item.name]
                this.innerVisibleValue[item.name] = ''
                this.$message({
                  type: 'success',
                  message: '下发成功!'
                })
                // const logData={
                //   operation:item.name,
                //   method:this.$route.meta.title,
                //   params:'将'+item.name+'修改为'+item.value,
                //   username:this.$store.state.user.userName,
                //   time:0,
                //   createDate:new Date().format('yyyy-MM-dd HH:mm:ss')
                // }
                // // console.log(logData)
                // getLogSave(logData).then(response=>{
                //   // console.log(response)
                // })
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
    confirm(value, active, inactive, tai, tri, name) {
      const val = this.value[tai][tri][value]
      this.value[tai][tri][value] = 100 - this.value[tai][tri][value] + ''
      this.$confirm('是否<span style="color:red;">' + (this.value[tai][tri][value] == '0' ? active : inactive) + '</span>' + name + '?', '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.value[tai][tri][value] = val
        this.$message({
          type: 'success',
          message: '切换成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    popoverChange(item) {
      this.$nextTick(() => {
        this.$set(this.innerVisibleValue, item, '')
        this.$refs['dataForm' + item][0].clearValidate()
      })
    },
    blackStart(item) {
      if (item.butclass) {
        this.$message({
          type: 'success',
          message: `已下发`
        })
      } else {
        this.$confirm('是否执行<span style="color:red;">' + (item.name || item.button) + '</span>' + '?', '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = {
            broker: hostIp,
            clientID: clientId,
            topic: 'ncyt_sub_yk_yt',
            msgType: item.msgType,
            snid: item.snid,
            manual: '1'
          }
          // console.log(data)
          mqttPublishPublish(data).then(response => {
            // console.log(response)
            if (response.controlResult == true) {
              this.$set(item, 'butclass', true)
              this.$message({
                type: 'success',
                message: '下发成功!'
              })
              if (item.buttonTitle) {
                const logData = {
                  operation: item.buttonTitle,
                  params: item.button
                }
                // console.log(logData)
                getLogSave(logData).then(response => {
                  // console.log(response)
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    radioChange(val) {
      const radiostate = val.radio
      val.radio = val.radio1
      this.$confirm('是否<span style="color:red;">' + (['开机', '关机', '待机'][radiostate]) + '</span>' + val.name.slice(0, 4) + '?', '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        val.radio = radiostate
        val.radio1 = radiostate
        this.$message({
          type: 'success',
          message: '启动成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const widthl = document.body.getBoundingClientRect().width
        if (widthl < 1200) {
          this.buttonsize = 'mini'
        } else {
          this.buttonsize = ''
        }
      }
    },
    gexinProtocal(msgType, snid) {
      const data = {
        broker: hostIp,
        clientID: clientId,
        topic: 'ncyt_sub_yk_yt',
        msgType: msgType,
        snid: snid,
        manual: '1'
      }
      // console.log(data)
      mqttPublishPublish(data).then(response => {
        // console.log(response)
        if (response.controlResult == true) {
          this.$message({
            type: 'success',
            message: '切换成功!'
          })
        } else {
          this.$message({
            type: 'info',
            message: '切换失败'
          })
        }
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '切换失败'
          })
        })
    }
  }
}
</script>

<style scoped>
.tableOne{
  width:100%;
  /*! autoprefixer: off */
    background:-webkit-linear-gradient(left, rgba(4, 183, 243, 0.075) , rgba(30, 223, 210, 0.075), rgba(74, 41, 221, 0.075));
  /*! autoprefixer: off */
  background:-moz-linear-gradient(left, rgba(4, 183, 243, 0.075) , rgba(30, 223, 210, 0.075), rgba(74, 41, 221, 0.075));
  background:-o-linear-gradient(left, rgba(4, 183, 243, 0.075) , rgba(30, 223, 210, 0.075), rgba(74, 41, 221, 0.075));
  background:-ms-linear-gradient(left, rgba(4, 183, 243, 0.075) , rgba(30, 223, 210, 0.075), rgba(74, 41, 221, 0.075));
  font-family: PingFangMedium;
}
.TaTitle{
  float:left;
  line-height:2em;
}
.frame {
  /* border: black solid 1px; */
  padding-left:1em;
  line-height:2em;
  /* width:150px; */
  float:left;
}
.div1{
  margin-left:10%;
}
.butclass{
  background-color: green;
  color: white;
}
@media screen and (max-width:1500px){
  .tableOne{
    font-size:14px;
  }
  .div1{
    margin-left:5px;
  }
}
@media screen and (max-width:1300px){
  .tableOne{
    font-size:13px;
  }
  .div1{
    margin-left:5px;
  }
}
</style>
