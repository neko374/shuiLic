import request from '@/utils/request'

export function pvOrderEvaluateSave(data) {
  return request({
    url: '/sys/hessorderevaluate/save',
    method: 'post',
    data
  })
}
