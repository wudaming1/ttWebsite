import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/flower-tt/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/flower-tt/user/info',
    method: 'get'
  })
}
