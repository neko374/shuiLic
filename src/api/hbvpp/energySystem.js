import request from '@/utils/request'

// 用户首页 deviceId必填
export function index(data) {
  return request({
    url: '/sys/userindex/index',
    method: 'post',
    data: data
  })
}

// 查询时间段内BMU运行数据
export function rangeBMURunData(data) {
  return request({
    url: '/sys/userindex/rangeBMURunData',
    method: 'post',
    data: data
  })
}

// 查询时间段内电池运行数据
export function rangeChargeData(data) {
  return request({
    url: '/sys/userindex/rangeChargeData',
    method: 'post',
    data: data
  })
}

// 查询用户及设备信息
export function userAndDevInfo(data) {
  return request({
    url: '/sys/userindex/userAndDevInfo',
    method: 'post',
    data: data
  })
}

// 用户及设备增长趋势图
export function userDevGrowthTrend(data) {
  return request({
    url: '/sys/userindex/userDevGrowthTrend',
    method: 'post',
    data: data
  })
}
