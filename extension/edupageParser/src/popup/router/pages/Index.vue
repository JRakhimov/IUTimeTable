<template>
  <div class="container">
    <div
      class="svg-indecator"
      :class="{ 'not-found': svgIndecatorNotFound, 'pending': svgIndecatorPending }"
    >
      <h1>
        {{svgIndecatorText}}
        <Preloader v-if="svgIndecatorPending"/>
      </h1>
    </div>

    <div class="found-timeTable" :class="{ 'display': showInfo }">
      <h3>{{ isTeacher ? parsedData.teacherName : parsedData.groupName }}</h3>
      <h3>Subjects: {{ parsedData.timeTable.length }}</h3>
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

export default {
  data() {
    return {
      svgIndecatorText: "Pending",
      svgIndecatorNotFound: false,
      svgIndecatorPending: true,

      isTeacher: false,
      showInfo: false,
      parsedSVG: {},

      parsedData: {
        teacherName: "",
        groupName: "",
        timeTable: []
      },

      showPreloader: true,

      daysY: {
        mondayY: 420,
        tuesdayY: 726,
        wednesdayY: 1032,
        thursdayY: 1338,
        fridayY: 1644
      }
    };
  },
  components: {
    Preloader
  },
  methods: {
    getDay(y) {
      switch (y) {
        case this.daysY.mondayY:
          return "Monday";
        case this.daysY.tuesdayY:
          return "Tuesday";
        case this.daysY.wednesdayY:
          return "Wednesday";
        case this.daysY.thursdayY:
          return "Thursday";
        case this.daysY.fridayY:
          return "Friday";
        default:
          return 404;
      }
    },

    getTime(xStart, xEnd) {
      const times = this.timesX.filter(
        time => xStart <= time.x && xEnd >= time.x
      );

      const [startTime] = times[0].time.split("-");
      const [, endTime] = times[times.length - 1].time.split("-");

      return { startTime, endTime };
    },

    parseTimeTable() {
      const groupName = this.parsedSVG.children[1].children[0].children[0];
      const subjects = this.parsedSVG.children[1].children
        .filter(child => child.name === "rect")
        .map(subject => {
          return {
            subjectInfo: subject.children[0].children[0],
            y: subject.attributes.y,
            xStart: subject.attributes.x,
            xEnd: subject.attributes.x + subject.attributes.width
          };
        });

      const timeTable = [];

      subjects.forEach(el => {
        const [subjectName, teacherName, room] = el.subjectInfo.split("\n");
        const { startTime, endTime } = this.getTime(el.xStart, el.xEnd);
        const [sectionNumber] = subjectName.match(/(\d)/);

        timeTable.push({
          subjectName: subjectName.split(" (")[0],
          subjectNameShort: subjectName
            .split(" (")[0]
            .split(" ")
            .map(el => el.charAt(0))
            .join(""),
          teacherName,
          teacherNameShort: teacherName
            .split(" ")
            .map(el => el.charAt(0))
            .join(""),
          sectionNumber: Number(sectionNumber),
          room,
          day: this.getDay(el.y),
          startTime,
          endTime
        });
      });

      return {
        groupName,
        timeTable
      };
    },

    parseTeacher() {
      let teacherName = this.parsedSVG.children[1].children[0].children[0].split(
        " "
      );
      teacherName.shift();
      teacherName = teacherName.join(" ");

      const subjects = this.parsedSVG.children[1].children
        .filter(child => child.name === "rect")
        .map(subject => {
          return {
            subjectInfo: subject.children[0].children[0],
            y: subject.attributes.y,
            xStart: subject.attributes.x,
            xEnd: subject.attributes.x + subject.attributes.width
          };
        });

      const timeTable = [];

      subjects.forEach(el => {
        const [subjectName, groups, room] = el.subjectInfo.split("\n");
        const { startTime, endTime } = this.getTime(el.xStart, el.xEnd);
        const [sectionNumber] = subjectName.match(/(\d)/);

        timeTable.push({
          subjectName: subjectName.split(" (")[0],
          subjectNameShort: subjectName
            .split(" (")[0]
            .split(" ")
            .map(el => el.charAt(0))
            .join(""),
          groups: groups.split("/"),
          sectionNumber: Number(sectionNumber),
          room,
          day: this.getDay(el.y),
          startTime,
          endTime
        });
      });

      return {
        teacherName,
        timeTable
      };
    }
  },

  mounted() {
    // if (Object.keys(this.$store.getters.timeTableInfo).length === 0) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, "getSVG", res => {
        setTimeout(() => {
          if (res) {
            this.$store.commit("UPDATE_TIMETABLE_INFO", res);
            this.parsedSVG = res.parsedSVG;
            this.isTeacher = res.isTeacher;

            if (this.isTeacher) this.parsedData = this.parseTeacher();
            else this.parsedData = this.parseTimeTable();

            alert(JSON.stringify(this.parsedData, undefined, 2));

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
  },

  computed: {
    timesX() {
      return this.parsedSVG.children[1].children
        .filter(child => child.name === "text")
        .filter(text => text.attributes.y === 335)
        .map(time => {
          return { time: time.children[0], x: time.attributes.x };
        });
    }
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
