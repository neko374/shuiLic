const state = {
  mainList: [
    [
      { deviceName: '光伏电站', protocolType: 7, name: '光伏总有功功率', value: '', valuec: [], unit: 'kW', icon: 'icon-icon-power-power' },
      { deviceName: 'PCS1', protocolType: 66, name: '储能日充电量', value: '0', valuec: [], unit: 'kWh', icon: 'icon-zhuangtai' },
      { deviceName: '储能集装箱终端', name: '系统运行模式', value: '并网', icon: 'icon-yunhangmoshi', protocolType: 51, stateQk: [
        { type: 0, name: '系统初始化' },
        { type: 1, name: '系统停机' },
        { type: 2, name: '系统离网运行' },
        { type: 3, name: '系统并网运行' },
        { type: 4, name: '系统离网开机过程' },
        { type: 5, name: '系统并网开机过程' },
        { type: 6, name: '系统离网停机过程' },
        { type: 7, name: '系统并网停机过程' },
        { type: 11, name: '通讯异常' },
        { type: 12, name: '系统异常，等待关机指令' },
        { type: 13, name: '异常处理状态' }
      ] }
    ],
    [
      { deviceName: '光伏电站', protocolType: 30, name: '光伏累计发电量', value: '0', valuec: [], unit: 'kWh', icon: 'icon-fadianliang' },
      { deviceName: 'PCS1', protocolType: 67, name: '储能日放电量', value: '0', valuec: [], unit: 'kWh', icon: 'icon-fadianliang' },
      { deviceName: '储能集装箱终端', name: '系统运行状态', value: '正常', icon: 'icon-zhuangtai', protocolType: 20, stateQk: [
        { type: 0, name: '正常' },
        { type: 1, name: '正常' },
        { type: 2, name: '正常' },
        { type: 3, name: '正常' },
        { type: 4, name: '正常' },
        { type: 5, name: '正常' },
        { type: 6, name: '正常' },
        { type: 7, name: '正常' },
        { type: 11, name: '异常' },
        { type: 12, name: '异常' },
        { type: 13, name: '异常' }
      ] }
    ]
  ],
  svgList: [
    { name: '线电压AB', value: '0', unit: 'V', farmId: [pcs1id], protocolType: 41 },
    { name: '线电压BC', value: '0', unit: 'V', farmId: [pcs1id], protocolType: 42 },
    { name: '线电压CA', value: '0', unit: 'V', farmId: [pcs1id], protocolType: 43 },
    { name: '光伏总有功功率', value: '', unit: 'kW', farmId: [pv1id], protocolType: 7  },
    { name: 'PCS功率', value: '', unit: 'kW', farmId: [pcs1id], protocolType: 7  },
    { name: 'SOC', value: '', unit: '%', coefficient: 100,farmId: [bms1id], protocolType: 12 }
  ]
}

const mutations = {
  SET_MAIN_LIST: (state, mainList) => {
    state.mainList = mainList
  },
  SET_SVG_LIST: (state, svgList) => {
    state.svgList = svgList
  }
}

const actions = {
  setMainList({ commit }, mainList) {
    commit('SET_MAIN_LIST', mainList)
  },
  setSvgList({ commit }, svgList) {
    commit('SET_SVG_LIST', svgList)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
