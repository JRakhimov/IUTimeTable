<template>
  <v-tabs
    :color="color"
    v-model="activeTab"
    slider-color="#F7C951"
    class="w-100 shadow-top"
    grow
    dark
  >
    <v-tab v-for="(tab, index) in tabs" :key="index" ripple>
      {{
      tab.name
      }}
    </v-tab>

    <v-tab-item v-for="(tab, index) in tabs" :key="index">
      <v-container style="height: 100vh">
        <v-layout justify-center>
          <v-progress-circular v-if="!loaded" :color="color" :size="60" :width="5" indeterminate></v-progress-circular>
        </v-layout>

        <div v-if="tab.timetable">
          <v-layout v-for="(subject, index) in tab.timetable" :key="index" justify-center>
            <v-flex md6>
              <Subject :subjectInfo="subject" />
            </v-flex>
          </v-layout>
        </div>

        <v-layout class="no-timetable mt-5" v-else column align-center>
          <img src="../assets/sticker.webp" alt />

          <h3 class="mt-2">You don't have lessons today🎉</h3>
        </v-layout>
      </v-container>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import { Student, TimeTable } from "../types";
import ProfileModule from "../store/profile";
import FriendsModule from "../store/friends";
import UtilsMixin from "../mixins/utils";
import store from "../store";

const Friends = getModule(FriendsModule, store);
const Profile = getModule(ProfileModule, store);

type Tab = {
  name: string;
  timetable: TimeTable | {};
};

@Component({ components: {} })
export default class Timetable extends Mixins(UtilsMixin) {
  private activeTab: Tab = {
    name: "Monday",
    timetable: {}
  };
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

  get loaded() {
    return Object.keys(this.timetable).length !== 0;
  }

  get timetable(): Timetable | {} {
    if (this.$route.name === "timetable") {
      return Profile.getProfile;
    }

    if (this.$route.name === "friends-timetable") {
      const { friendID } = this.$route.params;

      return Friends.friendsTimetable(friendID);
    }

    return {};
  }

  @Watch("timetable")
  public onTimetableChanged() {
    for (const tab of this.tabs) {
      // FIXME: Element implicitly has an 'any' type
      // because expression of type 'string' can't be
      // used to index type 'TimeTable'
      tab.timetable = (this.timetable as any)[tab.name];
    }
  }

  public mounted() {
    for (const tab of this.tabs) {
      // FIXME: Element implicitly has an 'any' type
      // because expression of type 'string' can't be
      // used to index type 'TimeTable'
      tab.timetable = (this.timetable as any)[tab.name];
    }
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
