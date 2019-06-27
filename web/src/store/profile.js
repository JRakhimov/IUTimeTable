import axios from "axios";
import { utils } from "../mixins/utils";

export const state = {
  profile: {
    fullNameLetter: "",
    oneNameLetter: "",
    groupName: "",
    timetable: {},
    studentID: "",
    fullName: "",
    stage: "",
    color: ""
  }
};

export const mutations = {
  setProfile: (state, profile) =>
    (state.profile = utils.methods.updateStudentData(profile)),

  clearProfile: state => {
    state.profile = {
      fullNameLetter: "",
      oneNameLetter: "",
      groupName: "",
      studentID: "",
      fullName: "",
      stage: "",
      color: ""
    };
  }
};

export const actions = {
  fetchProfile: async (ctx, studentID) => {
    const HOST_URL = process.env.VUE_APP_HOST_URL;
    const URL = `${HOST_URL}/students/${studentID}`;
    const jwt = localStorage.getItem("jwt");

    try {
      const { data } = await axios.get(URL, { headers: { "X-Auth": jwt } });

      if (data.status) {
        ctx.commit("setProfile", data.student);
      }
    } catch (error) {
      console.log("RJ: error", error);
    }
  }
};
