<template>
  <v-app>
    <v-container class="pb-5" fluid>
      <v-layout>
        <v-toolbar :color="color" dark>
          <v-toolbar-title>IUTimeTable</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat icon color="white">
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
        <v-bottom-nav
          :active="bottomNav"
          :color="color"
          :value="true"
          :app="true"
          fixed
          shift
          dark
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
        </v-bottom-nav>
      </v-layout>

      <v-snackbar v-model="snackbar" :top="true" :timeout="4000">
        {{ snackbarText }}
        <v-btn :color="color" flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-container>
  </v-app>
</template>

<script>
import { utils } from "../mixins/utils";
import { VueOfflineMixin } from "vue-offline";

export default {
  name: "Default",
  mixins: [utils, VueOfflineMixin],

  data() {
    return {
      snackbar: false,
      snackbarText: null
    };
  },

  computed: {
    bottomNav() {
      return this.$route.name === "friends-timetable"
        ? "friends"
        : this.$route.name;
    }
  },

  methods: {
    changeRoute(to) {
      this.$router.replace({ name: to });
    }
  },

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
};
</script>

<style lang="scss">
.scroll-container {
  // overflow-y: hidden !important;
}

.vue-pull-to-wrapper > .action-block > .default-text {
  color: rgba(0, 0, 0, 0.54);
  margin-bottom: 0;
  font-weight: 500;
}

.container.fluid {
  padding: 0;
}

.v-toolbar {
  z-index: 1;
}
</style>
