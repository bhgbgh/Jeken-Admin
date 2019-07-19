<template>
  <el-submenu :index="item.path" v-if="item.children && item.children.length>0 && !item.keepAlive" class="el-menu-sub">
    <template slot="title"><i :class="item.icon"></i><span>{{item.textName}}</span></template>
    <template v-for="child in item.children">
      <sub-menu v-if="child.children && child.children.length>0" :param="child"></sub-menu>
      <el-menu-item :index="child.path" v-else><i :class="child.icon"></i><span>{{child.textName}}</span></el-menu-item>
    </template>
  </el-submenu>
  <el-menu-item :index="item.path" v-else class="el-menu-each"><i :class="item.icon"></i><span>{{item.textName}}</span></el-menu-item>
</template>
<script>
  import SubMenu from "./SubMenu.vue"

  export default {
    name: 'subMenu',
    props: ['param'],
    data: function () {
      return {item: this.param}
    },
    components: {
      SubMenu
    }
  }
</script>
<style scoped>
  .el-menu .fa {
    margin-right: 10px;
  }
</style>
