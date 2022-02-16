export const deviceList = [
  { value: 'hess', label: '储能' },
  { value: 'pv', label: '光伏' }
]
export const hessList = [
  { value: 'BMS1', label: 'BMS' },
  { value: 'PCS1', label: 'PCS' },
  { value: 'batteryContainerA', label: '电池集装箱其他' }
]
export const pvList = [
  { value: 'PV1', label: '光伏电站' },
]

export const deviceListData = {
  BMS1: bms1id,
  PCS1: pcs1id,
  PV1: pv1id,
  batteryContainerA: [hess1ktId, hess1kt2Id, hess1kt3Id, hess1AmcId]
}

export const deviceZTList = {
  'YC31': [
    { value: 2, name: '充电' },
    { value: 1, name: '放电' },
    { value: 0, name: '静置' }
  ]
}

export const devicePvZTList = {
  'YC143': [
    { value: 0, name: '等待' },
    { value: 1, name: '等待' },
    { value: 2, name: '错误' }
  ],
  'YC64': [
    { value: 0, name: '停止' },
    { value: 1, name: '运行' }
  ],
  'YC71': [
    { value: 0, name: '停止' },
    { value: 1, name: '运行' }
  ],
  'YC78': [
    { value: 0, name: '停止' },
    { value: 1, name: '运行' }
  ],
}
