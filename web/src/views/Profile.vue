<template>
  <v-container>
    <v-layout justify-center>
      <v-progress-circular
        v-if="!profile.fullName"
        :color="color"
        :size="60"
        :width="5"
        indeterminate
      ></v-progress-circular>

      <v-flex v-if="profile.fullName" md6>
        <v-card>
          <v-layout
            class="profile-top elevation-3 pt-5"
            :style="{ backgroundColor: color }"
            align-center
            column
          >
            <v-avatar color="white mb-2" size="70">
              <span class="headline" :style="{ color: color }">{{
                profile.fullNameLetter
              }}</span>
            </v-avatar>

            <h2 class="student-name">{{ profile.fullName }}</h2>
          </v-layout>

          <v-layout class="profile-body py-3 px-3" column>
            <v-layout align-center>
              <v-flex class="icon" md1 xs2>
                <v-icon :style="{ color: color }">group</v-icon>
              </v-flex>

              <v-flex class="title" md6>
                <p>{{ profile.groupName }}</p>
                <p class="sub-title mt-1">Group</p>
              </v-flex>
            </v-layout>

            <v-divider class="my-2"></v-divider>

            <v-layout align-center>
              <v-flex class="icon" md1 xs2>
                <v-icon :style="{ color: color }">fingerprint</v-icon>
              </v-flex>

              <v-flex class="title" md6>
                <p>{{ profile.studentID }}</p>
                <p class="sub-title mt-1">StudentID</p>
              </v-flex>
            </v-layout>

            <v-divider class="my-2"></v-divider>

            <v-layout align-center>
              <v-flex class="icon" md1 xs2>
                <v-icon :style="{ color: color }">clear_all</v-icon>
              </v-flex>

              <v-flex class="title" md6>
                <p>{{ profile.stage }}</p>
                <p class="sub-title mt-1">Stage</p>
              </v-flex>
            </v-layout>

            <!-- <v-divider></v-divider> -->

            <v-layout justify-end align-end>
              <v-btn v-if="isOnline" :color="color" @click="logOut()" dark
                >LOGOUT</v-btn
              >
            </v-layout>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { utils } from "../mixins/utils";
import { VueOfflineMixin } from "vue-offline";

export default {
  name: "Profile",
  mixins: [utils, VueOfflineMixin],

  computed: {
    profile() {
      return this.$store.state.profile;
    }
  },

  methods: {
    async logOut() {
      localStorage.removeItem("jwt");
      this.$router.replace({ name: "login" });

      await this.$store.commit("clearProfile");
      await this.$store.commit("clearFriends");
      await this.$store.commit("clearGroupmates");
    }
  }
};
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
  height: 270px;

  .icon i {
    font-size: 2rem;
  }

  .title {
    .sub-title {
      text-align: left;
      font-size: 1rem;
      color: #969696;
      margin-bottom: 0;
    }

    p {
      text-align: left;
      font-size: 1.2rem;
      color: #484848;
      margin-bottom: 0;
    }
  }
}
</style>
