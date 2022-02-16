import request from '@/utils/request'

export function mqttyk(data) {
  return request({
    baseURL: PhotovoltaicIp,
    url: '/yk',
    method: 'post',
    data
  })
}

export function mqttyt(data) {
  return request({
    baseURL: PhotovoltaicIp,
    url: '/yt',
    method: 'post',
    data
  })
}
