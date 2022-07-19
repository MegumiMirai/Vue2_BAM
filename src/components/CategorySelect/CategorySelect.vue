<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" :disabled="show" @change="handler1">
          <el-option v-for="item in list1" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" :disabled="show" @change="handler2">
          <el-option v-for="item in list2" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" :disabled="show" @change="handerl3">
          <el-option v-for="item in list3" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      // 一级分类数据
      list1: [],
      // 一二三级分类的id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      },
      // 二级分类数据
      list2: [],
      // 三级分类数据
      list3: []
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类数据
    async getCategory1List() {
      const res = await this.$API.attr.reqCategory1List()
      if (res.code === 200) {
        this.list1 = res.data
      }
    },
    // 一级分类的select事件回调（当一级分类的option发生变化的时候获取相应二级分类的数据）
    async handler1() {
      // 把二级和三级数据清除掉
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      // 结构出一级分类id
      const { category1Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      // 获取数据
      const res = await this.$API.attr.reqCategory2List(category1Id)
      if (res.code === 200) {
        this.list2 = res.data
      }
    },
    // 二级分类select事件回调（当二级分类的option发生变化的时候获取相应三级分类的数据）
    async handler2() {
      // 把三级分类的数据清除
      this.list3 = []
      this.cForm.category3Id = ''
      // 结构出二级分类Id
      const { category2Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      // 获取数据
      const res = await this.$API.attr.reqCategory3List(category2Id)
      if (res.code === 200) {
        this.list3 = res.data
      }
    },
    // 三级分类select事件回调
    handerl3() {
      const { category3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style></style>
