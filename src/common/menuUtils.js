export default (routers, data) => {
    //这里之所以要重新遍历一下，是因为，通常我们动态路由的时候，是获取服务端数据，这个component属性是一个字符串，或者可能连字段名都是其他的key
    //所以这里要做一些转换
    generaMenu(routers, data)
}

function generaMenu(routers, data) {
    // console.log(routers);
    data.forEach((item) => {
        let menu = Object.assign({}, item)
            // menu.component = lazyLoading(menu.component)
        if (item.component) {
            menu.component = (resolve) => require(['@' + item.component], resolve);
            menu.meta = {};
            menu.meta.keepAlive = true;

            // routers.push(menu);
            // console.log(routers);
        }
        if (item.children) {
            menu.children = []
            generaMenu(menu.children, item.children)
        }
        if (item.component) {
            // menu.component = (resolve) => require(['@' + item.component], resolve);
            // menu.meta = {};
            // menu.meta.keepAlive = true;

            routers.push(menu);
            console.log(routers);
        }
    })
}