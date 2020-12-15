<template>
  <div class="order-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="10">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orders" border style="width: 100%">
        <el-table-column type="index" label="No"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="250px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay==='1'" type="success">已付款</el-tag>
            <el-tag v-else type="warning">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="50px"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="220px">
          <template slot-scope="scope">{{scope.row.create_time|capitalize}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button size="mini" icon="el-icon-edit" @click="showAreaBox" type="primary"></el-button>
            <el-button size="mini" icon="el-icon-location" @click="showTimeLine" type="success"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getOrders.pagenum"
        :page-sizes="[5, 10, 30, 50]"
        :page-size="getOrders.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
      ></el-pagination>
    </el-card>
    <!-- 地区选择框 -->
    <el-dialog title="收货地址" :visible.sync="areaDialogFormVisible" @close="areaClose">
      <el-form :model="areaForm" :rules="areaRules" ref="areaRuleForm" label-width="100px">
        <el-form-item label="省市区/县" prop="city">
          <el-input v-model="areaForm.city" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input v-model="areaForm.detail" placeholder="请输入详细地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="areaDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="areaConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 物流显示框 -->
    <el-dialog title="物流进度" :visible.sync="logisticDialogFormVisible">
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(item, index) in logisticData"
          :key="index"
          :timestamp="item.time"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      getOrders: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      totalPage: 0,
      orders: [],
      areaDialogFormVisible: false,
      logisticDialogFormVisible: false,
      areaForm: {
        city: '',
        detail: ''
      },
      areaRules: {
        city: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      logisticData: []
    }
  },
  created () {
    this.getAllOrders()
  },
  methods: {
    async getAllOrders () {
      const { data: res } = await this.$axios.get('orders', {
        params: this.getOrders
      })
      this.orders = res.data.goods
      this.totalPage = res.data.total
      console.log(res.data)
    },
    // 页容量改变
    handleSizeChange (val) {
      this.getOrders.pagesize = val
      this.getAllOrders()
    },
    // 当前页改变
    handleCurrentChange (val) {
      this.getOrders.pagenum = val
      this.getAllOrders()
    },
    // 显示地区选择框
    showAreaBox () {
      this.areaDialogFormVisible = true
    },
    areaConfirm () {
      this.$refs.areaRuleForm.validate(valid => {
        if (!valid) {
          return this.$Message.error('地址输入不完整')
        } else {
          this.$Message.success('修改地址成功')
          this.areaDialogFormVisible = false
        }
      })
    },
    areaClose () {
      this.$refs.areaRuleForm.resetFields()
    },
    // 物流框显示
    async showTimeLine () {
      const { data: res } = await this.$axios.get('/kuaidi/1106975712662')
      this.logisticData = res.data
      this.logisticDialogFormVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table {
  margin: 15px 0;
}
</style>
