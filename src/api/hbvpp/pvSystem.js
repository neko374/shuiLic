import request from '@/utils/request'

// 年月总电量汇总
export function allRated(data) {
  return request({
    url: '/homepage/farmmainpageinfo/allRated',
    method: 'post',
    data: data
  })
}

// 功率与电量
export function countInfo(data) {
  return request({
    url: '/homepage/farmmainpageinfo/countInfo',
    method: 'post',
    data: data
  })
}

// 发电量总计
export function countRated(data) {
  return request({
    url: '/homepage/farmmainpageinfo/countRated',
    method: 'post',
    data: data
  })
}

// 今日总发电量
export function curDaynKw(data) {
  return request({
    url: '/homepage/farmmainpageinfo/curDaynKw',
    method: 'post',
    data: data
  })
}

// 电站状态
export function farmstate(data) {
  return request({
    url: '/homepage/farmmainpageinfo/farmstate',
    method: 'post',
    data: data
  })
}

// 近30日发电量
export function thirtyDayscumulativePV(data) {
  return request({
    url: '/homepage/farmmainpageinfo/thirtyDayscumulativePV',
    method: 'post',
    data: data
  })
}
