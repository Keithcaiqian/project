<template>
  <div class="categories-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 按钮区域 -->
      <el-row>
        <el-button type="primary" @click="showAddCateBox">添加分类</el-button>
      </el-row>
      <!-- 表格区域 vue-table-with-tree-grid-->
      <zk-table
        show-index
        index-text="No"
        :data="data"
        :columns="columns"
        border
        :selection-type="false"
        :expand-type="false"
      >
        <template slot="isDelete" scope="scope">
          <i style="color:green" class="el-icon-success" v-if="scope.row.cat_deleted===false"></i>
          <i style="color:red" class="el-icon-error" v-else></i>
        </template>
        <template slot="level" scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <template slot="edit" scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="showEditCate(scope.row)">编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="deleteCate(scope.row)">删除</el-button>
        </template>
      </zk-table>
      <!-- 页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateList.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="cateList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataTotal"
      ></el-pagination>
    </el-card>
    <!-- 添加商品分类框 -->
    <el-dialog title="添加分类" :visible.sync="addCatedialogVisible" width="40%" @close="addcateClose">
      <el-form label-width="90px">
        <el-form-item label="分类名称：">
          <el-input v-model="addCateData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            clearable
            v-model="selCateData"
            ref="dropDown"
            :options="allData"
            :props="{ expandTrigger:'hover',label: 'cat_name',value: 'cat_id',children:'children',checkStrictly:true}"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCated">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类框 -->
    <el-dialog title="编辑分类" :visible.sync="editCatedialogVisible" width="40%" >
      <el-form label-width="90px" :model="editForm">
        <el-form-item label="分类名称：">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCated">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      data: [],
      allData: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '300px'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isDelete'
        },
        {
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'edit'
        }
      ],
      //   请求商品分类数据
      cateList: {
        pagenum: 1,
        pagesize: 5
      },
      //   商品总数
      dataTotal: 0,
      //   是否显示添加商品分类对话框
      addCatedialogVisible: false,
      editCatedialogVisible: false,
      addCateData: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      selCateData: [],
      editForm: {}
    }
  },
  created () {
    this.getGoodsList()
    this.getAllCate()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$axios.get('categories', {
        params: this.cateList
      })
      this.data = res.data.result
      this.dataTotal = res.data.total
    },
    async getAllCate () {
      const { data: res } = await this.$axios.get('categories', { params: {} })
      this.allData = res.data
    },
    // 监听页码大小改变
    handleSizeChange (val) {
      this.cateList.pagesize = val
      this.getGoodsList()
    },
    // 监听当前所在页的改变
    handleCurrentChange (val) {
      this.cateList.pagenum = val
      this.getGoodsList()
    },
    // 弹出添加商品分类对话框
    showAddCateBox () {
      this.addCatedialogVisible = true
    },
    handleChange (val) {
      this.$refs.dropDown.dropDownVisible = false
      if (val.length > 0) {
        this.addCateData.cat_pid = val[val.length - 1]
        this.addCateData.cat_level = val.length
      } else {
        this.addCateData.cat_pid = 0
        this.addCateData.cat_level = 0
      }
    },
    // 提交新增分类
    async addCated () {
      const { data: res } = await this.$axios.post('categories', this.addCateData)
      if (res.meta.status !== 201) {
        return this.$Message.error('添加分类失败')
      } else {
        this.$Message.success('添加分类成功')
        this.getGoodsList()
        this.addCatedialogVisible = false
      }
    },
    addcateClose () {
      this.addCateData.cat_name = ''
      this.selCateData = []
    },
    // 展示编辑分类的对话框
    showEditCate (cate) {
      this.editForm = cate
      this.editCatedialogVisible = true
    },
    // 编辑分类的提交
    async editCated () {
      const { data: res } = await this.$axios.put('categories/' + this.editForm.cat_id, { cat_name: this.editForm.cat_name })
      if (res.meta.status !== 200) {
        return this.$Message.error('修改失败')
      } else {
        this.$Message.success('修改成功')
        this.getGoodsList()
        this.editCatedialogVisible = false
      }
    },
    // 删除分类
    async deleteCate (cate) {
      const result = await this.$MessageBox.confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result === 'cancel') {
        return this.$Message.info('取消删除')
      } else {
        const { data: res } = await this.$axios.delete('categories/' + cate.cat_id)
        if (res.meta.status !== 200) {
          return this.$Message.error('删除失败')
        } else {
          this.$Message.success('删除成功')
          this.getGoodsList()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-card {
  .el-row {
    margin-bottom: 15px;
  }
}
</style>
