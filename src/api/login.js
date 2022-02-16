import request from '@/utils/request'

export function sysLogin(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data: data
  })
}

export function captcha(data) {
  return request({
    url: `/captcha.jpg?uuid=${data}`,
    method: 'get',
    responseType: 'arraybuffer',
    data: data
  })
}

export function sysMenuNav() {
  return request({
    url: '/sys/menu/nav',
    method: 'get'
  })
}

export function sysUserInfo() {
  return request({
    url: '/sys/user/info',
    method: 'get'
  })
}

export function sysLogout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}

export function sysUserManagementInfo(data) {
  return request({
    url: '/sys/user/info/' + data,
    method: 'get',
    params: data
  })
}
