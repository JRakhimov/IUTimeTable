<template>
  <v-app>
    <v-dialog v-model="updateDialogState" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Update found</v-card-title>
        <v-card-text>New version of the application was found, please update it to have the latest changes.</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn :color="color" text dark @click="updateServiceWorker()">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container class="pb-5" fluid>
      <v-layout>
        <v-toolbar :color="color" dark>
          <v-toolbar-title class="unselectable">IUTimeTable</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon color="white">
            <v-icon>help</v-icon>
          </v-btn>
        </v-toolbar>
      </v-layout>

      <v-layout>
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </v-layout>

      <v-layout>
        <v-bottom-navigation
          :background-color="color"
          :value="bottomNav"
          :app="true"
          fixed
          shift
          dark
          grow
        >
          <v-btn value="timetable" @click="changeRoute('timetable')" dark>
            <span>Timetable</span>
            <v-icon>chrome_reader_mode</v-icon>
          </v-btn>

          <v-btn value="groupmates" @click="changeRoute('groupmates')" dark>
            <span>Groupmates</span>
            <v-icon>people_outline</v-icon>
          </v-btn>

          <v-btn value="friends" @click="changeRoute('friends')" dark>
            <span>Friends</span>
            <v-icon>group</v-icon>
          </v-btn>

          <v-btn value="profile" @click="changeRoute('profile')" dark>
            <span>Profile</span>
            <v-icon>face</v-icon>
          </v-btn>
        </v-bottom-navigation>
      </v-layout>

      <v-snackbar v-model="snackbar" :top="true" :timeout="4000">
        {{ snackbarText }}
        <v-btn :color="color" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import { GeneralModule, ProfileModule } from "../store";
import VueOfflineMixin from "../mixins/vueOffline";
import UtilsMixin from "../mixins/utils";

@Component
export default class DefaultLayout extends Mixins(UtilsMixin, VueOfflineMixin) {
  private snackbar: boolean = false;
  private snackbarText: string = "";

  get bottomNav() {
    return this.$route.name === "friends-timetable"
      ? "friends"
      : this.$route.name;
  }

  get updateDialogState() {
    return GeneralModule.getShowUpdateDialogState;
  }

  updateServiceWorker() {
    ProfileModule.clearTimetable();
    window.location.reload(true);
  }

  changeRoute(to: string) {
    this.$router.replace({ name: to });
  }

  mounted() {
    this.$on("offline", () => {
      this.snackbarText = "You are offline ☹️";
      this.snackbar = true;
    });

    this.$on("online", () => {
      this.snackbarText = "You are online 😎️";
      this.snackbar = true;
    });

    if (this.isOffline) {
      this.snackbarText = "You are offline ☹️";
      this.snackbar = true;
    }
  }
}
</script>

<style lang="scss">
// TODO: Check style \./
.vue-pull-to-wrapper > .action-block > .default-text {
  color: rgba(0, 0, 0, 0.54);
  margin-bottom: 0;
  font-weight: 500;
}

.v-tabs-bar.v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-tabs-bar--show-arrows):not(.v-slide-group--has-affixes)
  .v-slide-group__prev {
  display: none;
}

.container.container--fluid {
  padding: 0;
}

.v-toolbar {
  z-index: 1;
}
</style>
