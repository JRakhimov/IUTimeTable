<template>
  <v-container class="mb-8">
    <v-dialog v-model="dialogOpened" max-width="600px">
      <v-card>
        <v-form ref="form" v-model="isInputValid">
          <v-card-title>
            <span class="headline">Add friend</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex>
                  <v-text-field
                    prepend-icon="account_circle"
                    label="Friend's StudentID"
                    :rules="inputRules"
                    v-model="newFriendID"
                    name="StudentID"
                    :color="color"
                    :counter="7"
                    type="number"
                    prefix="U"
                    clearable
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :color="color" @click="closeDialog" text>Close</v-btn>
            <v-btn
              text
              type="submit"
              :color="color"
              @click.prevent="addFriend"
              :loading="isAdding"
              :disabled="!isInputValid"
            >Add</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-layout justify-center>
      <FriendsSkeleton v-if="isLoading" />

      <v-flex v-if="!isLoading" md6>
        <v-card>
          <v-progress-linear :indeterminate="true" :active="isDeleting" :color="color" height="5"/>

          <v-list class="pr-3" two-line>
            <template v-for="(friend, index) in friendsList">
              <v-subheader v-if="friend.header" :key="friend.header">{{ friend.header }}</v-subheader>

              <v-divider v-else-if="friend.divider" :key="index" :inset="friend.inset"/>

              <v-list-item
                v-else
                :key="friend.studentID"
                @click="friendsTimetable(friend.studentID)"
                avatar
              >
                <v-list-item-avatar>
                  <v-avatar :color="friend.color" size="40">
                    <span class="white--text headline">{{ friend.oneNameLetter }}</span>
                  </v-avatar>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-html="friend.fullName"></v-list-item-title>
                  <v-list-item-subtitle v-html="`${friend.studentID} • ${friend.groupName}`"></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-fab-transition>
                    <v-btn v-if="isOnline" @click.stop="removeFriend(friend.studentID)" icon ripple>
                      <v-icon color="#E45164">delete</v-icon>
                    </v-btn>
                  </v-fab-transition>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>

    <v-fab-transition>
      <v-btn
        :color="color"
        @click="openDialog"
        :style="colorStyles()"
        v-show="!dialogOpened && isOnline && !isLoading"
        class="j-fab"
        dark
        fab
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import FriendsSkeleton from "../components/skeletons/FriendsSkeleton.vue";

import { FriendsModule, ProfileModule } from "../store";
import { ExtendedStudent } from "../types";
import VueOfflineMixin from "../mixins/vueOffline";
import UtilsMixin from "../mixins/utils";

type FriendsHeader = { header: string };
type FriendsDivider = { divider: boolean; inset: boolean };

@Component({ components: { FriendsSkeleton } })
export default class Friends extends Mixins(UtilsMixin, VueOfflineMixin) {
  private dialogOpened = false;
  private isInputValid = true;
  private newFriendID = "";
  private inputRules = [
    (v: string) =>
      (v || "").length === 7 || `StudentID should containt 7 characters.`,
    (v: string) =>
      `U${v}` !== ProfileModule.getProfile.studentID ||
      "You cannot add yourself."
  ];

  private isDeleting = false;
  private isLoading = false;
  private isAdding = false;

  get friends() {
    return FriendsModule.getFriends;
  }

  get friendsList() {
    const header = `You have ${this.friends.length} ${
      this.friends.length === 1 ? "friend" : "friends"
    }`;

    const tmpFriends: Array<
      FriendsHeader | ExtendedStudent | FriendsDivider
    > = [{ header }];

    this.friends.forEach((groupmate: ExtendedStudent, index) => {
      tmpFriends.push(groupmate);

      if (this.friends.length !== index + 1) {
        tmpFriends.push({ divider: true, inset: true });
      }
    });

    return tmpFriends;
  }

  async mounted() {
    if (!this.isOffline) {
      this.isDeleting = true;

      const { studentID } = ProfileModule.getProfile;

      await FriendsModule.fetchFriends(studentID);

      this.isDeleting = false;
    }
  }

  openDialog() {
    this.newFriendID = "";
    this.dialogOpened = true;
  }

  closeDialog() {
    this.newFriendID = "";
    this.dialogOpened = false;
  }

  async removeFriend(friendID: string) {
    this.isDeleting = true;

    await FriendsModule.removeFriend(friendID);

    this.isDeleting = false;
  }

  async addFriend() {
    this.isAdding = true;

    await FriendsModule.addFriend(this.newFriendID);

    this.isAdding = false;
    this.newFriendID = "";
    this.dialogOpened = false;
  }

  friendsTimetable(friendID: string) {
    this.$router.push({ name: "friends-timetable", params: { friendID } });
  }
}
</script>
