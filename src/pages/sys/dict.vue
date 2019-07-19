<template>

  <imp-panel>

    <div slot="body">
      <div class="handle-box">
        <el-form :inline="true" :model="condition" @keyup.enter.native="loadData($event)">
          <el-form-item>
            <el-button size="small" type="primary" @click="addDictType()" icon="plus">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-input size="small" v-model="condition.name" title="名称" placeholder="名称" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input size="small" v-model="condition.code" title="标识" placeholder="标识" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" class="filter-item"  type="success"  icon="el-icon-search" @click="loadData($event)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tableData.rows"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        stripe
        highlight-current-row
        size="mini"
        tooltip-effect="light"
        style="width: 100%"
        v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
        <!-- <el-table-column prop="id" type="selection" width="50"></el-table-column> -->
        <el-table-column type="expand">
        <template slot-scope="props">
            <el-table
                :data="props.row.children"
                border
                highlight-current-row
                size="mini"
                tooltip-effect="light"
                style="width: 100%">
                <el-table-column prop="name" label="名称">
                  <template slot-scope="scope">
                      <el-input size="small" v-model="scope.row.name" v-show="scope.row.edit"></el-input> 
                      <span v-show="!scope.row.edit">{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="value" label="值">
                  <template slot-scope="scope">
                      <el-input size="small" v-model="scope.row.value" v-show="scope.row.edit"></el-input> 
                      <span v-show="!scope.row.edit">{{scope.row.value}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="orderNum" label="序号">
                  <template slot-scope="scope">
                      <el-input size="small" v-model="scope.row.orderNum" v-show="scope.row.edit"></el-input> 
                      <span v-show="!scope.row.edit">{{scope.row.orderNum}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="type" label="类型">
                  <template slot-scope="scope">
                      <el-select size="small" v-model="scope.row.type"  v-show="scope.row.edit" placeholder="请选择">
                        <el-option v-for="item in dictTypes" :key="item.value" :label="item.name" :value="item.value"></el-option>
                      </el-select> 
                      <span v-show="!scope.row.edit">{{scope.row.type | dictFilter('dictType')}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="remark" label="备注">
                  <template slot-scope="scope">
                      <el-input size="small" v-model="scope.row.remark" v-show="scope.row.edit"></el-input> 
                      <span v-show="!scope.row.edit">{{scope.row.remark}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                  <template slot-scope="scope">
                      <el-button-group>
                        <el-button title="编辑" size="mini" type="primary" @click="editDict(scope.row, props.row.code)">{{scope.row.edit?"保存":"编辑"}}</el-button>
                        <el-button title="删除" size="mini" type="danger" @click="deleteDict(scope.row)">删除</el-button>
                      </el-button-group>
                  </template>
                </el-table-column>
            </el-table>
        </template>
        </el-table-column>
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.name" v-show="scope.row.edit"></el-input> 
            <span v-show="!scope.row.edit">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="标识">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.code" v-show="scope.row.edit"></el-input> 
            <span v-show="!scope.row.edit">{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <el-select size="small" v-model="scope.row.type"  v-show="scope.row.edit" placeholder="请选择">
              <el-option v-for="item in $dicts('dictType')" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select> 
            <span v-show="!scope.row.edit">{{scope.row.type | dictFilter('dictType')}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="remark" label="备注">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.remark" v-show="scope.row.edit"></el-input> 
            <span v-show="!scope.row.edit">{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button-group>
              <!-- <el-button type="primary" title="添加" size="mini" class="jeken1-xinjian"></el-button> -->
              <!-- <el-button type="primary" title="添加" size="mini" :icon="jeken1-xinjian"></el-button> -->
              <!-- <el-button type="primary" :title="scope.row.edit?'保存':'编辑'" size="mini" 
                @click="editDictType(scope.row)" :icon="scope.row.edit?'jeken1-baocun':'el-icon-edit-outline'"></el-button>
              <el-button type="danger" title="删除" size="mini" icon="el-icon-delete" @click="deleteDictType(scope.row)"></el-button> -->
              <el-button title="添加" v-show="!scope.row.hideAdd" size="mini" type="primary" @click="addDict(scope.row.children, scope.row.id)">添加</el-button>
              <el-button title="编辑" size="mini" type="primary" @click="editDictType(scope.row)">{{scope.row.edit?"保存":"编辑"}}</el-button>
              <el-button title="删除" size="mini" type="danger" @click="deleteDictType(scope.row)">删除</el-button>
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


    </imp-panel>
</template>

<script>
import { deleteRowUtil, submitFormUtil } from "@/common/utils";

export default {
  name: "sysDict",
  data() {
    return {
      currentRow: {},
      selectedRows: [], //选中的行
      listLoading: false,
      condition: {
        name: "",
        dictType: ""
      },
      tableData: {
        pagination: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: [],
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      dictTypes:[]
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
    // 获取row的key值
    getRowKeys(row) {
        return row.id;
    },
    addDictType() {
      var row = {edit:true,name:"",value:"",orderNum:"",type:"",remark:"",hideAdd:true};
      // this.tableData.rows.push(row);
      this.tableData.rows.unshift( row );
      // console.log(this.tableData.rows);
    },
    addDict(children,id) {
      // 在这里你想初始化的时候展开哪一行都可以了
      this.expands=[];//置空会把其它展开了的行收回
      this.expands.push(id);
      
      var row = {edit:true,name:"",code:"",type:"",remark:""};
      // this.tableData.rows.push(row);
      children.unshift( row );
      // console.log(this.tableData.rows);
    },
    editDictType(row) {
      const _self = this;
      if(row.edit){
        submitFormUtil('/sys/dictType', true, row, null).then(function(result) {
          //如果提交操作成功
          if(result){
            row.edit = !row.edit;
            _self.loadData();
          }
        });
      }else{
        row.edit = !row.edit;
      }
    },
    editDict(row,code) {
      const _self = this;
      if(row.edit){
        row.dictType = code;
        submitFormUtil('/sys/dict', true, row, null).then(function(result) {
          //如果提交操作成功
          if(result){
            row.edit = !row.edit;
            _self.loadData();
          }
        });
      }else{
        row.edit = !row.edit;
      }
    },
    deleteDictType(row) {
      const _self = this;
      deleteRowUtil("/sys/dictType/deleteByDictType/" + row.code).then(function(result) {
          //如果提交操作成功
          if(result){
            _self.loadData();
          }
        });
    },
    deleteDict(row) {
      const _self = this;
      if(!row.id){
        this.loadData();
        return;
      }
      deleteRowUtil("/sys/dict/delete/" + row.id).then(function(result) {
          //如果提交操作成功
          if(result){
            _self.loadData();
          }
        });
    },
    test() {
      this.$http
        .get("/sys/dictType/testPort", {})
        .then(res => {
          console.log(res.data);
        });
    },
    loadData() {
      this.listLoading = true;
      this.condition.pageSize = this.tableData.pagination.pageSize;
      this.condition.pageNumber = this.tableData.pagination.pageNo;
      this.$http
        .get("/sys/dictType/pageQuery", { params: this.condition })
        .then(res => {
            // 给数据设置编辑属性
            this.tableData.rows = res.list.map(v => {
                this.$set(v, 'edit', false) // https://cn.vuejs.org/v2/guide/reactivity.html
                if(v.children){
                    v.children = v.children.map(c => { 
                        this.$set(c, 'edit', false) ;
                        return c;
                    });
                }
          return v
        })
          this.tableData.pagination.total = res.totalRow;
          this.listLoading = false;
        });
    }
  },
  created() {
    this.loadData();
    // 参数类型：子表单的，不需要半系统办业务
      this.$dicts('dictType').forEach((item, index) => {
        if(item.value != 3) {
          this.dictTypes.push(item);
        }
      });
  }
};
</script>
<style scoped>

</style>
