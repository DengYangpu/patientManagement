import axios from 'axios'
import {
  signature,
  zipUtf16
} from './sign' // 引入md5签名文件
import store from '../store/index';
import Qs from 'qs'
// import Vue from 'vue'
//以下是新加
import {
  Message
} from 'element-ui';

// Vue.prototype.$message = Message;

let env = process.env.NODE_ENV;
// let root = '';

if (env === 'development') {
  axios.defaults.baseURL = '/api';
  // root = '/api'
} else if (env === 'production') {
  axios.defaults.baseURL = 'https://app.hyghealth.com/applet.php/';
  // root = 'https://app.hyghealth.com/applet.php/';
} else {
  throw '请检查process.env.NODE_ENV的值，是否符合这些值之一：development，production';
}

const service = axios.create({
  // 公共接口--这里注意后面会讲
  // baseURL: process.env.BASE_API,
  // 超时时间 单位是ms，这里设置了3s的超时时间
  timeout: 5000
})
// 2.请求拦截器
service.interceptors.request.use(config => {
  //发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
  if (config.url != 'login/account') {
    config.data.token = store.state.token
  }
  // console.log(store.state.token);

  config.data.timestamp = Date.parse(new Date());
  config.data.version = '1.0.1';
  config.data.sign = signature(config.data);
   config.data = Qs.stringify(config.data); //数据转化,也可以使用qs转换
  // //  config.headers = {
  // //    'Content-Type':'application/x-www-form-urlencoded' //配置请求头
  // //  }
  //  //注意使用token的时候需要引入cookie方法或者用本地localStorage等方法，推荐js-cookie
  // //  const token = getCookie('名称');//这里取token之前，你肯定需要先拿到token,存一下
  // //  if(token){
  // //     config.params = {'token':token} //如果要求携带在参数中
  // //     config.headers.token= token; //如果要求携带在请求头中
  // //   }
  // console.log(config.url);
  return config
}, error => {
  // console.log(error);
  Promise.reject(error)
})

// 3.响应拦截器
service.interceptors.response.use(response => {
  //接收到响应数据并成功后的一些共有的处理，关闭loading等
  // console.log(response);
  if (response.data.code || 1 > 1000) {
    Message.error(response.data.message);
    return response;
  } else {
    const res = zipUtf16(response.data)
    return res;
  }
  // return response
}, error => {
   /***** 接收到异常响应的处理开始 *****/
  if (error && error.response) {
    // 1.公共错误处理
    // 2.根据响应码具体处理
    switch (error.response.status) {
      case 400:
        Message.error('错误请求')
        break;
      case 401:
        Message.error('未授权，请重新登录')
        break;
      case 403:
        Message.error('拒绝访问')
        break;
      case 404:
        Message.error('请求错误,未找到该资源')
        window.location.href = "/NotFound"
        break;
      case 405:
        Message.error('请求方法未允许')
        break;
      case 408:
        Message.error('请求超时')
        break;
      case 500:
        Message.error('服务器端出错')
        break;
      case 501:
        Message.error('网络未实现')
        break;
      case 502:
        Message.error('网络错误')
        break;
      case 503:
        Message.error('服务不可用')
        break;
      case 504:
        Message.error('网络超时')
        break;
      case 505:
        Message.error('http版本不支持该请求')
        break;
      default:
        Message.error(`连接错误${error.response.status}`)
    }
  } else {
    // 超时处理
    if (JSON.stringify(error).includes('timeout')) {
      Message.error('服务器响应超时，请刷新当前页')
    }
    Message.error('连接服务器失败')
  }

  Message.error(error.message)
  /***** 处理结束 *****/
  //如果不需要错误处理，以上的处理过程都可省略
  return Promise.resolve(error.response)
})
//4.导入文件
export default service
