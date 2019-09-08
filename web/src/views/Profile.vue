<template>
  <v-container class="mt-3">
    <v-layout justify-center>
      <ProfileSkeleton class="mt-2" v-if="!isLoaded" />

      <v-flex v-else md6>
        <div class="profile">
          <div class="j-flex justify-center">
            <div>
              <v-layout
                class="top py-0 px-sm-8 px-md-10"
                :style="profileTopStyle"
                align-center
                justify-center
                column
              >
                <v-avatar color="white mb-2" size="70">
                  <span class="headline" :style="{ color }">{{ profile.fullNameLetter }}</span>
                </v-avatar>

                <h2 class="student-name">{{ profile.fullName }}</h2>
              </v-layout>
            </div>
          </div>

          <v-card class="pt-8">
            <v-layout class="body py-3 px-4" column>
              <v-layout>
                <v-flex class="icon" align-self-center xs2 sm1 md2>
                  <v-icon :style="{ color }">group</v-icon>
                </v-flex>

                <v-flex class="title" align-self-center md10>
                  <p>{{ profile.groupName }}</p>
                  <p class="sub-title">Group</p>
                </v-flex>
              </v-layout>

              <v-divider class="my-2"></v-divider>

              <v-layout>
                <v-flex class="icon" align-self-center xs2 sm1 md2>
                  <v-icon :style="{ color }">fingerprint</v-icon>
                </v-flex>

                <v-flex class="title" align-self-center md10>
                  <p>{{ profile.studentID }}</p>
                  <p class="sub-title">StudentID</p>
                </v-flex>
              </v-layout>

              <v-divider class="my-2"></v-divider>

              <v-layout>
                <v-flex class="icon" align-self-center xs2 sm1 md2>
                  <v-icon :style="{ color }">clear_all</v-icon>
                </v-flex>

                <v-flex class="title" align-self-center md10>
                  <p>{{ profile.stage }}</p>
                  <p class="sub-title">Stage</p>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-card>
        </div>
      </v-flex>
    </v-layout>

    <v-fab-transition>
      <v-btn
        :style="profileTopStyle"
        class="j-fab"
        :color="color"
        v-show="isOnline"
        @click="logOut()"
        dark
        fab
      >
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>


<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import { ProfileModule, GroupmatesModule, FriendsModule } from "../store";
import VueOfflineMixin from "../mixins/vueOffline";
import UtilsMixin from "../mixins/utils";
import { Student } from "../types";

import ProfileSkeleton from "../components/skeletons/ProfileSkeleton.vue";

@Component({ components: { ProfileSkeleton } })
export default class ProfileView extends Mixins(UtilsMixin, VueOfflineMixin) {
  get profile() {
    return ProfileModule.getProfile;
  }

  get isLoaded() {
    return ProfileModule.getProfile.fullName.length;
  }

  get profileTopStyle() {
    const rgb = this.hexToRgb(this.color);

    if (rgb) {
      const { r, g, b } = rgb;
      return {
        "background-color": this.color,
        "box-shadow": `0 6px 18px 0 rgba(${r}, ${g}, ${b}, 0.8)`
      };
    }

    return {
      "background-color": this.color
    };
  }

  async logOut() {
    localStorage.removeItem("jwt");
    this.$router.replace({ name: "login" });

    await ProfileModule.clearProfile();
    await FriendsModule.clearFriends();
    await GroupmatesModule.clearGroupmates();
  }
}
</script>

<style lang="scss">
.profile {
  position: relative;

  .j-flex {
    position: relative;
    display: flex;
    z-index: 2;
  }

  .top {
    height: 200px;
    border-radius: 8px !important;
    padding-left: 15px;
    padding-right: 15px;

    .headline {
      font-weight: bold !important;
    }

    span {
      font-weight: bold;
    }

    .student-name {
      font-size: 2rem;
      text-align: center;
      color: #ffffff;
    }
  }

  .v-card {
    margin-top: -2rem;
  }

  .body {
    min-height: 270px;

    .icon {
      text-align: center;
      i {
        font-size: 1.6rem;
      }
    }

    .title {
      .sub-title {
        text-align: left;
        font-size: 0.85rem;
        color: #969696;
        font-weight: 400;
        margin-bottom: 0;
        margin-top: -10px;
      }

      p {
        text-align: left;
        font-size: 1.05rem;
        color: #484848;
        margin-bottom: 0;
        font-weight: 500;
      }
    }
  }
}
</style>
