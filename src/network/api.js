// import request from './request'

// export function getUserInfo(data) {
//   return request.post('login/account',data)
// }

import http from './http'


/**
 * 登录接口
 */
export function Login(params){
  return http.post(`login/account`,params)
}

/**
 * 获取所有权限规则
 */
export function getRule(params){
  return http.post(`auth/rule/index`,params)
}

/**
 * 添加权限规则
 */
export function addRule(params){
  return http.post(`auth/rule/add`,params)
}

/**
 * 编辑权限规则
 */
export function editRule(params){
  return http.post(`auth/rule/edit`,params)
}

/**
 * 删除权限规则
 */
export function delRule(params){
  return http.post(`auth/rule/del`,params)
}