<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="手机号：">
        <el-input v-model="phoneNum" placeholder="请输入会员手机号" clearable />
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" @click="queryVip">查詢</el-button>
        <el-button type="primary" @click="showAddDialog">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="vip-info-panel">
      <div>会员--{{ vipInfo.name }}</div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">电话号码：{{ vipInfo.phone }}</div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">创建时间：{{ vipInfo.createTime }}</div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">余额：{{ vipInfo.money }} 元</div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">总共充值：{{ vipInfo.totalCharge }} 元</div>
        </el-col>
      </el-row>
    </div>

    <div class="vip-charge-panel">
      <div>充值</div>
      <el-form :model="chargeInfo" label-position="left" label-width="100px">
        <el-form-item label="手机号：">
          <el-input v-model="chargeInfo.phone" disabled />
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="chargeInfo.password" type="password" />
        </el-form-item>
        <el-form-item label="充值金额：">
          <el-select v-model="chargeInfo.money" placeholder="请选择金额">
            <el-option label="300元 送30元" value="330" />
            <el-option label="500元 送80元" value="580" />
            <el-option label="1000元 送200" value="1200" />
            <el-option label="2000元 送450" value="2450" />
          </el-select>
        </el-form-item>
        <el-button type="primary" :disabled="disabled" @click="preformCharge">充值</el-button>
      </el-form>
    </div>
    <div class="vip-charge-panel">
      <div>消费</div>
      <el-form :model="consumeInfo" label-position="left" label-width="100px">
        <el-form-item label="手机号：">
          <el-input v-model="consumeInfo.phone" disabled />
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="consumeInfo.password" type="password" />
        </el-form-item>
        <el-form-item label="充值金额：">
          <el-input v-model="consumeInfo.money" placeholder="请输入消费金额，正整数！" />
        </el-form-item>
        <el-button type="primary" :disabled="disabled" @click="preformConsume">消费</el-button>
      </el-form>
    </div>
    <el-dialog title="新增会员" :visible.sync="addDialog.show">
      <el-form ref="addDialog" :model="addDialog" :rules="addDialogRules" label-position="right">
        <el-form-item label="手机号：" prop="phoneNum" label-width="120px">
          <el-input v-model="addDialog.phoneNum" placeholder="请输入会员手机号" clearable />
        </el-form-item>
        <el-form-item label="姓名：" prop="name" label-width="120px">
          <el-input v-model="addDialog.name" placeholder="请输入会员姓名" />
        </el-form-item>
        <el-form-item label="密码：" prop="password" label-width="120px">
          <el-input v-model="addDialog.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label-width="120px">
          <el-button type="primary" @click="addVip">新增</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getVipInfo, charge, consume, createVip } from '@/api/vip'
import { isMobileNumber, isMoney } from '@/utils/validate'
import { formatTime2Date2 } from '@/utils/format'
export default {
  data() {
    return {
      phoneNum: 15201555981,
      vipInfo: {},
      chargeInfo: {},
      consumeInfo: {},
      disabled: true,
      addDialog: {
        show: false,
        phoneNum: '',
        money: 0,
        name: '',
        password: ''
      },
      addDialogRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phoneNum: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    refresh() {
      this.chargeInfo = {}
      this.consumeInfo = {}
      this.queryVip()
    },
    queryVip() {
      this.vipInfo = {}
      this.chargeInfo = {}
      this.consumeInfo = {}
      this.disabled = true
      if (!isMobileNumber(this.phoneNum)) {
        this.$message({
          message: '请输入正确的手机号，纯数字！',
          type: 'error'
        })
        return
      }
      const params = {
        shop: process.env.shop,
        phone: parseInt(this.phoneNum)
      }
      getVipInfo(params).then(res => {
        console.log(res)
        this.vipInfo = res.data
        this.vipInfo.createTime = formatTime2Date2(this.vipInfo.createTime)
        this.chargeInfo.phone = res.data.phone
        this.chargeInfo.id = res.data._id
        this.consumeInfo.phone = res.data.phone
        this.consumeInfo.id = res.data._id
        this.disabled = false
      })
    },
    showAddDialog() {
      this.addDialog.show = true
    },
    preformCharge() {
      if (isMoney(this.chargeInfo.money)) {
        const params = {
          phone: this.chargeInfo.phone,
          money: parseInt(this.chargeInfo.money),
          password: this.chargeInfo.password
        }
        charge(params).then(res => {
          console.log(res)
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.refresh()
        })
      } else {
        this.$message({
          message: '请输入金额',
          type: 'error'
        })
      }
    },
    addVip() {
      this.$refs['addDialog'].validate((valid) => {
        if (!valid) {
          return
        }
      })
      if (!isMobileNumber(this.addDialog.phoneNum)) {
        this.$message({
          message: '请输入正确的手机号！',
          type: 'info'
        })
        return
      }

      const params = {
        phone: this.addDialog.phoneNum,
        money: 0,
        password: this.addDialog.password,
        name: this.addDialog.name
      }
      createVip(params).then(res => {
        console.log(res)
        this.vipInfo = res.data
        this.vipInfo.createTime = formatTime2Date2(this.vipInfo.createTime)
        this.addDialog.show = false
      })
    },
    preformConsume() {
      if (isMoney(this.consumeInfo.money)) {
        const params = {
          phone: this.consumeInfo.phone,
          money: parseInt(this.consumeInfo.money),
          password: this.consumeInfo.password
        }
        consume(params).then(res => {
          console.log(res)
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.refresh()
        })
      } else {
        this.$message({
          message: '请输入金额',
          type: 'error'
        })
      }
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
