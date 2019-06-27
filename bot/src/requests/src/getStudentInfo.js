import axios from "axios";

export const getStudentInfo = (studentID, jwtToken) => {
  return axios.get(`${process.env.API_URL}/students/${studentID}`, {
    headers: {
      "X-Auth": jwtToken
    }
  });
};
