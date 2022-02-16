import request from '@/utils/request'

export function getWeather(data) {
  return request({
    url: '/sys/farmcfginfo/weather',
    method: 'post',
    data: data
  })
}
