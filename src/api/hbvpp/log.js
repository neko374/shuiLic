import request from '@/utils/request'
import store from '@/store'
import route from '@/router'

export function getLogList(data) {
  return request({
    url: '/sys/log/list',
    method: 'post',
    data: data
  })
}

export function getLogSave(data) {
  data.createDate = new Date().format('yyyy-MM-dd HH:mm:ss')
  data.time = 0
  if (route.app._route.matched[0].meta.title) { data.method = route.app._route.matched[0].meta.title + '/' + route.app._route.meta.title } else { data.method = route.app._route.meta.title }
  data.username = store.state.user.userName
  return request({
    url: '/sys/log/save',
    method: 'post',
    data: data
  })
}
