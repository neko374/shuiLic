import request from '@/utils/request'

export function getChartVal(data) {
  return request({
    url: '/sys/farmcfginfo/getChartVal',
    method: 'post',
    data: data
  })
}

export function getCurVal(data) {
  return request({
    url: '/sys/farmcfginfo/getCurVal',
    method: 'post',
    data: data
  })
}

export function getDayCurVal(data) {
  return request({
    url: '/sys/farmcfginfo/getDayCurVal',
    method: 'post',
    data: data
  })
}

// 详情
export function getFarmcfginfoList(data) {
  return request({
    url: '/sys/farmcfginfo/list',
    method: 'post',
    data: data
  })
}
