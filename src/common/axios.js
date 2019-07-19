import axios from "axios";
// import qs from "qs";
import auth from "./auth";
import { getBaseUrl } from "@/common/utils";
import { MessageBox } from "element-ui";

// axios 配置
// axios.defaults.timeout = 10000;
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//axios.defaults.baseURL = 'http://localhost:8008';
// axios.defaults.baseURL = getBaseUrl(window.location.href);
// axios.defaults.baseURL = 'api'
axios.defaults.baseURL = '/jeken'
axios.defaults.uploadURL = axios.defaults.baseURL + "/sys/file/upload";
axios.defaults.downURL = axios.defaults.baseURL + "/sys/file/downFile";
// axios.defaults.baseURL = ''
// axios.defaults.headers.common['authUid'] = auth.getUid();
// axios.defaults.headers.common['authSid'] = auth.getSid();

// //POST传参序列化
// axios.interceptors.request.use((config) => {
//     console.log("request");
//     // this.$Progress.start();
//     if (config.method === 'post') {
//         config.data = qs.stringify(config.data);
//     }
//     return config;
// }, (error) => {
//     // console.log("请求异常：", error.response);
//     return Promise.reject(error);
// });

// //返回状态判断
// axios.interceptors.response.use(


//     response => {
//         console.log("response");
//         if (response.data && response.data.code) {
//             if (response.data.code === '2001') {
//                 auth.logout()
//             }
//         }
//         return response.data;
//     },
//     error => {
//         // console.log("响应异常：", error.response);
//         if (error.response) {
//             //全局ajax错误信息提示
//             //MessageBox({type:"error",message:error.response.data,title:"温馨提示",});
//         }
//         //return Promise.reject(error);
//     });

//POST传参序列化
axios.interceptors.request.use(
    config => {
        // console.log("request");
        vm.$Progress.start();
        // if (config.method === "post") {
        //     config.data = qs.stringify(config.data);
        // }
        return config;
    },
    error => {
        vm.$Progress.finish();
        // console.log("请求异常：", error.response);
        return Promise.reject(error);
    }
);

//返回状态判断
axios.interceptors.response.use(
    response => {
        // console.log("响应正常", response);
        vm.$Progress.finish();
        //session超时
        if (response.status == 302) {
            auth.logout();
        }
        return response.data;
    },
    error => {
        vm.$Progress.finish();
        // console.log("响应异常：", error, error.response);
        // debugger;
        if (error.response) {
            //没有权限
            if (error.response.status == 403) {
                vm.$notify.warning({ title: '系统消息', message: '权限不够，请联系系统管理员！', position: 'bottom-right' });
            } else if (error.response.status == 302) { //session超时
                // vm.$notify.warning({ title: '系统消息', message: '请求超时，请刷新页面或者重新登录！', position: 'bottom-right' });
                auth.logout();
            }
            //全局ajax错误信息提示
            //MessageBox({type:"error",message:error.response.data,title:"温馨提示",});
        }
        if (error.message == "Network Error") {
            // vm.$notify.warning({ title: '系统消息', message: '网络异常，请刷新页面或者重新登录！', position: 'bottom-right' });
            auth.logout();
        }
        return Promise.reject(error);
    }
);

// export function fetch(url, config = { method: 'get' }) {
//     return axios.request({...config, url })
//         // return new Promise((resolve, reject) => {
//         //   axios.request({ ...config, url })
//         //     .then(response => {
//         //       resolve(response.data);
//         //     }, err => {
//         //       reject(err);
//         //     })
//         //     .catch((error) => {
//         //       reject(error)
//         //     })
//         // })
// }

export default axios