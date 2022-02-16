import request from '@/utils/request'
// 获取设备列表信息
export function getFarmcfginfoList(data) {
  return request({
    url: '/sys/farmcfginfo/list',
    method: 'post',
    data
  })
}
export function getCurVal(data) {
  return request({
    url: '/sys/farmcfginfo/getCurVal',
    method: 'post',
    data
  })
}
// 获取曲线
export function getChartVal(data) {
  data.dbName = 'fsvpp'
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/farmcfginfo/getChartVal',
    method: 'post',
    data
  })
}
// 获取天累计实时数据
export function getDayCurVal(data) {
  return request({
    url: '/sys/farmcfginfo/getDayCurVal',
    method: 'post',
    data
  })
}

export function getCurrentData(curName, deviceName) {
  curName.forEach(value => {
    if (typeof value.farmId != 'object') { value.farmId = [] }
    const devName = value.deviceName || deviceName || value.name
    if ('protocolType' in value) {
      if (typeof devName == 'object') {
        if (typeof value.protocolType == 'object') {
          value.state = []
          devName.forEach((deviceValue, devindex) => {
            value.protocolType.forEach((proVal, pindex) => {
              getCurrentShj(value, deviceValue, proVal, response => {
                const res = response.res
                value.farmId[devindex] = response.farmId
                if ('stateQk' in value) {
                  for (const j in value.stateQk) {
                    const val = value.stateQk[j]
                    if (val.type == res && res !== '') {
                      const valuesd = [...value.valuec]
                      valuesd[devindex][pindex] = res
                      value.valuec = valuesd
                      for (const j in valuesd) {
                        if (valuesd[j].indexOf(3) > -1) {
                          value.value = '正常'
                          break
                        } else {
                          value.value = '异常'
                        }
                      }
                      // value.value = val.name
                      break
                    }
                  }
                }
              })
            })
          })
        } else {
          value.state = []
          devName.forEach((deviceValue, index) => {
            getCurrentShj(value, deviceValue, null, response => {
              const res = response.res
              value.farmId[index] = response.farmId
              if ('stateQk' in value) {
                for (const j in value.stateQk) {
                  const val = value.stateQk[j]
                  if (val.type == res && res !== '') {
                    value.value = val.name
                    val.state = 1
                    break
                  }
                }
              } else {
                const resv = (res == '' ? 0 : res)
                const valuesd = [...value.valuec]
                valuesd[index] = resv
                value.valuec = valuesd
                value.value = valuesd.reduce((pre, cur) => { pre += Number(cur); return pre }, 0)
              }
            })
          })
        }
      } else if (typeof value.protocolType == 'object') {
        value.state = []
        value.protocolType.forEach((proVal, index) => {
          getCurrentShj(value, devName, proVal, response => {
            const res = response.res
            value.farmId[0] = response.farmId
            if ('stateType' in value) {

            } else if ('stateQk' in value) {
              for (const j in value.stateQk) {
                const val = value.stateQk[j]
                if (val.type == res && res !== '') {
                  const valuesd = [...value.valuec]
                  valuesd[index] = res
                  value.valuec = valuesd
                  if (value.valuec.indexOf(3) > -1) {
                    value.value = '正常'
                  } else {
                    value.value = '异常'
                  }
                  break
                }
              }
            } else {
              let asd = res
              if (value.separator == '-') {
                if (asd.toString().split('').length == 1) {
                  asd = '0' + asd
                }
              }
              if (typeof value.valuec != 'object') { value.valuec = [] }
              const valuesd = value.valuec
              valuesd[index] = asd
              value.valuec = valuesd
              value.value = valuesd.join(value.separator)
            }
          })
        })
      } else {
        getCurrentShj(value, devName, null, response => {
          const res = response.res
          value.farmId[0] = response.farmId
          if ('stateType' in value) {
            const states = []
            value.stateType.forEach(val => {
              let type = 0
              if ('type' in val) {
                if (val.type == res && res !== '') {
                  states.push(val.name)
                  val.state = 1
                } else {
                  val.state = 0
                }
              } else if ('bit' in val && res !== '') {
                type = Number((Math.pow(2, val.bit).toString(10)))
                if ((type & Number(res)) != 0) {
                  states.push(val.name)
                  val.state = 1
                } else {
                  val.state = 0
                }
              } else if ('unbit' in val && res !== '') {
                type = Number((Math.pow(2, val.unbit).toString(10)))
                if ((type & Number(res)) == 0) {
                  states.push(val.name)
                  val.state = 1
                } else {
                  val.state = 0
                }
              } else if ('bits' in val && res !== '') {
                type = val.bits
                if ((type & Number(res)) != 0) {
                  states.push(val.name)
                  val.state = 1
                } else {
                  val.state = 0
                }
              } else if ('unbits' in val && res !== '') {
                type = val.unbits
                if ((type & Number(res)) == 0) {
                  states.push(val.name)
                  val.state = 1
                } else {
                  val.state = 0
                }
              } else if ('str' in val && res !== '') {
                let asd = Number(res).toString(2).slice(-6, -3)
                asd = Number(parseInt(asd, 2).toString(10))
                if (val.str.indexOf(asd) > -1) {
                  states.push(val.name)
                  val.state = 1
                } else {
                  val.state = 0
                }
              }
            })
            value.state = states
            if ('value' in value) { value.value = value.state[0] }
          } else if ('stateQk' in value) {
            for (const j in value.stateQk) {
              const val = value.stateQk[j]
              if (val.type == res && res !== '') {
                value.value = val.name
                val.state = 1
                break
              }
            }
          } else {
            // if(res!=-99) {
              if ('coefficient' in value) { value.value = res * value.coefficient } else { value.value = res }
            // }
          }
        })
      }
    }
  })
  function getCurrentShj(value, devName, protocolType, callback) {
    getFarmcfginfoList({ name: devName,accessType:'0' }).then(response => {
      if (response.code === 0) {
        if (response.page.totalCount > 0) {
          const data = {
            farmId: response.page.list[0].id,
            farmProtocolTypeId: protocolType || value.protocolType
          }
          getCurVal(data).then(response => {
            if (response.code === 0) {
              // let res = response.curVal
              let res = response.curVal[data.farmId + '-' + data.farmProtocolTypeId]
              res = Number(res)
              // res=1
              // res=Number(parseInt('111111000',2).toString(10))
              // res = Math.ceil(Math.random()*3);
              // console.log(value,res)
              if (callback) {
                callback({ res: res, farmId: data.farmId })
              } else {
                // if(res!=-99) {
                value.value = res
                value.farmId = [data.farmId]
                // }
              }
            }
          })
        }
      }
    })
  }
}

