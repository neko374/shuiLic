import request from '@/utils/request'

export function UserManagementGetList(data) {
  return request({
    url: '/sys/user/list',
    method: 'post',
    data: data
  })
}

export function UserManagementAdd(data) {
  return request({
    url: '/sys/user/save',
    method: 'post',
    data: data
  })
}

export function UserManagementUpdate(data) {
  return request({
    url: '/sys/user/update',
    method: 'post',
    data: data
  })
}

export function UserManagementDelete(data) {
  return request({
    url: '/sys/user/delete',
    method: 'post',
    data: data
  })
}

export function UserManagementPassword(data) {
  return request({
    url: '/sys/user/password',
    method: 'post',
    data: data
  })
}

export function UserManagementInfo(data) {
  return request({
    url: '/sys/user/info/' + data.userId,
    method: 'get',
    params: data
  })
}
