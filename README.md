[演示地址](http://114.67.71.219:9201/jeken "Jeken-Admin")
>账号：admin 密码：a

## 项目介绍
基于Vue2 + element 基于Vue2 + element ui实现的基础开发平台（前端），支持前后端分离开发，已实现基础的后台管理功能，包括用户管理、资源（菜单、权限）管理、角色（岗位）管理、组织管理、数据字典、日志管理、定时任务等，后续后逐步开发其它功能。用户可基于此平台快速开发自己的业务功能。



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
1. 修改“Jeken-Admin/config/index.js”，参数:build.assetsPublicPath
```javascript
//eg.  assetsPublicPath: '/Jeken-Admin/'
assetsPublicPath: '/jeken/';
```
2. 修改“Jeken-Admin/src/common/axios.js“
```javascript
// export const CONTEXT = 'api';
export const CONTEXT = '/jeken';
```

## 页面截图

<p><img src="https://github.com/bhgbgh/Jeken-Admin/blob/master/static/data/%E7%99%BB%E5%BD%95.png?raw=true" /></p>
<p><img src="https://github.com/bhgbgh/Jeken-Admin/blob/master/static/data/%E7%94%A8%E6%88%B7%E7%AE%A1%E7%90%86.png?raw=true" /></p>
<p><img src="https://github.com/bhgbgh/Jeken-Admin/blob/master/static/data/%E8%A1%A8%E5%8D%95%E9%A1%B5.png?raw=true" /></p>
<p><img src="https://github.com/bhgbgh/Jeken-Admin/blob/master/static/data/%E8%B5%84%E6%BA%90%E7%AE%A1%E7%90%86.png?raw=true" /></p>
<p><img src="https://github.com/bhgbgh/Jeken-Admin/blob/master/static/data/%E5%AE%9A%E6%97%B6%E4%BB%BB%E5%8A%A1.png?raw=true" /></p>


## 鸣谢
前端的基础版本是基于[Vue-Admin](https://github.com/lanux/Vue-Admin "Vue-Admin")开发，在此基础上做了完善和扩充，完全和后端对接。