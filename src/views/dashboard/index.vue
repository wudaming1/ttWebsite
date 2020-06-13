<template>
  <div class="dashboard">
    <el-form :inline="true">
      <el-form-item prop="sourceType" label="类型：">
        <el-select v-model="deal.sourceType">
          <el-option  v-for="item in sourceTypeList"
                    :key="item"
                    :label="item"
                    :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="money" label="金额：">
        <el-input v-model="deal.money"  placeholder="请输入金额"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
    <div>历史记录
      <el-table :data="historyList" style="width: 100%" border>
        <el-table-column
          prop="date"
          label="时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="source"
          label="来源"
          width="180">
        </el-table-column>
        <el-table-column
          prop="money"
          label="金额">
        </el-table-column>
      </el-table>
    </div>
    <div class="pie">
      <v-chart :options="options"/>
      <div>总计：345元</div>
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/polar'

export default {
  name: 'Dashboard',
  components: {
    'v-chart': ECharts
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data(){
    return {  
      sourceTypeList: ['微信', '支付宝', '现金'],
      deal :{
        sourceType:'微信',
        money: 0,
      },
      historyList:  [{
          date: '2016-05-02',
          source: '微信',
          money: '13',
        }, {
          date: '2016-05-04',
          source: '微信',
          money: '122'
        }, {
          date: '2016-05-01',
          source: '支付宝',
          money: '200',
        }, {
          date: '2016-05-03',
          source: '现金',
          money: '120'
        }],
      options: {
        backgroundColor: '#2c343c',
        title: { 
          text: '金额统计',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },

      visualMap: {
          show: false,
          inRange: {
              colorLightness: [0, 1]
          }
      },
      series: [
          {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: [
                  {value: 335, name: '现金：335'},
                  {value: 310, name: '微信：310'},
                  {value: 274, name: '支付宝：274'},
              ].sort(function (a, b) { return a.value - b.value; }),
              roseType: 'angle',
              label: {
                  color: 'rgba(255, 255, 255, 0.7)'
              },
              labelLine: {
                  lineStyle: {
                      color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
              },
              itemStyle: {
                  color: '#c23531',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              animationDelay: function (idx) {
                  return Math.random() * 200;
              }
          }
      ]}
    }
  },
  methods: {
    onSubmit() {

    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  .pie {
    margin-top: 20px;
    padding-bottom: 20px;
    background-color: #2c343c;
    color: #ffffff;
    text-align: center;
    font-size: 20px;
  }
}
</style>
