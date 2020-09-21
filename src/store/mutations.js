import {SET_USERINFO, SET_TOKEN, SET_RULE} from './mutations-types'

export default {
  [SET_USERINFO](state,userInfo){
    state.userInfo= userInfo;
  },
  [SET_TOKEN](state, token) {
    state.token= token;
  },
  [SET_RULE](state, rule) {
    state.rule= rule;
  },
}