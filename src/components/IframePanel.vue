<!--加载外部HTML方法,使用iframe实现-->
<template>
  <div>
      <iframe :src="urlPath"
              class="iframe"
              ref="iframe" :style="styleObject"></iframe>
  </div>
</template>

<script>

import { getRootUrl } from "@/common/utils";
export default {
  name: 'iframePanel',
  data () {
    return {
      urlPath:this.getUrl(), //iframe src 路径
      styleObject:{height:this.height+'px'}
    }
  },
  // 使用时请使用 :url.sync=""传值
  props: {
    //页面地址
    url: {
      required: true
    },
    //高度
    height:{
      type: Number
    }
  },
  methods: {
    getUrl(){
      //   urlPath:'http://localhost:9000/api/druid/index.html' //iframe src 路径
      return getRootUrl() + '/' + this.$http.defaults.baseURL + this.url
    }
  },
  created(){
    // const iframe = this.$refs.iframe
    console.log(this);
      const clientHeight = document.documentElement.clientHeight;
      console.log(document.documentElement,clientHeight);
      // iframe.style.height = `${clientHeight}px`
      this.styleObject.height = `${clientHeight}px`;
  }
}
</script>

<style lang="scss">
.iframe {
  width: 100%;
//   height: 738px;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}
</style>