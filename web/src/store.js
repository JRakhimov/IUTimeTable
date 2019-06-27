import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import * as profile from "./store/profile";
import * as friends from "./store/friends";
import * as groupmates from "./store/groupmates";

export default new Vuex.Store({
  state: {
    ...profile.state,
    ...friends.state,
    ...groupmates.state
  },
  mutations: {
    ...profile.mutations,
    ...friends.mutations,
    ...groupmates.mutations
  },
  actions: {
    ...profile.actions,
    ...friends.actions,
    ...groupmates.actions
  },
  getters: {
    ...friends.getters
  }
});
