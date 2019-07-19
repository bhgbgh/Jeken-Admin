import pathToRegexp from "path-to-regexp";
import lazyLoading from "./lazyLoading";

export const isNullOrUndefined = (value) => {
    return value === '' || value === null || value === undefined;
};

export const getSessionKey = (key, defaultValue) => {
    const item = window.sessionStorage.getItem(key);
    if (item == undefined && defaultValue != undefined) {
        return defaultValue
    }
    return item;
}

/**
 * 截取根目录
 * @param {*} url 
 */
export const getBaseUrl = (url) => {
    var reg = /^((\w+):\/\/([^\/:]*)(?::(\d+))?)(.*)/;
    reg.exec(url);
    return RegExp.$1;
}

/**
 * 获取根目录
 * @param {*} url 
 */
export const getRootUrl = () => {
    var reg = /^((\w+):\/\/([^\/:]*)(?::(\d+))?)(.*)/;
    reg.exec(window.location.href);
    return RegExp.$1;
}

export const keyMirror = (obj) => {
    let key
    let mirrored = {}
    if (obj && typeof obj === 'object') {
        for (key in obj) {
            if ({}.hasOwnProperty.call(obj, key)) {
                mirrored[key] = key
            }
        }
    }
    return mirrored
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
    let data = array.map(item => ({...item }))
    let result = []
    let hash = {}
    data.forEach((item, index) => {
        hash[data[index][id]] = data[index]
    })

    data.forEach((item) => {
        let hashVP = hash[item[pid]]
        if (hashVP) {
            !hashVP[children] && (hashVP[children] = [])
            hashVP[children].push(item)
        } else {
            result.push(item)
        }
    })
    return result
}

export function getCurrentMenu(location, arrayMenu) {
    if (!!arrayMenu) {
        let current = []
        for (let i = 0; i < arrayMenu.length; i++) {
            const e = arrayMenu[i];
            const child = getCurrentMenu(location, e.children);
            if (!!child && child.length > 0) {
                child.push({...e, children: null });
                return child;
            }
            if (e.path && pathToRegexp(e.path).exec(location)) {
                current.push({...e, children: null });
                return current;
            }
        }
        return current;
    }
    return null;
}

/**
 * 列表批量删除公共函数
 * @param {*} url 删除请求地址
 * @param {*} selectedRows 要删除的行，默认取id属性进行删除
 */
export function batchDeleteUtil(url, selectedRows) {
    vm.$notify.error({ title: '系统消息', message: "演示环境暂不允许删除数据！", position: 'bottom-right' });
    return;
    return new Promise(function(resolve) {
        // console.log(selectedRows);
        if (selectedRows.length == 0) {
            vm.$notify.warning({ title: '系统消息', message: '请选择需要删除的行！', position: 'bottom-right' });
            return resolve(false);
        }
        vm.$confirm('确认是否进行批量删除操作?', '系统提示', {
            type: 'warning'
        }).then(() => {
            let ids = selectedRows[0].id;
            for (let i = 1; i < selectedRows.length; i++) {
                ids += "," + selectedRows[i].id;
            }
            // console.log(ids);
            vm.$http.get(url + ids).then(res => {
                if (res.success) {
                    vm.$notify.success({ title: '系统消息', message: res.msg, position: 'bottom-right' });
                    return resolve(true);
                } else {
                    vm.$notify.error({ title: '系统消息', message: res.msg, position: 'bottom-right' });
                    return resolve(false);
                }
            });
        }).catch(() => {
            return resolve(false);
        });
    });
}

/**
 * 根据id删除列表数据
 * @param {*} url 删除请求地址
 */
export function deleteRowUtil(url, content) {
    vm.$notify.error({ title: '系统消息', message: "演示环境暂不允许删除数据！", position: 'bottom-right' });
    return;
    return new Promise(function(resolve) {
        vm.$confirm(content ? content : '确认是否进行删除操作?', '系统提示', {
            type: 'warning'
        }).then(() => {
            vm.$http.get(url).then(res => {
                if (res.success) {
                    vm.$notify.success({ title: '系统消息', message: res.msg, position: 'bottom-right' });
                    return resolve(true);
                } else {
                    vm.$notify.error({ title: '系统消息', message: res.msg, position: 'bottom-right' });
                    return resolve(false);
                }
            });
        }).catch(() => {
            return resolve(false);
        });
    });
}

