import axios from '../config/axios';

export const topicService = {
  getAllTopics: async () => {
    try {
      const response = await axios.get('topics');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTopicById: async (id: string) => {
    try {
      const response = await axios.get(`topics/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};