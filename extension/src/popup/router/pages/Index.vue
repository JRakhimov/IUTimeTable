<template>
  <div class="container">
    <div
      class="svg-indecator"
      :class="{ 'not-found': svgIndecatorNotFound, 'pending': svgIndecatorPending }"
    >
      <h1>
        {{svgIndecatorText}}
        <Preloader v-if="svgIndecatorPending" />
      </h1>
    </div>

    <div class="found-timeTable" :class="{ 'display': showInfo }">
      <h3>{{ isTeacher ? parsedData.teacherName : parsedData.groupName }}</h3>
      <h3>Parser for {{ isTeacher ? "teachers" : "timetable" }}</h3>
      <div class="edit" v-if="isTeacher && !svgIndecatorPending">
        <router-link to="/edit">Edit</router-link>
      </div>
    </div>

    <div class="parse-button">
      <button :disabled="svgIndecatorPending || svgIndecatorNotFound">GO</button>
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
      svgIndecatorText: "Pending",
      svgIndecatorNotFound: false,
      svgIndecatorPending: true,

      showPreloader: true,

      showInfo: false,
      isTeacher: false,

      parsedData: {
        teacherName: "",
        groupName: "",
        timeTable: []
      }
    };
  },

  methods: {},

  mounted() {
    // if (Object.keys(this.$store.getters.timeTableInfo).length === 0) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, "getSVG", svg => {
        setTimeout(() => {
          if (svg) {
            const edupageParser = new EdupageParser(svg);

            this.parsedData = edupageParser.parseTimetable();
            this.isTeacher = edupageParser.isTeacherTimetable();

            this.svgIndecatorText = "SVG Found 🔥";
            this.svgIndecatorPending = false;
            this.showInfo = true;
          } else {
            this.svgIndecatorText = "SVG Not Found 😥";
            this.svgIndecatorPending = false;
            this.svgIndecatorNotFound = true;
          }
        }, 1000);
      });
    });
    // }
  }
};
</script>

<style lang="scss" scoped>
$primary: #6c63ff;
$pending: #ffc107;
$danger: #f50057;

.container {
  width: 320px;
  font-family: "Montserrat", sans-serif;
  padding: 10px;

  .svg-indecator {
    transition: background-color 0.7s ease;
    padding: 10px 40px;
    background-color: $primary;
    box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.12);
    border-radius: 4px;

    h1 {
      color: white;
      text-align: center;
    }
  }

  .svg-indecator.not-found {
    background-color: $danger;
  }

  .svg-indecator.pending {
    background-color: $pending;
    cursor: wait;
  }

  .parse-button {
    width: 100%;
    margin-top: 10px;

    button {
      transition: all 0.7s ease;
      width: 100%;
      border: 2px solid $primary;
      background-color: white;
      border-radius: 24px;
      outline: none;
      color: $primary;
      padding: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    }

    button:hover {
      background-color: $primary;
      color: white;
    }

    button:disabled,
    button[disabled] {
      background-color: white;
      border: 2px solid #f5f5f5;
      cursor: not-allowed;
      color: #cbcbcb;
    }
  }

  .found-timeTable {
    display: none;
    h3 {
      text-align: center;
      color: #cbcbcb;
    }
  }
  .found-timeTable.display {
    display: block;
  }

  .edit {
    margin-top: -5px;
    text-align: center;
    a {
      transition: all 0.3s ease;
      color: #cbcbcb;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      font-style: italic;
    }

    a:hover {
      color: $primary;
    }
  }
}
</style>
