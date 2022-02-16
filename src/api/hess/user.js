import request from '@/utils/request'

export function getUserList(data) {
  return request({
    url: '/sys/user/list',
    method: 'post',
    data
  })
}
