import request from '@/utils/request'

export function getHessIndex(data) {
  return request({
    url: '/sys/userindex/delete',
    method: 'post',
    data
  })
}

export function getHessBMU(data) {
  return request({
    url: '/sys/userindex/rangeBMURunData',
    method: 'post',
    data
  })
}

export function getHessCharge(data) {
  return request({
    url: '/sys/userindex/rangeChargeData',
    method: 'post',
    data
  })
}

export function getHessDevInfo(data) {
  return request({
    url: '/sys/userindex/userAndDevInfo',
    method: 'post',
    data
  })
}

export function getHessGrowthTrend(data) {
  return request({
    url: '/sys/userindex/userDevGrowthTrend',
    method: 'post',
    data
  })
}
