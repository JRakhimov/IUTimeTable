import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import friends from "./store/friends";
import profile from "./store/profile";
import groupmates from "./store/groupmates";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({ storage: window.localStorage });

export default new Vuex.Store({
  modules: {
    friends,
    profile,
    groupmates
  },
  plugins: [vuexLocal.plugin]
});
