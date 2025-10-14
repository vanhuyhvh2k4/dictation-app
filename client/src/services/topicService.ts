import axiosInstance from "../config/axios";
import axios from "../config/axios";
import type { Topic } from "../types/topic";
import type { Video } from "../types/video";

export const getAllTopics = async (): Promise<Topic[]> => {
  try {
    const response = await axios.get("topics");
    // Transform the response data to match our Topic interface
    const topics: Topic[] = response.data.map((topic: any) => ({
      id: topic.id.toString(),
      title: topic.title, // Map from backend 'name' to frontend 'title'
      levels: topic.levels || "A1", // Provide default if not available
      lessons: topic.lessons || 0,
      hasVideo: topic.hasVideo || false,
      image: topic.image || "📚", // Default emoji if no image
    }));
    return topics;
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};

export const getTopicById = async (id: string): Promise<Topic> => {
  try {
    const response = await axios.get(`topics/${id}`);
    // Transform the response data to match our Topic interface
    const topic: Topic = {
      id: response.data.id.toString(),
      title: response.data.title,
      levels: response.data.levels || "A1",
      lessons: response.data.lessons || 0,
      hasVideo: response.data.hasVideo || false,
      image: response.data.image || "📚",
    };
    return topic;
  } catch (error) {
    console.error("Error fetching topic:", error);
    throw error;
  }
};

// Lấy videos theo topic id
export const getVideosByTopicId = async (topicId: string): Promise<Video[]> => {
  try {
    const response = await axiosInstance.get<Video[]>(
      `/topics/${topicId}/videos`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching topic videos:", error);
    throw error;
  }
};
