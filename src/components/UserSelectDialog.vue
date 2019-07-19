<!--用户查找选择组件-->
<template>
    <div class="dialog-container">
        <el-dialog title="人员选择" :visible.sync="visible" @close="$emit('update:show', false)" width="80%" top="4vh">
            
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                        <el-tag
                            v-for="item in selectedRows"
                            :key="item.id"
                            closable
                            type="primary"
                            @close="deleteTag(item)"
                            close-transition>
                            <span class="el-select__tags-text">{{ item.name+'/'+item.code }}</span>
                        </el-tag>
                    </div>
                </el-col>
            </el-row>
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
                                <el-input v-model="condition.name" title="姓名" placeholder="输入姓名" size="mini" class="handle-input mr10"></el-input>
                                </el-form-item>
                                <el-form-item>
                                <el-input v-model="condition.username" title="登录用户名" placeholder="输入登录用户名" size="mini" class="handle-input mr10"></el-input>
                                </el-form-item>
                                <el-form-item>
                                <el-input v-model="condition.email" title="邮箱" placeholder="输入邮箱" size="mini" class="handle-input mr10"></el-input>
                                </el-form-item>
                                <el-form-item>
                                <el-button  type="success"  icon="el-icon-search" size="mini" @click="loadData($event)">查询</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                        <el-table
                            :data="tableData.rows"
                            ref="multipleTable"
                            stripe
                            highlight-current-row
                            size="mini"
                            tooltip-effect="light"
                            style="width: 100%"
                            v-loading="listLoading"
                            @select="select"
                            @select-all="selectAll">
                        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
                            <el-table-column prop="id" type="selection" width="50"></el-table-column>
                            <el-table-column prop="code" label="编号"></el-table-column>
                            <el-table-column prop="name" label="姓名"></el-table-column>
                            <el-table-column prop="username" label="登录用户名"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="email" label="邮箱"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="orgName" label="组织机构" width="250"></el-table-column>
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
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                visible: this.show,
                orgTree: [],
                listLoading: false,
                currentRow: {},
                selectedRows: this.users, //选中的行
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
            };
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            users: {//已经选择的用户数组
                type: Array,
                default: []
            }
        },
        watch: {
            show (val) {
                // console.log(this.show);
                if(val){
                    this.loadData();
                    this.$http
                        .get("/sys/org/getOrgTree")
                        .then(res => {
                            this.orgTree = res;
                            this.expandedKeys.push(this.orgTree[0].id);
                        });
                }else{
                    //回归初始状态
                    this.tableData.pagination.pageSize = 10;
                    this.tableData.pagination.pageNo = 1;
                    this.selectedRows = [];
                    this.condition = {
                    name: "",
                    username: "",
                    email: "",
                    dictType:""
                    }
                    this.$refs.multipleTable.clearSelection();
                }
                this.visible = this.show;
            },
            users(val){
                this.selectedRows = this.users;
            },
            filterText(val) {
                this.$refs.orgTree.filter(val);
            }
        },
        methods:{
            save(){
                this.visible = false;
                this.$emit("on-result-change",this.selectedRows);//组件内对外部发送通知
            },
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
            //在分页切换的时候选中已选择的行
            toggleSelection() {
                if (this.selectedRows.length > 0) {
                    this.tableData.rows.forEach(row => {
                        if(this.selectedRows.some((item) => item.id == row.id)){
                            this.$refs.multipleTable.toggleRowSelection(row);
                        }
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            //选择单行事件
            select(val, row, isSelectAll){
                //过滤出不包含row的数据
                var temp = this.selectedRows.filter((item, index, array) => {
                　　return item.id != row.id;
                });
                //如果不包含row的数据长度和之前选择数据的长度相等，表示row是新选中的行
                if(this.selectedRows.length == temp.length){
                    this.selectedRows.push(row);
                }else{
                    if(isSelectAll){
                        temp.push(row);
                    }
                    //否则是删除的行
                    this.selectedRows = temp;
                }
            },
            //全选事件
            selectAll(selection){
                if(selection.length == 0){
                    this.selectedRows = this.selectedRows.filter((item) => {
                        if(this.tableData.rows.some((row) => item.id == row.id)){
                            return false;
                        }
                        return true;
                    });
                }else{
                    this.tableData.rows.forEach(row => {
                        this.select(null, row, true);
                    });
                }
            },
            deleteTag(item){
                this.selectedRows = this.selectedRows.filter((row) => item.id != row.id);
                this.$refs.multipleTable.toggleRowSelection(item,false);
                this.tableData.rows.forEach(row => {
                    if( item.id == row.id){
                        this.$refs.multipleTable.toggleRowSelection(row,false);
                    }
                });
            },
            pageSizeChange(val) {
                this.tableData.pagination.pageSize = val;
                this.loadData();
            },
            pageNoChange(val) {
                this.tableData.pagination.pageNo = val;
                this.loadData();
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
                        //选中已选数据，用setTimeout是因为this.tableData.rows复值后页面数据还没有渲染出来就调用toggleRowSelection去选中行会失效
                        setTimeout(() => { 
                            this.toggleSelection();
                        })
                    });
            }
        }
    };
</script>

<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    /* .el-table--mini td, .el-table--mini th {
        padding: 0px 0;
    }

    .el-form-item {
        margin-bottom: 2px;
    } */
</style>
