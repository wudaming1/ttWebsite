<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="手机号：">
        <el-input v-model="phoneNum" placeholder="请输入会员手机号" />
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" @click="queryVip">查詢</el-button>
      </el-form-item>
    </el-form>
    <div class="vip-info-panel">
      <div>会员信息</div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            电话号码：{{ vipInfo.phone }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            创建时间：{{ vipInfo.createTime }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            余额：{{ vipInfo.money }} 元
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            总共充值：{{ vipInfo.totalCharge }} 元
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import { getVipInfo } from '@/api/vip'
import { isMobileNumber } from '@/utils/validate'
import { formatTime2Date2} from '@/utils/format'
export default {
  data() {
    return {
      phoneNum: 15201555981,
      vipInfo: {},
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
          { 日期: '7月1日', 微信: 1393, 支付宝: 1093, 现金: 32 },
          { 日期: '7月2日', 微信: 3530, 支付宝: 3230, 现金: 26 },
          { 日期: '7月3日', 微信: 2923, 支付宝: 2623, 现金: 76 },
          { 日期: '7月4日', 微信: 1723, 支付宝: 1423, 现金: 49 },
          { 日期: '7月5日', 微信: 3792, 支付宝: 3492, 现金: 323 },
          { 日期: '7月6日', 微信: 4593, 支付宝: 4293, 现金: 78 }
        ]
      }
    }
  },
  methods: {
    queryVip() {
      if (!isMobileNumber(this.phoneNum)) {
        this.$message({
          message: '请输入正确的手机号，纯数字！',
          type: 'error'
        })
        this.vipInfo = {}
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
      })
    }
  }
}
</script>

<style>
.vip-info-panel{
  text-align: center;
  font-size: 20px;
  background-color: #99a9bf;
  padding: 20px;
}

.el-row {
  margin-bottom: 20px;
  margin-top: 20px;
  &:last-child {
    margin-bottom: 0;
  }
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
