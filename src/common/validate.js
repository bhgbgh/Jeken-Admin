export default {
    /* 小写字母*/
    validateLowerCase: function validateLowerCase(str) {
        const reg = /^[a-z]+$/
        return reg.test(str)
    },

    /* 大写字母*/
    validateUpperCase: function validateUpperCase(str) {
        const reg = /^[A-Z]+$/
        return reg.test(str)
    },

    /* 大小写字母*/
    validateAlphabets: function validateAlphabets(str) {
        const reg = /^[A-Za-z]+$/
        return reg.test(str)
    },

    /**
     * 只能是汉字
     */
    validateChinese: function validateChinese(name) {
        var regName = /^[\u0391-\uFFE5]+$/;
        if (!regName.test(name)) return false;
        return true;
    },
    /**
     * 字母数字或下划线
     */
    validateAlphabetsOrNum: function validateAlphabetsOrNum(name) {
        var regName = /^\w+$/;
        if (!regName.test(name)) return false;
        return true;
    },
    /**
     * 输入的是否是数字，小数保留几位小数
     */
    validatenumord: function validatenumord(num, len) {
        var regu = /^[0-9]+\.?[0-9]*$/;
        if (num != "") {
            if (!regu.test(num)) {
                return false;
            } else {
                if (len == 0) {
                    if (num.indexOf('.') > -1) {
                        return false;
                    }
                }
                if (num.indexOf('.') > -1) {
                    if (num.split('.')[1].length > len) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    },
    //特殊字符校验
    validateSpecail: function validateSpecail(value, name) {
        var exp = /[!@#$%^&*~<>',.]/;
        //值含有特殊字符或空格!
        if (exp.test(value)) {
            return false;
        } else
            return true;
    },
    /**
     * 判断是否为空
     */
    validatenull: function validatenull(val) {
        if (typeof val == 'boolean') {
            return false;
        }
        if (val instanceof Array) {
            if (val.length == 0) return true;
        } else if (val instanceof Object) {
            if (JSON.stringify(val) === '{}') return true;
        } else {
            if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true;
            return false;
        }
        return false;
    },

    /**
     * 邮箱
     * validate email
     * @param email
     * @returns {boolean}
     */
    validateEmail: function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
    },

    /**
     * 判断身份证号码
     */
    cardid: function cardid(code) {
        let list = {};
        let result = true;
        let msg = '';
        var city = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江 ",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北 ",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏 ",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外 "
        };
        if (!validatenull(code)) {
            if (code.length == 18) {
                if (!code || !/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code)) {
                    msg = "证件号码格式错误";
                } else if (!city[code.substr(0, 2)]) {
                    msg = "地址编码错误";
                } else {
                    //18位身份证需要验证最后一位校验位
                    code = code.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                    //校验位
                    var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2, 'x'];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++) {
                        ai = code[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if (parity[sum % 11] != code[17]) {
                        msg = "证件号码校验位错误";
                    } else {
                        result = false;
                    }

                }
            } else {
                msg = "证件号码长度不为18位";
            }

        } else {
            msg = "证件号码不能为空";
        }
        list.result = result;
        list.msg = msg;
        return list;
    },
    // 判断是否为手机号
    validatemobile: function validatemobile(pone) {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(pone)) {
            return false;
        } else {
            return true;
        }
    },
    // 判断是否为电话号码
    validateTel: function validateTel(tel) {
        var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
        if (!myreg.test(tel)) {
            return false;
        } else {
            return true;
        }
    },
    /* 合法uri*/
    validateURL: function validateURL(textval) {
        const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
        return urlregex.test(textval)
    },
    /* 合法IP*/
    validateIP: function validateIP(val) {
        const regex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/
        return regex.test(val)
    }

}