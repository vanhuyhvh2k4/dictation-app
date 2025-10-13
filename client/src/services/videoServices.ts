import type { UploadVideoData, Video } from "../types/video";
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

// Lấy videos theo topic id
export const getVideosByTopicId = async (topicId: string): Promise<Video[]> => {
  try {
    const response = await axiosInstance.get<Video[]>(`${API_PATH}/topic/${topicId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching topic videos:", error);
    throw error;
  }
};

// Upload video với files và metadata
export const uploadVideo = async (data: UploadVideoData): Promise<Video> => {
  try {
    const formData = new FormData();
    
    // Thêm các file vào form data
    formData.append('thumbnail', data.thumbnail);
    formData.append('video', data.video);
    formData.append('transcript', data.transcript);
    
    // Thêm metadata
    formData.append('title', data.title);
    formData.append('channel', data.channel);
    formData.append('level', data.level);
    
    // Thêm duration nếu có
    if (data.duration) {
      formData.append('duration', data.duration);
    }

    const response = await axiosInstance.post<Video>(`${API_PATH}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Thêm options để theo dõi tiến trình upload
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
        console.log('Upload progress:', percentCompleted);
        data.onProgress?.(percentCompleted);
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};
