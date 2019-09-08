/* eslint-disable camelcase */
import { firebase, Logger } from "../../utils";

const formGroupForDepartment = students => {
  const depStudents = Object.values(students);
  const depGroups = {};

  for (const student of depStudents) {
    if (depGroups[student.groupName]) {
      depGroups[student.groupName][student.studentID] = student;
    } else {
      depGroups[student.groupName] = {
        [student.studentID]: student
      };
    }
  }

  return depGroups;
};

/**
 * @param {Request} req - Request class from express
 * @param {Response} res - Response class from express
 */
export const formGroups = async (req, res) => {
  const logger = Logger("FormGroups");

  const students = (await firebase
    .database()
    .ref("students")
    .once("value")).val();

  if (students) {
    const { SOL, SOCIE } = students;
    const groups = { SOL: {}, SOCIE: {} };

    if (SOL) {
      groups.SOL = formGroupForDepartment(SOL);
    }

    if (SOCIE) {
      groups.SOCIE = formGroupForDepartment(SOCIE);
    }

    await firebase
      .database()
      .ref("groups")
      .set(groups);

    const SOL_GroupsAmount = Object.keys(groups.SOL).length;
    const SOCIE_GroupsAmount = Object.keys(groups.SOCIE).length;

    res.status(200).json({
      status: true,
      message: `${SOL_GroupsAmount} SOL groups and ${SOCIE_GroupsAmount} SOCIE groups generated.`
    });
    logger.info(`${SOL_GroupsAmount} SOL groups and ${SOCIE_GroupsAmount} SOCIE groups generated.`);
  } else {
    res.status(200).json({ status: false, message: "Students not found" });
    logger.info("Students not found");
  }
};

/**
 * @param {Request} req - Request class from express
 * @param {Response} res - Response class from express
 */
export const removeGroup = async (req, res) => {
  const logger = Logger("RemoveGroup");

  const { groupName } = req.params;

  const isSOLGroup = groupName.slice(0, 3) === "SOL";

  await firebase
    .database()
    .ref(`groups/${isSOLGroup ? "SOL" : "SOCIE"}/${groupName}`)
    .remove();

  res.status(200).json(`Group ${groupName} removed.`);
  logger.info(`Group ${groupName} removed.`);
};

/**
 * @param {Request} req - Request class from express
 * @param {Response} res - Response class from express
 */
export const getGroupStudents = async (req, res) => {
  const logger = Logger("GetGroupStudents");

  const { groupName } = req.params;

  const isSOLGroup = groupName.slice(0, 3) === "SOL";

  const group = (await firebase
    .database()
    .ref(`groups/${isSOLGroup ? "SOL" : "SOCIE"}/${groupName}`)
    .once("value")).val();

  if (group) {
    res.status(200).json({
      status: true,
      group: Object.values(group)
    });
  } else {
    res.status(200).json({
      status: false,
      message: `Group with name ${groupName} not found in ${isSOLGroup ? "SOL" : "SOCIE"} department`
    });
    logger.info(`Group with name ${groupName} not found in ${isSOLGroup ? "SOL" : "SOCIE"} department`);
  }
};
