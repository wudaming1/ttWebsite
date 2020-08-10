<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="年份：">
        <el-date-picker
          v-model="year"
          type="year"
          value-format="yyyy"
          :picker-options="pickerOptions"
          placeholder="选择年"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data" style="width: 100%" border stripe>
      <el-table-column prop="month" label="月份" width="180" />
      <el-table-column prop="totalCharge" label="充值总金额" />
      <el-table-column prop="totalConsume" label="消费总金额" />
    </el-table>
  </div>
</template>

<script>
import { yearReport } from '@/api/vip'
import { isEmpty } from '@/utils/validate'
// import {formatTime2Date2} from '@/utils/format'

export default {
  data() {
    return {
      year: null,
      data: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  mounted() {
    this.year = new Date().getFullYear().toString()
  },
  methods: {
    queryData() {
      if (isEmpty(this.year)) {
        this.$message({
          message: '请输入选择年份！',
          type: 'info'
        })
        return
      }
      const params = { year: parseInt(this.year) }
      yearReport(params).then(res => {
        this.data = res.data
      })
    }
  }
}
</script>

<style lang='scss'>
.vip-charge-panel {
  display: inline-block;
  text-align: center;
  width: 500px;
  background-color: #99a9bf;
  padding: 20px;
  margin-bottom: 20px;

  .el-select {
    width: 100%;
  }
}

.vip-info-panel {
  text-align: center;
  font-size: 20px;
  background-color: #99a9bf;
  padding: 20px;
  margin-bottom: 20px;
}

.el-row {
  margin-bottom: 20px;
  margin-top: 20px;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  height: 36px;
  line-height: 36px;
  font-size: 16px;
  text-align: left;
  padding-left: 20px;
  vertical-align: middle;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
