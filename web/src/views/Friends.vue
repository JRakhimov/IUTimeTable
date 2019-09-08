<template>
  <v-container>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-form ref="form" v-model="valid">
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
                    :rules="studentIDRules"
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
            <v-btn :color="color" @click="closeDialog" flat>Close</v-btn>
            <v-btn
              type="submit"
              :color="color"
              @click.prevent="addFriend"
              :loading="loading"
              :disabled="!valid"
              flat
            >Add</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-layout justify-center>
      <FriendsSkeleton v-if="!friends" />

      <v-flex v-if="friends" md6>
        <v-card>
          <v-list class="pr-3" two-line>
            <template v-for="(friend, index) in friendsList">
              <v-subheader v-if="friend.header" :key="friend.header">{{ friend.header }}</v-subheader>

              <v-divider v-else-if="friend.divider" :key="index" :inset="friend.inset"></v-divider>

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

          <v-progress-linear
            :indeterminate="true"
            :active="deletePending"
            :color="color"
            height="5"
          ></v-progress-linear>
        </v-card>
      </v-flex>
    </v-layout>

    <v-fab-transition>
      <v-btn
        :color="color"
        @click="openDialog"
        :style="colorStyles()"
        v-show="!dialogOpened && isOnline && !isLoading"
        class="add-friend"
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
import { getModule } from "vuex-module-decorators";

import FriendsSkeleton from "../components/skeletons/FriendsSkeleton.vue";

import { FriendsModule, ProfileModule } from "../store";
import { Student, ExtendedStudent } from "../types";
import VueOfflineMixin from "../mixins/vueOffline";
import UtilsMixin from "../mixins/utils";

type FriendsHeader = { header: string };
type FriendsDivider = { divider: boolean; inset: boolean };

@Component({ components: { FriendsSkeleton } })
export default class Friends extends Mixins(UtilsMixin, VueOfflineMixin) {
  private friends: ExtendedStudent[] = [];
  private deletePending = false;
  private dialogOpened = false;
  private isInputValid = true;
  private isLoading = false;
  private newFriendID = "";
  private inputRules = [
    (v: string) =>
      (v || "").length === 7 || `StudentID should containt 7 characters.`,
    (v: string) => !isNaN(Number(v || "")) || "Only numbers are allowed."
  ];

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
    const { studentID } = ProfileModule.getProfile;
    let friends = FriendsModule.getFriends;

    if (studentID && !friends.length) {
      this.isLoading = true;

      await FriendsModule.fetchFriends(studentID);

      setTimeout(() => {
        this.friends = FriendsModule.getFriends;
        this.isLoading = false;
      }, 2000);

      return;
    }

    this.friends = friends;
  }

  openDialog() {
    this.newFriendID = "";
    this.dialogOpened = true;
  }

  closeDialog() {
    this.newFriendID = "";
    this.dialogOpened = false;
  }

  friendsTimetable(friendID: string) {
    this.$router.push({ name: "friends-timetable", params: { friendID } });
  }
}
</script>

<style lang="scss">
.add-friend {
  position: absolute !important;
  bottom: 5.5rem;
  right: 1.5rem;
}
</style>
