import Vue from "vue";
import Vuex from "vuex";

import friends from "./store/friends";
import profile from "./store/profile";
import groupmates from "./store/groupmates";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    friends,
    profile,
    groupmates
  }
});
