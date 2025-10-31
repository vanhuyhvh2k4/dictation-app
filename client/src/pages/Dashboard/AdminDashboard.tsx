import React, { useState } from 'react';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface Lesson {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  totalUsers: number;
  completionRate: number;
  averageScore: number;
  views: number;
  level: string;
}

interface UserStats {
  month: string;
  users: number;
}

interface LessonEngagement {
  lessonId: string;
  title: string;
  activeUsers: number;
  completedUsers: number;
  inProgressUsers: number;
}

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('7days');

  // Mock data - Statistics
  const stats = {
    totalUsers: 12847,
    userGrowth: 12.5,
    totalLessons: 156,
    lessonGrowth: 8.3,
    activeToday: 3421,
    activeTodayGrowth: 5.2,
    totalViews: 458920,
    viewsGrowth: 15.7
  };

  // Mock data - Top Lessons
  const topLessons: Lesson[] = [
    {
      id: '1',
      title: 'The power of believing that you can improve',
      channel: 'TED Talks',
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=150&fit=crop',
      totalUsers: 8547,
      completionRate: 87,
      averageScore: 4.8,
      views: 15420,
      level: 'Intermediate'
    },
    {
      id: '2',
      title: 'How to learn any language in six months',
      channel: 'TEDx Talks',
      thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&h=150&fit=crop',
      totalUsers: 7823,
      completionRate: 92,
      averageScore: 4.9,
      views: 28900,
      level: 'Beginner'
    },
    {
      id: '3',
      title: 'Advanced Vocabulary for Business English',
      channel: 'Business English Pod',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=150&fit=crop',
      totalUsers: 6234,
      completionRate: 78,
      averageScore: 4.6,
      views: 12300,
      level: 'Advanced'
    },
    {
      id: '4',
      title: 'English Grammar: Past Simple vs Present Perfect',
      channel: 'Khan Academy',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&h=150&fit=crop',
      totalUsers: 5890,
      completionRate: 85,
      averageScore: 4.7,
      views: 19200,
      level: 'Beginner'
    },
    {
      id: '5',
      title: 'Pronunciation Practice: Common Mistakes',
      channel: 'Rachel English',
      thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=200&h=150&fit=crop',
      totalUsers: 5456,
      completionRate: 81,
      averageScore: 4.5,
      views: 11500,
      level: 'Intermediate'
    }
  ];

  // Mock data - User Growth
  const userGrowthData: UserStats[] = [
    { month: 'Jan', users: 8500 },
    { month: 'Feb', users: 9200 },
    { month: 'Mar', users: 9800 },
    { month: 'Apr', users: 10500 },
    { month: 'May', users: 11200 },
    { month: 'Jun', users: 11900 },
    { month: 'Jul', users: 12847 }
  ];

  // Mock data - Lesson Engagement
  const lessonEngagementData: LessonEngagement[] = [
    { 
      lessonId: '1', 
      title: 'Power of Believing', 
      activeUsers: 1245, 
      completedUsers: 7302, 
      inProgressUsers: 1245 
    },
    { 
      lessonId: '2', 
      title: 'Learn Any Language', 
      activeUsers: 1089, 
      completedUsers: 6734, 
      inProgressUsers: 1089 
    },
    { 
      lessonId: '3', 
      title: 'Business Vocabulary', 
      activeUsers: 892, 
      completedUsers: 5342, 
      inProgressUsers: 892 
    },
    { 
      lessonId: '4', 
      title: 'Grammar Practice', 
      activeUsers: 756, 
      completedUsers: 5134, 
      inProgressUsers: 756 
    },
    { 
      lessonId: '5', 
      title: 'Pronunciation', 
      activeUsers: 634, 
      completedUsers: 4822, 
      inProgressUsers: 634 
    }
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
        <div className="mb-6 flex items-center gap-2">
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng Người Dùng"
            value={stats.totalUsers.toLocaleString()}
            growth={stats.userGrowth}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            title="Tổng Bài Học"
            value={stats.totalLessons}
            growth={stats.lessonGrowth}
            icon={<Video className="w-6 h-6 text-purple-600" />}
            color="bg-purple-100"
          />
          <StatCard
            title="Hoạt Động Hôm Nay"
            value={stats.activeToday.toLocaleString()}
            growth={stats.activeTodayGrowth}
            icon={<Activity className="w-6 h-6 text-green-600" />}
            color="bg-green-100"
          />
          <StatCard
            title="Tổng Lượt Xem"
            value={(stats.totalViews / 1000).toFixed(0) + 'K'}
            growth={stats.viewsGrowth}
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
                {topLessons.map((lesson, index) => (
                  <tr key={lesson.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 relative">
                          <img 
                            src={lesson.thumbnail} 
                            alt={lesson.title}
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                          <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 truncate">{lesson.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{lesson.channel}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        lesson.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                        lesson.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {lesson.level}
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
                        <span className="font-semibold text-gray-900">{lesson.averageScore}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">{lesson.views.toLocaleString()}</span>
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
            <BarChart data={lessonEngagementData}>
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
              <Bar dataKey="activeUsers" fill="#6366f1" name="Đang học" radius={[8, 8, 0, 0]} />
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
                {lessonEngagementData.reduce((sum, l) => sum + l.completedUsers, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                <span className="text-sm font-semibold text-gray-700">Đang học</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {lessonEngagementData.reduce((sum, l) => sum + l.activeUsers, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">Tỷ lệ hoàn thành TB</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(topLessons.reduce((sum, l) => sum + l.completionRate, 0) / topLessons.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;