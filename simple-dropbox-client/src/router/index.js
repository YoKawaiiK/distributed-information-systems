import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CreateFileView from "../views/CreateFileView.vue";

import { HOME_VIEW, CREATE_FILE_VIEW } from "./constants";

const routes = [
  {
    path: "/",
    name: HOME_VIEW,
    component: HomeView,
  },
  {
    path: "/create-file",
    name: CREATE_FILE_VIEW,
    component: CreateFileView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
