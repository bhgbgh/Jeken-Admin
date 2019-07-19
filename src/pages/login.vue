<template lang="html">
  <el-row class="all">
    <el-col :span="12" :offset="6">
      <div class="login">
      <el-row slot="body" :gutter="0" >
      <el-col :span="24" :xs="24" :sm="16" :md="16" :lg="16">
        <div class="login-form">
          <div class="card-block">
            <h1>Jeken-Admin</h1>
            <!-- <p class="text-muted">任意用户名/密码登录</p> -->
            <div class="input-group m-b-1">
              <span class="input-group-addon"><i class="fa fa-user"></i></span>
              <input type="text" class="form-control" placeholder="username" v-model="form.username">
            </div>
            <div class="input-group m-b-2">
              <span class="input-group-addon"><i class="fa fa-lock"></i></span>
              <input type="password" class="form-control" placeholder="password" v-model="form.pazzword"
                     @keyup.enter="login">
            </div>
            <div><span>{{errMsg}}</span></div>
            <div class="row">
              <el-row>
                <el-col :span="12">
                  <el-button type="primary" class="btn btn-primary p-x-2" @click="login" :loading="loginLoading">登录</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="button" class="btn btn-link forgot" style="float:right;">忘记密码?</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        </el-col>
      <el-col :span="24" :xs="24" :sm="8" :md="8" :lg="8">
        <div class="login-register">
          <div class="card-block">
            <h2>注册</h2>
            <p>平台暂时只支持使用公司邮箱注册.</p>
            <el-button type="info" class="btn btn-primary active m-t-1"> 马上注册</el-button>
          </div>
        </div>
        </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import types from "@/store/mutation-types";
import auth from "@/common/auth";
import menuUtils from "@/common/menuUtils";
import {generaMenu} from "@/common/utils";
import {encode64,decode64,strAnsi2Unicode,strUnicode2Ansi} from "@/common/base64";
import store from "@/store";
import qs from "qs";
import sha256 from "sha256"

export default {
  name: "login",
  data() {
    return {
      salt:"0YL2IPpkCDCmGIWhoF4250Hc5a2pMJmV",
      form: {
        username: "",
        pazzword: ""
      },
      errMsg:"",
      loginLoading:false
    };
  },
  components: {},
  methods: {
    // ...mapMutations({
    //   setUserInfo: types.SET_USER_INFO
    // }),
    // ...mapActions({
      // loadMenuList: "loadMenuList" // 映射 this.load() 为 this.$store.dispatch('loadMenuList')
    // }),
    login() {
      if(this.form.username.trim() == ""){
        this.errMsg = "登录用户名不能为空！";
        return;
      }
      if(this.form.pazzword.trim() == ""){
        this.errMsg = "登录密码不能为空！";
        return;
      }
      this.loginLoading = true;
      this.errMsg = "";
      var redirectUrl = "/index";
      if (
        this.$route.query &&
        this.$route.query != null &&
        this.$route.query.redirect &&
        this.$route.query.redirect != null
      ) {
        redirectUrl = this.$route.query.redirect;
      }
      // sysApi.login(this.form).then(res => {
      //   this.loginSuccess({...res,redirectUrl})
      // })

      var appRoute = {
            path: '',
            component:() =>import (`@/App.vue`),
            children: []
        };
      var str = ""+this.salt.charAt(6)+this.salt.charAt(8) + this.form.pazzword +this.salt.charAt(18) + this.salt.charAt(30);
      // this.form.pazzword = sha256(str);
      var data = {username:this.form.username.trim(),pazzword:sha256(str)};
      this.$http
        .post("/sys/login", data)
        // .post("/auth/auth/token", this.form)
        .then(
          response => {
            if(response.success){
              var data = response.data;
              // console.log(data.dicts);
              var resourceList = data.resourceList;
              var appRouteChildren = [];
              generaMenu(resourceList, appRouteChildren);
              appRouteChildren.push({ path: '/index', component:() =>import (`@/pages/dashboard.vue`) });
              appRoute.children = appRouteChildren;
              var routes = [
                  appRoute,
                  { path: '*', component: () =>import (`@/components/error-page/404.vue`)}
              ];
              this.$router.addRoutes(routes);
              store.commit(types.LOAD_MENU,data.resourceList);
              store.commit(types.SET_PERMISSIONS, data.permissions);
              store.commit(types.SET_USER_INFO, data.user);
              store.commit(types.SET_DICTS,data.dicts);
              auth.login(data);
              redirectUrl && this.$router.push({ path: redirectUrl });
            }else{
              this.errMsg = response.msg;
              this.loginLoading = false;
            }
          },
          err => {
            this.errMsg = "用户登录失败！";
            this.loginLoading = false;
          }
        );
    }
  },
  created() {
    // sessionStorage.clear();
    // localStorage.clear();
    // var strEncode = encode64(strUnicode2Ansi("JS前台编码")); 

    // console.log(strEncode);

    // var str=strAnsi2Unicode(decode64(strEncode));  
    // console.log(str);

    //  var strEncode = encode64("abcdef"); 

    // console.log(strEncode);
  }
};
</script>

