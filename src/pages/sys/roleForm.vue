<template>
  <imp-panel :oper="operation" :upRouteName="upRouteName">
    <el-form size="small" ref="form" :model="form" status-icon label-width="140px">

      <el-row>
        <el-col :span="24">
          <el-form-item label="角色名称" prop="name" :rules="$rules({required:true,maxLength:50})">
            <el-input :disabled="operation == 'operDetail'" v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="角色标识" prop="code" :rules="$rules({required:true,maxLength:50})">
            <el-input :disabled="operation == 'operDetail'" v-model="form.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="角色类型" prop="type" :rules="$rules({required:true})">
            <el-select :disabled="operation == 'operDetail'" v-model="form.type"  placeholder="请选择">
                <el-option v-for="item in $dicts('roleType')" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select> 
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="描述">
            <el-input :disabled="operation == 'operDetail'" type="textarea" v-model="form.remark"></el-input>
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
  import { submitFormUtil } from '@/common/utils'

  export default {
    data(){
      return {
        operation:"",//操作类型，参考panel组件中的operation定义
        upRouteName:"sysRole",//上一层页面名称，供路由跳转使用
        form: {
          id: null,
          code: '',
          name: '',
          type:null,
          remark: ''
        },
        opLoading:false
      }
    },
    created(){
      this.operation = this.$route.params.operation;
      if(!this.operation){
        this.$router.push({name: this.upRouteName})
        return;
      }
      if(this.operation != "operAdd"){
        this.form = this.$route.params.row;
      }
    },
    methods: {
      submitForm(formName) {
        this.opLoading = true;
        const _self = this;
        this.$refs[formName].validate((valid) => {
          submitFormUtil('/sys/role', valid, this.form, this.upRouteName).then(function(result) {
              _self.opLoading = false;
          });
        });
      }
    }
  }
</script>
