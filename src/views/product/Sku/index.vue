<template>
  <div>
    <el-table style="width: 100%" border :data="skuList">
      <el-table-column label="序号" width="80" type="index" align="center" />
      <el-table-column prop="skuName" label="名称" />
      <el-table-column prop="skuDesc" label="描述" />
      <el-table-column prop="date" label="默认图片" width="150">
        <template slot-scope="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; width: 100px"
          >
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="100" />
      <el-table-column prop="price" label="价格(元)" width="80" />
      <el-table-column prop="date" label="操作">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.isSale === 0"
            icon="el-icon-download"
            type="success"
            size="mini"
            @click="onSale(row)"
          />
          <el-button
            v-else
            icon="el-icon-upload"
            type="success"
            size="mini"
            @click="cancelSale(row)"
          />
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            @click="$message('正在开发中......')"
          />
          <el-button
            icon="el-icon-info"
            type="info"
            size="mini"
            @click="getSkuInfo(row)"
          />
          <el-button icon="el-icon-delete" type="danger" size="mini" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
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
    <!-- 抽屉 -->
    <el-drawer
      v-loading="loading"
      :visible.sync="drawer"
      :show-close="false"
      size="50%"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag v-for="tag in skuInfo.skuAttrValueList" :key="tag.id" type="success" style="margin: 5px">{{ tag.attrId }}-{{ tag.valueId }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel style="width: 100%">
            <el-carousel-item v-for="img in skuInfo.skuImageList" :key="img.id">
              <img :src="img.imgUrl" alt="" style="width: 100%">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      // 当前是第几页
      page: 1,
      // 每一页多少条
      limit: 10,
      // 总共多少条数据
      total: 0,
      // sku列表数据
      skuList: [],
      // sku详情
      skuInfo: {},
      // 控制抽屉的显示与隐藏
      drawer: false,
      loading: true
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    handleCurrentChange(page) {
      this.page = page
      this.getSkuList()
    },
    async getSkuList() {
      const { page, limit } = this
      const res = await this.$API.sku.reqSkuList(page, limit)
      if (res.code === 200) {
        this.total = res.data.total
        this.skuList = res.data.records
      }
    },
    // 上架商品
    async onSale(row) {
      const res = await this.$API.sku.reqOnSale(row.id)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '上架成功' })
        row.isSale = 1
      }
    },
    // 下架商品
    async cancelSale(row) {
      const res = await this.$API.sku.cancelSale(row.id)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '下架成功' })
        row.isSale = 0
      }
    },
    // 获取sku详情
    async getSkuInfo(row) {
      // 显示抽屉
      this.drawer = true
      // 发请求
      const res = await this.$API.sku.reqSkuById(row.id)
      if (res.code === 200) {
        this.skuInfo = res.data
      }
    }
  }
}
</script>

<style>
.el-row .el-col-5 {
  font-size: 18px;
  font-weight: 400;
  text-align: right;
}

.el-row .el-col{
  margin: 10px;
}
</style>