export function getCurrentData1(curName, callback) {
  let asd = []; let asd1 = []
  curName.forEach(value => {
    if ('protocolType' in value) {
      value.farmId.forEach(val => {
        if (typeof value.protocolType != 'object') {
          asd.push(val)
          asd1.push(value.protocolType)
        } else {
          value.protocolType.forEach(protoVal => {
            asd.push(val)
            asd1.push(protoVal)
          })
        }
      })
    }
  })
  asd = asd.join(',')
  asd1 = asd1.join(',')
  const data = {
    farmId: asd,
    farmProtocolTypeId: asd1
  }
  getCurVal(data).then(response => {
    if (response.code === 0) {
      const res = response.curVal
      // let res = response.curVal[data.farmId+'-'+data.farmProtocolTypeId]
      // res = Number(res)
      // res=2
      // res=Number(parseInt('1111000',2).toString(10))
      // res = Math.ceil(Math.random()*3);
      // value.value = res
      for (const j in res) {
        res[j] = Number(res[j])
        if(res[j]==-99) res[j]=''
        // res[j] = 65535
      }
      if (callback) { callback(res) }
      // else{
      //   curName.forEach(value=>{
      //     value.farmId.forEach((val,farmIdIndex)=>{
      //       value.protocolType.forEach((protoVal,protoIndex)=>{
      //         if(typeof value.valuec!='object')
      //             value.valuec=[]
      //         if(typeof value.valuec[farmIdIndex]!='object')
      //             value.valuec[farmIdIndex]=[]
      //         value.valuec[farmIdIndex][protoIndex] = res[val+'-'+protoVal]
      //       })
      //     })
      //   })
      // }
    }
  })
}

