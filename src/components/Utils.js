import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const addTokenToHeader = (token) => {
  axios.defaults.headers.common["Authorization"] = `Secret ${token}`;
};

export const checkTokens = async () => {
  const accessToken = await AsyncStorage.getItem('access');
  const refreshToken = await AsyncStorage.getItem('refresh');
  return { accessToken, refreshToken };
};

export const getNewToken = async (refreshToken) => {
  try {
    const data = {
      refresh: refreshToken
    };
    const tokenResponse = await axios.post(REFRESH, data);
    const newAccessToken = tokenResponse.data.access;
    AsyncStorage.setItem('access', newAccessToken);
    return newAccessToken;
  } catch (error) {
    return null;
  }
};
