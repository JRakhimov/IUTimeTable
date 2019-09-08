<template>
  <v-card class="px-4 py-4 subject">
    <v-layout align-center>
      <v-flex class="name" :style="nameStyle" @click="showSnackbar(lessonInfo.subjectName)">
        <span
          class="unselectable"
        >{{ lessonInfo.subjectNameShort }} ({{ lessonInfo.sectionNumber }})</span>
      </v-flex>

      <v-flex class="times" offset-8>
        <p class="start">{{ timeLength(lessonInfo.startTime) }}</p>

        <p class="end">{{ timeLength(lessonInfo.endTime) }}</p>
      </v-flex>
    </v-layout>

    <v-layout class="footer" mt-2 pt-2>
      <v-flex class="room">
        <span>Room: {{ lessonInfo.room }}</span>
      </v-flex>

      <v-flex class="teacher">
        <span
          @click="showSnackbar(lessonInfo.teacherName)"
        >Teacher: {{ lessonInfo.teacherNameShort }}</span>
      </v-flex>
    </v-layout>

    <v-snackbar v-model="snackbarShown" :timeout="2200">
      {{ snackbarText }}
      <v-btn color="#F7C951" text @click="snackbarShown = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";

import UtilsMixin from "../mixins/utils";
import { LessonInfo } from "../types";

@Component
export default class Lesson extends Mixins(UtilsMixin) {
  @Prop({
    default: {
      day: "",
      room: "",
      sectionNumber: 0,

      endTime: "",
      startTime: "",

      subjectName: "",
      subjectNameShort: "",

      teacherName: "",
      teacherNameShort: ""
    }
  })
  readonly lessonInfo!: LessonInfo;

  get nameStyle() {
    const rgb = this.hexToRgb(this.color);

    if (rgb) {
      const { r, g, b } = rgb;
      return {
        "background-color": this.color,
        "box-shadow": `0 6px 18px 0 rgba(${r}, ${g}, ${b}, 0.8)`
      };
    }

    return {
      "background-color": this.color
    };
  }

  private snackbarShown = false;
  private snackbarText = "";

  showSnackbar(snackbarText: string) {
    snackbarText = snackbarText.replace("&amp;", "");

    if (this.snackbarShown) {
      setTimeout(() => {
        this.snackbarShown = false;
      }, 200);

      setTimeout(() => {
        this.snackbarShown = true;
        this.snackbarText = snackbarText;
      }, 200);

      return;
    }

    this.snackbarText = snackbarText;
    this.snackbarShown = true;
  }

  timeLength(time: string) {
    let [a, b] = time.split(":");

    a = a.length <= 1 ? `0${a}` : a;

    return `${a}:${b}`;
  }
}
</script>

<style lang="scss">
.subject {
  position: relative;
  min-height: 100px;

  .name {
    position: absolute;
    top: -15px;
    padding: 20px 24px;
    text-align: center;
    border-radius: 8px;
    color: #ffffff;
    max-width: 230px;
    cursor: pointer;

    span {
      font-size: 19px;
    }
  }

  .times {
    p {
      margin: 0;
    }

    .start {
      font-size: 28px;
      font-weight: bold;
      color: #666666;
      text-align: right;
    }

    .end {
      font-size: 24px;
      color: #9b9b9b;
      text-align: right;
      margin-top: -4px;
    }
  }

  .footer {
    border-top: 1px solid darken(#f6f6f6, 3);
    color: #9b9b9b;

    .room {
      text-align: left;
    }

    .teacher {
      text-align: right;
      span {
        cursor: pointer;
      }
    }
  }
}
</style>
