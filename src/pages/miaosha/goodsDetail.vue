<template>
  <imp-panel :oper="operation" :upRouteName="upRouteName">
    <el-form size="small" ref="form" :model="form" status-icon label-width="140px">

      <el-row>
        <el-col :span="12">
          <el-form-item label="商品名称" prop="goodsName">
            {{form.goodsName}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="秒杀开始时间" prop="startDate">
            {{form.startDate}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="秒杀结束时间" prop="endDate">
            {{form.endDate}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="商品原价" prop="goodsPrice">
            {{form.goodsPrice}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品秒杀价格" prop="miaoshaPrice">
            {{form.miaoshaPrice}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="商品数量" prop="goodsStock">
            {{form.goodsStock}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="秒杀数量" prop="stockCount">
            {{form.stockCount}}
          </el-form-item>
        </el-col>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="goodsStock">
            <span v-if="form.miaoshaStatus == 0">秒杀倒计时：<span id="countDown">{{form.remainSeconds}}</span>秒</span>
            <span v-if="form.miaoshaStatus == 1">秒杀进行中</span>
            <span v-if="form.miaoshaStatus == 2">秒杀已结束</span>
          </el-form-item>
        </el-col>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button :disabled="btnDisabled" type="primary" @click="miaosha()" :loading="opLoading">立即秒杀</el-button>
        <router-link :to="{ name: upRouteName}">
          <el-button type="danger">取消</el-button>
        </router-link>
        <div>{{orderInfo}}</div>
      </el-form-item>

    </el-form>
  </imp-panel>
</template>

<script>
  export default {
    data(){
      return {
        operation:"",//操作类型，参考panel组件中的operation定义
        upRouteName:"goods",//上一层页面名称，供路由跳转使用
        form: {
          id: null,
          goodsName: null,
          goodsPrice: 0,
          miaoshaPrice: 0,
          goodsStock:0,
          stockCount:0,
          startDate:0,
          endDate:0,
          miaoshaStatus:0,
          remainSeconds:0
        },
        orderInfo:null,
        opLoading:false,
        btnDisabled:true
      }
    },
    created(){
      this.operation = this.$route.params.operation;
      if(!this.operation){
        this.$router.push({name: this.upRouteName});
        return;
      }
      this.$http
        .get("/goods/getGoodsById/"+this.$route.params.row.id)
        .then(res => {
          this.form = res;
          this.countDown();
      });
    },
    methods: {
      countDown(){
        var timeout;
        if(this.form.remainSeconds > 0){//秒杀还没开始，倒计时
          this.btnDisabled = true;
          const _self = this;
          timeout = setTimeout(function(){
            _self.form.remainSeconds = _self.form.remainSeconds -1;
            _self.countDown();
          },1000);
        }else if(this.form.remainSeconds == 0){//秒杀进行中
          this.btnDisabled = false;
          if(timeout){
            clearTimeout(timeout);
          }
        }else{//秒杀已经结束
          this.btnDisabled = true;
        }
      },
      miaosha(formName) {
        this.opLoading = true;
        vm.$http.get("miaosha/miao/"+this.form.id)
          .then(res => {
              if (res.success) {
                  vm.$notify.success({ title: '系统消息', message: res.msg, position: 'bottom-right' });
                  this.form = res.data.goods;
                  this.orderInfo = res.data.orderInfo;
              } else {
                  vm.$notify.error({ title: '系统消息', message: res.msg, position: 'bottom-right' });
              }
              this.opLoading = false;
          })
      }
    }
  }
</script>
