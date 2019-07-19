import Vue from "vue";
import VueRouter from "vue-router";
// import routeConfig from "./routes";
import { sync } from "vuex-router-sync";
import store from "@/store";
import types from "@/store/mutation-types";
import auth from "@/common/auth";
import { getCurrentMenu } from '@/common/utils'

//加载路由中间件
Vue.use(VueRouter)

let routeConfig = [{
        path: '/login',
        component: () =>
            import (`@/pages/login.vue`)
    },
    // {
    //     path: '*',
    //     component: () =>
    //         import (`@/components/404.vue`)
    // }
];

let appRouteConfig = {
    path: '',
    // component: (resolve) => require(['@/App.vue'], resolve),
    component: () =>
        import (`@/App.vue`),
    children: [
        // { path: '/resetPwd', component: resetPwd },
        // { path: '/index', component: (resolve) => require(['@/pages/dashboard.vue'], resolve) },
        // { path: '/sys/menuList', component: menuList },
        // { name: "role", path: '/sys/roleList', component: (resolve) => require(['@/pages/sys/role.vue'], resolve), meta: { keepAlive: true } }, //keepAlive：需要缓存的列表页
        // { name: "sysUser", path: '/sys/userList', component:  (resolve) => require(['@/pages/sys/user.vue'], resolve), meta: { keepAlive: true }, },
        // { name: "userFrom", path: '/sys/userFrom', component: (resolve) => require(['@/pages/sys/userFrom.vue'], resolve), meta: { upPath: "/sys/userList" } }, //upPath:上一级菜单path，只有需要缓存上一级页面，才需要这种此字段，避免菜单导航会切换
        // { name: "resource", path: '/sys/resource', component: (resolve) => require(['@/pages/sys/resource.vue'], resolve), meta: { keepAlive: true } }
    ]
};
// console.log("router");
//如果已经登录，表示是刷新页面，重新从后台加载权限资源数据
// if (auth.loggedIn) {
//     console.log("router, 重新从后台加载权限和菜单资源！");

// }

routeConfig.push(appRouteConfig);
// routeConfig.push({
//     path: '/index',
//     component: () =>
//         import (`@/pages/dashboard.vue`)
// });


//定义路由
const router = new VueRouter({
    routes: routeConfig,
    //mode: 'history'
})

sync(store, router)

const { state } = store

router.beforeEach((route, redirect, next) => {
    // console.log("beforeEach", route, store.getters.menuList, store.getters.menuList.length);
    if (store.getters.menuList.length) {
        let currentMenu = getCurrentMenu(route.fullPath, store.getters.menuList);
        if (currentMenu.length == 0) {
            currentMenu = getCurrentMenu(route.meta.upPath, store.getters.menuList);
        }
        store.commit(types.LOAD_CURRENT_MENU, currentMenu.reverse());
    }

    if (state.device.isMobile && state.sidebar.opened) {
        store.commit(types.TOGGLE_SIDEBAR, false)
    }
    // console.log();
    if (!auth.loggedIn() && route.path !== '/login') {
        next({
            path: '/login',
            query: { redirect: route.fullPath }
        })
    } else {
        //列表页跳转详情页、编辑页、新增页，缓存列表页
        if (route.meta.keepAlive) {
            store.commit(types.DEL_ALL_CACHED_VIEWS);
            store.commit(types.PUSH_CACHED_VIEWS, route.name);
        }
        next()
    }
})

// router.afterEach((to, from) => {
// console.log("afterEach");
// });

export default router