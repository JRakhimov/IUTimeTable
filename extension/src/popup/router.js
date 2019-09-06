import Vue from "vue";
import VueRouter from "vue-router";

import IndexPage from "./views/Index.vue";
import LoginPage from "./views/Login.vue";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      name: "index",
      path: "/",
      component: IndexPage
    },
    {
      name: "login",
      path: "/login",
      component: LoginPage
    }
  ]
});
