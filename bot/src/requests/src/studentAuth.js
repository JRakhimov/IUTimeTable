import axios from "axios";
import md5 from "md5";

export const studentAuth = (studentID, password) => {
  const jAuth = md5(`${JSON.stringify({ studentID, password })}${process.env.STUDENT_SALT}`);

  return axios.post(
    `${process.env.API_URL}/auth/eclass`,
    { studentID, password },
    { headers: { "J-Auth": jAuth } }
  );
};
