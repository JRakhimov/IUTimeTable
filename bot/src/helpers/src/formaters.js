import now from "moment-timezone";

const timeZone = "Asia/Tashkent";

export const formaters = {
  formatName(fullName) {
    let [ lastName, firstName ] = fullName.split(" ", 2);

    lastName = lastName.substr(0, 1) + lastName.substr(1).toLowerCase();
    firstName = firstName.substr(0, 1) + firstName.substr(1).toLowerCase();

    return `${lastName} ${firstName}`;
  },

  getStage(studentID) {
    const current = studentID.substr(1, 2);

    const year = now()
      .tz(timeZone)
      .format("YY");

    const month = now()
      .tz(timeZone)
      .format("M");

    let stage = year - current - 1;

    if (month > 5) {
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

  getTodayDate() {
    return {
      dayCode: now()
        .tz(timeZone)
        .format("d"),
      dayName: now()
        .tz(timeZone)
        .format("dddd"),
      fullDate: now()
        .tz(timeZone)
        .format("D MMM YYYY | dddd")
    };
  },

  timeTableText(timeTable) {
    const sortedTimeTable = timeTable.sort((a, b) => {
      const [ aPart ] = a.startTime.split(":");
      const [ bPart ] = b.startTime.split(":");

      return aPart - bPart;
    });

    let timeTableText = "";

    for (let i = 0; i < sortedTimeTable.length; i++) {
      const isLast = i + 1 === sortedTimeTable.length;
      const singleTimeTable = sortedTimeTable[i];

      const startEmoji = this.emojifyTime(singleTimeTable.startTime)
      const endEmoji = this.emojifyTime(singleTimeTable.endTime)

      timeTableText += `${i + 1}. 📚 <b>${singleTimeTable.subjectName} (${
        singleTimeTable.sectionNumber
      })</b>\n`;
      timeTableText += `    👨‍ <b>Teacher name:</b> ${singleTimeTable.teacherName}\n`;
      timeTableText += `    🏫 <b>Room:</b> ${singleTimeTable.room}\n`;
      timeTableText += `    ${startEmoji} <b>Start:</b> ${singleTimeTable.startTime}\n`;
      timeTableText += `    ${endEmoji} <b>End:</b> ${singleTimeTable.endTime}`;
      timeTableText += isLast ? "" : "\n\n";
    }

    return timeTableText;
  },

  groupmatesText(groupmates, groupName) {
    let messageText = `<b>Here are your groupmates (${groupName}):</b>\n\n`;

    const formatedGroupmates = groupmates.map((groupmate) => this.formatName(groupmate.fullName));

    for (let i = 0; i < formatedGroupmates.length; i++) {
      const groupmate = formatedGroupmates[i];

      messageText += `${i + 1}. ${groupmate}\n`;
    }

    return messageText;
  },

  emojifyTime(time) {
    let [hour, minute] = time.split(":");

    hour = Number(hour) >= 12 ? Number(hour) - 12 : Number(hour);
    
    const timeEmojis = {
      "00": ["🕛", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"],
      "30": ["🕧", "🕜", "🕝", "🕞", "🕟", "🕠", "🕡", "🕢", "🕣", "🕤", "🕥", "🕦"]
    };

    return timeEmojis[minute][hour]
  }
};
