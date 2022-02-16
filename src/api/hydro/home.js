import request from '@/utils/request'

export function hydroCountInfo(data) {
  return request({
    baseURL: hydroIp,
    url: '/homepage/farmmainpageinfo/countInfo',
    method: 'post',
    data
  })
}

export function hydroCurDayNKw(data) {
  return request({
    baseURL: hydroIp,
    url: '/homepage/farmmainpageinfo/curDaynKw',
    method: 'post',
    data
  })
}

export function hydroCurElc(data) {
  return request({
    baseURL: hydroIp,
    url: '/homepage/farmmainpageinfo/curElc',
    method: 'post',
    data
  })
}

export function hydroCurFarmState(data) {
  return request({
    baseURL: hydroIp,
    url: '/homepage/farmmainpageinfo/curFarmState',
    method: 'post',
    data
  })
}

export function hydroCurVoltage(data) {
  return request({
    baseURL: hydroIp,
    url: '/homepage/farmmainpageinfo/curVoltage',
    method: 'post',
    data
  })
}

export function hydroRunningInfo(data) {
  return request({
    baseURL: hydroIp,
    url: '/homepage/farmmainpageinfo/runningInfo',
    method: 'post',
    data
  })
}

export function hydroTypeInfo(data) {
  return request({
    baseURL: hydroIp,
    url: '/homepage/farmmainpageinfo/typeInfo',
    method: 'post',
    data
  })
}
