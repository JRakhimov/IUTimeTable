<template>
  <v-container>
    <v-layout justify-center>
      <GroupmatesSkeleton v-if="!groupmates"/>

      <v-flex v-if="groupmates" md6>
        <v-card class="pr-3">
          <v-list two-line>
            <template v-for="(groupmate, index) in groupmatesList">
              <v-subheader v-if="groupmate.header" :key="groupmate.header">
                {{
                groupmate.header
                }}
              </v-subheader>

              <v-divider v-else-if="groupmate.divider" :key="index" :inset="groupmate.inset"></v-divider>

              <v-list-tile v-else :key="groupmate.studentID" avatar>
                <v-list-tile-avatar>
                  <v-avatar :color="groupmate.color" size="40">
                    <span class="white--text headline">
                      {{
                      groupmate.oneNameLetter
                      }}
                    </span>
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
</template>

<script>
import { utils } from "../mixins/utils";
import GroupmatesSkeleton from "../components/GroupmatesSkeleton";

export default {
  name: "Groupmates",
  mixins: [utils],
  components: { GroupmatesSkeleton },

  data() {
    return {
      groupmates: null
    };
  },

  computed: {
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
  },

  async mounted() {
    const { groupName } = this.$store.state.profile;
    const { groupmates } = this.$store.state;

    if (groupName && !groupmates) {
      await this.$store.dispatch("fetchGroupmates", groupName);
    }

    if (!groupmates) {
      setTimeout(() => (this.groupmates = this.$store.state.groupmates), 2000);
      return;
    }

    this.groupmates = this.$store.state.groupmates;
  }
};
</script>
