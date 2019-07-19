import login from "@/pages/login.vue";
// Routes
const routes = [
    { path: '/login', component: login },
    // {
    //     path: '/test',
    //     component: app,
    //     children: [
    //         { path: '*', component: NotFoundView }
    //     ]
    // },
    // {
    //     path: '',
    //     component: app,
    //     children: [
    //         { path: '/resetPwd', component: resetPwd },
    //         { path: '/index', component: dashboard },
    //         // { path: '/sys/menuList', component: menuList },
    //         // { name: "role", path: '/sys/roleList', component: role, meta: { keepAlive: true } }, //keepAlive：需要缓存的列表页
    //         // { name: "sysUser", path: '/sys/userList', component: sysUser, meta: { keepAlive: true }, },
    //         // { name: "userFrom", path: '/sys/userFrom', component: userFrom, meta: { upPath: "/sys/userList" } }, //upPath:上一级菜单path，只有需要缓存上一级页面，才需要这种此字段，避免菜单导航会切换
    //         // { name: "resource", path: '/sys/resource', component: resource, meta: { keepAlive: true } }
    //     ]
    // },
    // { path: '*', component: NotFoundView }
]

export default routes