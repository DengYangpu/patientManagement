import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import config from '../../package.json'
// import modules from './modules/..'

Vue.use(Vuex)

const state = sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')):{
  version: config.version ,
  userInfo: null,
  token: null,
  rule: null,
}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules: {
  }
})

export default store
