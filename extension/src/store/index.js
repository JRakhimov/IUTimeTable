import Vue from "vue";
import Vuex from "vuex";

import indicatorModule from "./modules/indicator";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    indicator: indicatorModule
  }
});
