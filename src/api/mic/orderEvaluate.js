import request from '@/utils/request'

export function micOrderEvaluateSave(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessorderevaluate/save',
    method: 'post',
    data
  })
}
