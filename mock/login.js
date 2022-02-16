/* eslint-disable */
import Mock from 'mockjs'

let mockUuid = null, mockCaptcha = null, mockRoles= null

const namePass =[
  {username: 'admin', password: 'admin', auth: '1'},
  {username: 'editor', password: 'editor', auth: '2'},
  {username: 'visitor', password: 'visitor', auth: '3'}
]

const tokens = {
  'admin': {
    token: 'admin-token'
  },
  'editor': {
    token: 'editor-token'
  },
  'visitor': {
    token: 'visitor-token'
  }
}

export default [
  // user Captcha
  {
    url: '/login/captcha',
    type: 'get',
    response: config => {
      mockUuid = config.query[0]
      mockCaptcha = Mock.mock({ 'regexp': /\w{5}/ }).regexp
      return Mock.mock([Mock.Random.dataImage('50x20', mockCaptcha)])
    }
  },

  // user login
  {
    url: '/mockLogin/login',
    type: 'post',
    response: config => {
      const { username, password, uuid, captcha } = config.body
      if(uuid != mockUuid || captcha.toLowerCase() != mockCaptcha.toLowerCase())
        return {
          code: 500,
          msg: '验证码不正确'
        }
      for(let i= 0; i< namePass.length; i++) {
        if(namePass[i].username == username) {
          if(namePass[i].password == password) {
            mockRoles = namePass[i].auth
            return {
              code: 0,
              token: tokens[username]
            }
          } else {
            return {
              code: 500,
              msg: '用户名或密码不正确'
            }
          }
        }
      }
      return {
        code: 500,
        msg: '用户名或者密码不正确'
      }
    }
  },

  // user info
  {
    url: '/mockLogin/userInfo',
    type: 'get',
    response: _ => {
      return {
        code: 0,
        data: mockRoles
      }
    }
  }
]
