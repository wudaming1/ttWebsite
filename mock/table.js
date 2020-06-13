import Mock from 'mockjs'

// const data = Mock.mock({
//   'items|30': [{
//     id: '@id',
//     title: '@sentence(10, 20)',
//     'status|1': ['published', 'draft', 'deleted'],
//     author: 'name',
//     display_time: '@datetime',
//     pageviews: '@integer(300, 5000)'
//   }]
// })

const data = [
  {name:'彩玫', price:20, number:20, modifyTime:'20200606'},
  {name:'彩玫', price:20, number:20, modifyTime:'20200606'},
  {name:'彩玫', price:20, number:20, modifyTime:'20200606'},
  {name:'彩玫', price:20, number:20, modifyTime:'20200606'},
  {name:'彩玫', price:20, number:20, modifyTime:'20200606'},
]

export default [
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      const items = data
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
