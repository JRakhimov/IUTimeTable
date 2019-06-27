const { parse } = require("svg-parser");

class EdupageParser {
  constructor(svg) {
    this.parsedSVG = parse(svg);

    this.daysY = {
      mondayY: 420,
      tuesdayY: 726,
      wednesdayY: 1032,
      thursdayY: 1338,
      fridayY: 1644
    };

    this.timesX = this.parsedSVG.children[1].children
      .filter(child => child.name === "text")
      .filter(text => text.attributes.y === 335)
      .map(time => {
        return { time: time.children[0], x: time.attributes.x };
      });
  }

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
        return "";
    }
  }

  getTime(xStart, xEnd) {
    const times = [];

    this.timesX.forEach(time => {
      if (xStart <= time.x && xEnd >= time.x) {
        times.push(time.time);
      }
    });

    const startTime = times[0].split("-")[0];
    const endTime = times[times.length - 1].split("-")[1];

    return { startTime, endTime };
  }

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

    const timeTable = {};

    subjects.forEach(el => {
      const [subjectName, teacherName, room] = el.subjectInfo.split("\n");
      const { startTime, endTime } = this.getTime(el.xStart, el.xEnd);
      const [sectionNumber] = subjectName.match(/(\d)/);

      const oneTimeTable = {
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
      };

      if (timeTable[this.getDay(el.y)]) {
        timeTable[this.getDay(el.y)].push(oneTimeTable);
      } else {
        timeTable[this.getDay(el.y)] = [oneTimeTable];
      }
    });

    return {
      groupName,
      timeTable
    };
  }

  parseTeacher() {
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
      groupName,
      timeTable
    };
  }
}

module.exports = EdupageParser;
