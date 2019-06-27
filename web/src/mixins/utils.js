export const utils = {
  computed: {
    color() {
      return this.$route.meta.routeColor || "#5A97E5";
    }
  },

  methods: {
    formatName(fullName) {
      let [lastName, firstName] = fullName.split(" ", 2);

      lastName = lastName.substr(0, 1) + lastName.substr(1).toLowerCase();
      firstName = firstName.substr(0, 1) + firstName.substr(1).toLowerCase();

      return `${lastName} ${firstName}`;
    },

    getStage(studentID) {
      const current = studentID.substr(1, 2);

      let year = new Date();
      year = year
        .getFullYear()
        .toString()
        .slice(2);

      let month = new Date();
      month = month.getMonth();

      let stage = year - current - 1;

      if (month >= 5) {
        stage = year - current;
      }

      switch (stage) {
        case 0:
          return "Freshman";
        case 1:
          return "Sophomore";
        case 2:
          return "Junior";
        case 3:
          return "Senior";
        default:
          return "Entered wrong ID!";
      }
    },

    getRandomColor() {
      const getRandomNumber = (min, max) =>
        Math.floor(Math.random() * (max - min)) + min;

      const colors = [
        "#E45164",
        "#F36B4F",
        "#46C9A9",
        "#4DBAE1",
        "#E583B9",
        "#A78DE6",
        "#F7C852",
        "#9BCD65",
        "#5A97E5",
        "#4985D5"
      ];

      return colors[getRandomNumber(0, 10)];
    },

    updateStudentData(studentData) {
      const { fullName, groupName, studentID } = studentData;
      const [firstname, lastname] = fullName.split(" ");
      const fullNameLetter = firstname[0] + lastname[0];

      let timetable = studentData.timetable
        ? { timetable: studentData.timetable }
        : {};

      return {
        fullName: this.formatName(fullName),
        stage: this.getStage(studentID),
        color: this.getRandomColor(),
        oneNameLetter: fullName[0],
        fullNameLetter,
        groupName,
        studentID,

        ...timetable
      };
    }
  }
};
