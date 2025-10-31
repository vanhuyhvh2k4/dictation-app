import type { Video } from "./video";

export interface UserAnalyticsDataType {
  id: number;
  date: string;
  total_users: number;
  user_growth: number;
  total_lessons: number;
  lesson_growth: number;
  active_users_today: number;
  active_users_growth: number;
  total_views: number;
  views_growth: number;
  createdAt: string;
  updatedAt: string;
}

export interface LessonAnalyticsDataType {
  id: number;
  videoId: number;
  date: string;
  totalUsers: number;
  completedUsers: number;
  inProgressUsers: number;
  completionRate: number;
  averageScore: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
  video: Video;
}