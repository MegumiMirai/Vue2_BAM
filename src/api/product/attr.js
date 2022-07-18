// 平台属性模块管理
import request from '@/utils/request'

// 获取一级分类数据接口
export const reqCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'GET' })

// 获取二级分类数据接口
export const reqCategory2List = (id) => request({ url: `/admin/product/getCategory2/${id}`, method: 'GET' })

// 获取三级分类数据接口
export const reqCategory3List = (id) => request({ url: `/admin/product/getCategory3/${id}`, method: 'GET' })

// 获取商品基础属性
export const reqGetAttrInfoList = ({ category1Id, category2Id, category3Id }) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'GET'
})

// 添加属性与属性值接口
export const reqAddAttr = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'POST', data })
/*
{
  "attrName": '', // 属性名
  "attrValueList": [ // 属性名中属性值，因为属性值可以是多个，因此需要的是数组
    {
      "attrId": 0, // 属性的id
      "valueName": 'string' // 属性值
    }
  ],
  "categoryId": 0, // category3Id
  "categoryLevel": 3
}
*/
