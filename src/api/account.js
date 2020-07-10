import request from '@/utils/request'

const prefix = 'account'

export function add(data) {
  return request({
    url: `/flower-tt/${prefix}/add`,
    method: 'post',
    data
  })
}

export function query(data) {
  return request({
    url: `/flower-tt/${prefix}/query`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/flower-tt/${prefix}/delete`,
    method: 'post',
    data
  })
}

export function modify(data) {
  return request({
    url: `/flower-tt/${prefix}/modify`,
    method: 'post',
    data
  })
}
