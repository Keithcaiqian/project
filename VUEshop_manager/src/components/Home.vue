<template>
  <el-container class="home-container">
    <el-header>
      <div class="left">
        <img src="../assets/image/logo.jpg" alt />
        <div>后台管理系统</div>
      </div>
      <div class="right">
        <el-button type="info" round @click="exitUser">退出登录</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'60px':'200px'">
        <el-menu
          background-color="#345"
          text-color="#fff"
          active-text-color="gold"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router='true'
          :default-active="activePath"
        >
          <el-submenu :index="item.id+''" v-for="item in list" :key="item.id">
            <template slot="title">
              <i :class="iconLost[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="'/'+sel.path"
                v-for="sel in item.children"
                :key="sel.id"
                router="true"
                @click="savePath('/'+sel.path)"
              >
                <span slot="title">
                  <i class="el-icon-coin"></i>
                  <span>{{sel.authName}}</span>
                </span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
        <el-row >
          <div @click="changeCollapse">
            <span v-if="!isCollapse">&lt;&lt;&lt;&lt;&lt;</span>
            <span v-else>&gt;&gt;&gt;&gt;&gt;</span>
          </div>
        </el-row>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      list: '',
      iconLost: {
        125: 'el-icon-s-custom',
        103: 'el-icon-warning',
        101: 'el-icon-s-goods',
        102: 'el-icon-tickets',
        145: 'el-icon-s-data'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    //   退出登录
    exitUser () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //  折叠
    changeCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 储存路径
    savePath (path) {
      window.sessionStorage.setItem('activePath', path)
    }
  },
  //   获取左侧导航数据
  async created () {
    this.activePath = window.sessionStorage.getItem('activePath')
    const list = await this.$axios.get('menus').then(res => res.data.data)
    this.list = list
  }
}
</script>
<style lang="scss" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #234;
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      font-size: 20px;
      color: #fff;
      align-items: center;
      flex: none;
      img {
        height: 100%;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
    .right {
      display: flex;
      align-items: center;
    }
  }
  .el-aside {
    background-color: #567;
    .el-row {
      text-align: right;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>
