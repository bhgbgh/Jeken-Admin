<!--加载外部HTML方法,绑定html实现-->
<template>
 <div>
  <p v-html="html"></p>
 </div>
</template>
<script>
 export default{
  // 使用时请使用 :url.sync=""传值
  props: {
   url: {
    required: true
   }
  },
  data () {
   return {
    loading: false,
    html: ''
   }
  },
  watch: {
   url (value) {
    this.load(value)
   }
  },
  mounted () {
   this.load(this.url)
  },
  methods: {
   load (url) {
    if (url && url.length > 0) {
     // 加载中
     this.loading = true
     let param = {
      accept: 'text/html, text/plain'
     }
     this.$http.get(url, param).then((response) => {
      this.loading = false
      // 处理HTML显示
      this.html = response
    //   console.log(response);
     }).catch(() => {
      this.loading = false
      this.html = '加载失败'
     })
    }
   }
  }
 }
</script>