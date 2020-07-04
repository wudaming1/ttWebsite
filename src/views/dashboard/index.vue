<template>
  <div class="dashboard">
    <el-form :inline="true">
      <el-form-item prop="sourceType" label="类型：">
        <el-select v-model="deal.sourceType">
          <el-option  v-for="item in sourceTypeList"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="money" label="金额(元)：">
        <el-input v-model="deal.money"  placeholder="请输入金额"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
    <div>历史记录
      <el-table :data="historyList" style="width: 100%" border stripe>
        <el-table-column
          prop="time"
          label="时间"
          :formatter="dateFormat"
          width="180">
        </el-table-column>
        <el-table-column
          label="来源"
          width="180">
          <template slot-scope="scope">
            {{ scope.row | source}}
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          label="金额">
        </el-table-column>
        <el-table-column label="操作" width="100">
           <template slot-scope="scope">
            <el-button @click="showDialog(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="showDleteComfirm(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pie-parent">
      <ve-pie :data="chartData" width="500px" height="400px"/>
      <div class="pie-title">总计：{{totalCount}}元</div>
    </div>
    <el-dialog title="修改记录" :visible.sync="dealDialog.show">
      <el-form :inline="true">
      <el-form-item label="类型：">
        <el-select v-model="dealDialog.type">
          <el-option  v-for="item in sourceTypeList"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额(元)：">
        <el-input v-model="dealDialog.money"  placeholder="请输入金额"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="confirmModify">确认</el-button>
      </el-form-item>
    </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addDeal, getDeals, getTotal, deleteDeal, modifyDeal } from '@/api/cash'
import { formatTime2Date } from '@/utils/format'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data(){
    return { 
      sourceTypeList: [{ code: 'wx', value: '微信' }, { code: 'zfb', value: '支付宝' }, { code: 'xj', value: '现金' }],
      deal :{
        sourceType:'wx',
        money: 0,
      },
      historyList: [],
      totalCount: 0,
      chartData: {
        columns: ['日期', 'money'],
        rows: [
          { '日期': '现金', money: 120 },
          { '日期': '微信', money: 10 },
          { '日期': '支付宝', money: 20 },
        ]
      },
      dealDialog: {
        show: false,
        id: '',
        type: '',
        money: ''
      }
    }
  },
  mounted() {
    this.refresh();
  },
  filters: {
    source: function (data) {
      let value = data.type;
      if(value === 'wx') return '微信';
      if(value === 'zfb') return '支付宝';
      if(value === 'xj') return '现金';
      return '';
    }
  },
  methods: {
    onSubmit() {
      let params = {
        type:this.deal.sourceType,
        count:this.deal.money,
        shop:'tt',
        userId:'www'
      }
      addDeal(params).then(response =>{
        this.$message({
          message: '添加成功！',
          type: 'success'
        });
        this.refresh();
      });
    },
    refresh() {
      this.getList();
      this.getTotalDeals();
    },
    getList() {
      let now = new Date();
      let startTime = new Date(now.setHours(0, 0, 0, 0));
      let endTime = new Date(now.setHours(23, 60, 60, 0));
      
      let params = {
        shop:'tt',
        pageSize: 5,
        pageCount: 1,
        startTime: startTime.getTime(),
        endTime: endTime.getTime()
      }
      getDeals(params).then(res=>{
        this.historyList = res.data.items;
      })
    },
    getTotalDeals() {
      let now = new Date();
      let startTime = new Date(now.setHours(0, 0, 0, 0));
      let endTime = new Date(now.setHours(23, 60, 60, 0));
      
      let params = {
        shop:'tt',
        startTime: startTime.getTime(),
        endTime: endTime.getTime()
      }
      getTotal(params).then(res => {
        console.log(res);
        console.log(this.chartData.rows);
        let items = this.chartData.rows;
        this.totalCount = res.data.total;
        (items[0]).money = res.data.xj;
        (items[1]).money = res.data.wx;
        (items[2]).money = res.data.zfb;
      })
    },
    deleteItem(id) {
      deleteDeal({_id: id}).then(res =>{
        this.refresh();
      })
    },
    confirmModify() {
      let params = {
        id: this.dealDialog.id,
        type: this.dealDialog.type,
        money: this.dealDialog.money,
      }
      modifyDeal(params).then(res =>{
         this.$message({
          message: '修改成功！',
          type: 'success'
        });
        this.refresh();
      }).finally(_ =>{
        this.dealDialog.show = false;
      })
    },
    showDialog(data) {
      this.dealDialog.show = true;
      this.dealDialog.id = data['_id'];
      this.dealDialog.type = data.type;
      this.dealDialog.money = data.count;

    },
    showDleteComfirm(raw){
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteItem(raw['_id']);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    dateFormat(row, column) {  
      return formatTime2Date(row.time) 
    }  
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
  .pie-parent {
    width: 500px;
    height: 500px;
    margin-top: 20px;
    padding-top: 20px;
    background-color: rgb(236, 227, 92);
  }
  .pie-title {
    color: #000;
    text-align: center;
  }
}
</style>
