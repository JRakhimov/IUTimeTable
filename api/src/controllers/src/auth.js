import jwt from "jsonwebtoken";
import axios from "axios";
import md5 from "md5";

import { firebase } from "../../utils";

/**
 * @param {Request} req - Request class from express
 * @param {Response} res - Response class from express
 */
export const eclass = async (req, res) => {
  let { studentID, password } = req.body;

  studentID = studentID.toUpperCase();

  const response = await axios.post(
    `${process.env.ECLASS_AUTH_URL}/auth/eclass`,
    { studentID, password },
    { headers: { "X-Auth": process.env.ECLASS_AUTH_TOKEN } }
  );

  const { status, studentData } = response.data;

  if (status && studentData) {
    // eslint-disable-next-line eqeqeq
    const isSOL = studentID[5] == 1;
    const ref = `students/${isSOL ? "SOL" : "SOCIE"}/${studentID}`;

    let studentDataFromDB = await firebase
      .database()
      .ref(ref)
      .once("value");

    studentDataFromDB = studentDataFromDB.val();

    if (studentDataFromDB) {
      const token = jwt.sign({ studentID }, process.env.STUDENT_SALT);

      return res.status(200).json({ status: true, jwt: token, student: studentDataFromDB });
    }

    return res
      .status(200)
      .json({ status: false, message: `Student with ID ${studentID} not found in our database.` });
  }

  return res.status(200).json({ status: false, message: "Wrong ID or Password." });
};

export const admin = async (req, res) => {
  const { username, password } = req.body;

  let adminDataFromDB = await firebase
    .database()
    .ref("admin")
    .once("value");

  adminDataFromDB = adminDataFromDB.val();

  if (adminDataFromDB) {
    const hashedPassword = md5(password);

    const isAuthTrue = adminDataFromDB.username === username && adminDataFromDB.password === hashedPassword;

    if (isAuthTrue) {
      const token = jwt.sign({ username }, process.env.ADMIN_SALT);

      return res.status(200).json({ status: true, jwt: token, admin: { username } });
    }

    return res.status(200).json({ status: false, message: "Wrong Username or Password." });
  }

  return res.status(200).json({ status: false, message: "Admin data not found in database." });
};
