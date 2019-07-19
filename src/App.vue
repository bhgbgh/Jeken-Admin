<template>
  <div class="wrapper fixed">
    <vue-progress-bar></vue-progress-bar>
    <imp-header></imp-header>
    <side-menu></side-menu>
      <div class="content-wrapper" :class="{ slideCollapse: sidebar.collapsed,mobileSide:device.isMobile}">
        <el-scrollbar tag="div" wrapClass="content-scrollbar">
          <section class="content">
            <!-- <el-breadcrumb separator="/" style="margin-bottom: 20px;">
              <template v-for="child in currentMenus">
                <el-breadcrumb-item :to="{ path: child.href }">{{child.name}}</el-breadcrumb-item>
              </template>
            </el-breadcrumb> -->

            <el-breadcrumb class="app-breadcrumb" style="margin-bottom: 10px;" separator-class="el-icon-arrow-right">
              <transition-group name="breadcrumb">
                <el-breadcrumb-item v-for="child  in currentMenus" :key="child.path">{{child.textName}}</el-breadcrumb-item>
              </transition-group>
            </el-breadcrumb>
            <transition name="custom-classes-transition" mode="out-in"  leave-active-class="animated fadeOutDown" appear>
              <!-- <router-view></router-view> -->
              <keep-alive :include="cachedViews">
                <router-view></router-view>
              </keep-alive>
              <!-- <keep-alive>
                  <router-view v-if="$route.meta.keepAlive"></router-view>
              </keep-alive>
              <router-view v-if="!$route.meta.keepAlive"></router-view> -->
            </transition>
            <!-- <imp-footer></imp-footer> -->
          </section>
        </el-scrollbar>
      </div>
  </div>
</template>

<script>
import Vue from "vue";
import SideMenu from "@/components/SideMenu.vue";
import impHeader from "@/pages/layout/header.vue";
import impFooter from "@/pages/layout/footer.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import types from "@/store/mutation-types";
import auth from "@/common/auth";

import "animate.css";

export default {
  name: "app",
  components: {
    SideMenu,
    impFooter,
    impHeader
  },
  computed: {
    ...mapGetters({
      sidebar: "sidebar",
      device: "device",
      currentMenus: "currentMenus",
      cachedViews: "cachedViews"
    })
  },
  data: function() {
    return {
      active: true,
      headerFixed: true,
      breadcrumb: []
    };
  },
  methods: {
    ...mapMutations({
      toggleDevice: types.TOGGLE_DEVICE,
      toggleSidebar: types.TOGGLE_SIDEBAR,
      toggleSidebarShow: types.TOGGLE_SIDEBAR_SHOW,
      setUserInfo: types.SET_USER_INFO
    }),
    ...mapActions({
      changeCurrentMenu: "changeCurrentMenu" // 映射 this.changeCurrentMenu() 为 this.$store.dispatch('changeCurrentMenu')
    })
  },
  // watch: {
  //   $route: function(to, from) {console.log("watch");}
  // },
  beforeMount() {
    const { body } = document;
    const WIDTH = 784;
    const handler = () => {
      if (!document.hidden) {
        let rect = body.getBoundingClientRect();
        let isMobile = rect.width < WIDTH;
        this.toggleDevice(isMobile);
        if (isMobile) {
          this.toggleSidebarShow(false);
          this.toggleSidebar(false);
        } else {
          this.toggleSidebarShow(true);
        }
      }
    };
    document.addEventListener("visibilitychange", handler);
    window.addEventListener("DOMContentLoaded", handler);
    window.addEventListener("resize", handler);
  },
  beforeCreate() {
    // console.log("beforeCreated");
    // console.log("App.vue beforeCreated",auth.loggedIn());
    if(!auth.loggedIn()){
        return this.$router.push({path:'/login'});
    }
    // this.$http.get('/sys/currentUserInfo')
    //       .then(res => {
    //         console.log(res);
    //         this.setUserInfo(res.user);
    //       }).catch(error => {});
  },
  // mounted() {
  //   //  [App.vue specific] When App.vue is finish loading finish the progress bar
  //   // this.$Progress.finish();
  //   console.log("created",this.$router.currentRoute);
  //   this.changeCurrentMenu(this.$router.currentRoute);
  // },
  created() {
    
    // console.log(this.$router);
    
    // console.log("created");
    // //POST传参序列化
    // this.$http.interceptors.request.use(
    //   config => {
    //     // console.log("request");
    //     this.$Progress.start();
    //     if (config.method === "post") {
    //       config.data = qs.stringify(config.data);
    //     }
    //     return config;
    //   },
    //   error => {
    //     this.$Progress.finish();
    //     // console.log("请求异常：", error.response);
    //     return Promise.reject(error);
    //   }
    // );

    // //返回状态判断
    // this.$http.interceptors.response.use(
    //   response => {
    //     this.$Progress.finish();
    //     if (response.data && response.data.code) {
    //       if (response.data.code === "2001") {
    //         auth.logout();
    //       }
    //     }
    //     return response.data;
    //   },
    //   error => {
    //     this.$Progress.finish();
    //     // console.log("响应异常：", error.response);
    //     // if (error.response) {
    //       //全局ajax错误信息提示
    //       //MessageBox({type:"error",message:error.response.data,title:"温馨提示",});
    //     // }
    //     //return Promise.reject(error);
    //   }
    // );
  }
};
</script>

<style>
.animated {
  animation-duration: 0.3s;
}

blockquote,
body,
dd,
dl,
dt,
fieldset,
figure,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
html,
iframe,
legend,
li,
ol,
p,
pre,
textarea,
ul {
  margin: 0;
  padding: 0;
}

*,
:after,
:before {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.content-wrapper {
  -webkit-transition: -webkit-transform 0.3s ease-in-out,
    margin 0.3s ease-in-out;
  -moz-transition: -moz-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
  -o-transition: -o-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out, margin 0.3s ease-in-out;
  margin-left: 230px;
  padding-top: 50px;
}

.content-scrollbar {
  height: calc(100vh - 50px);
}

.content-wrapper .el-scrollbar__bar.is-vertical {
  display: none;
}

.content-wrapper .content {
  padding: 1.25rem;
}

.content-wrapper.slideCollapse {
  margin-left: 44px;
}

.content-wrapper.mobileSide {
  margin-left: 0px;
}

/*fade*/
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all 0.5s;
}

.breadcrumb-leave-active {
  position: absolute;
}

.el-table__expanded-cell[class*=cell] {
    padding: 5px 5px;
}
</style>
