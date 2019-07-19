<template>
    <imp-panel>
        <iframe-panel :url.asyc="'/jedruidken/index.html'" :height="738"></iframe-panel>
    </imp-panel>
</template>

<script>
import IframePanel from "@/components/IframePanel.vue"

export default {
  name: "druid",
  components: {
    'iframe-panel':IframePanel
  },
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>
<style scoped>

.box-body {
    padding: 0px;
    height: 100%;
}

</style>
