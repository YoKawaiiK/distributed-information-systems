<template>
  <header class="header">
    <!-- <h1 class="title" :to="{ name: HOME_VIEW }">Simple Dropbox client</h1> -->
    <router-link class="title" :to="{ name: $options.routes.HOME_VIEW }">
      Simple Dropbox client</router-link
    >
  </header>
</template>

<script>
import { HOME_VIEW } from "@/router/constants";

export default {
  name: "AppHeader",
  routes: {
    HOME_VIEW,
  },
};
</script>

<style lang="scss" scoped>
.header {
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
    text-decoration: none;
    color: white !important;
    font-size: 1.6rem;
  }
}
</style>
