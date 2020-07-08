<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="手机号：">
        <el-input v-model="phoneNum" placeholder="请输入会员手机号" clearable />
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" @click="queryVip">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-pagination
      :current-page="pagination.current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
    <el-table :data="vipList" style="width: 100%" border stripe>
      <el-table-column prop="createTime" label="创建时间" :formatter="dateFormat" width="180" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="money" label="余额" />
      <el-table-column prop="totalCharge" label="总充值金额" />
      <el-table-column width="200px" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="showModifyPasswordDialog(scope.row)">修改密码</el-button>
          <el-button type="text" size="mini" @click="showResetPasswordDialog(scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改密码" :visible.sync="modifyDialog.show">
      <el-form ref="modifyDialog" :model="modifyDialog" :rules="modifyDialogRules" label-width="120px">
        <el-form-item label="手机号码：" prop="phone">
          <el-input v-model="modifyDialog.phone" disabled/>
        </el-form-item>
        <el-form-item label="旧密码：" prop="oldPassword">
          <el-input v-model="modifyDialog.oldPassword" />
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword">
          <el-input v-model="modifyDialog.newPassword" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmMofiy">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { queryVipList, modifyVipPassword } from '@/api/vip'
import { isMobileNumber, isEmpty } from '@/utils/validate'
import { formatTime2Date2 } from '@/utils/format'

export default {
  data() {
    return {
      pagination: {
        current: 1,
        size: 20,
        total: 0
      },
      phoneNum: 15201555981,
      vipList: [],
      modifyDialog: {
        show: false,
        phone: null,
        oldPassword: '',
        newPassword: ''
      },
      modifyDialogRules: {
        oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
      },
      resetDialog: {
        show: false,
        phone: null,
        verifyCode: '',
        newPassword: ''
      }
    }
  },
  methods: {
    refresh() {
      this.queryVip()
    },
    dateFormat(row, column) {
      return formatTime2Date2(row.createTime)
    },
    handleSizeChange(newSize) {
      this.pagination.size = newSize
      this.pagination.current = 1
      this.queryVip()
    },
    handleCurrentChange(value) {
      this.pagination.current = value
      this.queryVip()
    },
    queryVip() {
      const params = {}
      if (isMobileNumber(this.phoneNum)) {
        params.phone = this.phoneNum
      } else if (!isEmpty(this.phoneNum)) {
        this.$message({
          message: '请输入正确的手机号',
          type: 'info'
        })
        return
      }
      queryVipList(params).then(res => {
        this.vipList = res.data
        console.log(res)
      })
    },
    showModifyPasswordDialog(row) {
      this.modifyDialog.show = true
      this.modifyDialog.phone = row.phone
      this.modifyDialog.oldPassword = null
      this.modifyDialog.newPassword = null
      this.$nextTick(() => {
        this.$refs.modifyDialog.clearValidate()
      })
    },
    confirmMofiy() {
      this.$refs['modifyDialog'].validate(valid => {
        if (!valid) {
          return
        }
      })
      modifyVipPassword(this.modifyDialog).then(res => {
        console.log(res)
        this.modifyDialog.show = false
        this.$message({
          message: res.message,
          type: 'success'
        })
      })
    },
    showResetPasswordDialog() {
      this.resetDialog.show = true
    },
    confirmReset() {

    }
  }
}
</script>

<style lang='scss'>
.vip-charge-panel{
  display: inline-block;
  text-align: center;
  width: 500px;
  background-color: #99a9bf;
  padding: 20px;
  margin-bottom: 20px;
  .el-select{
    width: 100%;
  }
}

.vip-info-panel{
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
