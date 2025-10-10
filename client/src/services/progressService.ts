import { type VideoProgress } from "../types/video";
import axiosInstance from "../config/axios";

const API_PATH = "/progress";

// Get progress for a specific video
export const getVideoProgress = async (videoId: number): Promise<VideoProgress> => {
  try {
    const response = await axiosInstance.get(`${API_PATH}/${videoId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error getting video progress:", error);
    throw error;
  }
};

// Update video progress
export const updateVideoProgress = async (
  videoId: number,
  currentTranscriptIndex: number,
  transcriptScore: number,
): Promise<VideoProgress> => {
  try {
    const response = await axiosInstance.post(`${API_PATH}/${videoId}`, {
      currentTranscriptIndex,
      transcriptScore
    });
    return response.data.data;
  } catch (error) {
    console.error("Error updating video progress:", error);
    throw error;
  }
};

// Get all user progress
export const getAllProgress = async (): Promise<VideoProgress[]> => {
  try {
    const response = await axiosInstance.get(API_PATH);
    return response.data.data;
  } catch (error) {
    console.error("Error getting all progress:", error);
    throw error;
  }
};