import store from "@/store";
/**
 * 数据字典
 * @param {*} Vue 
 * @param {*} options 
 */
exports.install = function(Vue, options) {

    Vue.prototype.$dicts = function(dictType) {
        return store.getters.dicts[dictType];
    };
};