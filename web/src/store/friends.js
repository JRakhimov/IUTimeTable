import axios from "axios";
import { utils } from "../mixins/utils";

export const state = {
  friends: null
};

export const mutations = {
  setFriends: (state, friends) =>
    (state.friends = friends.map(friend =>
      utils.methods.updateStudentData(friend)
    ))
};

export const actions = {
  fetchFriends: async (ctx, studentID) => {
    const HOST_URL = process.env.VUE_APP_HOST_URL;
    const URL = `${HOST_URL}/friends/${studentID}`;
    const jwt = localStorage.getItem("jwt");

    try {
      const { data } = await axios.get(URL, { headers: { "X-Auth": jwt } });

      if (data.status) {
        ctx.commit("setFriends", data.friends);
      }
    } catch (error) {
      console.log("RJ: error", error);
    }
  }
};

export const getters = {
  frinedsTimetable: state => friendID =>
    state.friends.find(friend => friend.studentID === friendID).timetable
};
