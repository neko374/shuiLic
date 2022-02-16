import request from '@/utils/request'

// 查询时间段内电池运行数据
export function micRangeChargeData(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessbatteryrundata/rangeChargeData',
    method: 'post',
    data
  })
}
