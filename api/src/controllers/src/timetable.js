import { firebase, Logger } from "../../utils";

/**
 * @param {Request} req - Request class from express
 * @param {Response} res - Response class from express
 */
export const add = async (req, res) => {
  const { groupName, timetable } = req.body;

  const logger = Logger("AddTimetable");

  if (groupName && timetable) {
    await firebase
      .database()
      .ref(`timetables/${groupName}`)
      .set(timetable);

    res.status(200).json({ status: true, message: `Timetable for group ${groupName} successfully saved.` });
    logger.info(`Timetable for group ${groupName} successfully saved.`);
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
export const getForGroup = async (req, res) => {
  const { groupName } = req.params;

  const groupTimetable = (await firebase
    .database()
    .ref(`timetables/${groupName}`)
    .once("value")).val();

  if (groupTimetable) {
    res.status(200).json({ status: true, timetable: groupTimetable });
  } else {
    res.status(200).json({ status: false, message: `Timetable for group ${groupName} not found.` });
  }
};

/**
 * @param {Request} req - Request class from express
 * @param {Response} res - Response class from express
 */
export const remove = async (req, res) => {
  const { groupName } = req.params;

  await firebase
    .database()
    .ref(`timetables/${groupName}`)
    .remove();

  res.status(200).json({ status: true, message: `Timetable for group ${groupName} deleted.` });
};