export function getChartData(chartName, dataFjz, deviceName) {
  dataFjz = dataFjz || {}
  dataFjz.time = dataFjz.time || [new Date().format(), new Date(Date.now() + 24 * 3600 * 1000).format()]
  dataFjz.time = [new Date(dataFjz.time[0].replace(/-/g, '/')).format(), new Date(dataFjz.time[1].replace(/-/g, '/')).format()]
  // console.log(dataFjz.time)
  chartName.forEach(value => {
    const devName = value.deviceName || deviceName || value.name
    if ('protocolType' in value) {
      if (typeof devName == 'object') {
        value.data = {}
        devName.forEach(deviceValue => {
          abc(value, dataFjz, deviceValue, 'all')
        })
      } else {
        abc(value, dataFjz, devName)
      }
    }
  })
  function abc(value, dataFjz, deviceName, allType) {
    getFarmcfginfoList({ name: deviceName }).then(response => {
      // console.log(response)
      if (response.code === 0) {
        if (response.page.totalCount > 0) {
          const data = {
            farmId: response.page.list[0].id,
            farmProtocolTypeId: value.protocolType,
            stime: dataFjz.time[0],
            etime: dataFjz.time[1],
            type: dataFjz.type || '3'
          }
          if (dataFjz.dataType) { data.dataType = dataFjz.dataType }
          // console.log(data)
          getChartVal(data).then(response => {
            if (response.code === 0) {
              const res = response.chartVal
              const b = Object.keys(res)
              res[b].series = res[b].series.map(item => { return item == -999 ? '' : item })
              // res[b]={
              //   xAxis:['00:00:00','00:05:00','10:00:00'],
              //   series:[1,2,3]
              // }
              if (allType == 'all') {
                if (value.data.series != undefined) {
                  res[b].series.forEach((alval, index) => {
                    if (alval != '' && alval != undefined) {
                      if (value.data.series[index] != '' && value.data.series[index] != undefined) {
                        if (data.farmId == pv1id || data.farmId == pv2id || data.farmId == pv3id || data.farmId == pv4id || data.farmId == pv5id) {
                          if (data.farmProtocolTypeId == 7) {
                            if (Number(value.data.series[index]) < -10 || Number(value.data.series[index]) > 1000) {
                              value.data.series[index] = 0
                            }
                          }
                        }
                        res[b].series[index] = Number(alval) + Number(value.data.series[index])
                      }
                    } else {
                      res[b].series[index] = value.data.series[index]
                    }
                  })
                }
                value.data = res[b]
              } else {
                if ('coefficient' in value) {
                  res[b].series = res[b].series.map(item => item * value.coefficient)
                }
                value.data = res[b]
              }
            }
          })
        }
      }
    })
  }
  // function abcd(value, dataFjz, deviceName) {
  //   getFarmcfginfoList({}).then(response => {
  //     if(response.code==0){
  //     getFarmcfginfoList({limit:response.page.totalCount.toString()}).then(response => {
  //     if (response.code === 0) {
  //       if (response.page.totalCount > 0) {
  //         const res= response.page.list
  //         const resList = res.reduce((pre,cur)=>{if(deviceName.indexOf(cur.name)!=-1) pre.push(cur);return pre;},[])
  //         const data = {
  //           farmId: resList.map(item=>item.id).join(','),
  //           farmProtocolTypeId: resList.map(()=>value.protocolType).join(','),
  //           stime: dataFjz.time[0],
  //           etime: dataFjz.time[1],
  //           type: dataFjz.type || '3'
  //         }
  //         if (dataFjz.dataType) { data.dataType = dataFjz.dataType }
  //         getChartVal(data).then(response => {
  //           if (response.code === 0) {
  //             console.log(data,response)
  //             const res = response.chartVal
  //             let xAxis = res.reduce((pre,cur)=>{
  //               if('xAxis' in cur.data)
  //                 pre = new Set([...pre,...cur.data.xAxis])
  //               return pre
  //             },[])
  //             xAxis = [...xAxis]
  //             let series = []
  //             res.forEach((value,index)=>{
  //               series[index]= xAxis.map(()=>'')
  //               if('xAxis' in value.data) {
  //                 value.data.xAxis.forEach((val,ind)=>{
  //                   let b = xAxis.indexOf(val)
  //                   if(b!=-1) series[index][b] = value.data.series[ind]==-99?'':value.data.series[ind]
  //                 })
  //               }
  //             })
  //             value.data = {
  //               xAxis:xAxis,
  //               series:series.reduce((pre,cur)=>{
  //                 if(pre==[]){
  //                   pre = cur
  //                 } else {
  //                   pre = pre.map((item,ind)=>{
  //                     if(item!='') {
  //                       if(cur[ind]!='')
  //                         return Number(item) + Number(cur[ind])
  //                       else
  //                         return item
  //                     } else {
  //                       return cur[ind]
  //                     }
  //                   })
  //                 }
  //                 return pre
  //               },[])
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  // }
  // })
  // }
}