/**
 * http get请求（带确认提示框）
 * @param {*} url 
 * @param {*} opMsg 
 */
export function confirmGet(url, opMsg) {
    return new Promise(function(resolve) {
        vm.$confirm('确认是否进行' + opMsg + '操作?', '系统提示', {
            type: 'warning'
        }).then(() => {
            vm.$http.get(url).then(res => {
                if (res.success) {
                    vm.$notify.success({ title: '系统消息', message: res.msg, position: 'bottom-right' });
                    return resolve(true);
                } else {
                    vm.$notify.error({ title: '系统消息', message: res.msg, position: 'bottom-right' });
                    return resolve(false);
                }
            });
        }).catch(() => {
            return resolve(false);
        });
    });
}

/**
 * 表单提交
 * @param {*} url 提交请求地址
 * @param {*} valid 是否通过表单校验
 * @param {*} form 表单数据对象
 * @param {*} upRouteName 操作成功后路由跳转地址名称
 */
export function submitFormUtil(url, valid, form, upRouteName) {
    return new Promise(function(resolve) {
        //表单校验通过
        if (valid) {
            //有id表示是修改操作
            if (form.id) {
                url += "/updateById"
            } else {
                url += "/save"
            }
            vm.$http.post(url, form)
                .then(res => {
                    if (res.success) {
                        vm.$notify.success({ title: '系统消息', message: res.msg, position: 'bottom-right' });
                        if (upRouteName) {
                            vm.$router.push({ name: upRouteName, params: { isReload: true } });
                        }
                        return resolve(res);
                    } else {
                        vm.$notify.error({ title: '系统消息', message: res.msg, position: 'bottom-right' });
                        return resolve(false);
                    }
                })
        } else {
            vm.$notify.error({ title: '系统消息', message: "表单校验失败！", position: 'bottom-right' });
            return resolve(false);
        }
    });
}

/**
 * 表单提交
 * @param {*} url 提交请求地址
 * @param {*} valid 是否通过表单校验
 * @param {*} form 表单数据对象
 * @param {*} upRouteName 操作成功后路由跳转地址名称
 */
export function submitFormUtilByUrl(url, valid, form, upRouteName) {
    return new Promise(function(resolve) {
        //表单校验通过
        if (valid) {
            //有id表示是修改操作
            vm.$http.post(url, form)
                .then(res => {
                    if (res.success) {
                        vm.$notify.success({ title: '系统消息', message: res.msg, position: 'bottom-right' });
                        if (upRouteName) {
                            vm.$router.push({ name: upRouteName, params: { isReload: true } });
                        }
                        return resolve(res);
                    } else {
                        vm.$notify.error({ title: '系统消息', message: res.msg, position: 'bottom-right' });
                        return resolve(false);
                    }
                })
        } else {
            vm.$notify.error({ title: '系统消息', message: "表单校验失败！", position: 'bottom-right' });
            return resolve(false);
        }
    });
}

/**
 * 遍历菜单数据，转换为路由
 * @param {*} data 菜单数据
 * @param {*} routers 路由
 */
export function generaMenu(data, routers) {
    for (let i = 0; i < data.length; i++) {
        var item = data[i];
        let menu = Object.assign({}, item);
        if (item.component) {
            menu.component = lazyLoading(item.component);
            menu.meta = {};
            if (item.keepAlive) {
                menu.meta.keepAlive = true;
                if (item.children) {
                    //加载菜单不需要显示的路由页面
                    for (let j = 0; j < item.children.length; j++) {
                        let cmenu = Object.assign({}, item.children[j]);
                        cmenu.component = lazyLoading(item.children[j].component);
                        cmenu.meta = {};
                        cmenu.meta.upPath = item.path;
                        routers.push(cmenu);
                    }
                }
            }
            routers.push(menu);
        }
        if (item.children) {
            if (item.component) {
                menu.children = [];
                generaMenu(menu.children, item.children);
            } else {
                generaMenu(menu.children, routers);
            }
        }
    }
}

/**
 * 时间毫秒数转固定日期格式
 * @param {*} milliseconds 
 */
