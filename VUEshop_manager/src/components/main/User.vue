<template>
  <div class="user-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input
            clearable
            @clear="getUserData"
            placeholder="请输入内容"
            class="input-with-select"
            v-model="user.query"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <template>
        <el-table :data="userArr" style="width: 100%" border>
          <el-table-column type="index" label="No"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch
                @change="changeState(scope.row)"
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ccc"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editUser(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(scope.row.id)"
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="allotRolesBox(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="user.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="user.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataAll"
      ></el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" @close="addFormClose">
      <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="rolesDialogVisible" width="30%" @close="rolesClose">
      <div>
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        <el-select v-model="selRoles" placeholder="请选择">
          <el-option
            v-for="item in allRoles"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rolesSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created () {
    this.getUserData()
  },
  data () {
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else {
        var reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('格式错误'))
        }
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        var reg = /^1\d{10}$/
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('格式错误'))
        }
      }
    }
    return {
      dataAll: 0,
      user: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userArr: [],
      dialogVisible: false,
      editDialogVisible: false,
      rolesDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rolesForm: {},
      editForm: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
        ],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur' }]
      },
      userInfo: '',
      allRoles: [],
      selRoles: ''
    }
  },
  methods: {
    async getUserData () {
      const res = await this.$axios
        .get('users', { params: this.user })
        .then(res => res.data.data)
      this.userArr = res.users
      this.dataAll = res.total
    },
    handleSizeChange (val) {
      this.getUserData()
      this.user.pagesize = val
    },
    handleCurrentChange (val) {
      this.getUserData()
      this.user.pagenum = val
    },
    // 切换用户状态
    async changeState (status) {
      const { data } = await this.$axios.put(
        `users/${status.id}/state/${status.mg_state}`
      )
      if (data.meta.status === 200) {
        this.$Message.success('修改成功')
      } else {
        return this.$Message.error(data.meta.msg)
      }
    },
    // 关闭添加表单的弹框
    addFormClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    submitUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$Message.error('格式错误')
        } else {
          const { data } = await this.$axios.post('users', this.addForm)
          if (data.meta.status !== 201) {
            return this.$Message.error('添加失败')
          } else {
            this.dialogVisible = false
            this.$Message.success('添加成功')
            this.getUserData()
          }
        }
      })
    },
    // 修改用户弹框
    async editUser (data) {
      this.editDialogVisible = true
      const { data: res } = await this.$axios.get('users/' + data.id)
      this.editForm = res.data
    },
    // 修改用户提交数据
    editSubmit () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$Message.error('格式错误')
        } else {
          const { data: res } = await this.$axios.put(
            `users/${this.editForm.id}`,
            {
              email: this.editForm.email,
              mobile: this.editForm.mobile
            }
          )
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$Message.error('修改失败')
          } else {
            this.editDialogVisible = false
            this.$Message.success('修改成功')
            this.getUserData()
          }
        }
      })
    },
    // 删除用户
    async deleteUser (id) {
      const result = await this.$MessageBox
        .confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .catch(err => err)
      if (result === 'cancel') {
        return this.$Message.success('取消删除')
      } else {
        const { data: res } = await this.$axios.delete('users/' + id)
        if (res.meta.status === 200) {
          this.$Message.success('删除用户成功')
          this.getUserData()
        } else {
          this.$Message.error('删除用户失败')
        }
      }
    },
    // 分配角色弹出框
    async allotRolesBox (role) {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      } else {
        this.allRoles = res.data
      }
      this.rolesDialogVisible = true
      this.userInfo = role
    },
    // 关闭角色弹框
    rolesClose () {
      this.selRoles = ''
      this.rolesDialogVisible = false
    },
    // 提交角色修改
    async rolesSubmit () {
      const { data: res } = await this.$axios.put(`users/${this.userInfo.id}/role`, { rid: this.selRoles })
      if (res.meta.status !== 200) {
        return this.$Message.error('角色授权失败')
      } else {
        this.$Message.success('角色授权成功')
        this.rolesDialogVisible = false
        this.getUserData()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