<style scoped>
.all{
  /* background-color: #0093E9;
background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%); */
height: 100%;
background-color: #ffff00;
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3CradialGradient id='a' cx='0' cy='800' r='800' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23ff8000'/%3E%3Cstop offset='1' stop-color='%23ff8000' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='b' cx='1200' cy='800' r='800' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%2380e680'/%3E%3Cstop offset='1' stop-color='%2380e680' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='c' cx='600' cy='0' r='600' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23806680'/%3E%3Cstop offset='1' stop-color='%23806680' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='d' cx='600' cy='800' r='600' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23ffff00'/%3E%3Cstop offset='1' stop-color='%23ffff00' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='e' cx='0' cy='0' r='800' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23FF0000'/%3E%3Cstop offset='1' stop-color='%23FF0000' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='f' cx='1200' cy='0' r='800' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%230CF'/%3E%3Cstop offset='1' stop-color='%230CF' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='1200' height='800'/%3E%3Crect fill='url(%23b)' width='1200' height='800'/%3E%3Crect fill='url(%23c)' width='1200' height='800'/%3E%3Crect fill='url(%23d)' width='1200' height='800'/%3E%3Crect fill='url(%23e)' width='1200' height='800'/%3E%3Crect fill='url(%23f)' width='1200' height='800'/%3E%3C/svg%3E");
background-attachment: fixed;
background-size: cover;

}
.login {
  margin-top: 160px;
  width: 100%;
  border: 1px solid #cfd8dc;
  margin-right: auto !important;
  margin-left: auto !important;
  display: table;
  table-layout: fixed;
  background-color: #20a8d8;
}

.login .el-button {
  border-radius: 0;
}

.login .el-button.forgot,
.login .el-button.forgot:hover {
  border: none;
}

.login .login-form {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  display: block;
}

.login .login-form .card-block {
  padding: 35px;
}

.login .login-form .card-block p {
  margin: 15px 0;
}

.input-group {
  width: 100%;
  display: table;
  border-collapse: separate;
  margin-bottom: 20px !important;
}

.input-group,
.input-group-btn,
.input-group-btn > .btn,
.navbar {
  position: relative;
}

.input-group-addon:not(:last-child) {
  border-right: 0;
}

.input-group-addon,
.input-group-btn {
  min-width: 40px;
  white-space: nowrap;
  vertical-align: middle;
  width: 1%;
}

.btn-link:focus,
.btn-link:hover {
  color: #167495;
  text-decoration: underline;
  background-color: transparent;
}

.btn-link,
.btn-link:active,
.btn-link:focus,
.btn-link:hover {
  border-color: transparent;
}

.btn.focus,
.btn:focus,
.btn:hover {
  text-decoration: none;
}

.input-group-addon {
  padding: 0.5rem 0.75rem;
  margin-bottom: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.75rem;
  color: #607d8b;
  text-align: center;
  background-color: #cfd8dc;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.input-group .form-control,
.input-group-addon,
.input-group-btn {
  display: table-cell;
}

.input-group .form-control {
  position: relative;
  z-index: 2;
  float: left;
  margin-bottom: 0;
}

.form-control {
  width: 90%;
  padding: 0.5rem 0.75rem;
  font-size: 1.5rem;
  line-height: 1.75rem;
  color: #607d8b;
  background: #fff none;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}

.login .login-form .card-block .row {
  display: block;
  margin: 15px 0;
}

.login .login-register {
  width: 100%;
  height: 100%;
  display: block;
  background-color: #20a8d8;
  color: #fff;
}

.login .login-register .card-block {
  text-align: center !important;
  padding: 30px;
}

.login .login-register .card-block p {
  text-align: left !important;
  margin: 15px 0;
  height: 100px;
}



</style>
