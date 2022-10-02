import axios from "axios";
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3030",
});

const reportingAxios = axios.create({
  reportingJobsURL: "https://report.csharpify.com/reporting/v1/jobs",
});

export { api, reportingAxios };
