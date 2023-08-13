import axios from "axios";
import { REACT_APP_API_MAIN_URL } from "../helpers/appContants";
// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || "http://localhost:3030",
// });

// const reportingAxios = axios.create({
//   reportingJobsURL: JSON.parse(sessionStorage.getItem("selectedMachine"))
//     .endPoint,
// });
const instance = axios.create({
  baseURL: REACT_APP_API_MAIN_URL,
});

const customAxios = (dynamicBaseURL) => {
  // axios instance for making requests
  const axiosInstance = axios.create({
    baseURL: dynamicBaseURL,
  });

  return axiosInstance;
};

// customAxios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.status === 401) {
//       window.location = "/login";
//     }
//   }
// );

// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.status === 401) {
//       window.location = "/login";
//     }
//   }
// );

export { customAxios, instance };
