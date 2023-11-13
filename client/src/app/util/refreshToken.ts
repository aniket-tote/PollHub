import axios from "axios";

const refreshToken = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/auth/refreshToken",
      {
        headers: {
          withCredentials: true,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to refresh token");
    }

    const { accessToken } = await response.data;

    localStorage.setItem("accessToken", accessToken);
  } catch (error) {
    console.error(error);
  }
};

export default refreshToken;
