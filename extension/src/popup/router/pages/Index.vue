<template>
  <div class="container">
    <div
      class="indecator"
      :class="{ 'not-found': indecatorNotFound, 'pending': indecatorPending, 'info': indecatorInfo }"
    >
      <h1>
        {{ indecatorText }}
        <Preloader v-if="showPreloader" />
      </h1>
    </div>

    <div v-if="parsedData.groupName" class="found-timeTable">
      <h2>{{ parsedData.groupName }}</h2>

      <div v-for="(day, index) in timeTableDays" :key="index" class="day">
        <h3 class="day-name">{{ day.name }}:</h3>
        <h3
          class="day-subjects"
        >{{ day.subjects > 1 ? `${day.subjects} subjects` : `${day.subjects} subject`}}</h3>
      </div>
    </div>

    <div v-if="parsedData.groupName" class="parse-button">
      <button @click="sendToBackend" :disabled="indecatorPending || disableButton">GO 🚀</button>
    </div>
  </div>
</template>

<script>
import Preloader from "../../components/preloader.vue";
import EdupageParser from "edupage-parser";

export default {
  name: "Index",

  components: {
    Preloader
  },

  data() {
    return {
      indecatorText: "Pending",
      indecatorNotFound: false,
      indecatorPending: true,
      indecatorInfo: false,

      showPreloader: true,
      disableButton: false,

      showInfo: false,
      isTeacher: false,

      parsedData: {
        groupName: "",
        timeTable: {}
      }
    };
  },

  computed: {
    timeTableDays() {
      const days = [];

      for (const dayName in this.parsedData.timeTable) {
        if (this.parsedData.timeTable.hasOwnProperty(dayName)) {
          const subjects = this.parsedData.timeTable[dayName];

          days.push({ name: dayName, subjects: subjects.length });
        }
      }

      return days;
    }
  },

  methods: {
    sendToBackend() {
      this.indecatorText = "Sending";
      this.indecatorPending = true;
      this.showPreloader = true;
      this.disableButton = true;

      setTimeout(() => {
        this.indecatorPending = false;
        this.showPreloader = false;

        this.indecatorText = "Sent 🎉";
        this.indecatorInfo = true;
      }, 2000);

      setTimeout(() => {
        this.disableButton = false;
        this.indecatorInfo = false;
        this.indecatorText = "Timetable found 🔥";
      }, 3500);
    }
  },

  mounted() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        "getSVG",
        ({ isEdupagePage, svg }) => {
          setTimeout(() => {
            if (isEdupagePage) {
              if (svg) {
                const edupageParser = new EdupageParser(svg);

                this.parsedData = edupageParser.parseTimetable();

                this.showPreloader = false;
                this.indecatorPending = false;

                this.indecatorText = "Timetable found 🔥";
              } else {
                this.showPreloader = false;
                this.indecatorPending = false;

                this.indecatorText = "Not found 😥";
                this.indecatorNotFound = true;
              }
            } else {
              this.showPreloader = false;
              this.indecatorPending = false;

              this.indecatorText = "Undefined page ☹️";
              this.indecatorInfo = true;
            }
          }, 1000);
        }
      );
    });
  }
};
</script>

<style lang="scss">
$primary: #6c63ff;
$pending: #ffc107;
$danger: #f50057;
$info: #65c7d2;

@mixin colorize-element($color) {
  background-color: $color;
  box-shadow: 0 6px 18px 0 rgba($color, 0.8);
}

body {
  font-family: "Montserrat", sans-serif;
}

.container {
  width: 325px;
  padding: 10px;

  .indecator {
    transition: background-color 0.7s ease;
    @include colorize-element($primary);
    border-radius: 14px;
    margin-bottom: 1.2rem;
    padding: 10px 40px;

    h1 {
      color: white;
      text-align: center;
    }
  }

  .indecator.not-found {
    @include colorize-element($danger);
    margin-bottom: 6px;
  }

  .indecator.pending {
    @include colorize-element($pending);
    margin-bottom: 6px;
    cursor: wait;
  }

  .indecator.info {
    @include colorize-element($info);
    margin-bottom: 6px;
    cursor: help;
  }

  .parse-button {
    width: 100%;
    margin-top: 10px;

    button {
      transition: all 0.4s ease;
      width: 100%;
      background-color: $primary;
      border-radius: 14px;
      box-shadow: 0 6px 18px 0 rgba($primary, 0.5);
      border: none;
      outline: none;
      color: white;
      padding: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    }

    button:hover {
      box-shadow: 0 6px 18px 0 rgba($primary, 0.8);
    }

    button:disabled,
    button[disabled] {
      background-color: white;
      box-shadow: 0 6px 18px 0 rgba(#cbcbcb, 0.7);
      cursor: not-allowed;
      color: #cbcbcb;
    }
  }

  .found-timeTable {
    h2 {
      text-align: center;
      color: #cbcbcb;
      margin-bottom: 0;
    }

    .day {
      display: flex;
      justify-content: space-between;

      .day-name {
        color: #3f3e41;
        text-align: left;
      }

      .day-subjects {
        color: #cbcbcb;
        text-align: right;
      }
    }
  }
}
</style>
