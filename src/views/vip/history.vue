<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="手机号：">
        <el-input v-model="form.phone" placeholder="请输入会员手机号" clearable />
      </el-form-item>
      <el-form-item label="起始日期：">
        <el-date-picker v-model="form.startTime" type="date" placeholder="选择起始日期" />
      </el-form-item>
      <el-form-item label="結束日期：">
        <el-date-picker v-model="form.endTime" type="date" placeholder="选择結束日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查詢</el-button>
      </el-form-item>
    </el-form>
    <el-pagination
      :current-page="pagination.current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-table :data="historyList" style="width: 100%" border stripe>
      <el-table-column prop="createTime" label="时间" :formatter="dateFormat" width="180" />
      <el-table-column prop="phone" label="手机号" width="180" />
      <el-table-column label="类型" width="180">
        <template slot-scope="scope">{{ scope.row | type }}</template>
      </el-table-column>
      <el-table-column prop="money" label="金额" />
    </el-table>
  </div>
</template>

<script>
import {
  getComsumeHistory
} from '@/api/vip'
import { formatTime2Date } from '@/utils/format'

export default {
  filters: {
    type: function(data) {
      const value = data.type
      if (value === 'Consume') return '消费'
      if (value === 'Charge') return '充值'
      return ''
    }
  },
  data() {
    return {
      form: {
        startTime: null,
        endTime: null,
        phone: null
      },
      pagination: {
        current: 1,
        size: 20,
        total: 0
      },
      historyList: []
    }
  },
  methods: {
    handleSizeChange(newSize) {
      this.pagination.size = newSize
      this.pagination.current = 1
      this.getList()
    },
    handleCurrentChange(value) {
      this.pagination.current = value
      this.getList()
    },
    refresh() {
      this.pagination.current = 1
      this.getList()
    },
    getList() {
      const params = {
        shop: 'tt',
        phone: this.form.phone,
        pageSize: this.pagination.size,
        page: this.pagination.current
      }
      if (this.form.startTime !== null) {
        this.form.startTime.setHours(0, 0, 0, 0)
        params.startTime = this.form.startTime.getTime()
      }
      if (this.form.endTime !== null) {
        this.form.endTime.setHours(23, 60, 60, 0)
        params.endTime = this.form.endTime.getTime()
      }
      getComsumeHistory(params).then(res => {
        this.historyList = res.data.items
        this.pagination.total = res.data.total
      })
    },
    dateFormat(row, column) {
      return formatTime2Date(row.createTime)
    }
  }
}
</script>
