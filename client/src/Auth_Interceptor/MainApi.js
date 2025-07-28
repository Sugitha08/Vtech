import axios from "axios";
import { Base_url } from "../Environment/Environment";
import { toast } from "react-toastify";

const Main_Api = axios.create({
  baseURL: Base_url,
});

const AuthHeader = (config) => {
  const jwt_token = localStorage.getItem("jwt_token");
  const token = jwt_token && jwt_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

Main_Api.interceptors.request.use(AuthHeader);

// ✅ Response Interceptor to catch 401 errors
Main_Api.interceptors.response.use(
  (response) => response,
  (error) => {
    const pathname = window.location.pathname;

    if (
      pathname !== "/" &&
      error.response.status === 401
    ) {
      toast.error("Invalid Token");
      localStorage.removeItem("jwt_token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default Main_Api;
