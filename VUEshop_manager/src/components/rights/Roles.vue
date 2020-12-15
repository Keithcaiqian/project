<template>
  <div class="roles-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-button class="addRoleBtn" type="primary" @click="addDialogVisible=true">添加角色</el-button>
        <el-table :data="rolesList" style="width: 100%" border stripe>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row class="bottomLine center" v-for="item in scope.row.children" :key="item.id">
                <el-col :span="5">
                  <el-tag
                    closable
                    @close="deleteRoleRights(scope.row,item.id)"
                  >{{item.authName}}>{{item.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row
                    class="center"
                    :class="[index==item.children.length-1?'':'bottomLine']"
                    v-for="(each,index) in item.children"
                    :key="each.id"
                  >
                    <el-col :span="8">
                      <el-tag
                        type="success"
                        closable
                        @close="deleteRoleRights(scope.row,each.id)"
                      >{{each.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="16">
                      <el-row>
                        <el-tag
                          closable
                          @close="deleteRoleRights(scope.row,it.id)"
                          v-for="it in each.children"
                          :key="it.id"
                          type="warning"
                        >{{it.authName}}</el-tag>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="No" width="50"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-edit"
                type="primary"
                @click="editRole(scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="deleteRoles(scope.row.id)"
              >删除</el-button>
              <el-button
                size="mini"
                icon="el-icon-setting"
                type="warning"
                @click="allotRights(scope.row)"
              >分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!-- 编辑角色 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="editForm" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="30%" @close="addFormClose">
      <el-form :model="addForm" label-width="70px" ref="addFormRef">
        <el-form-item label="角色名称">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 权限分配 -->
    <el-dialog title="权限分配" :visible.sync="allotRightsVisible" width="30%" @close="rightsClose">
      <el-tree
      ref="rightsTree"
        :data="rightsData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultSelRights"
        :props="defaultRights"
      ></el-tree>
      <span slot="footer">
        <el-button @click="allotRightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      editDialogVisible: false,
      addDialogVisible: false,
      allotRightsVisible: false,
      editForm: {},
      addForm: {},
      rolesList: [],
      rightsData: [],
      userId: '',
      defaultSelRights: [],
      defaultRights: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$axios.get('roles')
      this.rolesList = res.data
    },
    // 修改用户弹框
    async editRole (data) {
      this.editDialogVisible = true
      const { data: res } = await this.$axios.get('roles/' + data.id)
      this.editForm = res.data
    },
    // 修改用户提交数据
    async editSubmit () {
      const { data: res } = await this.$axios.put(
        `roles/${this.editForm.roleId}`,
        {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        }
      )
      if (res.meta.status !== 200) {
        return this.$Message.error('修改失败')
      } else {
        this.editDialogVisible = false
        this.$Message.success('修改成功')
        this.getRolesList()
      }
    },
    // 删除角色
    async deleteRoles (id) {
      const result = await this.$MessageBox
        .confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .catch(err => err)
      if (result === 'cancel') {
        return this.$Message.success('取消删除')
      } else {
        const { data: res } = await this.$axios.delete('roles/' + id)
        if (res.meta.status === 200) {
          this.$Message.success('删除用户成功')
          this.getRolesList()
        } else {
          this.$Message.error('删除用户失败')
        }
      }
    },
    // 添加角色
    async addSubmit () {
      const { data: res } = await this.$axios.post('roles', this.addForm)
      if (res.meta.status !== 201) {
        return this.$Message.error('添加失败')
      } else {
        this.addDialogVisible = false
        this.$Message.success('添加成功')
        this.getRolesList()
      }
    },
    // 关闭添加表单的弹框
    addFormClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 删除角色权限
    async deleteRoleRights (role, rightsId) {
      const result = await this.$MessageBox
        .confirm('此操作将删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .catch(err => err)
      if (result === 'cancel') {
        return this.$Message.info('取消删除')
      } else {
        const { data: res } = await this.$axios.delete(
          `roles/${role.id}/rights/${rightsId}`
        )
        if (res.meta.status !== 200) {
          return this.$Message.error('删除失败')
        } else {
          role.children = res.data
          this.$Message.success('删除成功')
        }
      }
    },
    // 分配权限弹出框
    async allotRights (rights) {
      this.userId = rights.id
      this.getDefaultRights(rights)
      const { data: res } = await this.$axios.get('rights/tree')
      this.rightsData = res.data
      this.allotRightsVisible = true
    },
    // 分配权限
    async addRights () {
      const allId = [...this.$refs.rightsTree.getCheckedKeys(), ...this.$refs.rightsTree.getHalfCheckedKeys()].join(',')
      const { data: res } = await this.$axios.post(`roles/${this.userId}/rights`, { rids: allId })
      if (res.meta.status !== 200) {
        return this.$Message.error('修改失败')
      } else {
        this.$Message.success('修改成功')
        this.getRolesList()
        this.allotRightsVisible = false
      }
    },
    // 默认选中的权限
    getDefaultRights (datas) {
      if (!datas.children) {
        this.defaultSelRights.push(datas.id)
      } else {
        datas.children.forEach(item => {
          this.getDefaultRights(item)
        })
      }
    },
    // 清空权限弹出框默认值
    rightsClose () {
      this.defaultSelRights = []
    }
  }
}
</script>
<style lang="scss" scoped>
.addRoleBtn {
  margin-bottom: 15px;
}
.bottomLine {
  border-bottom: 1px solid #ccc;
}
.el-table__expanded-cell {
  .el-tag {
    margin: 10px;
  }
}
.center {
  display: flex;
  align-items: center;
}
</style>
