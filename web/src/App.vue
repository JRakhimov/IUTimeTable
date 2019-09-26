<template>
  <div id="app">
    <v-app>
      <v-dialog v-model="updateDialogState" persistent max-width="300">
        <v-card>
          <v-card-title class="headline">Update found</v-card-title>
          <v-card-text>New version of the application was found, please update it to have the latest changes.</v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn :color="color" text dark @click="updateServiceWorker()">Update</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <transition name="fade" mode="out-in">
        <component :is="layout"></component>
      </transition>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import { ProfileModule, GeneralModule } from "./store";
import UtilsMixin from "./mixins/utils";

@Component
export default class App extends Mixins(UtilsMixin) {
  get layout() {
    return `${this.$route.meta.layout || "default"}-layout`;
  }

  get updateDialogState() {
    return GeneralModule.getShowUpdateDialogState;
  }

  updateServiceWorker() {
    ProfileModule.clearTimetable();
    window.location.reload(true);
  }
}
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

#app {
  background: #ffffff;
}

.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.j-fab {
  position: fixed !important;
  bottom: 5.5rem;
  right: 1.5rem;
}
</style>
