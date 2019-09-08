<template>
  <v-layout column>
    <vue-content-loading
      v-for="(x, index) in skeletonsAmount"
      style="height: 150px;"
      :class="{ 'mt-3': index !== 0}"
      :key="index"
      :height="150"
    >
      <rect x="15" y="0" rx="10" ry="10" width="100" height="60" />

      <rect x="315" y="30" rx="4" ry="4" width="70" height="24" />
      <rect x="325" y="65" rx="4" ry="4" width="60" height="20" />

      <rect x="5" y="105" rx="2" ry="2" width="380" height="1" />

      <rect x="5" y="120" rx="4" ry="4" width="70" height="20" />
      <rect x="325" y="120" rx="4" ry="4" width="60" height="20" />
    </vue-content-loading>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueContentLoading from "vue-content-loading";

@Component({ components: { VueContentLoading } })
export default class TimetableSkeleton extends Vue {
  get skeletonsAmount() {
    return Math.floor(window.innerHeight / 150) - 1;
  }
}
</script>
