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
                    :counter="max"
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
      <FriendsSkeleton v-if="!friends"/>

      <v-flex v-if="friends" md6>
        <v-card class="pr-3">
          <v-list two-line>
            <template v-for="(friend, index) in friendsList">
              <v-subheader v-if="friend.header" :key="friend.header">
                {{
                friend.header
                }}
              </v-subheader>

              <v-divider v-else-if="friend.divider" :key="index" :inset="friend.inset"></v-divider>

              <v-list-tile
                v-else
                :key="friend.studentID"
                @click="friendsTimetable(friend.studentID)"
                avatar
              >
                <v-list-tile-avatar>
                  <v-avatar :color="friend.color" size="40">
                    <span class="white--text headline">
                      {{
                      friend.oneNameLetter
                      }}
                    </span>
                  </v-avatar>
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title v-html="friend.fullName"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="`${friend.studentID} • ${friend.groupName}`"></v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-fab-transition>
                    <v-btn v-if="isOnline" @click.stop="removeFriend(friend.studentID)" icon ripple>
                      <v-icon color="#E45164">delete</v-icon>
                    </v-btn>
                  </v-fab-transition>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>

    <v-fab-transition>
      <v-btn
        :color="color"
        @click="openDialog"
        v-show="!dialog && isOnline && friends"
        class="add-friend"
        dark
        fab
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script>
import axios from "axios";
import { utils } from "../mixins/utils";
import { VueOfflineMixin } from "vue-offline";
import FriendsSkeleton from "../components/FriendsSkeleton";

export default {
  name: "Friends",
  mixins: [utils, VueOfflineMixin],
  components: { FriendsSkeleton },

  data() {
    return {
      newFriendID: null,
      loading: false,
      friends: null,
      dialog: false,
      valid: true,
      max: 7,
      studentIDRules: [
        v => (v || "").length === 7 || `StudentID should containt 7 characters.`
      ]
    };
  },

  computed: {
    friendsList() {
      const header = `You have ${this.friends.length} ${
        this.friends.length === 1 ? "friend" : "friends"
      }`;
      const tmpFriends = [{ header }];

      this.friends.forEach((friend, index) => {
        tmpFriends.push(friend);

        if (this.friends.length !== index + 1) {
          tmpFriends.push({ divider: true, inset: true });
        }
      });

      return tmpFriends;
    }
  },

  mounted() {
    const { studentID } = this.$store.state.profile;
    const { friends } = this.$store.state;

    if (studentID && !friends) {
      this.$store.dispatch("fetchFriends", studentID);
    }

    if (!friends) {
      setTimeout(() => (this.friends = this.$store.state.friends), 2000);
      return;
    }

    this.friends = this.$store.state.friends;
  },

  methods: {
    openDialog() {
      this.newFriendID = null;
      this.dialog = true;
    },

    closeDialog() {
      this.newFriendID = null;
      this.dialog = false;
    },

    async addFriend() {
      this.loading = true;

      const { studentID } = this.$store.state.profile;
      const URL = `${this.HOST_URL}/friends/${studentID}`;
      const jwt = localStorage.getItem("jwt");

      let friendID = this.newFriendID;
      friendID = friendID.split("");
      friendID.unshift("U");
      friendID = friendID.join("");

      try {
        const { data } = await axios.post(
          URL,
          { friendID },
          { headers: { "X-Auth": jwt } }
        );

        if (data.status) {
          await this.$store.dispatch("fetchFriends", studentID);
        }

        setTimeout(() => {
          this.loading = false;
          this.closeDialog();
        }, 500);
      } catch (error) {
        console.log("RJ: error", error);
      }
    },

    async removeFriend(friendID) {
      const { studentID } = this.$store.state.profile;

      for (const friend of this.friendsList) {
        if (friend.studentID === friendID) {
          try {
            const URL = `${this.HOST_URL}/friends/${studentID}`;
            const jwt = localStorage.getItem("jwt");

            const { data } = await axios.delete(URL, {
              headers: { "X-Auth": jwt },
              data: { friendID }
            });

            if (data.status) {
              await this.$store.dispatch("fetchFriends", studentID);
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    },

    friendsTimetable(friendID) {
      this.$router.push({ name: "friends-timetable", params: { friendID } });
    }
  }
};
</script>

<style lang="scss">
.add-friend {
  position: absolute !important;
  bottom: 5.5rem;
  right: 1.5rem;
}
</style>
