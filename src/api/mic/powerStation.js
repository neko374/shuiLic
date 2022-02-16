import request from '@/utils/request'

export function micDelete(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/microgridfarmcfginfo/delete',
    method: 'post',
    data
  })
}

export function micList(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/microgridfarmcfginfo/list',
    method: 'post',
    data
  })
}

export function micSave(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/microgridfarmcfginfo/save',
    method: 'post',
    data
  })
}

export function micUpdate(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/microgridfarmcfginfo/update',
    method: 'post',
    data
  })
}

// 根据微网电站id，查询微网下所有光伏电站
export function micQueryMicroPVInfos(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/microgridfarmcfginfo/queryMicroPVInfos',
    method: 'post',
    data
  })
}

// 根据微网电站id，查询微网下所有光伏电站实时值累加数据
export function micQueryMicroPVRtVals(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/microgridfarmcfginfo/queryMicroPVRtVals',
    method: 'post',
    data
  })
}

// 根据单个场站电站id，查询场站电站实测信息
export function micQueryPVRtVals(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/microgridfarmcfginfo/queryPVRtVals',
    method: 'post',
    data
  })
}

// 根据单个场站电站id关联气象站，查询气象站下所有光伏电站
export function micQueryRttowerInfos(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/microgridfarmcfginfo/queryRttowerInfos',
    method: 'post',
    data
  })
}

// 获取所有微网基础信息数据 cityId countyId 必填，查询市内所有城市下变电站时传入 0
export function micQueryMicrogridFarmInfos(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/microgridfarmcfginfo/queryMicrogridFarmInfos',
    method: 'post',
    data
  })
}

// 查询电站装机及发电量信息
export function micQueryFarmInfo(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/microgridfarmcfginfo/queryFarmInfo',
    method: 'post',
    data
  })
}
