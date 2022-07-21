import mockRequest from '@/utils/mockRequest'

const state = {
  list: {}
}
const mutations = {
  GETDATA(state, data) {
    state.list = data
  }
}
const actions = {
  async getDate(mutations) {
    const res = await mockRequest.get('/home/list')
    if (res.code === 20000) {
      mutations.commit('GETDATA', res.data)
    }
  }
}
const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
