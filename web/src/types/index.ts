export type LessonInfo = {
  day: string;
  room: string;
  sectionNumber: number;

  endTime: string;
  startTime: string;

  subjectName: string;
  subjectNameShort: string;

  teacherName: string;
  teacherNameShort: string;
};

export type TimeTable = {
  Monday: LessonInfo[];
  Tuesday: LessonInfo[];
  Wednesday: LessonInfo[];
  Thursday: LessonInfo[];
  Friday: LessonInfo[];
};

export type Student = {
  fullName: string;
  groupName: string;
  studentID: string;
  timetable: TimeTable | {};
};

export enum Stage {
  Freshman = "Freshman",
  Sophomore = "Sophomore",
  Junior = "Junior",
  Senior = "Senior",
  Wrong = "Entered wrong ID!"
}

export type ExtendedStudent = {
  fullName: string;
  oneNameLetter: string;
  fullNameLetter: string;

  groupName: string;
  studentID: string;
  timetable: TimeTable | {};

  stage: Stage;
  color: string;
};
