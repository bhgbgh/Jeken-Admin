<template>
  <imp-panel :oper="operation" :upRouteName="upRouteName">
    <el-form size="small" ref="form" :model="form" status-icon label-width="140px">

      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name" :rules="$rules({required:true,maxLength:50})">
            <el-input :disabled="operation == 'operDetail'" v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名" prop="username" :rules="$rules({required:true,maxLength:50})">
            <el-input :disabled="operation == 'operDetail'" v-model="form.username"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="编号" prop="code" :rules="$rules({required:true,maxLength:50})">
            <el-input :disabled="operation == 'operDetail'" v-model="form.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="operation == 'operAdd'" :rules="$rules({required:true,maxLength:50})">
          <el-form-item label="密码" prop="pazzword">
            <el-input type="password" v-model="form.pazzword"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age" :rules="$rules({required:true, number:true, max:200})">
            <el-input :disabled="operation == 'operDetail'" v-model.number="form.age"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织机构" prop="orgId" :rules="$rules({required:true})">
            <el-select-tree :disabled="operation == 'operDetail'" v-model="form.orgId" :treeData="orgTree" clearable v-on:inputObj="inputObj" placeholder="请选择组织机构">
            </el-select-tree>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="性别">
            <el-radio-group v-model="form.sex">
              <el-radio :disabled="operation == 'operDetail'" :label="true">男</el-radio>
              <el-radio :disabled="operation == 'operDetail'" :label="false">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="form.usable">
              <el-radio :disabled="operation == 'operDetail'" :label="true">激活</el-radio>
              <el-radio :disabled="operation == 'operDetail'" :label="false">未激活</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="mobile" :rules="$rules({type:'mobile'})">
            <el-input :disabled="operation == 'operDetail'" v-model="form.mobile"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话号码" prop="telephone" :rules="$rules({type:'tel'})">
            <el-input :disabled="operation == 'operDetail'" v-model="form.telephone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email" :rules="$rules({type:'email'})">
            <el-input :disabled="operation == 'operDetail'" v-model="form.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
<!-- {{form.region}} -->
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="活动区域" prop="region" :rules="$rules({required:true})">
            <el-select v-model="form.region" clearable multiple collapse-tags placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="活动性质" prop="type">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
              <el-checkbox label="地推活动" name="type"></el-checkbox>
              <el-checkbox label="线下主题活动" name="type"></el-checkbox>
              <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark" :rules="$rules({maxLength:500})">
            <el-input :disabled="operation == 'operDetail'" type="textarea" v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="附件">
            <el-upload
              class="upload-demo"
              :disabled="operation == 'operDetail'"
              ref="upload"
              :action="$http.defaults.uploadURL"
              multiple
              :before-upload="handleBeforeUpload"
              :on-preview="handlePreview"
              :on-error="handleError"
              :file-list="form.files">
              <el-button v-show="operation != 'operDetail'" size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button v-if="operation != 'operDetail'" type="primary" @click="submitForm('form')" :loading="opLoading">保存</el-button>
        <router-link :to="{ name: upRouteName}">
          <el-button type="danger">取消</el-button>
        </router-link>
      </el-form-item>

    </el-form>
  </imp-panel>
</template>
<script>
  import SelectTree from "@/components/SelectTree.vue"
  import { submitFormUtil,getFiles } from '@/common/utils'

  export default {
    components: {
      'el-select-tree': SelectTree
    },
    data(){
      return {
        operation:"",//操作类型，参考panel组件中的operation定义
        upRouteName:"sysUser",//上一层页面名称，供路由跳转使用
        form: {
          id: null,
          code: '',
          name: '',
          username: '',
          pazzword:'',
          age:0,
          orgId:null,
          orgName:null,
          sex:true,
          telephone:'',
          email: '',
          mobile: '',
          usable: true,
          remark: '',
          files: [],//查看时附件列表详细信息列表
          // region:'',
          type:[]
        },
        orgTree: [],
        // expandedKeys:[],//tree展开的层级keys
        inputOrg:null,
        opLoading:false
      }
    },
    created(){
      this.operation = this.$route.params.operation;
      if(!this.operation){
        this.$router.push({name: this.upRouteName});
        return;
      }
      if(this.operation != "operAdd"){
        this.$http
          .get("/sys/user/"+this.$route.params.row.id)
          .then(res => {
            this.form = res;
          });
      }
      this.$http
        .get("/sys/org/getOrgTree")
        .then(res => {
          this.orgTree = res;
        });
    },
    methods: {
      inputObj(obj){
          this.inputOrg = obj;
      },
      // handleBefore(file){
      //    console.log(file);
      //    return false;
      // },
      submitForm(formName) {
        this.opLoading = true;
        const _self = this;
        this.form.files = getFiles(this.$refs.upload.uploadFiles);
        // console.log("submitForm", this.$refs.upload.uploadFiles,this.form.files);
        this.$refs[formName].validate((valid) => {
          this.form.orgName = this.inputOrg.longName;
          submitFormUtil('/sys/user', valid, this.form, this.upRouteName).then(function(result) {
              _self.opLoading = false;
          });
        });
      }
    }
  }
</script>
