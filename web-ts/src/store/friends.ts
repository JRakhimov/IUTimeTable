import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import axios from "axios";

import { Student, ExtendedStudent, TimeTable } from "../types";
import UtilsMixin from "../mixins/utils";

type FriendsResponse = {
  status: boolean;
  friends: Student[];
};

@Module
export default class Friends extends VuexModule {
  friends: ExtendedStudent[] = [];

  get friendsTimetable() {
    return (friendID: string): TimeTable | {} => {
      const friend = this.friends.find(friend => friend.studentID === friendID);

      return friend ? friend.timetable : {};
    };
  }

  @Mutation
  setFriends(friends: Student[]) {
    this.friends = friends.map(friend => UtilsMixin.updateStudentData(friend));
  }

  @Mutation
  clearFriends() {
    this.friends = [];
  }

  @Action({ commit: "setFriends" })
  async fetchFriends(studentID: string): Promise<Student[]> {
    const HOST_URL = process.env.VUE_APP_HOST_URL;
    const URL = `${HOST_URL}/friends/${studentID}`;
    const jwt = localStorage.getItem("jwt");

    const { data }: { data: FriendsResponse } = await axios.get(URL, { headers: { "X-Auth": jwt } });

    if (data.status) {
      return data.friends;
    }

    return [];
  }
}