export function formatDateTime(milliseconds) {
    if (!milliseconds) {
        return '';
    }
    var theDate = new Date(milliseconds);
    var _hour = theDate.getHours();
    var _minute = theDate.getMinutes();
    var _second = theDate.getSeconds();
    var _year = theDate.getFullYear()
    var _month = theDate.getMonth();
    var _date = theDate.getDate();
    if (_hour < 10) { _hour = "0" + _hour; }
    if (_minute < 10) { _minute = "0" + _minute; }
    if (_second < 10) { _second = "0" + _second }
    _month = _month + 1;
    if (_month < 10) { _month = "0" + _month; }
    if (_date < 10) { _date = "0" + _date }
    return _year + "-" + _month + "-" + _date + " " + _hour + ":" + _minute + ":" + _second;
}

/**
 * 获取文件上传参数
 * @param {*} uploadFiles 
 */
export function getFiles(uploadFiles) {
    var files = [];
    if (uploadFiles && uploadFiles.length > 0) {
        for (var i = 0; i < uploadFiles.length; i++) {
            var uploadFile = uploadFiles[i]
                //upload组件取uploadFiles值的时候，通过点击加载的文件数据和默认加载的数据格式不一致，通过一下判断做区分，可能是element ui的upload组件功能不完善导致的
            if (uploadFile.response) {
                files.push(uploadFiles[i].response.data);
            } else {
                files.push(uploadFile);
            }
        }
    }
    return files;
}


// /** 
//      * 使用递归方法建树 
//      * @param treeNodes 
//      * @return 
//      */  
//     // public static List<SysOrg> buildByRecursive(List<SysOrg> treeNodes) {  
//     export function buildByRecursive(treeNodes) {  
//         // List<SysOrg> trees = new ArrayList<SysOrg>();  
//         var trees = [];  
//         for (var i = 0 ; i < treeNodes.length ; i++) {  
//             var treeNode = treeNodes[i];
//             if(treeNode.parentId == 0){
//                 trees.push(findChildren(treeNode,treeNodes));
//             }
//             if ("0".equals(treeNode.getParentId())) {  
//                 trees.add(findChildren(treeNode,treeNodes));  
//             }  
//         }  
//         return trees;  
//     }  

//     /** 
//      * 递归查找子节点 
//      * @param treeNodes 
//      * @return 
//      */  
//     public static SysOrg findChildren(SysOrg treeNode,List<SysOrg> treeNodes) {  
//         for (SysOrg it : treeNodes) {  
//             if(treeNode.getId().equals(it.getParentId())) {  
//                 if (treeNode.getChildren() == null) {  
//                     treeNode.setChildren(new ArrayList<SysOrg>());  
//                 }  
//                 treeNode.getChildren().add(findChildren(it,treeNodes));  
//             }  
//         }  
//         return treeNode;  
//     }

/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
        if (fullscreenEnable()) {
            exitFullScreen();
        } else {
            reqFullScreen();
        }
    }
    /**
     * esc监听全屏
     */
export const listenfullscreen = (callback) => {
        function listen() {
            callback()
        }
        document.addEventListener("fullscreenchange", function(e) {
            listen();
        });
        document.addEventListener("mozfullscreenchange", function(e) {
            listen();
        });
        document.addEventListener("webkitfullscreenchange", function(e) {
            listen();
        });
        document.addEventListener("msfullscreenchange", function(e) {
            listen();
        });
    }
    /**
     * 浏览器判断是否全屏
     */
export const fullscreenEnable = () => {
    var isFullscreen = document.fullscreenEnabled ||
        window.fullScreen ||
        document.mozFullscreenEnabled ||
        document.webkitIsFullScreen;
    return isFullscreen;
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        }
    }
    /**
     * 浏览器退出全屏
     */
export const exitFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.exitFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.mozCancelFullScreen();
    }
}

/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
    let random = '';
    random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len ? len : 4);
    if (date) random = random + Date.now();
    return random;
}

/**
 * 根据身份证计算年龄，性别
 */
export const IdCard = function(UUserCard, num) {
    if (UUserCard.length == 18) {
        if (num == 1) {
            //获取出生日期
            let birth = ''
            birth = UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
            return birth;
        }
        if (num == 2) {
            //获取性别
            if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
                //男
                return "1";
            } else {
                //女
                return "2";
            }
        }
        if (num == 3) {
            //获取年龄
            var myDate = new Date();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
            if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
                age++;
            }
            return age;
        }
    }
    return '';

}