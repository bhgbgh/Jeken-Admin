import Vue from "vue";
import Vuex from "vuex";
import types from "./mutation-types";
import { getSessionKey } from '@/common/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
    strict: true, // 严格模式，process.env.NODE_ENV !== 'production', 直接修改state 抛出异常
    state: {
        loading: false,
        menuList: {}, //菜单数据
        sidebar: {
            collapsed: getSessionKey('state.sidebar.collapsed', 'false') === 'true',
            show: getSessionKey('state.sidebar.show', 'true') === 'true',
        },
        device: {
            isMobile: false
        },
        userInfo: { name: '佚名' }, //当前登录用户信息
        currentMenus: [], //当前菜单层级列表（系统管理/安全管理/用户管理）
        cachedViews: [], //缓存页面name，配合keep-alive使用。参考https://segmentfault.com/a/1190000010546663
        permissions: [], //权限数据
        dicts: [], //数据字典
    },
    getters: {
        loading: state => state.loading,
        menuList: state => state.menuList,
        sidebar: state => state.sidebar,
        userInfo: state => state.userInfo,
        device: state => state.device,
        currentMenus: state => state.currentMenus,
        cachedViews: state => state.cachedViews,
        permissions: state => state.permissions,
        dicts: state => state.dicts,
    },
    //更改 Vuex 的 store 中的状态的唯一方法是提交 mutation，mutations 通过 store.commit方法触发通过，只能同步的函数
    mutations: {

        [types.TOGGLE_DEVICE](state, isMobile) {
            state.device.isMobile = isMobile
        },
        [types.TOGGLE_LOADING](state) {
            state.loading = !state.loading
        },
        [types.LOAD_MENU](state, menu) {
            state.menuList = menu;
        },
        [types.LOAD_CURRENT_MENU](state, menu) {
            state.currentMenus = menu;
        },
        [types.SET_USER_INFO](state, info) {
            state.userInfo = info;
        },
        [types.SET_PERMISSIONS](state, permissions) {
            state.permissions = permissions;
        },
        [types.SET_DICTS](state, dicts) {
            state.dicts = dicts;
        },
        [types.TOGGLE_SIDEBAR](state, collapsed) {
            if (collapsed == null) collapsed = !state.sidebar.collapsed;
            state.sidebar.collapsed = collapsed;
            window.sessionStorage.setItem("state.sidebar.collapsed", collapsed)
        },
        [types.TOGGLE_SIDEBAR_SHOW](state, show) {
            if (show == null) state.sidebar.show = !state.sidebar.show;
            else {
                state.sidebar.show = show;
            }
            window.sessionStorage.setItem("state.sidebar.show", state.sidebar.show)
        },
        [types.PUSH_CACHED_VIEWS](state, cachedView) {
            if (state.cachedViews.includes(cachedView)) {
                return;
            }
            state.cachedViews.push(cachedView);
        },
        [types.DEL_CACHED_VIEWS](state, cachedView) {
            for (const i of state.cachedViews) {
                if (i === cachedView) {
                    const index = state.cachedViews.indexOf(i)
                    state.cachedViews.splice(index, 1)
                    break
                }
            }
        },
        [types.DEL_ALL_CACHED_VIEWS](state) {
            state.cachedViews = [];
        },
    },
    //Action 通过 store.dispatch方法触发,可以异步操作
    actions: {
        //异步的函数
        toggleLoading: ({ commit }) => commit(types.TOGGLE_LOADING),
        // loadMenuList: ({ commit }) => {
        //     Vue.axios.get(api.SYS_MENU_LIST).then(res => {
        //         commit(types.LOAD_MENU, res.resourceList);
        //         // commit(types.LOAD_MENU, defaultValue.menuList);
        //         // }).catch(exp => commit(types.LOAD_MENU, defaultValue.menuList));
        //     }).catch(exp => commit(types.LOAD_MENU, []));
        // },
        changeCurrentMenu: ({ state, commit }, { currentMenu }) => {

            // let a = getCurrentMenu(fullPath, state.menuList);
            // console.log(fullPath, meta, a, state.menuList);
            // if (a.length == 0) {
            //     a = getCurrentMenu(meta.upPath, state.menuList);
            // }

            commit(types.LOAD_CURRENT_MENU, currentMenu);
        }
    },
})

export default store