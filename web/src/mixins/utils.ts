import Vue from "vue";
import Component from "vue-class-component";

import { Student, Stage, ExtendedStudent, TimeTable, LessonInfo } from "../types";

@Component
export default class UtilsMixin extends Vue {
  get color(): string {
    return this.$route.meta.routeColor || "#5A97E5";
  }

  hexToRgb(hex: string) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  colorStyles(withBoxShadow = true) {
    const rgb = this.hexToRgb(this.color);

    if (withBoxShadow && rgb) {
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

  static formatName(fullName: string): string {
    let [lastName, firstName] = fullName.split(" ", 2);

    lastName = lastName.substr(0, 1) + lastName.substr(1).toLowerCase();
    firstName = firstName.substr(0, 1) + firstName.substr(1).toLowerCase();

    return `${lastName} ${firstName}`;
  }

  static getStage(studentID: string): Stage {
    const current = studentID.substr(1, 2);

    let year = new Date();
    let yearString = year
      .getFullYear()
      .toString()
      .slice(2);

    let month = new Date();
    let monthString = month.getMonth();

    let stage = Number(yearString) - Number(current) - 1;

    if (monthString >= 5) {
      stage = Number(yearString) - Number(current);
    }

    switch (stage) {
      case 0:
        return Stage.Freshman;
      case 1:
        return Stage.Sophomore;
      case 2:
        return Stage.Junior;
      case 3:
        return Stage.Senior;
      default:
        return Stage.Wrong;
    }
  }

  static getRandomColor(): string {
    const getRandomNumber = (min: number, max: number): number =>
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
  }

  static sortLessons(timetable: TimeTable | {}) {
    for (const day in timetable) {
      if (timetable.hasOwnProperty(day)) {
        let lessons: LessonInfo[] = (timetable as any)[day];

        lessons = lessons.sort((a, b) => {
          const [aTime] = a.startTime.split(":");
          const [bTime] = b.startTime.split(":");

          return Number(aTime) - Number(bTime);
        });

        (timetable as any)[day] = lessons;
      }
    }

    return timetable;
  }

  static updateStudentData(studentData: Student): ExtendedStudent {
    const { fullName, groupName, studentID, timetable } = studentData;
    const [firstname, lastname] = fullName.split(" ");
    const fullNameLetter = firstname[0] + lastname[0];

    return {
      forceLogout: studentData.forceLogout,
      timetable: this.sortLessons(timetable),
      fullName: this.formatName(fullName),
      stage: this.getStage(studentID),
      color: this.getRandomColor(),
      oneNameLetter: fullName[0],
      fullNameLetter,
      groupName,
      studentID,
    };
  }
}
