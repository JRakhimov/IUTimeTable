import Vue from "vue";
import Vuetify from "vuetify";
import * as firebase from "firebase/app";

import App from "./App.vue";
import store from "./store";
import { router } from "./router";

import "./registerServiceWorker";
import "firebase/firebase-messaging";
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.prototype.HOST_URL = process.env.VUE_APP_HOST_URL;

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.usePublicVapidKey(process.env.VUE_APP_PUBLIC_VAPID_KEY);

messaging
  .requestPermission()
  .then(() => {
    console.log("Notification permission granted.");

    // Get Token
    messaging.getToken().then(token => {
      console.log(token);
    });
  })
  .catch(err => {
    console.log("Unable to get permission to notify.", err);
  });

Vue.use(Vuetify, { iconfont: "md" });

import Default from "@/layouts/Default.vue";
import Login from "@/layouts/Login.vue";

Vue.component("default-layout", Default);
Vue.component("login-layout", Login);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
