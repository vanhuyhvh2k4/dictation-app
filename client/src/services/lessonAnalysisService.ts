import axiosInstance from "../config/axios";
import type { LessonAnalyticsDataType } from "../types/analysis";


export const getLessonAnalytics = async (): Promise<LessonAnalyticsDataType[]> => {
  try {
    const response = await axiosInstance.get("/lessons/videos?sortBy=completionRate&order=DESC");
    return response.data.videos;
  } catch (error) {
    throw error;
  }
};
