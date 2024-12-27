import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});
axiosInstance.defaults.baseImageURL = "http://localhost:3000/uploads";

export default axiosInstance;
