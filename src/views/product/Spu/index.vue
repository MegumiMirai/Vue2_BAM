<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect :show="scene !== 0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="scene === 0">
        <!-- 展示Spu列表 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column label="spu名称" width="180" prop="spuName" />
          <el-table-column label="spu描述" prop="description" />
          <el-table-column label="操作">
            <template slot-scope="{row, $index}">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)" />
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)" />
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="showSku(row)" />
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10, 20]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <SpuForm v-show="scene === 1" ref="spu" @changeScene="changeScene" />
      <SkuForm v-show="scene === 2" ref="sku" @changeScenes="changeScenes" />
    </el-card>
    <el-dialog :title="`${title}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table v-loading="loading" :data="skuList">
        <el-table-column property="skuName" label="名称" />
        <el-table-column property="price" label="价格" />
        <el-table-column property="weight" label="重量" />
        <el-table-column property="address" label="默认图片">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width: 80px; height: 80px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 导入子组件
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  components: { SpuForm, SkuForm },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1, // 分页器当前页数
      limit: 3, // 每一页展示多少条数据
      total: 0, // 总共多少条数据
      records: [], // Spu列表数据
      scene: 0, // 0表示Spu列表，1表示添加或修改Spu，2表示Sku表单
      // 对话框的显示与隐藏
      dialogTableVisible: false,
      // sku实例对象列表
      skuList: [],
      // 对话框的标题
      title: '',
      // 加载中
      loading: true
    }
  },
  methods: {
    // 自定义事件的回调，获取一、二、三级数据的id
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        // 清除二、三级数据
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        // 清除三级数据
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 获取Spu数据
        this.getSpuList()
      }
    },
    // 获取Spu数据
    async getSpuList() {
      const { page, limit, category3Id } = this
      const res = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (res.code === 200) {
        this.total = res.data.total
        this.records = res.data.records
      }
    },
    // 当前展示数据条数改变
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 当前页数改变
    handleCurrentChange(page) {
      this.page = page
      this.getSpuList()
    },
    // 添加Spu按钮的回调
    addSpu() {
      this.scene = 1
      // 调用子组件添加的回调
      this.$refs.spu.addSpu(this.category3Id)
    },
    // 修改Spu按钮的回调
    updateSpu(row) {
      this.scene = 1
      // 调用子组件初始化的函数
      this.$refs.spu.initSpuData(row)
    },
    // 自定义事件回调
    changeScene({ scene, flag }) {
      // flag是区分修改还是添加的
      this.scene = scene
      // 从添加或修改回到这里的时候需要重新获取数据
      if (flag === '添加') {
        this.page = 1
      }
      this.getSpuList()
    },
    // 删除spu按钮的回调
    async deleteSpu(row) {
      const res = await this.$API.spu.reqDeleteSpu(row.id)
      if (res.code === 200) {
        if (this.records.length === 1) {
          this.page -= 1
        }
        this.getSpuList()
      }
    },
    // 添加sku
    addSku(row) {
      // 改变scene为2
      this.scene = 2
      // 调用sku的函数,获取数据
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // sku自定义事件改变场景
    changeScenes(scene) {
      this.scene = scene
    },
    // 获取sku实例
    async showSku(row) {
      // 展示对话框
      this.dialogTableVisible = true
      const res = await this.$API.spu.reqSkuList(row.id)
      if (res.code === 200) {
        this.loading = false
        this.skuList = res.data
        this.title = row.spuName
      }
    },
    // 对话框关闭前的回调
    close(done) {
      // 将loading变为true
      this.loading = true
      // 清空数据
      this.skuList = []
      // 关闭对话框
      done()
    }
  }
}
</script>

<style></style>

