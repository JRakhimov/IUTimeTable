import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import { router } from "./router";
import "./registerServiceWorker";

Vue.prototype.HOST_URL = process.env.VUE_APP_HOST_URL;

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.use(Vuetify, { iconfont: "md" });

import Default from "@/layouts/Default.vue";
import Login from "@/layouts/Login.vue";

Vue.component("default-layout", Default);
Vue.component("login-layout", Login);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App),
  vuetify: new Vuetify({})
}).$mount("#app");
