<template>
  <imp-panel :oper="operation" title="创建任务" :upRouteName="upRouteName">
    <el-form size="small" ref="form" :model="form" status-icon label-width="140px">
      <el-form-item label="任务">
        <el-select v-model="form.beanName" :disabled="operation == 'operDetail'" @change="changeBean" placeholder="请选择">
          <el-option
              v-for="item in beanSelectBox"
              :key="item.name"
              :label="item.desc"
              :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="方法">
        <el-select v-model="form.methodName" :disabled="operation == 'operDetail'" @change="changeMethod" placeholder="请选择">
          <el-option
              v-for="item in methodSelectBox"
              :key="item.name"
              :label="item.desc"
              :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-for="(domain, index) in form.parameter"
        :label="(domain.desc?domain.desc:domain.name)+'('+domain.type+')'"
        :key="domain.name"
        :prop="'parameter.' + index + '.value'">
        <el-input v-model="domain.value"></el-input>
      </el-form-item>

      <el-form-item label="备注">
        <el-input :disabled="operation == 'operDetail'" type="textarea" v-model="form.desc"></el-input>
      </el-form-item>

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
  import { submitFormUtilByUrl } from '@/common/utils'

  export default {
    components: {
      'el-select-tree': SelectTree
    },
    data(){
      return {
        operation:"",//操作类型，参考panel组件中的operation定义
        upRouteName:"sysTimeTask",//上一层页面名称，供路由跳转使用
        form: {
          id: null,
          beanName: '',
          methodName: '',
          desc: '',
          // parameter: [{name: "arg", type: "String", value: null, desc: "参数1"}],
          parameter: [],
        },
        beanSelectBox:[],
        methodSelectBox:[],
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

      this.$http
          .get("/sys/timetask/getbeans")
          .then(res => {
            this.beanSelectBox = res;
          });
    },
    methods: {
      submitForm(formName) {
        this.opLoading = true;
        const _self = this;
        this.$refs[formName].validate((valid) => {
          submitFormUtilByUrl('/sys/timetask/addExecutionMethodJob', valid, this.form, this.upRouteName).then(function(result) {
              _self.opLoading = false;
          });
        });
      },
      changeBean( name) {
        this.methodSelectBox = [];
        for(var i = 0 ; i < this.beanSelectBox.length ; i++){
          if(name == this.beanSelectBox[i].name){
            this.methodSelectBox = this.beanSelectBox[i].methods;
          }
        }
      },
      changeMethod( name) {
        for(var i = 0 ; i < this.methodSelectBox.length ; i++){
          if(name == this.methodSelectBox[i].name){
            this.form.parameter = this.methodSelectBox[i].parameters;
          }
        }
      }
    }
  }
</script>
