[演示地址](https://114.67.71.219:9201/jeken "Jeken-Admin")
>账号：admin 密码：a

## 项目介绍
基于Vue2 + element ui实现的基础开发平台（前端），已实现基础的后台管理功能，包括用户管理、资源（菜单、权限）管理、角色（岗位）管理、组织管理、数据字典、日志管理、定时任务等，后续后逐步开发其它功能。用户可基于此平台快速开发自己的业务功能。

[前端（GitHub）](https://114.67.71.219:9201/jeken "Jeken-Admin")
[前端（Gitee）](https://github.com/0oliumino0/Jeken-Admin "Jeken-Admin")
[后端（GitHub）](https://114.67.71.219:9201/jeken "Jeken")
[后端（Gitee）](https://github.com/0oliumino0/Jeken "Jeken")

## 安装步骤

1. **安装依赖**
``` bash
npm install
```
2. **启动dev server**
``` bash
npm run dev
```
3. **编译打包**
``` bash
npm run build
```

## 打包发布,修改根路径名
1. 修改 **[./Jeken-Admin/config/index.js](Jeken-Admin/config/index.js)**   参数:build.assetsPublicPath
```javascript
//eg.  assetsPublicPath: '/Jeken-Admin/'
assetsPublicPath: '/jeken/';
```
2. 修改 **[./Jeken-Admin/src/common/axios.js](Jeken-Admin/src/common/axios.js)**
```javascript
// export const CONTEXT = 'api';
export const CONTEXT = '/jeken';
```

## 页面截图

<p><img src="https://raw.githubusercontent.com/lanux/Jeken-Admin/master/static/data/login.png?t=1" /></p>
<p><img src="https://raw.githubusercontent.com/lanux/Jeken-Admin/master/static/data/cmenu.png?t=1" /></p>
<p><img src="https://raw.githubusercontent.com/lanux/Jeken-Admin/master/static/data/dash.png?t=1" /></p>
<p><img src="https://raw.githubusercontent.com/lanux/Jeken-Admin/master/static/data/dash2.png?t=1" /></p>
<p><img src="https://raw.githubusercontent.com/lanux/Jeken-Admin/master/static/data/menu.png?t=1" /></p>
<p><img src="https://raw.githubusercontent.com/lanux/Jeken-Admin/master/static/data/menu2.png?t=1" /></p>
<p><img src="https://raw.githubusercontent.com/lanux/Jeken-Admin/master/static/data/menu5.png?t=1" /></p>
<p><img src="https://raw.githubusercontent.com/lanux/Jeken-Admin/master/static/data/resource.png?t=1" /></p>
<p><img src="https://raw.githubusercontent.com/lanux/Jeken-Admin/master/static/data/role.png?t=1" /></p>
<p><img src="https://raw.githubusercontent.com/lanux/Jeken-Admin/master/static/data/role4.png?t=1" /></p>
<p><img src="https://raw.githubusercontent.com/lanux/Jeken-Admin/master/static/data/user.png?t=1" /></p>
<p><img src="https://raw.githubusercontent.com/lanux/Jeken-Admin/master/static/data/user2.png?t=1" /></p>
<p><img src="https://raw.githubusercontent.com/lanux/Jeken-Admin/master/static/data/mobile.png?t=1" /></p>


## 鸣谢
前端的基础版本是基于[Vue-Admin](https://github.com/lanux/Vue-Admin "Vue-Admin")开发，在此基础上做了完善和扩充，完全和后端对接。