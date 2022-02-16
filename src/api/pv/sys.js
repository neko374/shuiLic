import request from '@/utils/request'

export function pvSysList(data) {
  return request({
    url: '/sys/farmloaderror/list',
    method: 'post',
    data
  })
}
