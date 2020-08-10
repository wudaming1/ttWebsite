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

export function getComsumeHistory(data) {
  return request({
    url: '/flower-tt/vip/queryRecord',
    method: 'post',
    data
  })
}

export function queryVipList(data) {
  return request({
    url: '/flower-tt/vip/list',
    method: 'post',
    data
  })
}

export function modifyVipPassword(data) {
  return request({
    url: '/flower-tt/vip/modifyPassword',
    method: 'post',
    data
  })
}
export function yearReport(data) {
  return request({
    url: '/flower-tt/vip/getYearReport',
    method: 'post',
    data
  })
}
