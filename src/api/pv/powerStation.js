import request from '@/utils/request'

// 删除
export function pvDelete(data) {
  return request({
    url: '/sys/farmcfginfo/delete',
    method: 'post',
    data: data
  })
}

// 详情
export function pvInfo(data) {
  return request({
    url: '/sys/farmcfginfo/info/' + data,
    method: 'post',
    data: data
  })
}

// 列表
export function pvList(data) {
  return request({
    url: '/sys/farmcfginfo/list',
    method: 'post',
    data: data
  })
}

// 近30天的发电量
export function pvQueryAllThirtyData(data) {
  return request({
    url: '/sys/farmcfginfo/queryAllThirtyData',
    method: 'post',
    data,
    timeout: 60000
  })
}

// 微电网数据
export function pvQuery(data) {
  return request({
    url: '/sys/farmcfginfo/queryAllTypeFarmInfo',
    method: 'post',
    data: data
  })
}

// 电站装机及发电量信息
export function pvQueryFarmInfo(data) {
  return request({
    url: '/sys/farmcfginfo/queryFarmInfo',
    method: 'post',
    data: data
  })
}

// 保存
export function pvSave(data) {
  return request({
    url: '/sys/farmcfginfo/save',
    method: 'post',
    data: data
  })
}

// 修改
export function pvUpdate(data) {
  return request({
    url: '/sys/farmcfginfo/update',
    method: 'post',
    data: data
  })
}

// 获取天气
export function pvWeather(data) {
  return request({
    url: '/sys/farmcfginfo/weather',
    method: 'post',
    data: data
  })
}

// 根据微网id，查询所有光伏电站
export function pvQueryMicroPVInfos(data) {
  return request({
    url: '/sys/farmcfginfo/queryMicroPVInfos',
    method: 'post',
    data: data
  })
}

// 根据微网id，查询所有光伏电站实时值累加数据
export function pvQueryMicroPVRtVals(data) {
  return request({
    url: '/sys/farmcfginfo/queryMicroPVRtVals',
    method: 'post',
    data: data
  })
}

// 根据单个场站id，查询场站电站实测信息
export function pvQueryPVRtVals(data) {
  return request({
    url: '/sys/farmcfginfo/queryPVRtVals',
    method: 'post',
    data: data
  })
}

// 根据单个场站id关联气象站，查询气象站下所有光伏电站
export function pvQueryRttowerInfos(data) {
  return request({
    url: '/sys/farmcfginfo/queryRttowerInfos',
    method: 'post',
    data: data
  })
}
