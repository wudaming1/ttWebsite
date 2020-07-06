<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="起始日期：">
        <el-date-picker v-model="form.startTime" type="date" placeholder="选择起始日期" />
      </el-form-item>
      <el-form-item label="結束日期：">
        <el-date-picker v-model="form.endTime" type="date" placeholder="选择結束日期" />
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" @click="getList">查詢</el-button>
      </el-form-item>
    </el-form>
    <ve-line :data="chartData" :extend="extend" />
  </div>
</template>

<script>
import {
  getDeals
} from '@/api/cash'
export default {
  data() {
    this.extend = {
      series: {
        label: {
          normal: {
            show: true
          }
        }
      }
    }
    return {
      sourceTypeList: [
        { code: 'wx', value: '微信' },
        { code: 'zfb', value: '支付宝' },
        { code: 'xj', value: '现金' }
      ],
      form: {
        startTime: new Date(),
        endTime: new Date()
      },
      chartData: {
        columns: ['日期', '微信', '支付宝', '现金'],
        rows: [
          { '日期': '7月1日', '微信': 1393, '支付宝': 1093, '现金': 32 },
          { '日期': '7月2日', '微信': 3530, '支付宝': 3230, '现金': 26 },
          { '日期': '7月3日', '微信': 2923, '支付宝': 2623, '现金': 76 },
          { '日期': '7月4日', '微信': 1723, '支付宝': 1423, '现金': 49 },
          { '日期': '7月5日', '微信': 3792, '支付宝': 3492, '现金': 323 },
          { '日期': '7月6日', '微信': 4593, '支付宝': 4293, '现金': 78 }
        ]
      }
    }
  },
  methods: {
    getList() {
      const params = {
        shop: 'tt'
      }
      if (this.form.startTime !== null) {
        this.form.startTime.setHours(0, 0, 0, 0)
        params.startTime = this.form.startTime.getTime()
      }
      if (this.form.endTime !== null) {
        this.form.endTime.setHours(23, 59, 59, 0)
        params.endTime = this.form.endTime.getTime()
      }
      getDeals(params).then(res => {
        this.historyList = res.data.items
        this.pagination.total = res.data.total
      })
    }
  }
}
</script>
