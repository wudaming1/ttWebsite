<template>
  <div class="app-container">
    <el-form :data="form" :inline="true">
      <el-form-item label="起始日期：">
        <el-date-picker v-model="form.startTime" type="date" placeholder="选择起始日期" />
      </el-form-item>
      <el-form-item label="結束日期：">
        <el-date-picker v-model="form.endTime" type="date" placeholder="选择結束日期" />
      </el-form-item>
      <el-form-item label="类型：">
        <el-select v-model="form.type" clearable>
          <el-option label="收入" value="in" />
          <el-option label="支出" value="out" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查詢</el-button>
        <el-button type="primary" @click="showDialog()">新增</el-button>
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
      <el-table-column label="类型" width="180">
        <template slot-scope="scope">{{ scope.row | source }}</template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" />
      <el-table-column prop="desc" label="描述" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showDialog(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="showDeleteConfirm(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialog.title" :visible.sync="dialog.show">
      <el-form ref="dialog" label-width="120px" :model="dialog" :rules="rules">
        <el-form-item label="类型：" prop="type">
          <el-select v-model="dialog.type">
            <el-option key="收入" value="in" label="收入" />
            <el-option key="支出" value="out" label="支出" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额(元)：" prop="amount">
          <el-input v-model="dialog.amount" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="描述：" prop="desc">
          <el-input v-model="dialog.desc" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  add, del, modify, query
} from '@/api/account'
// import moment from 'moment'
import { formatTime2Date } from '@/utils/format'
import { moneyValidator } from '@/utils/validate'

export default {
  filters: {
    source: function(data) {
      const value = data.type
      if (value === 'in') return '收入'
      if (value === 'out') return '支出'
      return ''
    }
  },
  data() {
    return {
      form: {
        startTime: new Date(),
        endTime: new Date(),
        type: null
      },
      pagination: {
        current: 1,
        size: 20,
        total: 0
      },
      historyList: [],
      dialog: {
        title: '',
        show: false,
        isAdd: true,
        amount: null,
        desc: '',
        type: '',
        id: ''
      },
      rules: {
        amount: [{ validator: moneyValidator, trigger: 'blur' }],
        desc: [{ required: true, message: '描述必填' }],
        type: [{ required: true, message: '类型必填' }]
      }
    }
  },
  methods: {
    dateFormat(row, column) {
      return formatTime2Date(row.time)
    },
    handleSizeChange(newSize) {
      this.pagination.size = newSize
      this.pagination.current = 1
      this.getList()
    },
    handleCurrentChange(value) {
      this.pagination.current = value
      this.getList()
    },
    getList() {
      const params = {
        pageSize: this.pagination.size,
        page: this.pagination.current
      }
      if (this.form.startTime !== null) {
        this.form.startTime.setHours(0, 0, 0, 0)
        params.startTime = this.form.startTime.getTime()
      }
      if (this.form.endTime !== null) {
        this.form.endTime.setHours(23, 59, 59, 0)
        params.endTime = this.form.endTime.getTime()
      }
      if (this.form.type) {
        params.type = this.form.type
      }
      query(params).then(res => {
        this.historyList = res.data.items
        this.pagination.total = res.data.total
      })
    },
    showDialog(data) {
      this.dialog.show = true
      this.dialog.isAdd = !data
      if (!data) {
        this.dialog.title = '新增记录'
      } else {
        this.dialog.id = data._id
        this.dialog.title = '修改记录'
        this.dialog.amount = data.amount
        this.dialog.type = data.type
        this.dialog.desc = data.desc
      }
      this.$nextTick(() => {
        this.$refs.dialog.resetFields()
      })
    },
    doSubmit() {
      const params = {
        type: this.dialog.type,
        amount: this.dialog.amount,
        desc: this.dialog.desc
      }
      debugger
      if (this.dialog.isAdd) {
        add(params).then(res => {
          this.$message({
            message: '添加记录成功！',
            type: 'success'
          })
          this.dialog.show = false
        })
      } else {
        params.id = this.dialog.id
        modify(params).then(res => {
          this.$message({
            message: '修改记录成功！',
            type: 'success'
          })
          this.dialog.show = false
          this.getList()
        })
      }
    },
    submitForm() {
      this.$refs.dialog.validate((valid) => {
        if (valid) {
          this.doSubmit()
        }
      })
    },
    showDeleteConfirm(raw) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: raw._id
          }
          del(params).then(res => {
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
