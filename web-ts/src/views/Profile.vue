<template>
  <v-container>
    <v-layout justify-center>
      <ProfileSkeleton class="mt-2" v-if="!isLoaded" />

      <v-flex v-if="isLoaded" md6>
        <v-card>
          <v-layout
            class="profile-top elevation-3 pt-5"
            :style="{ backgroundColor: color }"
            align-center
            column
          >
            <v-avatar color="white mb-2" size="70">
              <span class="headline" :style="{ color: color }">
                {{
                profile.fullNameLetter
                }}
              </span>
            </v-avatar>

            <h2 class="student-name">{{ profile.fullName }}</h2>
          </v-layout>

          <v-layout class="profile-body py-3 px-4" column>
            <v-layout>
              <v-flex class="icon" align-self-center md1 xs2>
                <v-icon :style="{ color: color }">group</v-icon>
              </v-flex>

              <v-flex class="title" md6>
                <p>{{ profile.groupName }}</p>
                <p class="sub-title">Group</p>
              </v-flex>
            </v-layout>

            <v-divider class="my-2"></v-divider>

            <v-layout>
              <v-flex class="icon" align-self-center md1 xs2>
                <v-icon :style="{ color: color }">fingerprint</v-icon>
              </v-flex>

              <v-flex class="title" md6>
                <p>{{ profile.studentID }}</p>
                <p class="sub-title">StudentID</p>
              </v-flex>
            </v-layout>

            <v-divider class="my-2"></v-divider>

            <v-layout>
              <v-flex class="icon" align-self-center md1 xs2>
                <v-icon :style="{ color: color }">clear_all</v-icon>
              </v-flex>

              <v-flex class="title" md6>
                <p>{{ profile.stage }}</p>
                <p class="sub-title">Stage</p>
              </v-flex>
            </v-layout>

            <v-layout justify-end align-end>
              <v-btn v-if="isOnline" :color="color" @click="logOut()" dark>LOGOUT</v-btn>
            </v-layout>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import ProfileSkeleton from "../components/ProfileSkeleton.vue";

import VueOfflineMixin from "../mixins/vueOffline";
import GroupmatesModule from "../store/groupmates";
import ProfileModule from "../store/profile";
import FriendsModule from "../store/friends";
import UtilsMixin from "../mixins/utils";
import { Student } from "../types";
import store from "../store";

const Groupmates = getModule(GroupmatesModule, store);
const Profile = getModule(ProfileModule, store);
const Friends = getModule(FriendsModule, store);

@Component({ components: { ProfileSkeleton } })
export default class ProfileView extends Mixins(UtilsMixin, VueOfflineMixin) {
  get profile() {
    return Profile.getProfile;
  }

  get isLoaded() {
    return Profile.getProfile.fullName.length;
  }

  async logOut() {
    localStorage.removeItem("jwt");
    this.$router.replace({ name: "login" });

    await Profile.clearProfile();
    await Friends.clearFriends();
    await Groupmates.clearGroupmates();
  }
}
</script>

<style lang="scss">
.profile-top {
  height: 200px;

  span {
    font-weight: bold;
  }

  .student-name {
    font-size: 2rem;
    text-align: center;
    color: #ffffff;
  }
}

.profile-body {
  min-height: 270px;

  .icon {
    text-align: left;
    padding-left: 8px;

    i {
      font-size: 1.6rem;
    }
  }

  .title {
    .sub-title {
      text-align: left;
      font-size: 0.85rem;
      color: #969696;
      margin-bottom: 0;
      margin-top: -10px;
    }

    p {
      text-align: left;
      font-size: 1.05rem;
      color: #484848;
      margin-bottom: 0;
    }
  }
}
</style>
