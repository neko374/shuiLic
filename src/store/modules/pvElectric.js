const state = {
  pv1Cur: [
    [
      { name: 'A相电压', value: '0', unit: 'V', icon: 'icon-dianya1', farmId: [pv1id], protocolType: 116 },
      { name: 'B相电压', value: '0', unit: 'V', icon: 'icon-dianya1', farmId: [pv1id], protocolType: 117 },
      { name: 'C相电压', value: '0', unit: 'V', icon: 'icon-dianya1', farmId: [pv1id], protocolType: 118 }
    ]
  ],
  

  pv1Chart: [
    { name: '光伏电站', data: {}, protocolType: 116 },
    { name: '光伏电站', data: {}, protocolType: 117 },
    { name: '光伏电站', data: {}, protocolType: 118 }
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
