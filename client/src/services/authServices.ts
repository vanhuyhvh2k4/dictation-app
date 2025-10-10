import axios from "axios";
import type { User, AuthSignUp, AuthSignIn } from "../types/user";

const API_URL = "http://localhost:3000/api/auth";

// Đăng ký tài khoản mới
export const signUp = async (data: AuthSignUp): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data.user; // API trả về { user: User }
  } catch (error) {
    console.error("Error in signup:", error);
    throw error;
  }
};

// Đăng nhập
export const signIn = async (data: AuthSignIn): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data.user; // API trả về { user: User }
  } catch (error) {
    console.error("Error in signin:", error);
    throw error;
  }
};
