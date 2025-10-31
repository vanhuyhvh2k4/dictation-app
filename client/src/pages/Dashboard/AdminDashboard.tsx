import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Video, 
  TrendingUp, 
  Eye,
  Award,
  BarChart3,
  Activity,
  Clock,
  ArrowUp,
  ArrowDown,
  Calendar
} from 'lucide-react';
import { getUserTodayAnalytics } from '../../services/userAnalysisService';
import { type LessonAnalyticsDataType, type UserAnalyticsDataType } from '../../types/analysis';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { getLessonAnalytics } from '../../services/lessonAnalysisService';

interface UserStats {
  month: string;
  users: number;
}

interface LessonEngagementType {
  lessonId: string;
  title: string;
  inProgressUser: number;
  completedUsers: number;
}

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('7days');
  const [userAnalyticsData, setUserAnalyticsData] = useState<UserAnalyticsDataType | null>(null);
  const [lessonAnalyticsData, setLessonAnalyticsData] = useState<LessonAnalyticsDataType[] | null>(null);
  const [LessonEngagement, setLessonEngagement] = useState<LessonEngagementType[] | []>([]);

  const fetchUserAnalytics = async () => {
    try {
      const response = await getUserTodayAnalytics();
      setUserAnalyticsData(response);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };
  const fetchLessonAnalytics = async () => {
    try {
      const response = await getLessonAnalytics();
      setLessonAnalyticsData(response);
      
      // Transform data for LessonEngagement
      const transformedData: LessonEngagementType[] = response.map(lesson => ({
        lessonId: lesson.id.toString(),
        title: lesson.video.title,
        inProgressUser: lesson.inProgressUsers,
        completedUsers: lesson.completedUsers
      }));
      
      setLessonEngagement(transformedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  useEffect(() => {
    fetchUserAnalytics();
    fetchLessonAnalytics();
  }, []); // Fetch data when component mounts

  // Mock data - User Growth
  const userGrowthData: UserStats[] = [
    { month: 'Jan', users: 20 },
    { month: 'Feb', users: 30 },
    { month: 'Mar', users: 50 },
    { month: 'Apr', users: 60 },
    { month: 'May', users: 77 },
    { month: 'Jun', users: 99 },
    { month: 'Jul', users: 10 }
  ];

  // Level Distribution Data
  const levelDistribution = [
    { name: 'Beginner', value: 45, color: '#10b981' },
    { name: 'Intermediate', value: 35, color: '#f59e0b' },
    { name: 'Advanced', value: 20, color: '#ef4444' }
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    growth: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, growth, icon, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          growth >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {growth >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {Math.abs(growth)}%
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Tổng Quan</h1>
          <p className="text-gray-600">Chào mừng trở lại! Đây là tổng quan về hệ thống của bạn.</p>
        </div>

        {/* Time Range Filter */}
        {/* <div className="mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="90days">90 ngày qua</option>
            <option value="1year">1 năm qua</option>
          </select>
        </div> */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng Người Dùng"
            value={(userAnalyticsData?.total_users ?? 0).toLocaleString()}
            growth={userAnalyticsData?.user_growth ?? 0}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            title="Tổng Bài Học"
            value={userAnalyticsData?.total_lessons ?? 0}
            growth={userAnalyticsData?.lesson_growth ?? 0}
            icon={<Video className="w-6 h-6 text-purple-600" />}
            color="bg-purple-100"
          />
          <StatCard
            title="Hoạt Động Hôm Nay"
            value={(userAnalyticsData?.active_users_today ?? 0).toLocaleString()}
            growth={userAnalyticsData?.active_users_growth ?? 0}
            icon={<Activity className="w-6 h-6 text-green-600" />}
            color="bg-green-100"
          />
          <StatCard
            title="Tổng Lượt Xem"
            value={((userAnalyticsData?.total_views ?? 0)).toFixed(0)}
            growth={userAnalyticsData?.views_growth ?? 0}
            icon={<Eye className="w-6 h-6 text-orange-600" />}
            color="bg-orange-100"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Tăng Trưởng Người Dùng</h2>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Level Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Phân Bố Cấp Độ</h2>
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={levelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {levelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {levelDistribution.map((level) => (
                <div key={level.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: level.color }}
                    />
                    <span className="text-sm text-gray-700">{level.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{level.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Lessons */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900">Top 5 Bài Học Phổ Biến</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bài Học</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Kênh</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Cấp Độ</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Học Viên</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Hoàn Thành</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Đánh Giá</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Lượt Xem</th>
                </tr>
              </thead>
              <tbody>
                {lessonAnalyticsData?.map((lesson, index) => (
                  <tr key={lesson.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 relative">
                          <img 
                            src={lesson.video.thumbnail} 
                            alt={lesson.video.title}
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                          <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 truncate">{lesson.video.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{lesson.video.channel}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        lesson.video.level === 'beginner' ? 'bg-green-100 text-green-700' :
                        lesson.video.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {lesson.video.level}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">{lesson.totalUsers.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-gray-900">{lesson.completionRate}%</span>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${lesson.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-semibold text-gray-900">{lesson.averageRating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">{lesson.video.view.toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lesson Engagement */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Thống Kê Người Học Theo Bài</h2>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={LessonEngagement}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="title" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="completedUsers" fill="#10b981" name="Đã hoàn thành" radius={[8, 8, 0, 0]} />
              <Bar dataKey="inProgressUser" fill="#6366f1" name="Đang học" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Engagement Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm font-semibold text-gray-700">Đã hoàn thành</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
              {lessonAnalyticsData?.reduce((sum, l) => sum + l.completedUsers, 0)?.toLocaleString() ?? 0}
              </p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                <span className="text-sm font-semibold text-gray-700">Đang học</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {lessonAnalyticsData?.reduce((sum, l) => sum + l.inProgressUsers, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">Tỷ lệ hoàn thành TB</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {lessonAnalyticsData ? Math.round(lessonAnalyticsData.reduce((sum, l) => sum + l.completionRate, 0) / lessonAnalyticsData.length) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;