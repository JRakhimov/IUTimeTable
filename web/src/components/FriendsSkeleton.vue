<template>
  <v-layout column>
    <vue-content-loading
      style="height: 70px"
      v-for="(x, index) in skeletonsAmount"
      :key="index"
      :height="70"
    >
      <rect
        v-if="index === 0"
        x="0"
        y="0"
        rx="4"
        ry="4"
        width="120"
        height="8"
      />

      <circle cx="30" cy="45" r="25" />
      <rect x="70" y="25" rx="4" ry="4" width="120" height="13" />

      <rect x="70" y="45" rx="4" ry="4" width="60" height="8" />
      <circle cx="140" cy="49" r="3" />
      <rect x="150" y="45" rx="4" ry="4" width="60" height="8" />

      <circle cx="380" cy="35" r="10" />

      <rect
        v-if="index !== skeletonsAmount - 1"
        x="70"
        y="69"
        rx="4"
        ry="4"
        :width="skeletonWidth"
        height="2"
      />
    </vue-content-loading>
  </v-layout>
</template>

<script>
import VueContentLoading from "vue-content-loading";

export default {
  name: "FriendsSkeleton",

  components: {
    VueContentLoading
  },

  computed: {
    skeletonsAmount() {
      return Math.floor(window.innerHeight / 70) - 2;
    },

    skeletonWidth() {
      return Math.floor(window.innerWidth * 0.8);
    }
  }
};
</script>
