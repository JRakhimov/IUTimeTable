<template>
  <v-container>
    <v-layout justify-center>
      <v-progress-circular
        v-if="!groupmates.length"
        :color="color"
        :size="60"
        :width="5"
        indeterminate
      ></v-progress-circular>

      <v-flex v-if="groupmates.length" md6>
        <v-card class="pr-3">
          <v-list two-line>
            <template v-for="(groupmate, index) in groupmatesList">
              <v-subheader v-if="groupmate.header" :key="groupmate.header">{{
                groupmate.header
              }}</v-subheader>

              <v-divider
                v-else-if="groupmate.divider"
                :key="index"
                :inset="groupmate.inset"
              ></v-divider>

              <v-list-tile v-else :key="groupmate.studentID" avatar>
                <v-list-tile-avatar>
                  <v-avatar :color="groupmate.color" size="40">
                    <span class="white--text headline">{{
                      groupmate.oneNameLetter
                    }}</span>
                  </v-avatar>
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title
                    v-html="groupmate.fullName"
                  ></v-list-tile-title>
                  <v-list-tile-sub-title
                    v-html="groupmate.studentID"
                  ></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { utils } from "../mixins/utils";

export default {
  name: "Groupmates",
  mixins: [utils],

  computed: {
    groupmates() {
      const { groupName } = this.$store.state.profile;
      const { groupmates } = this.$store.state;

      if (groupName && !groupmates.length) {
        this.$store.dispatch("fetchGroupmates", groupName);
      }

      return this.$store.state.groupmates;
    },

    groupmatesList() {
      const tmpGroupmates = [{ header: this.$store.state.profile.groupName }];

      this.groupmates.forEach((groupmate, index) => {
        tmpGroupmates.push(groupmate);

        if (this.groupmates.length !== index + 1) {
          tmpGroupmates.push({ divider: true, inset: true });
        }
      });

      return tmpGroupmates;
    }
  }
};
</script>
