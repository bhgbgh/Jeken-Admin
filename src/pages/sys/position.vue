<template>
  <imp-panel>
    <el-row style="margin-bottom: 20px;" :gutter="5">
      
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>组织机构</span>
            <!-- <el-button type="primary" size="mini" style="float: right;"  @click="newAdd">新增</el-button> -->
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

      <el-col :span="4" :xs="24" :sm="24" :md="4" :lg="4">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>岗位</span>
            <el-button type="primary" size="mini" style="float: right;"  @click="positionEdit">配置岗位</el-button>
          </div>
          <div class="text item">
            <ul>
              <li class="position_item" v-bind:class="{ selected: (position.id == selectPositionId) }" @click="positionClick(position)" v-for="position in positions">
                <span>{{position.name}}</span>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>

      <el-col :span="14" :xs="24" :sm="24" :md="14" :lg="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户</span>
            <el-button type="primary" size="mini" style="float: right;"  @click="userEdit">配置人员</el-button>
          </div>
          <div class="text item">
            <el-table
              :data="tableData.rows"
              stripe
              highlight-current-row
              size="mini"
              tooltip-effect="light"
              style="width: 100%"
              v-loading="listLoading">
          <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
              <!-- <el-table-column prop="id" type="selection" width="50"></el-table-column> -->
              <el-table-column prop="code" label="编号"></el-table-column>
              <el-table-column prop="name" label="姓名"></el-table-column>
              <el-table-column prop="username" label="登录用户名"></el-table-column>
              <el-table-column show-overflow-tooltip prop="email" label="邮箱"></el-table-column>
              <el-table-column show-overflow-tooltip prop="orgName" label="组织机构" width="200"></el-table-column>
              <el-table-column label="操作" width="70">
                <template slot-scope="scope">
                    <el-button title="移除" size="mini" type="danger" @click="deleteRow(scope.row)">移除</el-button>
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

    <el-dialog title="配置岗位" :visible.sync="dialogVisible">
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
        <el-button type="primary" @click="updateOrgRole">确 定</el-button>
      </span>
    </el-dialog>
    <user-select-dialog :show.sync="userSelectDialogVisible" :users.sync="orgPositionUsers" v-on:on-result-change="onResultChange"></user-select-dialog>
  </imp-panel>
