<template>
  <pull-to :top-load-method="refresh" :top-config="pullToConfig" style="width: 100%;">
    <v-container>
      <v-layout justify-center>
        <GroupmatesSkeleton v-if="!groupmates || updating"/>

        <v-flex v-if="groupmates && !updating" md6>
          <v-card class="pr-3" ref="groupmatesCard">
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
  </pull-to>
</template>

<script>
import PullTo from "vue-pull-to";
import { utils } from "../mixins/utils";
import GroupmatesSkeleton from "../components/GroupmatesSkeleton";

export default {
  name: "Groupmates",
  mixins: [utils],
  components: { GroupmatesSkeleton, PullTo },

  data() {
    return {
      groupmates: null,
      updating: false,
      pullToConfig: {
        pullText: "Update list of groupmates 👨‍👩‍👧‍👦", // The text is displayed when you pull down
        triggerText: "You can let go 🚀", // The text that appears when the trigger distance is pulled down
        loadingText: "Updating", // The text in the load
        doneText: "Updated 🎉", // Load the finished text
        failText: "Error", // Load failed text
        loadedStayTime: 500, // Time to stay after loading ms
        stayDistance: 60, // Trigger the distance after the refresh
        triggerDistance: 75 // Pull down the trigger to trigger the distance
      },
      clock: "",
      clocks: [
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
      ]
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

  methods: {
    clockPreloader() {
      if (!this.updating) {
        return;
      }

      this.clock = this.clocks[
        Math.floor((Date.now() / 100) % this.clocks.length)
      ];

      setTimeout(this.clockPreloader, 50);

      this.pullToConfig.loadingText = "Updating " + this.clock;
    },

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
