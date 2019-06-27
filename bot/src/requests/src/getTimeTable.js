import axios from "axios";

export const getTimeTable = (groupName, jwtToken) => {
  return axios.get(`${process.env.API_URL}/timetable/${groupName}`, {
    headers: {
      "X-Auth": jwtToken
    }
  });
};
