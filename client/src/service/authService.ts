import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { initiateInterceptor } from "./axiosConfig";

const authService = {
  getAccessToken: () => {
    return localStorage.getItem("token") || "";
  },

  isAuthenticated: () => {
    const accessToken = authService.getAccessToken();
    return accessToken && !authService.isTokenExpired(accessToken);
  },

  isTokenExpired: (token: string) => {
    if (!token || token === "") {
      return true;
    }

    const decodedToken: {
      id: number;
      name: string;
      email: string;
      iat: number;
      exp: number;
    } = jwtDecode(token);

    const expirationTime = new Date(decodedToken.exp * 1000);

    return expirationTime < new Date();
  },

  refreshToken: async () => {
    try {
      axios.interceptors.request.clear();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/refresh-token`,
        {
          withCredentials: true,
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to refresh token");
      }

      const { accessToken } = await response.data;

      localStorage.setItem("token", accessToken);
      initiateInterceptor();
    } catch (error) {
      console.error(error);
    }
  },
};

export default authService;
