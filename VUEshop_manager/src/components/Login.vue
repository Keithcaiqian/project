<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-photo">
        <img src="../assets/image/登录头像.jpg" alt />
      </div>
      <el-form label-width="50px" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="用户" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type='password' v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账户名', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 表单验证
    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { data: res } = await this.$axios.post('/login', this.ruleForm)
          if (res.meta.status !== 200) {
            this.$Message.error('登录失败')
          } else {
            this.$Message.success('登录成功')
            window.sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          }
        }
      })
    },
    // 表单重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  background-color: rgb(76, 192, 238);
  .login-box {
    width: 400px;
    height: 300px;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    .login-photo {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 10px 5px 10px #fff;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  .el-form {
    margin: 80px 0;
    box-sizing: border-box;
    .el-form-item {
      padding: 0 10px;
    }
    .btns {
      padding: 0;
      display: flex;
      justify-content: center;
      .el-form-item__content {
        left: 10px;
      }
    }
  }
}
</style>
<style >
.btns .el-form-item__content {
  margin-left: 0 !important;
}
.el-form-item label::before{
    display: none;
}
</style>
