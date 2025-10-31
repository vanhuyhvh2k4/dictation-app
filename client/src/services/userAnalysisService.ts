import axiosInstance from "../config/axios";
import type { UserAnalyticsDataType } from "../types/analysis";


export const getUserTodayAnalytics = async (): Promise<UserAnalyticsDataType> => {
  try {
    const response = await axiosInstance.get("/analytics/today");
    return response.data;
  } catch (error) {
    throw error;
  }
};
