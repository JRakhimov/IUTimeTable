import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import axios from "axios";

import { Student, ExtendedStudent, TimeTable } from "../types";
import UtilsMixin from "../mixins/utils";
import store from "@/store";

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

  //   async addFriend() {
  //     this.isLoading = true;

  //     const { studentID } = this.$store.state.profile;
  //     const URL = `${this.HOST_URL}/friends/${studentID}`;
  //     const jwt = localStorage.getItem("jwt");

  //     let friendID = this.newFriendID;
  //     friendID = friendID.split("");
  //     friendID.unshift("U");
  //     friendID = friendID.join("");

  //     try {
  //       const { data } = await axios.post(
  //         URL,
  //         { friendID },
  //         { headers: { "X-Auth": jwt } }
  //       );

  //       if (data.status) {
  //         await this.$store.dispatch("fetchFriends", studentID);
  //       }

  //       setTimeout(() => {
  //         this.friends = this.$store.state.friends;
  //         this.loading = false;
  //         this.closeDialog();
  //       }, 500);
  //     } catch (error) {
  //       console.log("RJ: error", error);
  //     }
  //   }
  // async removeFriend(friendID) {
  //     this.deletePending = true;

  //     const { studentID } = this.$store.state.profile;

  //     for (const friend of this.friendsList) {
  //       if (friend.studentID === friendID) {
  //         try {
  //           const URL = `${this.HOST_URL}/friends/${studentID}`;
  //           const jwt = localStorage.getItem("jwt");

  //           const { data } = await axios.delete(URL, {
  //             headers: { "X-Auth": jwt },
  //             data: { friendID }
  //           });

  //           if (data.status) {
  //             await this.$store.dispatch("fetchFriends", studentID);
  //           }
  //         } catch (error) {
  //           console.error(error);
  //         }
  //       }
  //     }

  //     this.friends = this.$store.state.friends;
  //     this.deletePending = false;
  //   }
}
