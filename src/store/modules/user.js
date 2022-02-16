import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { sysLogin, sysUserInfo, sysLogout } from '@/api/login'
import avatar from '@/assets/avatar.png'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roleId: '',
  roles: [],
  loginState: false,
  userId: '',
  userName: ''
}

const users = {
  '1': {
    roles: ['aipower'],
    roleId: '1',
    introduction: 'I am an editor',
    avatar: avatar,
    name: 'Normal visitor'
  },
  '2': {
    roles: ['agent'],
    roleId: '2',
    introduction: 'I am an editor',
    avatar: avatar,
    name: 'Normal Editor'
  },
  '3': {
    roles: ['user'],
    roleId: '3',
    introduction: 'I am a super administrator',
    avatar: avatar,
    name: 'Super Admin'
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_ROLEID: (state, roleId) => {
    state.roleId = roleId
  },
  SET_LOGIN_STATE: (state, loginState) => {
    state.loginState = loginState
  },
  SET_USER_NAME: (state, userName) => {
    state.userName = userName
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, captcha, uuid } = userInfo
    return new Promise((resolve, reject) => {
      sysLogin({ username: username.trim(), password: password.trim(), captcha: captcha, uuid: uuid }).then(data => {
        if (data.code === 0) {
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve(false)
        } else if (data.code === 500) {
          alert(data.msg)
          resolve(true)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // commit('SET_TOKEN', hbvppToken)
      // setToken(hbvppToken)
      // const data = users['1']
      // const { roleId, roles, name, avatar, introduction } = data
      // commit('SET_ROLES', roles)
      // commit('SET_USERID', '')
      // commit('SET_ROLEID', roleId)
      // commit('SET_NAME', name)
      // commit('SET_AVATAR', avatar)
      // commit('SET_INTRODUCTION', introduction)
      // resolve(data)
      sysUserInfo().then(res => {
        if (res.code === 0) {
          const data = users[res.user.roleIdList[0]]
          const { roleId, roles, name, avatar, introduction } = data
          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }
          commit('SET_ROLES', roles)
          commit('SET_USERID', res.user.userId)
          commit('SET_ROLEID', roleId)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', introduction)
          commit('SET_USER_NAME', res.user.username)
          resolve(data)
        } else if (res.code !== 401) {
          const data = users['1']
          const { roleId, roles, name, avatar, introduction } = data
          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }
          commit('SET_ROLES', roles)
          commit('SET_ROLEID', roleId)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', introduction)
          resolve(data)
        } else {
          reject()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  changeLoginState({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOGIN_STATE', true)
      resolve()
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_USERID', '')
      commit('SET_ROLEID', '')
      commit('SET_NAME', '')
      commit('SET_LOGIN_STATE', false)
      removeToken()
      resetRouter()
      resolve()
      // if (getToken() == hbvppToken) { resolve() } else {
      //   sysLogout().then(res => {
      //     commit('SET_TOKEN', '')
      //     commit('SET_ROLES', [])
      //     commit('SET_USERID', '')
      //     commit('SET_ROLEID', '')
      //     commit('SET_NAME', '')
      //     commit('SET_LOGIN_STATE', false)
      //     removeToken()
      //     resetRouter()
      //     resolve()
      //   })
      // }
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
