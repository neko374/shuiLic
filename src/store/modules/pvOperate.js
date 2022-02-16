const state = {
  pv1Cur: [
    [
      { name: '装机容量', value: '20', unit: 'kW', icon: 'icon-zhuangjirongliang' },
      { name: '有功功率', value: '0', unit: 'kW', icon: 'icon-icon-power-power', farmId: [pv1id], protocolType: 7 },
      { name: '累计发电量', value: '0', unit: 'kWh', icon: 'icon-fadianliang', farmId: [pv1id], protocolType: 30 },
      { name: '电站状态', value: '正常', icon: 'icon-zhuangtai', farmId: [pv1id], protocolType: 20, stateQk: [
        { type: 1, name: '正常', state: 0 },
        { type: 0, name: '等待', state: 0 },
        { type: 2, name: '错误', state: 0 }
      ] }
    ]
  ],
  pv1Chart: [
    { name: '光伏电站', data: {}, protocolType: 7 },
    { name: '光伏电站', data: {}, protocolType: 28 }
  ]
}

const mutations = {
  
}

const actions = {
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
