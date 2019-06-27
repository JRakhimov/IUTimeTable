import axios from "axios";

export const studentAuth = (studentID, password) => {
  return axios.post(`${process.env.API_URL}/auth/eclass`, { studentID, password });
};
