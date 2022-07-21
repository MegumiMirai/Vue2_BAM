// 引入登录|退出登录|获取用户信息的函数接口
import { login, logout, getInfo } from '@/api/user'
// 获取token|设置token|删除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 路由模块当中重置路由的方法
import { asyncRoutes, resetRouter, constantRoutes, anyRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // 存储用户名
    name: '',
    // 存储用户头像
    avatar: '',
    // 服务器返回的菜单信息[根据不同的角色,返回的标记信息,数组里面的元素是字符串]
    routes: [],
    // 按钮权限的信息
    buttons: [],
    // 角色信息
    roles: [],
    // 对比之后【项目中已有的异步任务，与服务器返回的标记信息进行对比最终需要展示的理由】
    resultAsyncRotes: [],
    // 最终的所有路由
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO(state, userInfo) {
    // 用户名
    state.name = userInfo.name
    // 用户头像
    state.avatar = userInfo.avatar
    // 菜单权限标记
    state.routes = userInfo.routes
    // 按钮权限标记
    state.buttons = userInfo.buttons
    // 角色
    state.roles = userInfo.roles
  },
  SET_RESULTASYNCROUTES(state, asyncRoutes) {
    state.resultAsyncRotes = asyncRoutes
    // 计算出当前用户需要展示的所有路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRotes, anyRoutes)
    // 给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前用户【超级管理|普通员工】需要展示的异步路由
  return asyncRoutes.filter(item => {
    // 数组当中没有这个元素返回值为-1，有这个元素返回的索引值不是-1
    if (routes.indexOf(item.name) !== -1) {
      // 递归
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    // 结构出用户名和密码
    const { username, password } = userInfo
    const res = await login({ username: username.trim(), password: password })
    // console.log(res)
    if (res.code === 20000) {
      commit('SET_TOKEN', res.data.token)
      setToken(res.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('fail'))
    }
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          // 存储用户全部信息
          commit('SET_USERINFO', data)
          commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
