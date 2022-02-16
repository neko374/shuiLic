import request from '@/utils/request'

export function hessOrderEvaluateSave(data) {
  return request({
    baseURL: hessIp,
    url: '/sys/hessorderevaluate/save',
    method: 'post',
    data
  })
}
