<template>
  <div>
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
      <JButton @click="sendToBackend" :disabled="buttonDisabled" text="GO 🚀" />
    </div>
  </div>
</template>

<script>
import EdupageParser from "edupage-parser";
import axios from "axios";

import JButton from "../components/button";

export default {
  name: "Index",

  components: {
    JButton
  },

  data() {
    return {
      buttonDisabled: false,

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
    async sendToBackend() {
      const jwt = window.localStorage.getItem("jwt");

      if (!jwt) {
        this.$store.commit("indicator/set", {
          text: "Login required 👮‍♂️",
          theme: "danger"
        });

        return this.$router.replace({ name: "login" });
      }

      this.$store.commit("indicator/set", {
        text: "Sending",
        theme: "pending"
      });

      this.buttonDisabled = true;
      let response;

      try {
        response = await axios.post(
          `${this.HOST_URL}/timetable/add`,
          this.parsedData,
          { headers: { "X-Auth": jwt } }
        );
      } catch (e) {
        console.log("e :", e);
      }

      if (response && response.status === 200 && response.data.status) {
        this.$store.commit("indicator/set", {
          text: "Success 🎉",
          theme: "info"
        });

        setTimeout(() => {
          this.$store.commit("indicator/set", {
            text: "Timetable found 🔥",
            theme: "default"
          });

          this.buttonDisabled = false;
        }, 2000);
      } else {
        this.$store.commit("indicator/set", {
          text: "Error ☢️",
          theme: "danger"
        });

        setTimeout(() => {
          this.$store.commit("indicator/set", {
            text: "Timetable found 🔥",
            theme: "default"
          });

          this.buttonDisabled = false;
        }, 2000);
      }
    }
  },

  mounted() {
    this.$store.commit("indicator/set", {
      text: "Pending",
      theme: "pending"
    });

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, "getSVG", response => {
        setTimeout(() => {
          if (response && response.isEdupagePage) {
            const { svg } = response;

            if (svg) {
              const edupageParser = new EdupageParser(svg);
              this.parsedData = edupageParser.parseTimetable();

              this.$store.commit("indicator/set", {
                text: "Timetable found 🔥",
                theme: "default"
              });
            } else {
              this.$store.commit("indicator/set", {
                text: "Not found 😥",
                theme: "danger"
              });
            }
          } else {
            this.$store.commit("indicator/set", {
              text: "Undefined page ☹️",
              theme: "info"
            });
          }
        }, 1000);
      });
    });
  }
};
</script>

<style lang="scss">
.parse-button {
  width: 100%;
  margin-top: 10px;
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
</style>
