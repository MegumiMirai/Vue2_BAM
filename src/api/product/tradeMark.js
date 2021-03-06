// 这个模块主要获取的是品牌管理的数据的模块
import request from '@/utils/request.js'
// 获取品牌列表接口
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 处理添加品牌
// 新增品牌： /admin/product/baseTrademark/save   post  携带两个参数：品牌名称、品牌logo
// 切记：对于新增的品牌，给服务器传递数据，不需要传递id，id是由服务器生成

// 修改品牌
// 修改品牌 /admin/product/baseTrademark/update   put   携带三个参数：id、品牌名称、品牌LOGO
// 切记：对于修改某一个品牌的操作，前端携带的参数需要带上id，你需要告诉服务器修改的是哪一个品牌

export const reqAddOrUpdateTrademark = (trademark) => {
  if (trademark.id) {
    // 发起修改的请求
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'PUT',
      data: trademark
    })
  } else {
    // 发起添加的请求
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'POST',
      data: trademark
    })
  }
}

// 删除品牌
export const reqDeleteTradeMark = (id) => request({
  url: `/admin/product/baseTrademark/remove/${id}`,
  method: 'delete'
})
