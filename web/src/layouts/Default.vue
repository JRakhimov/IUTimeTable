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
          <router-view/>
        </transition>
      </v-layout>

      <v-layout>
        <v-bottom-nav :active="bottomNav" :color="color" :value="true" :app="true" fixed shift dark>
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
    </v-container>
  </v-app>
</template>

<script>
import { utils } from "../mixins/utils";

export default {
  name: "Default",
  mixins: [utils],

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
  }
};
</script>

<style lang="scss">
.container.fluid {
  padding: 0;
}

.v-toolbar {
  z-index: 1;
}
</style>
