const state = {
  bms1Cur: [
    [
      { name: '总电压', value: '', unit: 'V', icon: 'icon-dianya1', farmId: [bms1id], protocolType: 31, tdWidth: '25%' },
      { name: '总电流', value: '', unit: 'A', icon: 'icon-dianliu1', farmId: [bms1id], protocolType: 32, tdWidth: '25%' },
      { name: 'SOC', value: '', unit: '%', coefficient: 100, icon: 'icon-Soclowalarm', farmId: [bms1id], protocolType: 12, tdWidth: '25%' },
      { name: '电池运行状态', value: '', icon: 'icon-zhuangtai', farmId: [bms1id], protocolType: 20, stateQk: [
        { type: 0, name: '静置状态', state: 0 },
        { type: 1, name: '放电状态', state: 0 },
        { type: 2, name: '充电状态', state: 0 }
      ] }
    ],
    [
      { name: '最高单体电压', value: '', unit: 'V', icon: 'icon-dantidianya', farmId: [bms1id], protocolType: 33 },
      { name: '最低电池温度', value: '', unit: '℃', icon: 'icon-dantiwendu', farmId: [bms1id], protocolType: 35 },
      { name: 'SOH', value: '', unit: '%', coefficient: 100, icon: 'icon-leijichongdianliang', farmId: [bms1id], protocolType: 13 },
      // { deviceName: '1#储能箱温湿度传感器', name: '室内湿度', value: '0', unit: '%RH', icon: 'icon-temperate', farmId: [hess1temId], protocolType: 57 }
      { deviceName: '1#储能箱空调', name: '空调1状态', value: '', icon: 'icon-zhuangtai', farmId: [hess1ktId], protocolType: 20, stateQk: [
        { type: 0, name: '停止' },
        { type: 1, name: '运行' },
        { type: 2, name: '未选配' }
      ] }
    ],
    [
      { name: '最低单体电压', value: '', unit: 'V', icon: 'icon-dantidianya', farmId: [bms1id], protocolType: 34 },
      { name: '最高电池温度', value: '', unit: '℃', icon: 'icon-dantiwendu', farmId: [bms1id], protocolType: 37 },
      // { deviceName: '1#储能箱水浸传感器', name: '水浸状态', value: '', icon: 'icon-zhuangtai', farmId: [hess1sjId], tdWidth: '25%', protocolType: 20, stateQk: [
      //   { type: 0, name: '正常' },
      //   { type: 1, name: '有水' }
      // ] },
      { deviceName: '1#储能箱温湿度传感器', name: '室内温度', value: '0', unit: '℃', icon: 'icon-temperate', farmId: [hess1ktId,hess1kt2Id,hess1kt3Id], protocolType: 56, isGetMax:true },
      { deviceName: '1#储能箱空调', name: '空调2状态', value: '', icon: 'icon-zhuangtai', farmId: [hess1kt2Id], protocolType: 20, stateQk: [
        { type: 0, name: '停止' },
        { type: 1, name: '运行' },
        { type: 2, name: '未选配' }
      ] }
    ],
    [
      { name: '累计充电量', value: '', unit: 'kWh', icon: 'icon-leijichongdianliang', farmId: [bms1id], protocolType: 18 },
      { name: '最低电池温度编号', value: '', icon: 'icon-bianhao', farmId: [bms1id], protocolType: [52, 36], separator: '-' },
      { name: '最低单体电压编号', value: '', icon: 'icon-bianhao', farmId: [bms1id], protocolType: [54, 40], separator: '-' },
      { deviceName: '1#储能箱空调', name: '空调3状态', value: '', icon: 'icon-zhuangtai', farmId: [hess1kt3Id], protocolType: 20, stateQk: [
        { type: 0, name: '停止' },
        { type: 1, name: '运行' },
        { type: 2, name: '未选配' }
      ] }
      
    ],
    [
      { name: '累计放电量', value: '', unit: 'kWh', icon: 'icon-kefangdianliang', farmId: [bms1id], protocolType: 19 },
      { name: '最高电池温度编号', value: '', icon: 'icon-bianhao', farmId: [bms1id], protocolType: [53, 38], separator: '-' },
      { name: '最高单体电压编号', value: '', icon: 'icon-bianhao', farmId: [bms1id], protocolType: [55, 39], separator: '-' },
      
    ]
  ],
  bms1Chart: [
    { deviceName: 'PCS1', data: {}, protocolType: 66 },
    { deviceName: 'PCS1', data: {}, protocolType: 67 },
    { data: {}, protocolType: 12, coefficient: 100 }
  ]
}

const mutations = {
  SET_MBS1CUR: (state, bms1Cur) => {
    state.bms1Cur = bms1Cur
  },
  SET_MBS1CHART: (state, bms1Chart) => {
    state.bms1Chart = bms1Chart
  }
}

const actions = {
  setBms1Cur({ commit }, bms1Cur) {
    commit('SET_MBS1CUR', bms1Cur)
  },
  setBms1Chart({ commit }, bms1Chart) {
    commit('SET_MBS1CHART', bms1Chart)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
