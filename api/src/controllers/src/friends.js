import { firebase, Logger } from "../../utils";

/**
 * @param {Request} req - Request class from express
 * @param {Response} res - Response class from express
 */
export const get = async (req, res) => {
  const { studentID } = req.params;

  const logger = Logger("GetFriendsList");

  if (studentID) {
    let friends = await firebase
      .database()
      .ref(`friends/${studentID}`)
      .once("value")
      .then((x) => x.val());

    friends = friends ? Object.values(friends) : [];

    for (const friend of friends) {
      const timetable = await firebase
        .database()
        .ref(`timetables/${friend.groupName}`)
        .once("value")
        .then((x) => x.val());

      friend.timetable = timetable ? timetable : {};
    }

    res.status(200).json({ status: true, friends });
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
  let { studentID } = req.params;

  let { friendID } = req.body;

  studentID = studentID.toUpperCase();
  friendID = friendID.toUpperCase();

  if (studentID === friendID) {
    return res.status(200).json({ status: false, message: "StudentID and FriendID ara equal." });
  }

  const logger = Logger("AddNewFriend");

  if (studentID && friendID) {
    // eslint-disable-next-line eqeqeq
    const friendIsSOL = friendID[5] == 1;

    let friendData = await firebase
      .database()
      .ref(`students/${friendIsSOL ? "SOL" : "SOCIE"}/${friendID}`)
      .once("value")
      .then((x) => x.val());

    await firebase
      .database()
      .ref(`friends/${studentID}`)
      .update({ [friendID]: friendData });

    res
      .status(200)
      .json({ status: true, message: `Friend with ID ${friendID} successfully added to ${studentID}` });
    logger.info(`Friend with ID ${friendID} successfully added to ${studentID}`);
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
  const { friendID } = req.body;

  const logger = Logger("RemoveSingleFriend");

  await firebase
    .database()
    .ref(`friends/${studentID}/${friendID}`)
    .remove();

  res.status(200).json({ status: true, message: `Friend with ID ${friendID} removed from ${studentID}` });
  logger.info(`Friend with ID ${friendID} removed from ${studentID}`);
};
