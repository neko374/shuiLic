import { mqttprojectInfoList } from '@/api/mqtt/projectInfo'
import { mqttsoftwareInfoInfo } from '@/api/mqtt/softwareInfo'

const state = {
  defaultProject: null,
  defaultSoftware: null,
  softwareName: ''
}

const mutations = {
  SET_DEFAULT_PROJECT: (state, defaultProject) => {
    state.defaultProject = defaultProject
  },
  SET_DEFAULT_SOFTWARE: (state, defaultSoftware) => {
    state.defaultSoftware = defaultSoftware
  },
  SET_SOFTWARE_NAME: (state, softwareName) => {
    state.softwareName = softwareName
  }
}

const actions = {
  defaultProjectSGet({ commit }) {
    return new Promise(resolve => {
      if (!state.defaultProject) {
        mqttprojectInfoList({ id:7 }).then(response => {
          if (response.code === 0) {
            const res = response.page.list[0]
            commit('SET_DEFAULT_PROJECT', res)
            resolve(res)
          }
        })
      } else {
        resolve(state.defaultProject)
      }
    })
  },
  defaultSoftwareSGet({ commit }) {
    return new Promise(async resolve => {
      const project = await this.dispatch('project/defaultProjectSGet',{})
      mqttsoftwareInfoInfo(project.softwareId).then(response => {
        if (response.code === 0) {
          const res = response.aipowerSoftwareInfo
          commit('SET_DEFAULT_SOFTWARE', res)
          commit('SET_SOFTWARE_NAME', res.name)
          resolve(res)
        } else {
          resolve(state.defaultSoftware)
        }
      })
    })
  },
  refreshProSof({ commit }) {
    return new Promise(() => {
      this.dispatch('project/defaultSoftwareSGet',{})
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

