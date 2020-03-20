/*
 * @Author: your name
 * @Date: 2020-03-01 17:19:53
 * @LastEditTime: 2020-03-20 14:21:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-blog\src\request\axios.js
 */
// 在http.js中引入axios
import axios from 'axios'; // 引入axios
import {createHashHistory} from 'history';
import BASE from './base'
import { Loading } from 'element-ui';
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到

import { Message } from 'element-react';
const history = createHashHistory();

// 环境的切换
if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = BASE.dev;
}
else if (process.env.NODE_ENV == 'debug') {
    axios.defaults.baseURL = BASE.debug;
}
else if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL = BASE.pr;
}

// 设置请求超时
axios.defaults.timeout = 1000 * 60 * 60;
// post请求头的设置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


// console.log('axios.defaults.baseURL',axios.defaults);

// 请求拦截

axios.interceptors.request.use(
    config => {
        // 每次发送请求之前判断vuex中是否存在token        
        // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 
        // console.log('config',config);

        const token = localStorage.token;
        token && (config.headers.Authorization = token);
        return config;
    },
    error => {
        return Promise.error(error);
    })



// 响应拦截器
axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据     
        // 否则的话抛出错误
        // console.log('response',response);
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码    
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
        if (error && error.response.status) {
            switch (error.response.status) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。                
                case 401:
                    history.replace('/login')
                    break;

                // 403 token过期
                // 登录过期对用户进行提示
                // 跳转登录页面                
                case 403:
                    Message({
                        message: '登录过期，请重新登录',
                        type: 'warning',
                    });
                    // 清除token
                    localStorage.removeItem('token');
                    // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面 
                    setTimeout(() => {
                        history.replace('/login')
                    }, 1000);
                    break;

                // 404请求不存在
                case 404:
                    Message({
                        message: '404地址不存在',
                        type: 'error',
                    });
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    Message({
                        message: error.response.data.msg,
                        type: 'error',
                    });
            }
            return Promise.reject(error.response);
        }
    })

// loadingOpt params 具体参数看element 参数
export default function ajax(url, data = {}, loadingOpt, method = 'get') {

    let loadingInstance
    if (loadingOpt) {
        //    console.log(Loading.service());
        loadingInstance = Loading.service(
            {
                lock: loadingOpt.lock || true,
                text: loadingOpt.text || 'loadign...',
                spinner: loadingOpt.spinner || 'el-icon-loading',
                background: loadingOpt.background || 'rgba(0, 0, 0, 0.7)'
            }
        )

    }
    let promise
    return new Promise((resovle, reject) => {
        if (method === 'get') {
            promise = axios({
                method,
                url,
                params: data
            });
        } else {
            promise = axios({
                method,
                url,
                data
            });
        }


        promise.then(res => {

            resovle(res.data);
            // console.log('res---',res);

            // console.log('执行');
            loadingInstance && loadingInstance.close()

        })
            .catch(error => {
                console.log('error', error);
                loadingInstance && loadingInstance.close()
                Message({
                    message: error.message,
                    type: 'error'
                });
            })


    })


}

