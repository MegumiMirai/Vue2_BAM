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
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" />
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
      <SkuForm v-show="scene === 2" ref="sku" />
    </el-card>
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
      scene: 0 // 0表示Spu列表，1表示添加或修改Spu，2表示Sku表单
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
    }
  }
}
</script>

<style></style>

