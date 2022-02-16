import request from '@/utils/request'

export function rangeChargeData(data) {
  return request({
    url: '/sys/hessbatteryrundata/rangeChargeData',
    method: 'post',
    data: data
  })
}

