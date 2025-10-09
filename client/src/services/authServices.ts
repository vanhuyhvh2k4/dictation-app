import axios from "axios";
import type { User, AuthSignUp } from "../types/user";

const API_URL = "http://localhost:3000/api/auth/register";

// Lấy tất cả videos
export const signUp = async (data: AuthSignUp): Promise<User> => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data.user; // API trả về { user: User }
  } catch (error) {
    console.error("Error in signup:", error);
    throw error;
  }
};
