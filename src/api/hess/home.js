import request from '@/utils/request'

export function HomeIndex(data) {
  return request({
    baseURL: 'http://47.103.79.116:8765/hess',
    url: '/sys/userindex/index',
    method: 'post',
    data: data
  })
}

export function HomeRangeChargeData(data) {
  return request({
    baseURL: '',
    url: 'http://47.103.79.116:8765/hess/sys/userindex/rangeChargeData',
    method: 'post',
    data: data
  })
}

export function HomeRangeBMURunData(data) {
  return request({
    baseURL: '',
    url: 'http://47.103.79.116:8765/hess/sys/userindex/rangeBMURunData',
    method: 'post',
    data: data
  })
}

export function HomeUserAndDevInfo(data) {
  return request({
    baseURL: '',
    url: 'http://47.103.79.116:8765/hess/sys/userindex/userAndDevInfo',
    method: 'post',
    data: data
  })
}

export function HomeUserDevGrowthTrend(data) {
  return request({
    baseURL: '',
    url: 'http://47.103.79.116:8765/hess/sys/userindex/userDevGrowthTrend',
    method: 'post',
    data: data
  })
}
