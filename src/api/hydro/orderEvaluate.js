import request from '@/utils/request'

export function hydroOrderEvaluateSave(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessorderevaluate/save',
    method: 'post',
    data
  })
}
