<template>
  <imp-panel>
    <el-row slot="body" style="margin-bottom: 20px;" :gutter="5">
      
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>组织机构</span>
            <el-button type="primary" size="mini" style="float: right;"  @click="newAdd">新增</el-button>
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
          <!--<div slot="header" class="clearfix">-->
          <!--<el-button type="primary" style="float: right;" @click="dialogFormVisible = true"><i class="el-icon-plus"></i></el-button>-->
          <!--&lt;!&ndash;<el-button type="primary" @click="editSelectedMenu" icon="edit"></el-button>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-button type="primary" @click="deleteSelectedMenu" icon="delete"></el-button>&ndash;&gt;-->
          <!--</div>-->
          <div class="text item">
            <el-form size="small" :model="form" ref="form">
              <el-form-item label="父级" :label-width="formLabelWidth">
                <el-select-tree v-model="form.parentId" :treeData="orgTree" clearable v-on:inputObj="inputObj"
                                placeholder="请选择父级">
                </el-select-tree>
              </el-form-item>
              <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="类型" :label-width="formLabelWidth">
                <el-select v-model="form.type" placeholder="请选择">
                    <el-option
                    v-for="item in $dicts('orgType')"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
              
              <!-- <el-form-item label="图标" v-if="form.type == 1" :label-width="formLabelWidth">
                <el-input v-model="form.icon" auto-complete="off"></el-input>
              </el-form-item> -->
              <el-form-item label="激活状态" :label-width="formLabelWidth">
                <el-radio class="radio" border v-model="form.usable" :label=true>激活</el-radio>
                <el-radio class="radio" border v-model="form.usable" :label=false>未激活</el-radio>
              </el-form-item>
              <!-- <el-form-item label="keepAlive" :label-width="formLabelWidth">
                <el-radio class="radio" v-model="form.keepAlive" label="1">是</el-radio>
                <el-radio class="radio" v-model="form.keepAlive" label="0">否</el-radio>
              </el-form-item> -->
              <el-form-item label="排序" :label-width="formLabelWidth">
                <el-slider v-model="form.orderNum"></el-slider>
              </el-form-item>
              <!-- <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input v-model="form.remarks" auto-complete="off"></el-input>
              </el-form-item> -->
              <el-form-item label="" :label-width="formLabelWidth">
                <el-button type="primary" @click="onSubmit('form')" v-text="form.id?'修改':'新增'" :loading="opLoading"></el-button>
                <el-button type="danger" @click="deleteSelected" icon="delete" v-show="form.id && form.id!=null">删除
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </imp-panel>

</template>
<script>

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
      'el-select-tree': SelectTree
    },
    data(){
      return {
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
        form: {
          id: null,
          parentId: null,
          parentName:null,
          longName:null,
          name:'',
          code: '',
          type: null,
          orderNum: 0,
          usable: true,
        },
        inputOrg:null,
        opLoading:false
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      inputObj(obj){
          this.inputOrg = obj;
      },
      selectIcon(event){
        this.form.icon = event.target.className;
      },
      newAdd(){
        this.form = {
          id: null,
          parentId: null,
          parentName:null,
          longName:null,
          name:'',
          code: '',
          type: null,
          orderNum: 0,
          usable: true,
        };
      },
      renderContent(h, {node, data, store}) {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
          </span>);
      },
      deleteSelected(){
        const _self = this;
        deleteRowUtil("/sys/resource/delete/" + this.form.id).then(function(result) {
          //如果提交操作成功
          if(result){
            _self.loadData();
            _self.newAdd();
            // this.deleteFromTree(this.orgTree, this.form.id);
          }
        });
      },
      handleNodeClick(data){
        this.form = merge({}, data);
      },
      onSubmit(formName){
        this.opLoading = true;
        const _self = this;
        this.$refs[formName].validate((valid) => {
            // this.form.parentName = this.inputOrg.name;
            this.form.longName = this.inputOrg.longName + "/" + this.form.name;
          submitFormUtil('/sys/org', valid, this.form).then(function(res) {
            _self.opLoading = false;
            //如果提交操作成功
            if(res){
              _self.form.id = res.data.id;
              _self.loadData();
            }
          });
        });
      },
      loadData(){
        this.$http
          .get("/sys/org/getOrgTree", { params: this.condition })
          .then(res => {
            // console.log(res);
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
  

</style>
