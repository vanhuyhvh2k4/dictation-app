import axios from "axios";
import type { Video } from "../types/video";

const API_URL = "http://localhost:3000/api/videos/";

// Lấy tất cả videos
export const getVideos = async (): Promise<Video[]> => {
  try {
    const response = await axios.get<Video[]>(API_URL); // trực tiếp Video[]
    return response.data; // trả về mảng Video[]
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

// Lấy video theo id
export const getVideoById = async (id: string): Promise<Video> => {
  try {
    const response = await axios.get<Video>(`${API_URL}${id}`); // trực tiếp Video
    return response.data; // trả về 1 Video
  } catch (error) {
    console.error("Error fetching video:", error);
    throw error;
  }
};
