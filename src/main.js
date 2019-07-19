import 'babel-polyfill';
import Vue from "vue";
import frame from "@/frame.vue";
import router from "@/router";
import store from "@/store";
import axios from "@/common/axios";
import filters from "@/filters";
import VueProgressBar from "vue-progressbar";
import Element from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
// import '../static/icon/iconfont.css'
import '@/styles/form.css';
import ImpPanel from "@/components/ImpPanel.vue";
import rules from "@/common/rules";
import dicts from "@/common/dicts";
import types from "@/store/mutation-types";
import auth from "@/common/auth";
import { generaMenu, isNullOrUndefined } from "@/common/utils";

Vue.prototype.$http = axios
Vue.axios = axios
Vue.http = axios;
Vue.use(axios);
Vue.use(rules);
Vue.use(dicts);
Vue.use(Element);

Vue.component(ImpPanel.name, ImpPanel);

Vue.use(VueProgressBar, {
    color: '#67C23A',
    failedColor: '#874b4b',
    thickness: '3px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s'
    },
    autoRevert: true,
    location: 'top',
    inverse: false
})


Object.keys(filters).forEach(key => {
        Vue.filter(key, filters[key])
    })
    // console.log("实列化vue对象");

// let res = auth.getJkinfo();
//如果已经登录，表示是刷新页面，重新从后台加载权限资源数据
if (auth.loggedIn()) {
    // store.commit(types.LOAD_MENU, res.resourceList);
    let appRoute = {
        path: '',
        component: () =>
            import (`@/App.vue`),
        children: []
    };
    axios.get('/sys/currentUserInfo')
        .then(res => {
            // console.log(res.resourceList);
            let appRouteChildren = [];
            generaMenu(res.resourceList, appRouteChildren);
            // console.log(appRouteChildren);
            appRouteChildren.push({
                path: '/index',
                component: () =>
                    import (`@/pages/dashboard.vue`)
            });

            appRoute.children = appRouteChildren;
            let routes = [
                appRoute,
                {
                    path: '*',
                    component: () =>
                        import (`@/components/error-page/404.vue`)
                }
            ];
            // console.log(res.resourceList);
            router.addRoutes(routes);
            store.commit(types.LOAD_MENU, res.resourceList);
            store.commit(types.SET_USER_INFO, res.user);
            store.commit(types.SET_PERMISSIONS, res.permissions);
            store.commit(types.SET_DICTS, res.dicts);
        }).catch(error => {});
}

// console.log(store.getters.permissions);

Vue.directive('has', {
    bind: function(el, binding) {
        // console.log(store.getters.permissions, binding.value);
        if (!store.getters.permissions.includes(binding.value)) {
            el.parentNode.removeChild(el);
        }
    }
});



var vm = new Vue({
    store,
    router,
    el: "#root",
    render: h => h(frame)
})
window.vm = vm;
// if (!res) {
//     auth.logout();
// }

/**
 * 文件下载钩子，配合upload组件“on-preview”事件使用
 * @param {} file 
 */
Vue.prototype.handlePreview = function(file) {
        let content;
        if (file.response) {
            content = axios.defaults.downURL + "?fileId=" + file.response.data.id;
        } else {
            content = axios.defaults.downURL + "?fileId=" + file.id;
        }
        location.href = content;
    }
    /**
     * 上传错误提示钩子，配合upload组件“on-preview”事件使用
     * @param {*} err 
     * @param {*} file 
     * @param {*} fileList 
     */
Vue.prototype.handleError = function(err, file, fileList) {
    // console.log(err, file, fileList);
    vm.$notify.error({ title: '系统消息', message: "附件上传失败！", position: 'bottom-right' });
}

/**
 * 文件上传前的校验提示
 * @param {*} file 
 */
Vue.prototype.handleBeforeUpload = function(file) {
    // console.log(file);
    var size = file.size;
    //52428800kb == 50M
    if (file.size > 52428800) {
        vm.$notify.error({ title: '系统消息', message: "上传文件不能大于50M！", position: 'bottom-right' });
        return false;
    }
}