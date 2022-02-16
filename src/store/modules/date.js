const state = {
  nowDayY: new Date().getFullYear(),
  nowDayM: (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1),
  nowDayD: new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate(),
  nextDayY: new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getFullYear(),
  nextDayM: (new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getMonth() + 1) < 10 ? '0' + (new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getMonth() + 1) : (new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getMonth() + 1),
  nextDayD: new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getDate() < 10 ? '0' + new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getDate() : new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getDate()
}
state.nowDate = state.nowDayY + '-' + state.nowDayM + '-' + state.nowDayD
state.nextDate = state.nextDayY + '-' + state.nextDayM + '-' + state.nextDayD

export default {
  namespaced: true,
  state
}
