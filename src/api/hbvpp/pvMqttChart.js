import request from '@/utils/request'

// 光伏预测曲线 短期预测
export function fcData(data) {
  return request({
    url: '/sys/chart/fcData',
    method: 'post',
    data: data
  })
}

// 实时数据
export function realtv(data) {
  return request({
    url: `/sys/chart/info/${data.key}/${data.hashKey}`,
    method: 'post',
    data: data
  })
}
// 实测曲线
export function runData(data) {
  return request({
    url: '/sys/chart/runData',
    method: 'post',
    data: data
  })
}

// 光伏预测曲线 超短期预测
export function usFcData(data) {
  return request({
    url: '/sys/chart/usFcData',
    method: 'post',
    data: data
  })
}

//
export function getTableVal(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/farmcfginfo/getTableVal',
    method: 'post',
    timeout: '10000',
    data: data
  })
}

