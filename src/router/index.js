import { createRouter, createWebHashHistory } from "vue-router";
import { auth } from "@/firebase/config";

const routes = [
  {
    path: "/login",
    name: "login",
    meta: {
      layout: "empty",
    },
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    meta: {
      layout: "empty",
    },
    component: () => import("../views/SignupView.vue"),
  },
  {
    path: "/",
    name: "home",
    alias: "/dashboard",
    meta: {
      auth: true,
      layout: "main",
      title: "account",
      at_sidebar: true,
    },
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/categories",
    name: "categories",
    meta: {
      auth: true,
      layout: "main",
      title: "categories",
      at_sidebar: true,
    },
    component: () => import("../views/CategoriesView.vue"),
  },
  {
    path: "/record-detail/:id",
    name: "record-detail",
    meta: {
      auth: true,
      layout: "main",
    },
    component: () => import("../views/DetailRecordView.vue"),
  },
  {
    path: "/history",
    name: "history",
    meta: {
      auth: true,
      layout: "main",
      title: "history",
      at_sidebar: true,
    },
    component: () => import("../views/HistoryView.vue"),
  },
  {
    path: "/planning",
    name: "planning",
    meta: {
      auth: true,
      layout: "main",
      title: "planning",
      at_sidebar: true,
    },
    component: () => import("../views/PlanningView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    meta: {
      layout: "main",
    },
    component: () => import("../views/ProfileView.vue"),
  },
  {
    path: "/record",
    name: "record",
    meta: {
      auth: true,
      title: "new_record",
      at_sidebar: true,
      layout: "main",
    },
    component: () => import("../views/RecordView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  const requiredAuth = to.matched.some((route) => route.meta.auth);

  if (!currentUser && requiredAuth) {
    next({ name: "login", query: { message: "login" } });
  } else {
    next();
  }
});

export default router;
