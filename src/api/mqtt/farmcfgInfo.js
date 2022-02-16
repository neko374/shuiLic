// 规约编辑人
import request from '@/utils/request'

export function getTableVal(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmcfginfo/getTableVal',
    method: 'post',
    timeout: 10000,
    data
  })
}

