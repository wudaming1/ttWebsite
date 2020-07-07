import request from '@/utils/request'

export function getVipInfo(data) {
  return request({
    url: '/flower-tt/vip/queryVip',
    method: 'post',
    data
  })
}