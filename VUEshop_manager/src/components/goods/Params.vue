<template>
  <div class="params-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>
      <el-row>
        <span>选择商品分类：</span>
        <!-- 级联选择器 -->
        <el-cascader
          v-model="selCate"
          :options="allCates"
          :props="{ expandTrigger: 'hover',label: 'cat_name',value: 'cat_id',children:'children' }"
          @change="cateChange"
        ></el-cascader>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="isShowBtn" type="primary" @click="addParams('many')">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button :disabled="isShowBtn" type="primary" @click="addParams('only')">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
      <el-table border :data="parameter" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag
              :key="tag"
              v-for="tag in scope.row.attr_vals"
              closable
              :disable-transitions="true"
              @close="handleClose(tag,scope.row)"
            >{{tag}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            ></el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(scope.row)"
            >+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" label="No" width="50"></el-table-column>
        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditParams(scope.row.attr_id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="showDeleteParams(scope.row.attr_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加参数对话框 -->
      <el-dialog
        :title="'添加'+showName"
        :visible.sync="paramsDialogFormVisible"
        @close="paramsFormClose"
      >
        <el-form :model="paramsForm" ref="paramsForm" :rules="rules">
          <el-form-item :label="showName" prop="attr_name" label-width="100px">
            <el-input v-model="paramsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="paramsDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="paramsClose">确 定</el-button>
        </div>
      </el-dialog>
      <!--编辑参数对话框 -->
      <el-dialog :title="'添加'+showName" :visible.sync="editParamsDialogFormVisible">
        <el-form :model="editParamsForm" ref="editParamsForm" :rules="rules">
          <el-form-item :label="showName" prop="attr_name" label-width="100px">
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="editParamsDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParamsClose">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      allCates: [],
      //   级联选择器
      selCate: [],
      selId: null,
      activeName: 'many',
      // 表单数据
      parameter: [],
      // 添加表单的数据
      paramsDialogFormVisible: false,
      paramsForm: {},
      rules: {
        attr_name: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      },
      // 编辑参数的数据
      editAddr_id: 0,
      editParamsForm: {},
      editParamsDialogFormVisible: false
    }
  },
  created () {
    this.getAllCate()
  },
  methods: {
    async getAllCate () {
      const { data: res } = await this.$axios.get('categories', {
        params: {}
      })
      this.allCates = res.data
    },
    cateChange () {
      if (this.selCate.length !== 3) {
        this.selCate = []
        return
      }
      this.getParameter(this.activeName)
    },
    handleClick (tab, event) {
      if (this.selCate.length === 3) {
        this.getParameter(this.activeName)
      }
    },
    // 得到静态参数和动态属性列表
    async getParameter (params) {
      const { data: res } = await this.$axios.get(
        `categories/${this.showId}/attributes`,
        {
          params: {
            sel: params
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$Message.error('获取参数失败')
      } else {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        this.parameter = res.data
      }
    },
    // 添加参数
    addParams (params) {
      this.paramsDialogFormVisible = true
      this.activeName = params
    },
    paramsClose () {
      this.$refs.paramsForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$axios.post(
            `categories/${this.showId}/attributes`,
            {
              attr_name: this.paramsForm.attr_name,
              attr_sel: this.activeName
            }
          )
          if (res.meta.status !== 201) {
            return this.$Message.error('添加失败')
          } else {
            this.$Message.success('添加成功')
            this.getParameter(this.activeName)
            this.paramsDialogFormVisible = false
          }
        } else {
          return this.$Message.error('添加失败')
        }
      })
    },
    paramsFormClose () {
      this.$refs.paramsForm.resetFields()
    },
    // 编辑参数
    async showEditParams (attrId) {
      this.editAddr_id = attrId
      const { data: res } = await this.$axios.get(
        `categories/${this.showId}/attributes/${this.editAddr_id}`,
        {
          attr_vals: this.activeName
        }
      )
      this.editParamsForm = res.data
      this.editParamsDialogFormVisible = true
    },
    editParamsClose () {
      this.$refs.editParamsForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$axios.put(
            `categories/${this.showId}/attributes/${this.editAddr_id}`,
            {
              attr_name: this.editParamsForm.attr_name,
              attr_sel: this.activeName,
              attr_vals: this.editParamsForm.attr_vals
            }
          )
          if (res.meta.status !== 200) {
            return this.$Message.error('修改失败')
          } else {
            this.$Message.success('修改成功')
            this.getParameter(this.activeName)
            this.editParamsDialogFormVisible = false
          }
        } else {
          return this.$Message.error('添加失败')
        }
      })
    },
    // 删除参数
    async showDeleteParams (id) {
      const result = await this.$MessageBox
        .confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .catch(err => err)
      if (result === 'cancel') {
        return this.$Message.info('已取消删除')
      } else {
        const { data: res } = await this.$axios.delete(
          `categories/${this.showId}/attributes/${id}`
        )
        if (res.meta.status !== 200) {
          return this.$Message.error('删除失败')
        } else {
          this.$Message.success('删除成功')
          this.getParameter(this.activeName)
        }
      }
    },
    // 删除添加标签
    async handleClose (tag, row) {
      row.attr_vals.splice(row.attr_vals.indexOf(tag), 1)
      const { data: res } = await this.$axios.put(
        `categories/${this.showId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$Message.error('删除失败')
      } else {
        this.$Message.success('删除成功')
      }
    },

    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    async handleInputConfirm (row) {
      const inputValue = row.inputValue.trim()
      if (inputValue) {
        row.attr_vals.push(inputValue)
        const { data: res } = await this.$axios.put(
          `categories/${this.showId}/attributes/${row.attr_id}`,
          {
            attr_name: row.attr_name,
            attr_sel: this.activeName,
            attr_vals: row.attr_vals.join(' ')
          }
        )
        if (res.meta.status !== 200) {
          return this.$Message.error('添加失败')
        } else {
          this.$Message.success('添加成功')
        }
      }
      row.inputVisible = false
      row.inputValue = ''
    }
  },
  computed: {
    isShowBtn () {
      if (this.selCate.length !== 3) {
        return true
      } else {
        return false
      }
    },
    showId () {
      if (this.selCate.length === 3) {
        return this.selCate[2]
      } else {
        return null
      }
    },
    showName () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-cascader {
  margin-bottom: 15px;
}
.el-tabs {
  margin-bottom: 15px;
}
.el-tag + .el-tag {
  margin: 10px;
}
.button-new-tag {
  margin: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  padding: 0;
  margin: 10px;
  width: 90px;
}
</style>
