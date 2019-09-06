import Vue from "vue";
import App from "./App";
import store from "../store";
import router from "./router.js";

Vue.prototype.HOST_URL = "http://localhost:3001";

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  render: h => h(App)
});
