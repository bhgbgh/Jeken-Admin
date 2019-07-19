// import validator from 'validator';
import { isNullOrUndefined } from "@/common/utils";
import validate from "@/common/validate";
/**
 * 表单校验规则
 * element ui参考实现：https://github.com/yiminghe/async-validator
 *                    https://github.com/baianat/vee-validate
 * @param {*} Vue 
 * @param {*} options 
 */
exports.install = function(Vue, options) {

    /* 合法uri*/
    const url = (rule, value, callback) => {
        if (isNullOrUndefined(value)) {
            callback();
            return;
        }
        if (!validate.validateURL(value)) {
            callback(new Error('URL地址格式不正确!'));
            return;
        }
        callback();
    }

    /* 合法小写字母*/
    const lowerCase = (rule, value, callback) => {
        if (isNullOrUndefined(value)) {
            callback();
            return;
        }
        if (!validate.validateLowerCase(value)) {
            callback(new Error('请输入小写字母!'));
            return;
        }
        callback();
    }

    /* 合法大写字母*/
    const upperCase = (rule, value, callback) => {
        if (isNullOrUndefined(value)) {
            callback();
            return;
        }
        if (!validate.validateUpperCase(value)) {
            callback(new Error('请输入大写字母!'));
            return;
        }
        callback();
    }

    /* 大小写字母*/
    const alphabets = (rule, value, callback) => {
        if (isNullOrUndefined(value)) {
            callback();
            return;
        }
        if (!validate.validateAlphabets(value)) {
            callback(new Error('请输入字母!'));
            return;
        }
        callback();
    }

    /* 字母数字或下划线*/
    const alphabetsOrNum = (rule, value, callback) => {
        if (isNullOrUndefined(value)) {
            callback();
            return;
        }
        if (!validate.validateAlphabetsOrNum(value)) {
            callback(new Error('请输入字母数字或下划线!'));
            return;
        }
        callback();
    }

    /* 邮箱*/
    // const email = (rule, value, callback) => {
    //     if (!validate.validateEmail(value)) {
    //         callback(new Error('邮箱地址格式不正确！'));
    //         return;
    //     }
    //     callback();
    // }

    /* 判断身份证号码*/
    const cardid = (rule, value, callback) => {
        if (isNullOrUndefined(value)) {
            callback();
            return;
        }
        var list = validate.cardid(value);
        if (list.result) {
            callback(new Error(list.msg));
            return;
        }
        callback();
    }

    /* 判断手机号码是否正确*/
    const mobile = (rule, value, callback) => {
        console.log(value);
        if (isNullOrUndefined(value)) {
            callback();
            return;
        }
        if (!validate.validatemobile(value)) {
            callback(new Error('手机号码格式不正确！'));
            return;
        }
        callback();
    }

    /* 判断是否为电话号码*/
    const tel = (rule, value, callback) => {
        if (isNullOrUndefined(value)) {
            callback();
            return;
        }
        if (!validate.validateTel(value)) {
            callback(new Error('电话号码格式不正确！'));
            return;
        }
        callback();
    }

    /* 只能是汉字*/
    const chinese = (rule, value, callback) => {
        if (isNullOrUndefined(value)) {
            callback();
            return;
        }
        if (!validate.validateChinese(value)) {
            callback(new Error('只能输入汉字！'));
            return;
        }
        callback();
    }

    /* 特殊字符校验*/
    const specail = (rule, value, callback) => {
        if (isNullOrUndefined(value)) {
            callback();
            return;
        }
        if (!validate.validateSpecail(value)) {
            callback(new Error('不能输入特殊字符！'));
            return;
        }
        callback();
    }

    /* IP地址*/
    const ip = (rule, value, callback) => {
        if (isNullOrUndefined(value)) {
            callback();
            return;
        }
        if (!validate.validateIP(value)) {
            callback(new Error('IP地址格式不正确！'));
            return;
        }
        callback();
    }

    /* 小数*/
    // const numord = (rule, value, callback) => {
    //     if (!validate.validatenumord(value)) {
    //         callback(new Error('请输入小数！'));
    //         return;
    //     }
    //     callback();
    // }

    //根据类型判断获取规则
    var ruleTypes = {
        //邮箱
        "email": { type: 'email', message: '邮箱地址格式不正确！', trigger: 'blur' },
        //url
        "url": { validator: url, trigger: 'blur' },
        //小写字母
        "lowerCase": { validator: lowerCase, trigger: 'blur' },
        //大写字母
        "upperCase": { validator: upperCase, trigger: 'blur' },
        //字母
        "alphabets": { validator: alphabets, trigger: 'blur' },
        //字母数字或下划线
        "alphabetsOrNum": { validator: alphabetsOrNum, trigger: 'blur' },
        //身份证
        "cardid": { validator: cardid, trigger: 'blur' },
        //手机号码
        "mobile": { validator: mobile, trigger: 'blur' },
        //电话号码
        "tel": { validator: tel, trigger: 'blur' },
        //汉字
        "chinese": { validator: chinese, trigger: 'blur' },
        //特殊字符
        "specail": { validator: specail, trigger: 'blur' },
        //IP地址
        "ip": { validator: ip, trigger: 'blur' },
    };

    /**
     * 
     * required true  必填项
     * maxLength  字符串的最大长度
     * min 和 max 必须同时给 min < max  type=number
     * 参数 item
     * type 手机号 mobile
     *      邮箱   email
     *      网址   url
     *      各种自定义类型   定义在 src/utils/validate 中    持续添加中.......
     * */
    Vue.prototype.$rules = function(item) {
        // console.log(item);
        let rules = [];
        //必填项
        if (item.required) {
            rules.push({ required: true, message: '该输入项为必填项!', trigger: 'blur' });
        }

        //数字
        if (item.number) {
            rules.push({ type: 'number', message: '请输入数字!', trigger: 'blur' });
        }

        //字符最小长度和最大长度校验
        if (!isNullOrUndefined(item.minLength) && !isNullOrUndefined(item.maxLength)) {
            rules.push({ min: item.minLength, max: item.maxLength, message: '字符长度在' + item.minLength + '至' + item.maxLength + '之间!', trigger: 'blur' });
        } else if (!isNullOrUndefined(item.maxLength)) {
            rules.push({ min: 1, max: item.maxLength, message: '最多输入' + item.maxLength + '个字符!', trigger: 'blur' });
        } else if (!isNullOrUndefined(item.minLength)) {
            rules.push({ min: item.minLength, message: '最少输入' + item.minLength + '个字符!', trigger: 'blur' });
        }

        //数字最大值和最小值校验
        if (!isNullOrUndefined(item.max) && !isNullOrUndefined(item.min)) {
            rules.push({ min: item.min, max: item.max, type: 'number', message: '输入值的范围为' + item.min + '至' + item.max + '之间!', trigger: 'blur' })
        } else if (!isNullOrUndefined(item.max)) {
            rules.push({ max: item.max, type: 'number', message: '最大值为' + item.max + '!', trigger: 'blur' })
        } else if (!isNullOrUndefined(item.min)) {
            rules.push({ min: item.min, type: 'number', message: '最小值为' + item.min + '!', trigger: 'blur' })
        }


        if (item.type) {
            var types = item.type.split(",");
            for (var type of types) {
                rules.push(ruleTypes[type]);
            }
        }


        return rules;
    };




};