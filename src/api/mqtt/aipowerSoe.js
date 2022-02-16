// 规约编辑人
import request from '@/utils/request'

export function mqttaipowerSoeList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerSoe/list',
    method: 'post',
    data
  })
}
