<template>

  <imp-panel>

    <el-row style="margin-bottom: 20px;" :gutter="5">
      
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>组织机构</span>
            <el-button type="primary" size="mini" style="float: right;"  @click="cancelSelectedOrg">清除条件</el-button>
          </div>
          <div class="text item">
            <el-input
              placeholder="输入关键字进行过滤"
              size="mini"
              v-model="filterText">
            </el-input>
            <el-tree 
              :data="orgTree"
              highlight-current
              accordion
              :expand-on-click-node=false
              :render-content="renderContent"
              @node-click="handleNodeClick" 
              node-key="id" 
              :default-expanded-keys="expandedKeys"
              :props="defaultProps"
              :filter-node-method="filterNode"
              ref="orgTree">
            </el-tree>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户</span>
          </div>
          <div class="text item">
            <div class="handle-box">
              <el-form :inline="true" :model="condition" @keyup.enter.native="loadData($event)">
                <el-form-item>
                  <el-button v-has="'pages/sys/userForm'" size="small"  type="primary" icon="plus" @click="$router.push({ name: 'userForm', params: { operation : 'operAdd' }})">新增</el-button>
                  <el-button size="small"  type="danger" @click="batchDelete">批量删除</el-button>
                </el-form-item>
                <el-form-item>
                  <el-input size="small"  v-model="condition.name" title="姓名" placeholder="输入姓名" class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input size="small"  v-model="condition.username" title="登录用户名" placeholder="输入登录用户名" class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input size="small"  v-model="condition.email" title="邮箱" placeholder="输入邮箱" class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="small"  type="success"  icon="el-icon-search" @click="loadData($event)">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <el-table
              :data="tableData.rows"
              stripe
              highlight-current-row
              size="mini"
              tooltip-effect="light"
              style="width: 100%"
              v-loading="listLoading"
              @selection-change="handleSelectionChange">
              <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
              <el-table-column prop="id" type="selection" width="50"></el-table-column>
              <el-table-column prop="name" label="姓名">
                <template slot-scope="scope">
                  <router-link :to="{ name: 'userForm', params: { operation : 'operDetail',row:scope.row  }}">
                    <el-button  size="mini" type="text" icon="plus">{{scope.row.name}}</el-button>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column prop="username" label="登录用户名"></el-table-column>
              <el-table-column show-overflow-tooltip prop="email" label="邮箱"></el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <p v-html="$options.filters.dictFilter(scope.row.usable,'usableStatus')"/>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button title="编辑" size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
                    <el-button title="配置角色" size="mini" type="info" @click="handleRoleConfig(scope.row)">配置角色</el-button>
                    <el-button title="删除" size="mini" type="danger" @click="deleteRow(scope.row)">删除</el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
              @size-change="pageSizeChange"
              @current-change="pageNoChange"
              :current-page="tableData.pagination.pageNo"
              :page-sizes="[10, 20, 50]"
              :page-size="tableData.pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.pagination.total">
            </el-pagination>
          </div>
        </el-card>
      </el-col>

    </el-row>

    <el-dialog v-el-drag-dialog title="配置用户角色" :visible.sync="dialogVisible">
      <div style="text-align: center">
        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="roleIds"
          :titles="['可选择', '已选择']"
          :props="{
            key: 'id',
            label: 'name'
          }"
          :data="roleArr">
        </el-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="configUserRoles">确 定</el-button>
      </span>
    </el-dialog>

  </imp-panel>
</template>

<script>
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import { batchDeleteUtil, deleteRowUtil } from "@/common/utils";

export default {
  name: "sysUser",
  directives: { elDragDialog },
  watch: {
    filterText(val) {
      this.$refs.orgTree.filter(val);
    }
  },
  data() {
    return {
      currentRow: {},
      selectedRows: [], //选中的行
      roleArr: [],
      listLoading: false,
      dialogVisible:false,
      orgTree: [],
      filterText: '',
      expandedKeys:[],//tree展开的层级keys
      defaultProps: {
        children: 'children',
        label: 'name',
        id: "id",
      },
      condition: {
        name: "",
        username: "",
        email: "",
        dictType:""
      },
      tableData: {
        pagination: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: []
      },
      roleIds:[]
    };
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    renderContent(h, {node, data, store}) {
      return (
        <span>
          <span>
            <span>{node.label}</span>
          </span>
        </span>);
    },
    //组织机构树点击事件
    handleNodeClick(data){
      this.condition.orgId = data.id;
      this.loadData();
    },
    //取消组织机构选中节点
    cancelSelectedOrg(){
      //待被选节点的 key，若为 null 则取消当前高亮的节点
      this.$refs.orgTree.setCurrentKey(null);
      if(this.condition.orgId){
        delete this.condition.orgId;
        this.loadData();
      }
      
    },
    //列表选择触发事件
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    handleRoleConfig(row) {
      this.currentRow = row;
      this.dialogVisible = true;
      if (this.roleArr.length <= 0) {
        this.$http
          .get("/sys/role/getList",{params:{type:1}})
          .then(res => {
            this.roleArr = res;
          });
      }
      this.$http.get("/sys/userRole/getRoleIdList/" + row.id)
        .then(res => {
          this.roleIds = res;
        });
    },
    configUserRoles() {
        this.$http.post("/sys/userRole/updateUserRole",{userId:this.currentRow.id,roleIdList:this.roleIds})
          .then(res => {
            if(res.success){
              vm.$notify.success({ title: '系统消息', message: res.msg, position: 'bottom-right' });
              this.dialogVisible = false;
            }else{
              vm.$notify.error({ title: '系统消息', message: res.msg, position: 'bottom-right' });
            }
           
          })
    },
    pageSizeChange(val) {
      this.tableData.pagination.pageSize = val;
      this.loadData();
    },
    pageNoChange(val) {
      this.tableData.pagination.pageNo = val;
      this.loadData();
    },
    edit(row) {
      this.$router.push({
        name: "userForm",
        params: { operation: "operEdit", row: row }
      });
    },
    deleteRow(row) {
      const _self = this;
      deleteRowUtil("/sys/user/delete/" + row.id).then(function(result) {
        //如果提交操作成功
        if(result){
          _self.loadData();
        }
      });
    },
    batchDelete() {
      const _self = this;
      batchDeleteUtil("/sys/user/deleteByIds/",this.selectedRows).then(function(result) {
        //如果提交操作成功
        if(result){
          _self.loadData();
        }
      });
    },
    loadData() {
      
      this.listLoading = true;
      this.condition.pageSize = this.tableData.pagination.pageSize;
      this.condition.pageNumber = this.tableData.pagination.pageNo;
      this.$http
        .get("/sys/user/pageQuery", { params: this.condition })
        .then(res => {
          this.tableData.rows = res.list;
          this.tableData.pagination.total = res.totalRow;
          this.listLoading = false;
        });
    }
  },
  //在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见
  created() {
    this.loadData();
    this.$http
        .get("/sys/org/getOrgTree")
        .then(res => {
          this.orgTree = res;
          this.expandedKeys.push(this.orgTree[0].id);
          
        });
  },
  //keep-alive 组件激活时调用
  activated() {
    if (this.$route.params.isReload) {
      this.loadData();
    }
  }
};
</script>
<style scoped>
</style>
