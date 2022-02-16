import request from '@/utils/request'

export function CountryInfo(data) {
  return request({
    url: '/sys/sysarea/info/' + data,
    method: 'post',
    data: data
  })
}

export function CountryList(data) {
  return request({
    url: '/sys/sysarea/list',
    method: 'post',
    data: data
  })
}

export function CountryDelete(data) {
  return request({
    url: '/sys/sysarea/delete',
    method: 'post',
    data: data
  })
}

export function CountrySave(data) {
  return request({
    url: '/sys/sysarea/save',
    method: 'post',
    data: data
  })
}

export function CountryUpdate(data) {
  return request({
    url: '/sys/sysarea/update',
    method: 'post',
    data: data
  })
}
