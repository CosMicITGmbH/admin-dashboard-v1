import axios from "axios";
// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || "http://localhost:3030",
// });

// const reportingAxios = axios.create({
//   reportingJobsURL: JSON.parse(sessionStorage.getItem("selectedMachine"))
//     .endPoint,
// });

const customAxios = (dynamicBaseURL) => {
  // axios instance for making requests
  const axiosInstance = axios.create({
    baseURL: dynamicBaseURL,
  });

  return axiosInstance;
};

//export { api, reportingAxios, };

export default customAxios;
