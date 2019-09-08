import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import { getModule } from "vuex-module-decorators";

import Groupmates from "./store/groupmates";
import Friends from "./store/friends";
import Profile from "./store/profile";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({ storage: window.localStorage });

const store = new Vuex.Store({
  modules: {
    groupmates: Groupmates,
    friends: Friends,
    profile: Profile
  },
  plugins: [vuexLocal.plugin]
});

export default store;
export const GroupmatesModule = getModule(Groupmates, store);
export const FriendsModule = getModule(Friends, store);
export const ProfileModule = getModule(Profile, store);
