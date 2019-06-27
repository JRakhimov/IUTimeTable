<template>
  <v-card class="mb-3 subject">
    <v-layout class="px-3 py-3 mb-4" align-center>
      <v-flex class="mr-3 times" md3>
        <div class="start-time">{{ subjectInfo.startTime }}</div>

        <div class="end-time">{{ subjectInfo.endTime }}</div>
      </v-flex>

      <v-flex class="subject-name"
        >{{ subjectInfo.subjectName }} ({{ subjectInfo.sectionNumber }})</v-flex
      >
    </v-layout>

    <v-layout>
      <div class="subject-room" :style="{ backgroundColor: color }" md4>
        Room: {{ subjectInfo.room }}
      </div>
      <div class="subject-teacher" :style="{ backgroundColor: color }" md4>
        Teacher: {{ subjectInfo.teacherNameShort }}
      </div>
    </v-layout>
  </v-card>
</template>

<script>
import { utils } from "../mixins/utils";

export default {
  name: "Subject",
  mixins: [utils],

  props: {
    subjectInfo: {
      type: Object
    }
  }
};
</script>

<style lang="scss">
.subject {
  position: relative;

  .times {
    max-width: 100px;

    .start-time {
      text-align: center;
      font-size: 2rem;
    }

    .end-time {
      text-align: center;
      font-size: 1.5rem;
    }
  }

  .subject-name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .subject-room {
    text-align: center;
    padding: 4px 8px;
    color: white;
    border-radius: 0 3px 0 0;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .subject-teacher {
    bottom: 0;
    right: 0;
    text-align: center;
    padding: 4px 8px;
    color: white;
    border-radius: 3px 0 0 0;
    position: absolute;
  }
}
</style>
