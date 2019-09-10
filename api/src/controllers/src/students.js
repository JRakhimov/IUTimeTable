import { firebase, Logger } from "../../utils";

/**
 * @param {Request} req - Request class from express
 * @param {Response} res - Response class from express
 */
export const get = async (req, res) => {
  const { studentID } = req.params;

  const logger = Logger("GetSingleStudent");

  if (studentID) {
    // eslint-disable-next-line eqeqeq
    const isSOL = studentID[4] == 1;

    const student = await firebase
      .database()
      .ref(`students/${isSOL ? "SOL" : "SOCIE"}/${studentID}`)
      .once("value")
      .then(x => x.val());

    const timetable = await firebase
      .database()
      .ref(`timetables/${student.groupName}`)
      .once("value")
      .then(x => x.val());

    if (student) {
      res.status(200).json({ status: true, student: { ...student, timetable } });
    } else {
      res
        .status(200)
        .json({ status: false, message: `Student with ID ${studentID} not found in our database. ` });
      logger.warn(`Student with ID ${studentID} not found in our database. `);
    }
  } else {
    res
      .status(200)
      .json({ status: false, message: `Wrong request:\n${JSON.stringify(req.params, undefined, 2)}` });

    logger.warn(`Wrong json:\n${JSON.stringify(req.body, undefined, 2)}`);
  }
};

/**
 * @param {Request} req - Request class from express
 * @param {Response} res - Response class from express
 */
export const add = async (req, res) => {
  const { studentID, groupName, fullName } = req.body;

  const logger = Logger("AddSingleStudent");

  if (studentID && groupName && fullName) {
    // eslint-disable-next-line eqeqeq
    const isSOL = studentID[4] == 1;

    await firebase
      .database()
      .ref(`students/${isSOL ? "SOL" : "SOCIE"}/${studentID}`)
      .set({ studentID, groupName, fullName });

    res.status(200).json({ status: true, message: `Student with ID ${studentID} successfully added.` });
    logger.info(`Student with ID ${studentID} successfully added.`);
  } else {
    res
      .status(200)
      .json({ status: false, message: `Wrong json:\n${JSON.stringify(req.body, undefined, 2)}` });

    logger.warn(`Wrong json:\n${JSON.stringify(req.body, undefined, 2)}`);
  }
};

/**
 * @param {Request} req - Request class from express
 * @param {Response} res - Response class from express
 */
export const remove = async (req, res) => {
  const { studentID } = req.params;

  const logger = Logger("RemoveSingleStudent");

  // eslint-disable-next-line eqeqeq
  const isSOL = studentID[4] == 1;

  await firebase
    .database()
    .ref(`students/${isSOL ? "SOL" : "SOCIE"}/${studentID}`)
    .remove();

  res.status(200).json({ status: true, message: `Student with ID ${studentID} removed.` });
  logger.info(`Student with ID ${studentID} removed.`);
};

/**
 * @param {Request} req - Request class from express
 * @param {Response} res - Response class from express
 */
export const importFromJSON = async (req, res) => {
  const { department, students } = req.body;

  const logger = Logger("ImportStudents");

  if (department && students) {
    const formatedStudents = {};

    for (let i = 0; i < students.length; i++) {
      for (let j = i === 0 ? 1 : 0; j < students[i].data.length; j++) {
        const student = students[i].data[j];

        const studentID = student[0].text;
        const groupName = student[2].text;
        const fullName = student[1].text;

        formatedStudents[studentID] = { studentID, groupName, fullName };
      }
    }

    const isSOL = department === "SOL";

    await firebase
      .database()
      .ref(`students/${isSOL ? "SOL" : "SOCIE"}`)
      .update(formatedStudents);

    const studentsAmount = Object.keys(formatedStudents).length;

    res.status(200).json({ status: true, message: `${studentsAmount} students from ${department} added.` });
    logger.info(`${studentsAmount} students from ${department} added.`);
  } else {
    res
      .status(200)
      .json({ status: false, message: `Wrong json:\n${JSON.stringify(req.body, undefined, 2)}` });

    logger.warn(`Wrong json:\n${JSON.stringify(req.body, undefined, 2)}`);
  }
};
