<template>
  <v-tabs
    :color="color"
    v-model="activeTab"
    slider-color="#F7C951"
    class="w-100 shadow-top"
    grow
    dark
  >
    <v-tab v-for="(tab, index) in tabs" :key="index" ripple>{{ tab.name }}</v-tab>

    <v-tab-item v-for="(tab, index) in tabs" :key="index">
      <v-container style="height: 100vh">
        <v-layout justify-center>
          <v-progress-circular v-if="!loaded" :color="color" :size="60" :width="5" indeterminate></v-progress-circular>
        </v-layout>

        <div v-if="tab.timetable">
          <v-layout v-for="(subject, index) in tab.timetable" :key="index" justify-center>
            <v-flex md6>
              <Subject :subjectInfo="subject"/>
            </v-flex>
          </v-layout>
        </div>

        <v-layout class="no-timetable mt-5" v-else column align-center>
          <img src="../assets/sticker.webp" alt>

          <h3 class="mt-2">You don't have lessons today🎉</h3>
        </v-layout>
      </v-container>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import Subject from "@/components/Subject.vue";
import { utils } from "../mixins/utils";

export default {
  name: "Timetable",
  mixins: [utils],

  components: {
    Subject
  },

  data() {
    return {
      activeTab: null,
      loaded: false,
      tabs: [
        {
          name: "Monday",
          timetable: []
        },
        {
          name: "Tuesday",
          timetable: []
        },
        {
          name: "Wednesday",
          timetable: []
        },
        {
          name: "Thursday",
          timetable: []
        },
        {
          name: "Friday",
          timetable: []
        }
      ]
    };
  },

  computed: {
    timetable() {
      if (this.$route.name === "timetable") {
        this.loaded = true;

        const { studentID, timetable } = this.$store.state.profile;

        if (!timetable || Object.keys(timetable).length === 0) {
          this.$store.dispatch("fetchProfile", studentID);
        }

        return this.$store.state.profile.timetable;
      }

      if (this.$route.name === "friends-timetable") {
        this.loaded = true;

        const { friendID } = this.$route.params;

        return this.$store.getters.frinedsTimetable(friendID);
      }

      this.loaded = true;

      return {};
    }
  },

  watch: {
    timetable() {
      for (const tab of this.tabs) {
        tab.timetable = this.timetable[tab.name];
      }
    }
  },

  mounted() {
    for (const tab of this.tabs) {
      tab.timetable = this.timetable[tab.name] || undefined;
    }
  }
};
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
