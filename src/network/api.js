// import request from './request'

// export function getUserInfo(data) {
//   return request.post('login/account',data)
// }

import http from './http'

export function Login(params){
  return http.post(`login/account`,params)
}