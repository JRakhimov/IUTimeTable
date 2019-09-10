import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import axios from "axios";

import { Student, ExtendedStudent, TimeTable } from "../types";
import UtilsMixin from "../mixins/utils";
import store, { ProfileModule } from "@/store";

type FriendsResponse = {
  status: boolean;
  friends?: Student[];
};

@Module({ name: "Friends", store })
export default class Friends extends VuexModule {
  public friends: ExtendedStudent[] = [];

  get getFriends() {
    return this.friends;
  }

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

    if (data.status && data.friends) {
      return data.friends;
    }

    return [];
  }

  @Action({ rawError: true })
  async addFriend(friendID: string) {
    const { studentID } = ProfileModule.getProfile;
    const HOST_URL = process.env.VUE_APP_HOST_URL;
    const URL = `${HOST_URL}/friends/${studentID}`;
    const jwt = localStorage.getItem("jwt");

    let splitterFriendID = friendID.split("");
    splitterFriendID.unshift("U");
    friendID = splitterFriendID.join("");

    try {
      const { data } = await axios.post(URL, { friendID }, { headers: { "X-Auth": jwt } });

      if (data.status) {
        await this.context.dispatch("fetchFriends", studentID);
      }
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log(error);
    }
  }

  @Action({ rawError: true })
  async removeFriend(friendID: string) {
    const { studentID } = ProfileModule.getProfile;

    for (const friend of this.getFriends) {
      if (friend.studentID === friendID) {
        try {
          const HOST_URL = process.env.VUE_APP_HOST_URL;
          const URL = `${HOST_URL}/friends/${studentID}`;
          const jwt = localStorage.getItem("jwt");

          const { data } = await axios.delete(URL, {
            headers: { "X-Auth": jwt },
            data: { friendID }
          });

          if (data.status) {
            await this.context.dispatch("fetchFriends", studentID);
          }
        } catch (error) {
          // tslint:disable-next-line:no-console
          console.error(error);
        }
      }
    }
  }
}