</template>
<script>

  import UserSelectDialog from "@/components/UserSelectDialog.vue"
  import SelectTree from "@/components/SelectTree.vue"
  import treeter from "@/common/treeter"
  import merge from 'element-ui/src/utils/merge';
  import { submitFormUtil, deleteRowUtil } from '@/common/utils'

  export default {
    watch: {
      filterText(val) {
        this.$refs.orgTree.filter(val);
      }
    },
    mixins: [treeter],
    components: {
      'user-select-dialog': UserSelectDialog,
      'el-select-tree': SelectTree
    },
    data(){
      return {
        userSelectDialogVisible: false,
        filterText: '',
        formLabelWidth: '100px',
        orgTree: [],
        expandedKeys:[],//tree展开的层级keys
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        maxId:700000,
        positions:[],
        roleArr:[],
        dialogVisible:false,
        roleIds:null,
        oldRoleIds:null,
        selectOrgId:null,//当前选中的组织机构Id
        selectPositionId:null,//当前选中的岗位Id
        orgPositionUsers:[],//组织机构岗位用户列表
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
        listLoading: false,
      }
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
      //配置岗位
      positionEdit(){
        if(!this.selectOrgId){
          vm.$notify.error({ title: '系统消息', message: "请先选择组织机构！", position: 'bottom-right' });
          return;
        }
        this.dialogVisible = true;
        if (this.roleArr.length == 0) {
          this.$http
            .get("/sys/role/getList",{params:{type:2}})
            .then(res => {
              this.roleArr = res;
            });
        }
      },
      positionClick(position){
        this.selectPositionId = position.id;
        this.loadOrgRoleUsers();
      },
      // userClick(){
      //   // this.orgPositionUsers = [{"createUserId":"1","code":"q3","orgName":"招商银行/广州分行","roleIdList":null,"updateUserId":"1","sex":true,"updateUserName":"admin/admin","mobile":"3","createUserName":"admin/admin","remark":"3","telephone":"3","updateTime":"2018-04-25 11:41:50","type":["地推活动","线下主题活动","单纯品牌曝光"],"orgId":"979269162293526528","usable":true,"password":"403186b593d6c28e8951c66b0b42ed66959e336609004ee03b8a13fb7b1f44e7","createTime":"2018-04-17 14:53:55","name":"张三","files":null,"id":"986135651759947776","age":3,"email":"3@163.com","username":"q3"},{"createUserId":"1","code":"q2","orgName":"招商银行/广州分行","roleIdList":null,"updateUserId":"1","sex":false,"updateUserName":"admin/admin","mobile":"1","createUserName":"admin/admin","remark":"1","telephone":"1","updateTime":"2018-04-17 14:53:18","type":[],"orgId":"979269162293526528","usable":true,"password":"6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b","createTime":"2018-04-17 14:53:18","name":"李四","files":null,"id":"986135496121909248","age":1,"email":"1","username":"q2"},{"createUserId":"1","code":"a7","orgName":"招商银行/广州分行","roleIdList":null,"updateUserId":"1","sex":false,"updateUserName":"admin/admin","mobile":"a71","createUserName":"admin/admin","remark":"a7","telephone":"a7","updateTime":"2018-04-11 09:57:47","type":[],"orgId":"979269162293526528","usable":true,"password":"39d0c082b57ee1ce18d2ae9b8cfa54b8b75dad79cfd831a13fdfef864d5ed849","createTime":"2018-04-02 11:52:04","name":"王五","files":null,"id":"980654092147752960","age":5,"email":"a71","username":"a7"}];
      //   this.userSelectDialogVisible = true;
      // },
      //配置人员
      userEdit(){
        if(!this.selectPositionId){
          vm.$notify.error({ title: '系统消息', message: "请先选择组织岗位！", position: 'bottom-right' });
          return;
        }
        this.$http
          .get("/sys/user/queryOrgRoleUsers", { params: {orgId:this.selectOrgId,roleId:this.selectPositionId} })
          .then(res => {
            // console.log(res);
              this.orgPositionUsers = res;
              this.userSelectDialogVisible = true;
          });
        
      },
      onResultChange(selectedRows){
        // console.log(selectedRows);
        var orgRoleUsers = [];
        selectedRows.forEach(row => {
          orgRoleUsers.push(row.id);
        });
        this.$http.post("/sys/orgRoleUser/saveBatchOrgRoleUsers",{orgId:this.selectOrgId,roleId:this.selectPositionId,orgRoleUsers:orgRoleUsers})
          .then(res => {
            if(res.success){
              vm.$notify.success({ title: '系统消息', message: res.msg, position: 'bottom-right' });
              this.dialogVisible = false;
              this.loadOrgRoleUsers();
            }else{
              vm.$notify.error({ title: '系统消息', message: res.msg, position: 'bottom-right' });
            }
           
          })
      },
      //获取组织机构对应的岗位数据
      getOrgPosition(orgId){
        this.$http
          .get("/sys/role/getOrgPosition/"+orgId)
          .then(res => {
            this.positions = res;
            if(this.positions){
              for(var i = 0 ; i < res.length ; i++){
                this.roleIds.push(res[i].id);
              }
            }
            this.oldRoleIds = this.roleIds;
          });
      },
      //组织机构树点击事件
      handleNodeClick(data){
        this.selectOrgId = data.id;
        this.selectPositionId = null;
        this.roleIds = [];
        this.getOrgPosition(data.id);
        this.tableData.rows = [];
      },
      //修改角色岗位
      updateOrgRole(){
        //过滤出被删除的岗位id
        var filterRoleIds = this.oldRoleIds.filter(item => !this.roleIds.includes(item));
        this.$http.post("/sys/orgRole/updateOrgRole",{orgId:this.selectOrgId,roleIdList:this.roleIds,deleteRoleIdList:filterRoleIds})
          .then(res => {
            if(res.success){
              this.getOrgPosition(this.selectOrgId);
              vm.$notify.success({ title: '系统消息', message: res.msg, position: 'bottom-right' });
              this.dialogVisible = false;
            }else{
              vm.$notify.error({ title: '系统消息', message: res.msg, position: 'bottom-right' });
            }
           
          })
      },
      //移除岗位
      deleteRow(row){
        const _self = this;
        deleteRowUtil("/sys/orgRoleUser/delete/" + row.soruId, "确认是否移除岗位相关人员?").then(function(result) {
          //如果提交操作成功
          if(result){
            _self.loadOrgRoleUsers();
          }
        });
      },
      pageSizeChange(val) {
          this.tableData.pagination.pageSize = val;
          this.loadOrgRoleUsers();
      },
      pageNoChange(val) {
          this.tableData.pagination.pageNo = val;
          this.loadOrgRoleUsers();
      },
      loadOrgRoleUsers(){
        this.listLoading = true;
        this.condition.pageSize = this.tableData.pagination.pageSize;
        this.condition.pageNumber = this.tableData.pagination.pageNo;
        this.condition.orgId = this.selectOrgId;
        this.condition.roleId = this.selectPositionId;
        this.$http
          .get("/sys/user/pageQueryOrgRoleUsers", { params: this.condition })
          .then(res => {
              this.tableData.rows = res.list;
              this.tableData.pagination.total = res.totalRow;
              this.listLoading = false;
          });
      },
      loadData(){
        this.$http
          .get("/sys/org/getOrgTree")
          .then(res => {
            this.orgTree = res;
            this.expandedKeys.push(this.orgTree[0].id);
          });
      }
    },
    created(){
      this.loadData();
    }
  }
</script>

<style scoped>
.position_item {
    font-size: 14px;
    padding: 0 10px;
    /* position: relative; */
    /* white-space: nowrap; */
    overflow: hidden;
    /* text-overflow: ellipsis; */
    /* color: #606266; */
    /* height: 34px; */
    line-height: 34px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
}

.position_item:hover
{ 
background-color:#f0f7ff;
}

.position_item.selected{
    /* color: #409eff; */
    /* font-weight: 700; */
    background-color:#f0f7ff;
}
</style>
