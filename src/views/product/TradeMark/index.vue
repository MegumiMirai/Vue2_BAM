<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog()"
    >添加</el-button>
    <el-table border style="width: 100%" :data="list">
      <el-table-column
        prop="prop"
        label="序号"
        width="80px"
        align="center"
        type="index"
      />
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
        align="center"
      />
      <el-table-column
        prop="logoUrl"
        label="品牌LOGO"
        width="width"
        align="center"
      >
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10, 20]"
      :page-size="limit"
      :pager-count="9"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="ruleForm" style="width: 80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addOrUpdateTradeMark"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback('品牌名称需要2-10位')
      } else {
        callback()
      }
    }
    return {
      // 当前页数
      page: 1,
      // 每页几条数据
      limit: 5,
      // 共有多少条数据
      total: 0,
      // 品牌列表数据
      list: [],
      // 对话框显示与隐藏
      dialogFormVisible: false,
      // 收集要添加或修改的表单数据
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 表单内验证规则
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'change' },
          { validator: validateTmName, trigger: 'change' }
        ],
        logoUrl: [{ required: true, message: '请添加品牌图片' }]
      }
    }
  },
  mounted() {
    this.getTradeMarkList()
  },
  methods: {
    // 获取品牌列表数据
    async getTradeMarkList() {
      const { page, limit } = this
      const result = await this.$API.tradeMark.reqTradeMarkList(page, limit)
      this.total = result.data.total
      this.list = result.data.records
    },
    // 页面的limit改变
    handleSizeChange(size) {
      this.limit = size
      this.getTradeMarkList()
    },
    // 当前页数改变
    handleCurrentChange(page) {
      this.page = page
      this.getTradeMarkList()
    },
    // 展示对话框
    showDialog() {
      this.dialogFormVisible = true
      // 把tmForm里面的东西清理
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 更新商品数据
    updateTradeMark(row) {
      // 展示对话框
      this.dialogFormVisible = true
      // 将tmForm赋值，在对话框中可以显示数据
      // 在这里要把row里面的数据解构赋值给tmForm，否则双向绑定会直接修改数据
      this.tmForm = { ...row }
      // 发起请求
      // this.addOrUpdateTradeMark()
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // 图片上传成功保存
      this.tmForm.logoUrl = URL.createObjectURL(file.raw)
    },
    // 图片上传前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 添加或修改商品
    addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          // 关闭对话框
          this.dialogFormVisible = false
          // 发送请求
          const res = await this.$API.tradeMark.reqAddOrUpdateTrademark(
            this.tmForm
          )
          if (res.code === 200) {
            this.$message.success(
              this.tmForm.id ? '修改商品成功！' : '添加商品成功!'
            )
          } else {
            this.$message.error(res.message)
          }
          // 重新获取数据
          this.getTradeMarkList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除品牌
    deleteTradeMark(row) {
      // console.log(row)
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 删除商品
        const res = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 重新获取列表
          // 先判断当前页是否只剩下一条数据，只有一条要返回上一页面，否则留在本页
          if (this.list.length === 1) {
            this.page -= 1
          }
          this.getTradeMarkList()
        } else {
          this.$message({
            type: 'info',
            message: '删除失败'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
