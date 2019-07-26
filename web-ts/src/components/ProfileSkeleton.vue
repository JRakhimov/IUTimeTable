<template>
  <v-layout column>
    <vue-content-loading style="height: 400px" :height="400">
      <circle cx="220" cy="35" r="35" />

      <rect x="120" y="85" rx="4" ry="4" width="200" height="20" />

      <circle cx="40" cy="170" r="20" />
      <rect x="75" y="150" rx="4" ry="4" width="120" height="13" />
      <rect x="75" y="170" rx="4" ry="4" width="60" height="8" />

      <rect x="10" y="205" rx="4" ry="4" width="500" height="2" />

      <circle cx="40" cy="245" r="20" />
      <rect x="75" y="225" rx="4" ry="4" width="120" height="13" />
      <rect x="75" y="245" rx="4" ry="4" width="60" height="8" />

      <rect x="10" y="280" rx="4" ry="4" width="500" height="2" />

      <circle cx="40" cy="320" r="20" />
      <rect x="75" y="300" rx="4" ry="4" width="120" height="13" />
      <rect x="75" y="320" rx="4" ry="4" width="60" height="8" />

      <rect x="310" y="350" rx="4" ry="4" width="90" height="27" />
    </vue-content-loading>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueContentLoading from "vue-content-loading";

@Component({ components: { VueContentLoading } })
export default class ProfileSkeleton extends Vue {}
</script>
