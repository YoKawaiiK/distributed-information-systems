<template>
  <div class="page">
    <app-header> </app-header>
    <div class="container">
      <div class="columns">
        <div class="column column_half">
          <the-drop-zone></the-drop-zone>
        </div>
      </div>
    </div>
    <footer class="footer">
      <p>
        Created by
        <a
          href="
http://t.me/yokawaiik"
          target="_blank"
        >
          @yokawaiik
        </a>
      </p>
    </footer>
  </div>
</template>

<script>
// @ is an alias to /src
// import { HOME_VIEW } from "@/router/constants";

import TheDropZone from "@/components/TheDropZone.vue";
// import TheFileList from "@/components/TheFileList.vue";
import AppHeader from "@/components/AppHeader.vue";

export default {
  name: "HomeView",
  data() {
    return {
      dropzoneFile: null,
    };
  },

  components: {
    TheDropZone,
    //  TheFileList,
    AppHeader,
  },
  methods: {
    onDrop(data) {
      this.dropzoneFile = data;
    },
  },
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

  background: mediumpurple;

  .title {
    cursor: pointer;
    color: white !important;
  }
}

.footer {
  flex-direction: row;
  color: mediumpurple;
}

.container {
  height: 100%;
  // margin: 20px;
  padding: 20px 20px;
  display: flex;
  width: 100%;
  justify-content: center;

  .columns {
    width: 100%;
    display: flex;
    gap: 40px;
    align-items: center;
    justify-content: space-around;

    .column {
      height: 100%;
      flex: 1;

      &.column_half {
        flex: none;
        width: 700px;
      }
    }
  }
}
</style>
