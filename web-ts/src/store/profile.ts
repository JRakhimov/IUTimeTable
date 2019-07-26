import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import axios from "axios";

import { Student, ExtendedStudent, Stage } from "../types";
import UtilsMixin from "../mixins/utils";

type ProfileResponse = {
  status: boolean;
  student: Student;
};

const emptyProfile: ExtendedStudent = {
  fullName: "",
  oneNameLetter: "",
  fullNameLetter: "",
  groupName: "",
  studentID: "",
  timetable: {},
  stage: Stage.Freshman,
  color: ""
};

@Module({ name: "Profile" })
export default class Profile extends VuexModule {
  public profile: ExtendedStudent = emptyProfile;

  get getProfile() {
    return this.profile;
  }

  get getProfileTimetable() {
    return this.profile.timetable;
  }

  @Mutation
  setProfile(student: Student) {
    this.profile = UtilsMixin.updateStudentData(student);
  }

  @Mutation
  clearProfile() {
    this.profile = emptyProfile;
  }

  @Action({ commit: "setProfile" })
  async fetchProfile(studentID: string): Promise<Student> {
    const HOST_URL = process.env.VUE_APP_HOST_URL;
    const URL = `${HOST_URL}/students/${studentID}`;
    const jwt = localStorage.getItem("jwt");

    const { data }: { data: ProfileResponse } = await axios.get(URL, { headers: { "X-Auth": jwt } });

    if (data.status) {
      return data.student;
    }

    return emptyProfile;
  }
}
