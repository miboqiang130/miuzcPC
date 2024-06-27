import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    children: [
      { path: "/Music", component: () => import("@renderer/Music.vue") },
      { path: "/Setting", component: () => import("@renderer/Setting.vue") },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
