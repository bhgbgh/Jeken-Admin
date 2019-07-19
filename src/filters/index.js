import store from "@/store";
import { isNullOrUndefined, formatDateTime } from "@/common/utils";
// const $dict = {
//     "userStatus": [{
//             "backgroundColor": '#d9534f',
//             "name": "未激活",
//             "value": "0"
//         },
//         {
//             "backgroundColor": '#5cb85c',
//             "name": "已激活",
//             "value": "1"
//         }
//     ]
// };
//默认可供选择的颜色
// const options = ['', '#5cb85c', '#f0ad4e', '#d9534f', '#428bca', '#145b7d', '#a1a3a6', '#020304', '#37bc9b', '#f532e5', '#7266ba', '#b2d235'];
/**
 * 去除首尾空格
 * @param  {[string]} string [字符串]
 * @return {[string]}        [返回处理后数据]
 */
const trim = (string) => {
    return string.toString().replace();
}

const subString = (value, length = 10) => {
    if (value && value != null && value.length > length) {
        return value.substring(0, length)
    }
    return value;
}

/**
 * 数据字典过滤器
 * @param {*} input 
 * @param {*} name 
 */
const dictFilter = (input, name) => {

    if (isNullOrUndefined(input)) { //如果是空，返回空字符串，防止是number0
        return "";
    }
    try {
        var dictArr = store.getters.dicts[name];
        // console.log(input, name, dictArr);
        for (var i = 0; i < dictArr.length; i++) {
            if (input == dictArr[i].value) {
                if (dictArr[i].backgroundColor) {
                    return "<span class='el-tag " + dictArr[i].backgroundColor + "'>" + dictArr[i].name + "</span>";;
                } else {
                    return dictArr[i].name;
                }

            }
        }
    } catch (e) {
        return "未知";
    }
    //否则有值，而在参数类型中没有找到，返回未知
    return "未知";
};

/**
 * 将时间毫秒数格式化为（2017-06-06 15:05:04）
 * @param {*} input 
 * @param {*} name 
 */
const formatDateTimeFilter = (input) => {
    if (isNullOrUndefined(input)) {
        return "";
    }
    return formatDateTime(input);
};

export default {
    trim,
    subString,
    dictFilter,
    formatDateTimeFilter
}