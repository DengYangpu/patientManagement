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
 * 获取侧边栏
 */
export function getGroupRules(params){
  return http.post(`auth/group/fetchGroupRules`,params)
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

/**
 * 查询角色组
 */
export function getGroup(params){
  return http.post(`auth/group/index`,params)
}

/**
 * 添加角色组
 */
export function addGroup(params){
  return http.post(`auth/group/add`,params)
}

/**
 * 删除角色组
 */
export function delGroup(params){
  return http.post(`auth/group/del`,params)
}

/**
 * 编辑角色组
 */
export function editGroup(params){
  return http.post(`auth/group/edit`,params)
}

/**
 * 查询角色
 */
export function getAdmin(params) {
  return http.post(`auth/admin/index`,params)
}

/**
 * 修改角色
 */
export function editAdmin(params) {
  return http.post(`auth/admin/edit`,params)
}

/**
 * 添加角色
 */
export function addAdmin(params) {
  return http.post(`auth/admin/add`,params)
}

/**
 * 删除角色
 */
export function delAdmin(params) {
  return http.post(`auth/admin/del`,params)
}

/**
 * 搜索角色
 */
export function searchAdmin(params) {
  return http.post(`auth/admin/search`,params)
}

/**
 * 获取医院信息
 */
export function getHospital(params) {
  return http.post(`hospital/getHospitals`,params)
}

/**
 * 查询医院信息
 */
export function queryHospital(params) {
  return http.post(`hospital/index`,params)
} 

/**
 * 新增医院信息
 */
export function addHospital(params) {
  return http.post(`hospital/add`,params)
} 
/**
 * 修改医院信息
 */
export function editHospital(params) {
  return http.post(`hospital/edit`,params)
} 
/**
 * 删除医院信息
 */
export function delHospital(params) {
  return http.post(`hospital/del`,params)
} 