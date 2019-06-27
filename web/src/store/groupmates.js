import axios from "axios";
import { utils } from "../mixins/utils";

export const state = {
  groupmates: null
};

export const mutations = {
  setGroupmates: (state, groupmates) =>
    (state.groupmates = groupmates.map(groupmate =>
      utils.methods.updateStudentData(groupmate)
    )),

  clearGroupmates: state => (state.groupmates = null)
};

export const actions = {
  fetchGroupmates: async (ctx, groupName) => {
    const HOST_URL = process.env.VUE_APP_HOST_URL;
    const URL = `${HOST_URL}/groups/${groupName}`;
    const jwt = localStorage.getItem("jwt");

    try {
      const { data } = await axios.get(URL, { headers: { "X-Auth": jwt } });

      if (data.status) {
        ctx.commit("setGroupmates", data.group);
      }
    } catch (error) {
      console.log("RJ: error", error);
    }
  }
};
