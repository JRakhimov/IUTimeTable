<template>
  <pull-to
    :is-bottom-bounce="bottomBounceActive"
    :is-top-bounce="topBounceActive"
    :top-load-method="refresh"
    :top-config="pullToConfig"
    style="width: 100%;"
  >
    <v-container>
      <v-layout justify-center>
        <GroupmatesSkeleton v-if="!groupmates || updating" />

        <v-flex v-if="groupmates && !updating" md6>
          <v-card class="pr-3" ref="groupmatesCard">
            <v-list two-line>
              <template v-for="(groupmate, index) in groupmatesList">
                <v-subheader v-if="groupmate.header" :key="groupmate.header">{{ groupmate.header }}</v-subheader>

                <v-divider v-else-if="groupmate.divider" :key="index" :inset="groupmate.inset"></v-divider>

                <v-list-tile v-else :key="groupmate.studentID" avatar>
                  <v-list-tile-avatar>
                    <v-avatar :color="groupmate.color" size="40">
                      <span class="white--text headline">{{ groupmate.oneNameLetter }}</span>
                    </v-avatar>
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title v-html="groupmate.fullName"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="groupmate.studentID"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </pull-to>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import VueContentLoading from "vue-content-loading";
import PullTo from "vue-pull-to";

import GroupmatesSkeleton from "../components/GroupmatesSkeleton.vue";
import { Student, ExtendedStudent } from "../types";
import GroupmatesModule from "../store/groupmates";
import ProfileModule from "../store/profile";
import UtilsMixin from "../mixins/utils";
import store from "../store";

const ProfileState = getModule(ProfileModule, store);
const GroupmatesState = getModule(GroupmatesModule, store);

type GroupmatesHeader = { header: string };
type GroupmatesDivider = { divider: boolean; inset: boolean };

@Component({ components: { VueContentLoading, PullTo } })
export default class Groupmates extends Mixins(UtilsMixin) {
  private groupmates: ExtendedStudent[] = [];
  private bottomBounceActive = false;
  private topBounceActive = true;
  private updating = false;

  private pullToConfig = {
    pullText: "Update list of groupmates 👨‍👩‍👧‍👦", // The text is displayed when you pull down
    triggerText: "You can let go 🚀", // The text that appears when the trigger distance is pulled down
    loadingText: "Updating", // The text in the load
    doneText: "Updated 🎉", // Load the finished text
    failText: "Error", // Load failed text
    loadedStayTime: 500, // Time to stay after loading ms
    stayDistance: 60, // Trigger the distance after the refresh
    triggerDistance: 75 // Pull down the trigger to trigger the distance
  };

  private clock = "";
  private clocks = [
    "🕐",
    "🕑",
    "🕒",
    "🕓",
    "🕔",
    "🕕",
    "🕖",
    "🕗",
    "🕘",
    "🕙",
    "🕚",
    "🕛"
  ];

  get groupmatesList() {
    const tmpGroupmates: Array<
      GroupmatesHeader | ExtendedStudent | GroupmatesDivider
    > = [{ header: ProfileState.getProfile.groupName }];

    this.groupmates.forEach((groupmate: ExtendedStudent, index: number) => {
      tmpGroupmates.push(groupmate);

      if (this.groupmates.length !== index + 1) {
        tmpGroupmates.push({ divider: true, inset: true });
      }
    });

    return tmpGroupmates;
  }

  clockPreloader() {
    if (!this.updating) {
      return;
    }

    const index = Math.floor((Date.now() / 100) % this.clocks.length);
    this.clock = this.clocks[index];

    setTimeout(this.clockPreloader, 50);

    this.pullToConfig.loadingText = "Updating " + this.clock;
  }

  async refresh(loaded) {
    const { groupName } = this.$store.state.profile;

    this.updating = true;
    this.clockPreloader();

    await this.$store.dispatch("fetchGroupmates", groupName);

    setTimeout(() => {
      this.groupmates = this.$store.state.groupmates;
      this.updating = false;
      loaded("done");
    }, 2000);
  }

  handleScroll() {
    if (window.scrollY >= 0 && window.scrollY <= 20) {
      this.topBounceActive = true;
    } else {
      this.topBounceActive = false;
    }

    if (window.scrollY >= window.innerHeight - 120) {
      this.bottomBounceActive = true;
    } else {
      this.bottomBounceActive = false;
    }
  }

  async mounted() {
    window.addEventListener("scroll", this.handleScroll);

    const { groupName } = ProfileState.getProfile;
    const { groupmates } = GroupmatesState;

    if (groupName && !groupmates) {
      await this.$store.dispatch("fetchGroupmates", groupName);
    }

    if (!groupmates) {
      setTimeout(() => (this.groupmates = groupmates), 2000);
      return;
    }

    this.groupmates = groupmates;
  }

  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
}
</script>
