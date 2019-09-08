import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import axios from "axios";

import { Student, ExtendedStudent } from "../types";
import UtilsMixin from "../mixins/utils";
import store from "@/store";

type GroupmatesResponse = {
  status: boolean;
  group: Student[];
};

@Module({ name: "Groupmates", store })
export default class Groupmates extends VuexModule {
  public groupmates: ExtendedStudent[] = [];

  get getGroupmates() {
    return this.groupmates;
  }

  @Mutation
  setGroupmates(groupmates: Student[]) {
    console.log("this :", this);
    this.groupmates = groupmates.map(groupmate => UtilsMixin.updateStudentData(groupmate));
  }

  @Mutation
  clearGroupmates() {
    this.groupmates = [];
  }

  @Action({ commit: "setGroupmates", rawError: true })
  async fetchGroupmates(groupName: string): Promise<Student[]> {
    const HOST_URL = process.env.VUE_APP_HOST_URL;
    const URL = `${HOST_URL}/groups/${groupName}`;
    const jwt = localStorage.getItem("jwt");

    const { data }: { data: GroupmatesResponse } = await axios.get(URL, { headers: { "X-Auth": jwt } });

    if (data.status) {
      return data.group;
    }

    return [];
  }
}
