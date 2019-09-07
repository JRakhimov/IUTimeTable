<template>
  <div class="w-100">
    <v-tabs
      :background-color="color"
      class="w-100 shadow-top"
      slider-color="#F7C951"
      v-model="activeTab"
      center-active
      grow
      dark
    >
      <v-tab v-for="(tab, index) in tabs" :key="index" ripple>{{ tab.name }}</v-tab>

      <v-tab-item v-for="(tab, index) in tabs" :key="index">
        <v-container class="pb-7">
          <v-layout justify-center>
            <TimetableSkeleton v-if="!isLoaded" />
          </v-layout>

          <div v-if="isLoaded && tab.timetable" style="min-height: 71vh;">
            <v-layout v-for="(lesson, index) in tab.timetable" :key="index" justify-center>
              <v-flex md6>
                <LessonView :lessonInfo="lesson" class="mt-4 mb-5" />
              </v-flex>
            </v-layout>
          </div>

          <v-layout class="no-timetable mt-5" v-if="isLoaded && !tab.timetable" column align-center>
            <img src="../assets/sticker.webp" alt />

            <h3 class="mt-2">You don't have lessons today 🎉</h3>
          </v-layout>
        </v-container>
      </v-tab-item>
    </v-tabs>

    <v-fab-transition>
      <v-btn
        v-show="isOnline && isLoaded"
        @click="updateTimetable()"
        :style="colorStyles()"
        class="j-fab"
        :color="color"
        dark
        fab
      >
        <v-icon>cached</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import VueOfflineMixin from "../mixins/vueOffline";
import { Student, TimeTable } from "../types";
import ProfileModule from "../store/profile";
import FriendsModule from "../store/friends";
import UtilsMixin from "../mixins/utils";
import store from "../store";

import LessonView from "../components/LessonView.vue";
import TimetableSkeleton from "../components/skeletons/TimetableSkeleton.vue";

const Friends = getModule(FriendsModule, store);
const Profile = getModule(ProfileModule, store);

type Tab = {
  name: string;
  timetable: TimeTable | {};
};

@Component({ components: { LessonView, TimetableSkeleton } })
export default class Timetable extends Mixins(UtilsMixin, VueOfflineMixin) {
  private activeTab: number = 0;
  private status = false;
  private tabs: Tab[] = [
    {
      name: "Monday",
      timetable: {}
    },
    {
      name: "Tuesday",
      timetable: {}
    },
    {
      name: "Wednesday",
      timetable: {}
    },
    {
      name: "Thursday",
      timetable: {}
    },
    {
      name: "Friday",
      timetable: {}
    }
  ];

  get isLoaded() {
    return Object.keys(this.timetable).length > 0;
  }

  get timetable(): Timetable | {} {
    if (this.$route.name === "timetable") {
      return Profile.getProfileTimetable;
    }

    if (this.$route.name === "friends-timetable") {
      const { friendID } = this.$route.params;

      return Friends.friendsTimetable(friendID);
    }

    return {};
  }

  private assignTimetableContent() {
    for (const tab of this.tabs) {
      tab.timetable = (this.timetable as any)[tab.name];
    }
  }

  @Watch("timetable")
  public onTimetableChanged() {
    this.assignTimetableContent();
  }

  public mounted() {
    this.assignTimetableContent();

    const currentDateTab = this.tabs.findIndex(tab =>
      tab.name.startsWith(new Date().toDateString().split(" ")[0])
    );

    this.activeTab = currentDateTab === -1 ? 0 : currentDateTab;
  }

  async updateTimetable() {
    Profile.clearTimetable();

    setTimeout(() => {
      Profile.fetchTimetable(Profile.getProfile.groupName);
    }, 2000);
  }
}
</script>

<style lang="scss">
.no-timetable {
  img {
    height: 256px;
    width: 256px;
  }
}

.w-100 {
  width: 100%;
}
</style>
