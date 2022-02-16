import store from '@/store'
import { getCurrentData, getCurrentData1, getChartData } from '@/api/getCurChart'

export default {
  created() {
    setTimeout(() => {
      // this.$_CurGet()
      this.$_CurGetALL()
      this.$_ChartGet()
    }, 1000)
  },
  beforeDestroy() {
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_CurGet() {
      store.state.mainWiring.mainList.forEach(item => {
        getCurrentData(item)
      })
      getCurrentData(store.state.mainWiring.svgList)

      store.state.energyBattery.bms1Cur.forEach(item => {
        getCurrentData(item, '电池组1')
      })

      store.state.energyConverter.pcs1Cur.forEach(item => {
        getCurrentData(item, 'PCS1')
      })

      store.state.pvOperate.pv1Cur.forEach(item => {
        getCurrentData(item, '光伏电站1')
      })
    },
    $_CurGetALL() {
      store.state.mainWiring.mainList.forEach(item => {
        getCurrentData(item)
      })
      getCurrentData(store.state.mainWiring.svgList)

      // const data = [...store.state.energyBattery.bms1Cur.flat(2), ...store.state.energyBattery.bms2Cur.flat(2), ...store.state.energyBattery.bms3Cur.flat(2),
      //   ...store.state.energyConverter.pcs1Cur.flat(2), ...store.state.energyConverter.pcs2Cur.flat(2), ...store.state.energyConverter.pcs3Cur.flat(2),
      //   ...store.state.pvOperate.pvAllCur.flat(2), ...store.state.pvOperate.pv1Cur.flat(2), ...store.state.pvOperate.pv2Cur.flat(2), ...store.state.pvOperate.pv3Cur.flat(2),
      //   ...store.state.pvOperate.pv4Cur.flat(2), ...store.state.pvOperate.pv5Cur.flat(2)]
      const data = [...store.state.energyBattery.bms1Cur.reduce((pre, cur) => pre.concat(cur), []),
        ...store.state.energyConverter.pcs1Cur.reduce((pre, cur) => pre.concat(cur), []),
        ...store.state.pvOperate.pv1Cur.reduce((pre, cur) => pre.concat(cur), [])]
      getCurrentData1(data, response => {
        const res = response
        store.state.energyBattery.bms1Cur.forEach(value => {
          value.forEach(val => {
            if('protocolType' in val) {
              if ('separator' in val) {
                let asd = res[val.farmId[0] + '-' + val.protocolType[0]]
                let asd1 = res[val.farmId[0] + '-' + val.protocolType[1]]
                if (asd != undefined && asd1 != undefined) {
                  if (asd.toString().split('').length == 1) {
                    asd = '0' + asd
                  }
                  if (asd1.toString().split('').length == 1) {
                    asd1 = '0' + asd1
                  }
                  val.value = asd + val.separator + asd1
                }
              } else if ('stateQk' in val) {
                for (const j in val.stateQk) {
                  if (val.stateQk[j].type == res[val.farmId[0] + '-' + val.protocolType] && res[val.farmId[0] + '-' + val.protocolType] !== undefined) {
                    val.value = val.stateQk[j].name
                    break
                  }
                }
              } else {
                if (res[val.farmId[0] + '-' + val.protocolType] != undefined) {
                  if ('coefficient' in val) { val.value = res[val.farmId[0] + '-' + val.protocolType] * val.coefficient } else { val.value = res[val.farmId[0] + '-' + val.protocolType] }
                }
              }
            }
          })
        })
        
        store.state.energyConverter.pcs1Cur.forEach(value => {
          value.forEach(val => {
            if('protocolType' in val) {
              if ('separator' in val) {
                let asd = res[val.farmId[0] + '-' + val.protocolType[0]]
                let asd1 = res[val.farmId[0] + '-' + val.protocolType[1]]
                if (asd.toString().split('').length == 1) {
                  asd = '0' + asd
                }
                if (asd1.toString().split('').length == 1) {
                  asd1 = '0' + asd1
                }
                val.value = asd + val.separator + asd1
              } else if ('stateQk' in val) {
                for (const j in val.stateQk) {
                  if (val.stateQk[j].type == res[val.farmId[0] + '-' + val.protocolType] && res[val.farmId[0] + '-' + val.protocolType] !== '') {
                    val.value = val.stateQk[j].name
                    break
                  }
                }
              } else {
            if(res[val.farmId[0] + '-' + val.protocolType[0]]!==''&&res[val.farmId[0] + '-' + val.protocolType[0]]!=undefined) {
              if ('coefficient' in val) { val.value = res[val.farmId[0] + '-' + val.protocolType] * val.coefficient } else { val.value = res[val.farmId[0] + '-' + val.protocolType] }
                }
              }
            }
          })
        })
        
        store.state.pvOperate.pv1Cur.forEach(value => {
          value.forEach(val => {
            if ('protocolType' in val) {
              if ('stateQk' in val) {
                for (const j in val.stateQk) {
                  if (val.stateQk[j].type == res[val.farmId[0] + '-' + val.protocolType] && res[val.farmId[0] + '-' + val.protocolType] !== '') {
                    val.value = val.stateQk[j].name
                    break
                  }
                }
                // val.protocolType.forEach((proval, proindex) => {
                //   for (const j in val.stateQk) {
                //     const val1 = val.stateQk[j]
                //     if (val1.type == res[val.farmId[0] + '-' + proval] && res[val.farmId[0] + '-' + proval] !== '') {
                //       if (typeof value.valuec != 'object') { val.valuec = ['', '', '', '', ''] }
                //       const valuesd = [...val.valuec]
                //       valuesd[proindex] = Number(res[val.farmId[0] + '-' + proval])
                //       val.valuec = valuesd
                //       if (valuesd.indexOf(3) > -1) {
                //         val.value = '正常'
                //       } else {
                //         val.value = '异常'
                //       }
                //       break
                //     }
                //   }
                // })
              } else {
                if (res[val.farmId[0] + '-' + val.protocolType] != undefined) {
                  val.value = res[val.farmId[0] + '-' + val.protocolType]
                }
              }
            }
          })
        })
      })
    },
    $_ChartGet() {
      const curDate = [new Date().format(), new Date(Date.now() + 24 * 3600 * 1000).format()]
      getChartData(store.state.energyBattery.bms1Chart, { time: curDate }, '电池组1')

      getChartData(store.state.energyConverter.pcs1Chart, { time: curDate }, 'PCS1')

      getChartData(store.state.pvOperate.pv1Chart, { time: curDate }, '光伏电站')
    },
    $_resizeHandler() {

    }
  }
}
