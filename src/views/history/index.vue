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
      <el-table-column prop="time" label="时间" :formatter="dateFormat" width="180" />
      <el-table-column label="来源" width="180">
        <template slot-scope="scope">{{ scope.row | source }}</template>
      </el-table-column>
      <el-table-column prop="count" label="金额" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showDialog(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="showDleteComfirm(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改记录" :visible.sync="dealDialog.show">
      <el-form :inline="true">
        <el-form-item label="类型：">
          <el-select v-model="dealDialog.type">
            <el-option
              v-for="item in sourceTypeList"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="金额(元)：">
          <el-input v-model="dealDialog.money" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmModify">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDeals,
  deleteDeal,
  modifyDeal
} from '@/api/cash'
import { formatTime2Date } from '@/utils/format'
export default {
  filters: {
    source: function(data) {
      const value = data.type
      if (value === 'wx') return '微信'
      if (value === 'zfb') return '支付宝'
      if (value === 'xj') return '现金'
      return ''
    }
  },
  data() {
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
      pagination: {
        current: 1,
        size: 20,
        total: 0
      },
      historyList: [],
      dealDialog: {
        show: false,
        id: '',
        type: '',
        money: ''
      }
    }
  },
  mounted() {
    this.getList()
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
      getDeals(params).then(res => {
        this.historyList = res.data.items
        this.pagination.total = res.data.total
      })
    },
    deleteItem(id) {
      deleteDeal({ _id: id }).then(res => {
        this.refresh()
      })
    },
    confirmModify() {
      const params = {
        id: this.dealDialog.id,
        type: this.dealDialog.type,
        money: this.dealDialog.money
      }
      modifyDeal(params)
        .then(res => {
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          this.refresh()
        })
        .finally(_ => {
          this.dealDialog.show = false
        })
    },
    showDialog(data) {
      this.dealDialog.show = true
      this.dealDialog.id = data['_id']
      this.dealDialog.type = data.type
      this.dealDialog.money = data.count
    },
    showDleteComfirm(raw) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteItem(raw['_id'])
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    dateFormat(row, column) {
      return formatTime2Date(row.time)
    }
  }
}
</script>
