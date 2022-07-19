<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <el-table :data="attrInfoList" style="width: 100%" border>
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <el-table-column prop="attrName" label="属性名称" width="180" />
          <el-table-column label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                type="success"
                style="margin: 10px"
              >{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" style="margin-right: 10px" @click="updateAttr(row)" />
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @confirm="deleteAttr"
              >
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0;" border :data="attrInfo.attrValueList">
          <el-table-column label="序号" align="center" type="index" width="80" />
          <el-table-column label="属性值名称">
            <template slot-scope="{row,$index}">
              <!-- input和span切换 -->
              <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" placeholder="请输入属性值" size="mini" @blur="toLook(row)" @keyup.native.enter="row.flag = false" />
              <span v-else style="display: block" @click="toEdit(row, $index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row, $index}">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length < 1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需导入lodash中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 商品的基础属性
      attrInfoList: [],
      // 是否显示表格
      isShowTable: true,
      // 收集新增属性|修改属性
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [ // 属性值
          // {
          //   attrId: 0, // 相应的属性名的id
          //   valueName: ''
          // }
        ],
        categoryId: 0, // 三级分类的id
        categoryLevel: 3 // 服务器也需要区分几级id
      }
    }
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        // 清除二三级id
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        this.getAttrList()
      }
    },
    // 获取平台属性
    async getAttrList() {
      // 结构出属性
      const { category1Id, category2Id, category3Id } = this
      const res = await this.$API.attr.reqGetAttrInfoList({
        category1Id,
        category2Id,
        category3Id
      })
      if (res.code === 200) {
        this.attrInfoList = res.data
      }
    },
    // 添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 对于修改某一个属性的时候，可以在已有的属性基础之上新增新的属性值（新增属性值的时候，需要把已有的属性的id带上）
        valueName: '',
        // 控制input和span切换
        flag: true
      })
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性按钮的回调
    addAttr() {
      this.isShowTable = false
      // 清除数据
      // 收集三级数据的id
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      }
    },
    // 更新平台属性
    updateAttr(row) {
      this.isShowTable = false
      // 深拷贝row里面的数据给attrInfo
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach(item => {
        // 不能这样写，这么书写可以给属性值添加flag，但是试图不会跟着变化，因为flag不是响应式数据
        // 因为vue无法探测普通的新增的property，这样书写的属性不是响应式数据
        // item.flag = false
        this.$set(item, 'flag', false)
      })
    },
    // input变为span
    toLook(row) {
      if (row.valueName.trim() === '') {
        this.$message({
          type: 'info',
          message: '请输入正确的属性值'
        })
        return
      }
      const res = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          return item.valueName === row.valueName.trim()
        }
      })
      if (res) {
        this.$message({
          type: 'info',
          message: '请勿输入重复的属性值'
        })
        return
      }
      row.flag = false
    },
    // 点击span的回调，显示input
    toEdit(row, index) {
      row.flag = true
      this.$nextTick(() => {
        // 根据refs获取对应的input，获取焦点
        this.$refs[index].focus()
      })
    },
    deleteAttr() {
      console.log(123)
    },
    // 删除属性值
    deleteAttrValue(index) {
      // 不需要发送请求
      this.attrInfo.attrValueList.splice(index, 1)
    },
    async addOrUpdateAttr() {
      // 处理参数
      // 1. 过滤出valueName不为空字符串的
      // 2. 删除掉flag参数
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName !== '') {
          delete item.flag
          return true
        }
      })
      // 添加或修改商品
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        // 展示表格
        this.isShowTable = true
        // 弹出消息
        this.$message({
          type: 'success',
          message: '保存成功！'
        })
        // 重新获取数据
        this.getAttrList()
      } catch (error) {
        this.$message({
          type: 'error',
          message: '保存失败！'
        })
      }
    }
  }
}
</script>

<style></style>
