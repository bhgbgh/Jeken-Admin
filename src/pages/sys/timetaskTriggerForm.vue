<template>
  <imp-panel :oper="operation" title="添加触发器" :upRouteName="upRouteName">
    <el-form size="small" ref="form" :model="form" status-icon label-width="140px">

      <el-form-item label="任务名称" prop="jobName">
        <el-input :disabled="true" v-model="form.jobName"></el-input>
      </el-form-item>

      <el-form-item label="触发器名称" prop="triggerName">
        <el-input  :disabled="operation == 'operDetail'" v-model="form.triggerName"></el-input>
      </el-form-item>

      <el-form-item label="有效时间范围" prop="timeRange">
        <el-date-picker
          :disabled="operation == 'operDetail'"
          v-model="form.timeRange"
          type="datetimerange"
          unlink-panels
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="触发器类型">
        <el-select v-model="form.triggerType" :disabled="operation == 'operDetail'" placeholder="请选择">
          <el-option
              v-for="item in triggerTypeSelectBox"
              :key="item.value"
              :label="item.name"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="执行次数" prop="repeatCount" v-if="form.triggerType == '1'">
        <el-input  :disabled="operation == 'operDetail'" v-model="form.repeatCount"></el-input>
      </el-form-item>

      <el-form-item label="执行间隔" prop="repeatInterval" v-if="form.triggerType == '1'">
        <el-input  :disabled="operation == 'operDetail'" v-model="form.repeatInterval"></el-input>
      </el-form-item>

      <el-form-item label="cron表达式" prop="cron" v-if="form.triggerType == '2'">
        <el-input  :disabled="operation == 'operDetail'" v-model="form.cron"></el-input>
      </el-form-item>

      <el-form-item label="备注">
        <el-input :disabled="operation == 'operDetail'" type="textarea" v-model="form.description"></el-input>
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
          jobName: '',
          triggerName: '',
          timeRange:[],
          startTime:null,
          endTime:null,
          triggerType:'',
          repeatCount:0,
          repeatInterval:0,
          cron:'',
          description: '',
          parameter: [],
        },
        triggerTypeSelectBox:[{name:'简单触发器',value:'1'},{name:'复杂触发器',value:'2'}],
        opLoading:false
      }
    },
    created(){
      this.operation = this.$route.params.operation;
      this.form.jobName =  this.$route.params.jobName;
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
        if(this.form.timeRange && this.form.timeRange.lentgh > 1){
          this.form.startTime = this.form.timeRange[0];
          this.form.endTime = this.form.timeRange[1];
        }
        this.$refs[formName].validate((valid) => {
          submitFormUtilByUrl('/sys/timetask/addTrigger', valid, this.form, this.upRouteName).then(function(result) {
              _self.opLoading = false;
          });
        });
      }
    }
  }
</script>
