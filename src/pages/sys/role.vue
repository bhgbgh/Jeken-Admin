<template>

  <imp-panel>

    <div slot="body">
      <div class="handle-box">
        <el-form :inline="true" :model="condition" @keyup.enter.native="loadData($event)">
          <el-form-item v-has="'pages/sys/roleForm'">
            <router-link :to="{ name: 'roleForm', params: { operation : 'operAdd' }}">
              <el-button  size="small" type="primary" icon="plus">新增</el-button>
            </router-link>
          </el-form-item>
          <el-form-item>
            <el-input size="small" v-model="condition.name" title="角色名称" placeholder="输入角色名称" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input size="small" v-model="condition.code" title="角色标识" placeholder="角色标识" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" class="filter-item" type="success" icon="el-icon-search" @click="loadData($event)">查询</el-button>
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
        <el-table-column prop="name" label="角色名称">
          <template slot-scope="scope">
            <router-link :to="{ name: 'roleForm', params: { operation : 'operDetail',row:scope.row  }}">
              <el-button  size="mini" type="text" icon="plus">{{scope.row.name}}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="角色标识"></el-table-column>
        <el-table-column prop="type" label="角色类型">
          <template slot-scope="scope">
              <span>{{scope.row.type | dictFilter('roleType')}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="remark" label="描述"></el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button-group>
              <el-button title="编辑" size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
              <el-button title="配置资源" size="mini" type="info" @click="settingResource(scope.row)">配置资源</el-button>
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

      <el-dialog title="配置资源" :visible.sync="dialogVisible" size="tiny">
        <div class="select-tree">
          <el-scrollbar
            tag="div"
            class='is-empty'
            wrap-class="el-select-dropdown__wrap"
            view-class="el-select-dropdown__list">
            <el-tree
              :data="resourceTree"
              ref="resourceTree"
              :default-expanded-keys="expandedKeys"
              show-checkbox
              check-strictly
              node-key="id"
              v-loading="dialogLoading"
              :props="defaultProps">
            </el-tree>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="configRoleResources">确 定</el-button>
        </span>
      </el-dialog>

    </div>
    </imp-panel>
</template>

<script>
import { batchDeleteUtil, deleteRowUtil } from "@/common/utils";

export default {
  name: "sysRole",
  data() {
    return {
      currentRow: {},//当前选中的某一行
      selectedRows: [], //选中的所有行
      dialogVisible:false,
      dialogLoading:false,
      resourceTree:[],
      defaultProps: {
        children: 'children',
        label: 'textName',
        id: "id",
      },
      expandedKeys:[],//tree展开的层级keys
      // roleTree: [],
      listLoading: false,
      condition: {
        name: "",
        code: ""
      },
      tableData: {
        pagination: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: []
      }
    };
  },
  methods: {
    //列表选择触发事件
    handleSelectionChange(val) {
      this.selectedRows = val;
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
        name: "roleForm",
        params: { operation: "operEdit", row: row }
      });
    },
    deleteRow(row) {
      const _self = this;
      deleteRowUtil("/sys/role/delete/" + row.id).then(function(result) {
        if(result){
          _self.loadData();
        }
      });
    },
    settingResource(row){
      this.currentRow = row;
        this.dialogVisible = true;
        if(this.resourceTree==null||this.resourceTree.length<=0){
          this.dialogLoading = true;
          this.$http
          .get("/sys/resource/getResourceTree")
          .then(res => {
            this.resourceTree = res;
            this.expandedKeys.push(this.resourceTree[0].id);
            this.dialogLoading = false;
          });
        }
      this.$http.get("/sys/roleResource/getRoleResourceByRoleId/" + row.id)
        .then(res => {
          this.$refs.resourceTree.setCheckedKeys(res);
        });
    },
    configRoleResources(){
        let checkedKeys = this.$refs.resourceTree.getCheckedKeys();
        // console.log(this.currentRow.id,checkedKeys);
        this.$http.post("/sys/roleResource/updateRoleResource",{roleId:this.currentRow.id,resourceIdList:checkedKeys})
          .then(res => {
            if(res.success){
              vm.$notify.success({ title: '系统消息', message: res.msg, position: 'bottom-right' });
              this.dialogVisible = false;
            }else{
              vm.$notify.error({ title: '系统消息', message: res.msg, position: 'bottom-right' });
            }
           
          })
      },
    loadData() {
      this.listLoading = true;
      this.condition.pageSize = this.tableData.pagination.pageSize;
      this.condition.pageNumber = this.tableData.pagination.pageNo;
      this.$http
        .get("/sys/role/pageQuery", { params: this.condition })
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
  },
  //keep-alive 组件激活时调用
  activated() {
    if (this.$route.params.isReload) {
      this.loadData();
    }
  }
  // deactivated() {
  //   console.log("deactivated");
  // }
};
</script>
<style scoped>
  .select-tree .el-scrollbar.is-empty .el-select-dropdown__list {
    padding: 0;
  }

  .select-tree .el-scrollbar {
    border: 1px solid #d1dbe5;
  }

  .select-tree .el-tree{
    border:0;
  }
</style>
