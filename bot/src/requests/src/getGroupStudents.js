import axios from "axios";

export const getGroupStudents = (groupName, jwtToken) => {
  return axios.get(`${process.env.API_URL}/groups/${groupName}`, {
    headers: {
      "X-Auth": jwtToken
    }
  });
};
