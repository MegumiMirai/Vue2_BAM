<template>
  <div>
    <el-form label-width="100px" class="demo-ruleForm">
      <el-form-item label="SPU名称">
        <el-input
          v-model="spu.spuName"
          autocomplete="off"
          placeholder="SPU名称"
        />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            v-for="tradeMark in tradeMarkList"
            :key="tradeMark.id"
            :label="tradeMark.tmName"
            :value="tradeMark.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          v-model="spu.description"
          placeholder="SPU描述"
          type="textarea"
          rows="4"
        />
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="attrIdAndName"
          :placeholder="`还有${unSelectSaleAttr.length}项选择`"
        >
          <el-option
            v-for="selectSaleAttr in unSelectSaleAttr"
            :key="selectSaleAttr.id"
            :label="selectSaleAttr.name"
            :value="`${selectSaleAttr.id}:${selectSaleAttr.name}`"
          />
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndName"
          @click="addSaleAttr"
        >添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            prop="date"
            label="序号"
            type="index"
            width="80"
            align="center"
          />
          <el-table-column prop="saleAttrName" label="属性名" width="150" />
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row }">
              <el-tag
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!--   @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @blur="handleInputConfirm(row)"
              />
              <!--  @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
              >添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="操作" width="150">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {
        // spu属性初始化的时候是一个空的对象，在修改SPU的时候，会向服务器发请求，返回SPU信息（对象），在修改的时候可以利用服务器返回的这个对象收集
        // 最新的数据提交给服务器
        // 添加SPU，如果是添加SPU的时候并没有向服务器发请求，数据收集到spu
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: '',
        // spu名称
        spuName: '',
        // 品牌的id
        tmId: '',
        // 收集SPU图片的信息
        spuImageList: [],
        // 平台属性与属性值
        spuSaleAttrList: []
      },
      tradeMarkList: [], // 存储品牌信息
      spuImageList: [], // 存储SPU图片的数据
      saleAttrList: [
      ], // 销售属性的数据
      attrIdAndName: ''
    }
  },
  computed: {
    unSelectSaleAttr() {
      // 计算出还未选择的销售属性
    // 整个平台的销售属性一共三个:尺寸/颜色/版本 --- saleAttrList
    // 当前SPU拥有的属于自己的销售属性SPU, spuSaleAttrList --- 颜色
    // 数组的过滤方法，可以从已有的数组中过滤出用户需要的元素，并返回一个新的数据
      const result = this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
      return result
    }
  },
  methods: {
    // 照片墙删除某一个图片的时候触发
    handleRemove(file, fileList) {
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 照片墙图片上传成功的回调
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList
    },
    // 初始化spu数据
    async initSpuData(spu) {
      // 获取SPU信息
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 获取品牌信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取SPU图片的数据
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageResult.code === 200) {
        // 由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        // 需要把服务器返回的数据进行修改
        const imageArr = spuImageResult.data
        imageArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = imageArr
      }
      // 获取平台全部销售属性
      const baseSaleAttrResult = await this.$API.spu.reqBaseSaleAttrList()
      if (baseSaleAttrResult.code === 200) {
        this.saleAttrList = baseSaleAttrResult.data
      }
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 已经收集需要添加的销售属性的信息
      // 把收集到的销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(':')
      // 创建新的销售属性
      const spuSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      // 添加到spu的spuSaleAttrList
      this.spu.spuSaleAttrList.push(spuSaleAttr)
      // 清空input
      this.attrIdAndName = ''
    },
    // 添加属性值的按钮的回调
    addSaleAttrValue(row) {
      // 添加响应式数据inputVisible， 控制input和button转换
      this.$set(row, 'inputVisible', true)
      // 挂载响应式数据inputValue，获取input中的数据
      this.$set(row, 'inputValue', '')
    },
    // input输入框失去焦点事件
    handleInputConfirm(row) {
      // 将输入框中的数据添加到spuSaleAttrValueList中
      // 解构出需要的数据
      const { inputValue, baseSaleAttrId } = row
      // 新增的属性值不能为空
      if (inputValue.trim() === '') {
        this.$message('属性值不能为空')
        return
      }
      // 属性值不能重复
      const res = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === inputValue)
      if (res) {
        this.$message('属性值不能重复')
        return
      }
      const newSaleAttrValue = {
        saleAttrValueName: inputValue,
        baseSaleAttrId
      }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // input变成button
      row.inputVisible = false
    },
    // 删除属性值
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1)
    },
    // 删除属性
    deleteSaleAttr(index) {
      this.spu.spuSaleAttrList.splice(index, 1)
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数，整理需要照片墙的数据
      // 携带参数：对于图片，需要携带imageName和imageUrl字段
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url
        }
      })
      // 发请求
      const res = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '保存成功！' })
        // 调用自定义事件，返回scene=0
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 添加Spu的回调
    async addSpu(category3Id) {
      // 获取品牌信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取平台全部销售属性
      const baseSaleAttrResult = await this.$API.spu.reqBaseSaleAttrList()
      if (baseSaleAttrResult.code === 200) {
        this.saleAttrList = baseSaleAttrResult.data
      }
      this.spu.category3Id = category3Id
    },
    // 取消按钮的回调
    cancel() {
      // 通知父组件更换场景为0
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 清理数据
      // Object.assign是es6中新增的语法，可以合并对象
      // this._data可以操作data中的响应式数据
      // this.$options可以获取配置对象,配置对象的data函数执行,返回的响应式数据为空
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
