import type { Video } from "../types/video";
import axiosInstance from "../config/axios";

const API_PATH = "/videos";

// Lấy videos với optional filter theo level
export const getVideos = async (level?: string): Promise<Video[]> => {
  try {
    const response = await axiosInstance.get<Video[]>(API_PATH, {
      params: {
        level: level
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

// Lấy video theo id
export const getVideoById = async (id: string): Promise<Video> => {
  try {
    const response = await axiosInstance.get<Video>(`${API_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching video:", error);
    throw error;
  }
};
