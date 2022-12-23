import { Promise } from 'core-js'
import { ADD_COUNTER, ADD_TO_CRAT } from './mutations-types'

export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // state.cartList.push(payLoad)
      // 1 查找之前数组中是否有该商品
      // let oldProduct = null
      // for (let item of state.cartList) {
      //   if (item.iid === payload.iid) {
      //     oldProduct = item
      //   }
      // }
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      // 2 判断 oldProduct
      if (oldProduct) {
        // oldProduct.count += 1
        context.commit(ADD_COUNTER, oldProduct)
        resolve('当前商品数量+1')
      } else {
        payload.count = 1
        // context.state.cartList.push(payload)
        context.commit(ADD_TO_CRAT, payload)
        resolve('添加了新的商品')
      }
    })
  }
}