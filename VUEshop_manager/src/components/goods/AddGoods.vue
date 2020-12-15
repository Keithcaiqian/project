<template>
  <div class="addGoods-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <el-steps :space="200" :active="+activeIndex" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="goodsForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeChangeTabs"
          @tab-click="tabsChange"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="goodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item type="number" label="商品重量" prop="goods_weight">
              <el-input v-model="goodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item type="number" label="商品数量" prop="goods_number">
              <el-input v-model="goodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="selCate"
                :options="allCates"
                :props="{ expandTrigger: 'hover' ,value:'cat_id',label:'cat_name'}"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in goodsManyParams"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals" size="small" @change="checkboxChange">
                <el-checkbox
                  v-for="(prop,index) in item.attr_vals"
                  :label="prop"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in goodsOnlyParams"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-success="successUpload"
              :on-remove="handleRemove"
              :file-list="pictureList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              v-model="goodsForm.goods_introduce"
            ></quill-editor>
            <el-button type="primary" size="mini" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 弹出图片预览框 -->
    <el-dialog title="图片预览" :visible.sync="pictureDialogVisible" width="50%">
      <img width="100%" :src="pictureUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeIndex: '0',
      goodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: '',
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      //   所有商品分类
      allCates: [],
      //   选中的分类
      selCate: [],
      //   商品参数
      goodsManyParams: [],
      goodsOnlyParams: [],
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      //   上传图片的请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 上传图片的response
      response: {},
      // 上传的图片数组
      pictureList: [],
      pictureUrl: '',
      pictureDialogVisible: false
    }
  },
  methods: {
    async getAllCates () {
      const { data: res } = await this.$axios.get('categories', {
        params: {}
      })
      this.allCates = res.data
    },
    // 级联选择器的选择
    handleChange () {
    },
    // tabs切换前
    beforeChangeTabs (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.selCate.length !== 3) {
        this.$Message.info('请选择三级商品分类')
        return false
      }
    },
    // tabs切换
    async tabsChange () {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        })
        this.goodsManyParams = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        this.goodsOnlyParams = res.data
      }
    },
    // 多选框切换值
    checkboxChange () {
      //   console.log(this.goodsParams)
    },
    // 预览图片
    handlePreview (file) {
      this.pictureUrl = file.url
      this.pictureDialogVisible = true
    },
    // 移除图片
    handleRemove (file) {
      var pic = file.pic
      var index = this.goodsForm.pics.findIndex(item => item.pic === pic)
      this.goodsForm.pics.splice(index, 1)
    },
    // 上传图片成功的钩子
    successUpload (response) {
      this.goodsForm.pics.push({
        pic: response.data.tmp_path
      })
    },
    // 添加商品
    addGoods () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) {
          return this.$Message.info('请填写完全部内容')
        } else {
          this.goodsForm.goods_cat = this.selCate.join(',')
          this.goodsManyParams.forEach(item => {
            var tempObj = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.goodsForm.attrs.push(tempObj)
          })
          this.goodsOnlyParams.forEach(item => {
            var tempObj = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.goodsForm.attrs.push(tempObj)
          })
          const { data: res } = await this.$axios.post('goods', this.goodsForm)
          if (res.meta.status !== 201) {
            return this.$Message.error('添加失败')
          } else {
            this.$Message.success('添加成功')
            this.$router.push('/goods')
          }
        }
      })
    }
  },
  created () {
    this.getAllCates()
  },
  computed: {
    cateId () {
      if (this.selCate.length === 3) {
        return this.selCate[2]
      } else {
        return null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-steps {
  margin-bottom: 15px;
}
.el-checkbox {
  margin: 10px;
  padding: 0;
}
.el-button{
  margin-top: 15px;
}
</style>
