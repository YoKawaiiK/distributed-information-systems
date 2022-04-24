<template>
  <div class="page">
    <app-header> </app-header>
    <div class="container">
      <the-simple-editor></the-simple-editor>
    </div>
    <footer class="footer">
      <p>
        Created by
        <a href="t.me/yokawaiik" target="_blank"> @yokawaiik </a>
      </p>
    </footer>
  </div>
</template>

<script>
import TheSimpleEditor from "@/components/TheSimpleEditor.vue";
import AppHeader from "@/components/AppHeader.vue";

export default {
  name: "CreateFileView",
  data() {
    return {
      dropzoneFile: null,
    };
  },

  components: { TheSimpleEditor, AppHeader },
  methods: {},
};
</script>

<style lang="scss" scoped>
.page {
  height: calc(100vh - 60px * 2 - 40px);
  min-height: 300px;
}

.header,
.footer {
  height: 60px;
  padding: 0 40px;
  display: flex;
  justify-content: center;
}
.header {
  flex-direction: column;
  color: white;
  background: mediumpurple;
}

.footer {
  flex-direction: row;
  color: mediumpurple;
}

.container {
  height: 100%;
  width: 100%;
  // margin: 20px;
  padding: 20px 20px;
  display: flex;
  justify-content: center;
}
</style>
