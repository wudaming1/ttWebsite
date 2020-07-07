import request from '@/utils/request'

export function getVipInfo(data) {
  return request({
    url: '/flower-tt/vip/queryVip',
    method: 'post',
    data
  })
}
export function createVip(data) {
  return request({
    url: '/flower-tt/vip/create',
    method: 'post',
    data
  })
}
export function charge(data) {
  return request({
    url: '/flower-tt/vip/charge',
    method: 'post',
    data
  })
}
export function consume(data) {
  return request({
    url: '/flower-tt/vip/consume',
    method: 'post',
    data
  })
}
