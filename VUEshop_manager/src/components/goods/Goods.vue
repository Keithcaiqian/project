<template>
  <div class="goods-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="goodsData.query" clearable @clear="getAllGoods()">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goods" style="width: 100%" border>
        <el-table-column type="index" label="No"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" width="80px" label="商品价格（元）"></el-table-column>
        <el-table-column prop="goods_weight" width="80px" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" width="200px" label="创建时间">
          <template slot-scope="scope">{{scope.row.add_time|capitalize}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editGoods(scope.row.goods_id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- page区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsData.pagenum"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="goodsData.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 编辑商品区域 -->
    <el-dialog title="编辑商品" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input type="number" v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input type="number" v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input type="number" v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditGoods">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      goodsData: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      //   总商品数量
      total: 0,
      goods: [],
      // 编辑商品
      editGoodsId: '',
      editDialogFormVisible: false,
      editForm: {
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getAllGoods()
  },
  methods: {
    async getAllGoods () {
      const { data: res } = await this.$axios.get('goods', {
        params: this.goodsData
      })
      this.total = res.data.total
      this.goods = res.data.goods
    },
    // 改变页码大小
    handleSizeChange (val) {
      this.goodsData.pagesize = val
      this.getAllGoods()
    },
    // 改变当前页码值
    handleCurrentChange (val) {
      this.goodsData.pagenum = val
      this.getAllGoods()
    },
    // 查询商品
    searchGoods () {
      this.getAllGoods()
    },
    // 删除商品
    async deleteGoods (id) {
      const result = await this.$MessageBox
        .confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .catch(err => err)
      if (result === 'cancel') {
        return this.$Message.info('取消成功')
      } else {
        const { data: res } = await this.$axios.delete('goods/' + id)
        if (res.meta.status !== 200) {
          return this.$Message.error('删除失败')
        } else {
          this.$Message.success('删除成功')
          this.getAllGoods()
        }
      }
    },
    // 添加商品
    addGoods () {
      this.$router.push('/addGoods')
    },
    // 显示编辑商品的弹框
    async editGoods (id) {
      this.editGoodsId = id
      const { data: res } = await this.$axios.get('goods/' + id)
      this.editForm = res.data
      console.log(this.editForm)
      this.editDialogFormVisible = true
    },
    // 提交编辑的商品数据
    submitEditGoods () {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) {
          return this.$Message.info('请把内容填写完整')
        } else {
          const { data: res } = await this.$axios.put('goods/' + this.editGoodsId, this.editForm)
          if (res.meta.status !== 200) {
            return this.$Message.error('修改失败')
          } else {
            this.$Message.success('修改成功')
            this.editDialogFormVisible = false
            this.getAllGoods()
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table {
  margin: 15px 0;
  font-size: 12px;
}
</style>
