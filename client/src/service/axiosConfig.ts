import axios from "axios";
import authService from "./authService";

export const initiateInterceptor = () => {
  axios.interceptors.request.use(
    async (config) => {
      if (!authService.isAuthenticated()) {
        await authService.refreshToken();
        config.headers.Authorization = `Bearer ${localStorage.getItem(
          "token"
        )}`;
      }
      return config;
    },
    (error) => {
      console.error("Request Interceptor Error:", error);
      return Promise.reject(error);
    }
  );
};

export default axios;
