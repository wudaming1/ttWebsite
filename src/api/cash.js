import request from '@/utils/request'

export function addDeal(data) {
  return request({
    url: '/flower-tt/cash/add',
    method: 'post',
    data
  })
}

export function getDeals(data) {
  return request({
    url: '/flower-tt/cash/query',
    method: 'post',
    data
  })
}

export function getTotal(data) {
  return request({
    url: '/flower-tt/cash/queryTotal',
    method: 'post',
    data
  })
}

export function deleteDeal(data) {
  return request({
    url: '/flower-tt/cash/delete',
    method: 'post',
    data
  })
}

export function modifyDeal(data) {
  return request({
    url: '/flower-tt/cash/modify',
    method: 'post',
    data
  })
}
