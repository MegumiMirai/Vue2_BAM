<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model.number="skuInfo.price" placeholder="价格(元)" type="number" />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" placeholder="规格描述" type="textarea" rows="4" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="attrValue in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.saleAttrIdAndValueId" placeholder="请选择">
              <el-option v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column label="图片">
            <template slot-scope="{row}">
              <img style="width: 100px; height: 100px" :src="row.imgUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName" />
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button v-if="row.isDefault === 0" type="primary" size="mini" @click="changeDefault(row)">设为默认</el-button>
              <el-tag v-else type="success" disable-transitions>默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      // 存储图片的信息
      spuImageList: [],
      // 存储销售属性
      spuSaleAttrList: [],
      // 存储平台属性的数据
      attrInfoList: [],
      // 收集sku数据
      skuInfo: {
        // 第一类收集的数据:父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类:需要通过数据双向绑定v-model收集
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        // 第三类:需要自己书写的代码
        skuDefaultImg: '',
        // 收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   isDefault: '',
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0
          // }
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: '',
          //   saleAttrValueId: 0,
          //   saleAttrValueName: '',
          //   skuId: 0,
          //   spuId: 0
          // }
        ]
      },
      spu: {},
      imageList: []

    }
  },
  methods: {
    // 发请求获取数据
    async getData(category1Id, category2Id, spu) {
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 获取存储图片的信息
      const res1 = await this.$API.spu.reqSpuImageList(spu.id)
      if (res1.code === 200) {
        const list = res1.data
        list.forEach(item => {
          // 给每个图片信息添加isDefault字段
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性
      const res2 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (res2.code === 200) {
        this.spuSaleAttrList = res2.data
      }
      // 获取平台属性
      const res3 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (res3.code === 200) {
        this.attrInfoList = res3.data
      }
    },
    // 复选框选中事件
    handleSelectionChange(selection) {
      // 收集复选框选中的图片
      this.imageList = selection
    },
    // 点击设置默认,排他
    changeDefault(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      // 设置为默认
      row.isDefault = 1
      // 收集默认图片
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 点击取消按钮的回调
    cancel() {
      // 自定义事件,通知父组件改变场景
      this.$emit('changeScenes', 0)
      // 清空数据
      Object.assign(this._data, this.$options.data())
    },
    // 发请求
    async save() {
      // 整理参数
      // 整理平台属性
      // 方式一
      // const { attrInfoList, skuInfo } = this
      // const arr = []
      // attrInfoList.forEach(item => {
      //   if (item.attrIdAndValueId) {
      //     const [attrId, valueId] = item.attrIdAndValueId.split(':')
      //     const obj = { attrId, valueId }
      //     arr.push(obj)
      //   }
      // })
      // skuInfo.skuAttrValueList = arr
      // 方式二
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleAttrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      // 整理图片数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // 发请求
      const res = await this.$API.spu.reqAddSku(skuInfo)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '保存成功!' })
        this.$emit('changeScenes', 0)
        // 清空数据
        Object.assign(this._data, this.$options.data())
      }
    }
  }
}
</script>

<style>

</style>
