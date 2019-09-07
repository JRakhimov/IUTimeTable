<template>
  <v-container class="mb-9 mt-2">
    <v-layout justify-center>
      <GroupmatesSkeleton v-if="!groupmates || updating" />

      <v-flex v-if="groupmates && !updating" md6>
        <v-card class="pr-3" ref="groupmatesCard">
          <v-list two-line>
            <template v-for="(groupmate, index) in groupmatesList">
              <v-subheader v-if="groupmate.header" :key="groupmate.header">{{ groupmate.header }}</v-subheader>

              <v-divider v-else-if="groupmate.divider" :key="index" :inset="groupmate.inset"></v-divider>

              <v-list-item v-else :key="groupmate.studentID" avatar>
                <v-list-item-avatar>
                  <v-avatar :color="groupmate.color" size="40">
                    <span class="white--text headline">{{ groupmate.oneNameLetter }}</span>
                  </v-avatar>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-html="groupmate.fullName"></v-list-item-title>
                  <v-list-item-subtitle v-html="groupmate.studentID"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>

    <v-fab-transition>
      <v-btn
        v-show="!updating && isOnline"
        :style="colorStyles()"
        @click="refresh()"
        :color="color"
        class="j-fab"
        dark
        fab
      >
        <v-icon>cached</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import GroupmatesSkeleton from "../components/skeletons/GroupmatesSkeleton.vue";

import { Student, ExtendedStudent } from "../types";
import GroupmatesModule from "../store/groupmates";
import VueOfflineMixin from "../mixins/vueOffline";
import ProfileModule from "../store/profile";
import UtilsMixin from "../mixins/utils";
import store from "../store";

const ProfileState = getModule(ProfileModule, store);
const GroupmatesState = getModule(GroupmatesModule, store);

type GroupmatesHeader = { header: string };
type GroupmatesDivider = { divider: boolean; inset: boolean };

@Component({ components: { GroupmatesSkeleton } })
export default class Groupmates extends Mixins(UtilsMixin, VueOfflineMixin) {
  private groupmates: ExtendedStudent[] = [];
  private updating = false;

  get groupmatesList() {
    const tmpGroupmates: Array<
      GroupmatesHeader | ExtendedStudent | GroupmatesDivider
    > = [{ header: ProfileState.getProfile.groupName }];

    this.groupmates.forEach((groupmate: ExtendedStudent, index: number) => {
      tmpGroupmates.push(groupmate);

      if (this.groupmates.length !== index + 1) {
        3;
        tmpGroupmates.push({ divider: true, inset: true });
      }
    });

    return tmpGroupmates;
  }

  async refresh() {
    this.updating = true;

    const { groupName } = ProfileState.getProfile;
    await GroupmatesState.fetchGroupmates(groupName);

    setTimeout(() => {
      this.groupmates = GroupmatesState.getGroupmates;
      this.updating = false;
    }, 2000);
  }

  async mounted() {
    const { groupName } = ProfileState.getProfile;
    let groupmates = GroupmatesState.getGroupmates;

    if (groupName && !groupmates.length) {
      this.updating = true;

      await GroupmatesState.fetchGroupmates(groupName);

      setTimeout(() => {
        this.groupmates = GroupmatesState.getGroupmates;
        this.updating = false;
      }, 2000);

      return;
    }

    this.groupmates = groupmates;
  }
}
</script>
