<template>
  <aside class="main-sidebar animated" :class="{ showSlide: sidebar.show, hideSlide: !sidebar.show, expandSide:(!sidebar.collapsed||device.isMobile)}">
    <el-scrollbar tag="div" wrapClass="vue-scrollbar" v-if="(!sidebar.collapsed||device.isMobile)">
      <div class="sidebar">
        <el-menu :default-active="onRoutes" unique-opened
                 :default-openeds="onRouteKeys"
                 class="el-menu-style"
                 router :collapse="sidebar.collapsed&&!device.isMobile" @select="handleSelect">
          <template v-for="item in menuList">
            <sub-menu :param="item"></sub-menu>
          </template>
        </el-menu>
      </div>
    </el-scrollbar>
    <div class="sidebar" v-else>
      <el-menu :default-active="onRoutes" unique-opened
               class="el-menu-style"
               router :collapse="sidebar.collapsed&&!device.isMobile" @select="handleSelect">
        <template v-for="item in menuList">
          <sub-menu :param="item"></sub-menu>
        </template>
      </el-menu>
    </div>
  </aside>
</template>
<script>
  import SubMenu from "./SubMenu.vue"
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import types from "@/store/mutation-types"
  import { getCurrentMenu } from '@/common/utils'
  // import role from "../pages/sys/role.vue";


  export default {
    props: {
      show: Boolean,
    },
    data() {
      return {}
    },
    components: {
      SubMenu,
    },
    computed: {
      ...mapGetters({
        sidebar: 'sidebar',
        device:'device',
      }),
      onRoutes(){
        if(this.$route.meta && this.$route.meta.upPath){
          return this.$route.meta.upPath;
        }
        return this.$route.path;
      },
      onRouteKeys(){
        const getParentArray = (path, ms, kas = []) => {
          // console.log(ms);
          if (ms && ms.length > 0) {
            for (let k = 0, length = ms.length; k < length; k++) {
              if (path == ms[k].path) {
                kas.push(ms[k].path);
                break;
              }
              let i = kas.length;
              if (ms[k].children && ms[k].children.length > 0) {
                getParentArray(path, ms[k].children, kas);
              }
              if (i < kas.length) {
                kas.push(ms[k].path);
              }
            }
          }
          return kas.reverse();
        }
        if(this.$route.meta && this.$route.meta.upPath){
          return getParentArray(this.$route.meta.upPath, this.menuList);
        }
        
        return getParentArray(this.$route.path, this.menuList);
      },
      // 使用对象展开运算符将 getters 混入 computed 对象中
      ...mapGetters([
        'menuList'
      ])
    },
    // mounted () {
      // let route = this.$route
//      console.log(route)
//      if (route.name) {
//        this.shouldExpandMatchItem(route)
//      }
// console.log("created",this.$router.currentRoute);
//       this.changeCurrentMenu(this.$router.currentRoute);
    // },
    created: function () {
      // this.load();
      // this.$http.get("/sys/resource/menu").then(res => {
          // console.log(res);
          // this.loadMenu(res.resourceList);
          this.changeCurrentMenu(this.$router.currentRoute);
          if (this.$store.getters.menuList.length) {
              let currentMenu = getCurrentMenu(this.$router.currentRoute.fullPath, this.$store.getters.menuList);
              if (currentMenu.length == 0) {
                  currentMenu = getCurrentMenu(this.$router.currentRoute.meta.upPath, this.$store.getters.menuList);
              }
              this.loadCurrentMenu(currentMenu.reverse());
          }
          // this.$router.addRoutes({ name: "role", path: '/sys/roleList', component: role, meta: { keepAlive: true } });
          // console.log("get('/sys/resource/menu')");
                // commit(types.LOAD_MENU, res.resourceList);
                // commit(types.LOAD_MENU, defaultValue.menuList);
                // }).catch(exp => commit(types.LOAD_MENU, defaultValue.menuList));
      // });
      
    },
    methods: {
      handleSelect() {
        if(this.device.isMobile){
          this.toggleSidebarShow(false);
        }
      },
      // 使用对象展开运算符将此对象混入到外部对象中
      ...mapMutations({
        toggleSidebarShow: types.TOGGLE_SIDEBAR_SHOW,
        loadMenu: types.LOAD_MENU,
        loadCurrentMenu:types.LOAD_CURRENT_MENU
      }),
      // 使用对象展开运算符将此对象混入到外部对象中
      ...mapActions({
        // load: 'loadMenuList', // 映射 this.load() 为 this.$store.dispatch('loadMenuList')
        changeCurrentMenu: "changeCurrentMenu" // 映射 this.changeCurrentMenu() 为 this.$store.dispatch('changeCurrentMenu')
      })
    }
  }
</script>
<style scoped>

  .showSlide {
    animation-duration: .2s;
    animation-name: slideInLeft;
  }

  .hideSlide {
    animation-duration: .2s;
    animation-name: slideOutLeft;
  }

  .main-sidebar {
    background-color: #ffffff;
    position: fixed;
    top: 50px;
    left: 0;
    bottom: 0;
    height: calc(100vh - 50px);
    width: 44px;
    z-index: 810;
    -webkit-transition: -webkit-transform 0.3s ease-in-out, width 0.3s ease-in-out;
    -moz-transition: -moz-transform 0.3s ease-in-out, width 0.3s ease-in-out;
    -o-transition: -o-transform 0.3s ease-in-out, width 0.3s ease-in-out;
    transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
  }

  .expandSide {
    width: 230px;
  }

  .el-menu-style,
  .el-menu-style .el-menu{
    background-color: #ffffff;
  }
  .el-menu-style .el-menu-item:hover,
  .el-menu-style .el-submenu__title:hover{
    background-color: #eeeeee !important;
  }

  .el-menu-style .el-submenu .el-menu-item {
    height: 45px;
    line-height: 45px;
  }

  .el-menu-style .el-menu-item,
  .el-menu-style .el-submenu__title {
    height: 45px;
    line-height: 45px;
  }

  .main-sidebar .el-menu--collapse {
    width: 44px;
  }

  .main-sidebar .el-menu--collapse>.el-menu-item,
  .main-sidebar .el-menu--collapse>.el-submenu>.el-submenu__title {
    padding-left: 13px !important;
  }

  .vue-scrollbar{
    background-color: #ffffff !important;
    height: calc(100vh - 50px)
  }

  .main-sidebar .el-scrollbar__bar.is-vertical{
    display: none;
  }

  .sidebar{
    min-height: 450px;
  }


</style>
