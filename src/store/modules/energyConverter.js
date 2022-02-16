const state = {
  pcs1Cur: [
    [
      { name: '线电压AB', value: '0', unit: 'V', icon: 'icon-dianya1', farmId: [pcs1id], protocolType: 41, tdWidth: '25%' },
      { name: '电流A', value: '0', unit: 'A', icon: 'icon-pinshuai', farmId: [pcs1id], protocolType: 4, tdWidth: '25%' },
      { name: '功率因数', value: '0', unit: '', icon: 'icon-gongshuaiyinshu-', farmId: [pcs1id], protocolType: 47, tdWidth: '25%' },
      { name: '效率', value: '0', coefficient: 100, unit: '%', icon: 'icon-gongshuaiyinshu-', farmId: [pcs1id], protocolType: 48, tdWidth: '25%' }
    ],
    [
      { name: '线电压BC', value: '0', unit: 'V', icon: 'icon-dianya1', farmId: [pcs1id], protocolType: 42 },
      { name: '电流B', value: '0', unit: 'A', icon: 'icon-pinshuai', farmId: [pcs1id], protocolType: 5 },
      { name: '交流有功功率', value: '0', unit: 'kW', icon: 'icon-yougonggongshuai', farmId: [pcs1id], protocolType: 7 },
      // { name: '温度', value: '0', unit: '℃', icon: 'icon-yougonggongshuai', farmId: [pcs1id], protocolType: 56 }
    ],
    [
      { name: '线电压CA', value: '0', unit: 'V', icon: 'icon-dianya1', farmId: [pcs1id], protocolType: 43 },
      { name: '电流C', value: '0', unit: 'A', icon: 'icon-pinshuai', farmId: [pcs1id], protocolType: 6 },
      { name: 'IGBT温度', value: '0', unit: '℃', icon: 'icon-temperate', farmId: [pcs1id], protocolType: 49 },
      // { name: '湿度', value: '0', unit: '%RH', icon: 'icon-temperate', farmId: [pcs1id], protocolType: 57 }
    ],
    [
      { name: '直流侧电压', value: '0', unit: 'V', icon: 'icon-dianya1', farmId: [pcs1id], protocolType: 10 },
      { name: '直流侧电流', value: '0', unit: 'A', icon: 'icon-dianliu1', farmId: [pcs1id], protocolType: 27 },
      { name: '直流侧功率', value: '0', unit: 'kW', icon: 'icon-zonggongshuai', farmId: [pcs1id], protocolType: 26 }
    ]
  ],
  pcs1Chart: [
    { data: {}, protocolType: 41 },
    { data: {}, protocolType: 42 },
    { data: {}, protocolType: 43 },
    { data: {}, protocolType: 10 },
    { data: {}, protocolType: 7 }
  ]
}

const mutations = {
  SET_PCS1CUR: (state, pcs1Cur) => {
    state.pcs1Cur = pcs1Cur
  },
  SET_PCS1CHART: (state, pcs1Chart) => {
    state.pcs1Chart = pcs1Chart
  }
}

const actions = {
  setPcs1Cur({ commit }, pcs1Cur) {
    commit('SET_PCS1CUR', pcs1Cur)
  },
  setPcs1Chart({ commit }, pcs1Chart) {
    commit('SET_PCS1CHART', pcs1Chart)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
