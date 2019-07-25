import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import axios from "axios";

import { Student, ExtendedStudent, TimeTable } from "../types";
import UtilsMixin from "../mixins/utils";

type GroupmatesResponse = {
  status: boolean;
  students: Student[];
};

@Module
export default class Groupmates extends VuexModule {
  groupmates: ExtendedStudent[] = [];

  @Mutation
  setGroupmates(groupmates: Student[]) {
    this.groupmates = groupmates.map(groupmate => UtilsMixin.updateStudentData(groupmate));
  }

  @Mutation
  clearGroupmates() {
    this.groupmates = [];
  }

  @Action({ commit: "setGroupmates" })
  async fetchFriends(groupName: string): Promise<Student[]> {
    const HOST_URL = process.env.VUE_APP_HOST_URL;
    const URL = `${HOST_URL}/groups/${groupName}`;
    const jwt = localStorage.getItem("jwt");

    const { data }: { data: GroupmatesResponse } = await axios.get(URL, { headers: { "X-Auth": jwt } });

    if (data.status) {
      return data.students;
    }

    return [];
  }
}
