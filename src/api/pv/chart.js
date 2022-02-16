import request from '@/utils/request'

export function pvFcData(data) {
  return request({
    url: '/sys/chart/fcData',
    method: 'post',
    data
  })
}

export function pvRunData(data) {
  return request({
    url: '/sys/chart/runData',
    method: 'post',
    data
  })
}

export function pvUsFcData(data) {
  return request({
    url: '/sys/chart/usFcData',
    method: 'post',
    data
  })
}
