import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Camera, Award, BookOpen, Clock, TrendingUp, Save, X } from 'lucide-react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@example.com',
    phone: '0123 456 789',
    location: 'Đà Nẵng, Việt Nam',
    joinDate: '2024-01-15',
    bio: 'Đam mê học tập và phát triển kỹ năng lập trình. Luôn tìm kiếm những thách thức mới để nâng cao khả năng của bản thân.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  });

  const [formData, setFormData] = useState(userData);

  const stats = [
    { icon: BookOpen, label: 'Bài học hoàn thành', value: '45', color: 'bg-red-100 text-red-600' },
    { icon: Clock, label: 'Tổng thời gian học', value: '127h', color: 'bg-red-100 text-red-600' },
    { icon: TrendingUp, label: 'Điểm trung bình', value: '92%', color: 'bg-red-100 text-red-600' },
    { icon: Award, label: 'Thành tích đạt được', value: '12', color: 'bg-red-100 text-red-600' }
  ];

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Hoàn thành bài học đầu tiên', date: '2024-01-20', icon: '🎯' },
    { id: 2, title: 'Fast Learner', description: 'Hoàn thành 10 bài học trong 1 tuần', date: '2024-02-15', icon: '⚡' },
    { id: 3, title: 'Perfect Score', description: 'Đạt 100% trong 5 bài học', date: '2024-03-10', icon: '🌟' },
    { id: 4, title: 'Dedicated', description: 'Học liên tục 30 ngày', date: '2024-04-05', icon: '🔥' }
  ];

  const recentActivity = [
    { id: 1, action: 'Hoàn thành', lesson: 'React Hooks Advanced', date: '2 giờ trước' },
    { id: 2, action: 'Đạt 95%', lesson: 'TypeScript Fundamentals', date: '1 ngày trước' },
    { id: 3, action: 'Hoàn thành', lesson: 'Tailwind CSS Master', date: '2 ngày trước' }
  ];

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  return (
    <div>
      <Header></Header>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="h-32 bg-gradient-to-r from-red-500 to-red-600"></div>
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <button className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
  
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{userData.name}</h1>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4 text-red-600" />
                          <span>{userData.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4 text-red-600" />
                          <span>{userData.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span>{userData.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-red-600" />
                          <span>Tham gia {new Date(userData.joinDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 mt-4 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
  
              {/* About / Edit Form */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Về tôi</h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Lưu thay đổi
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
                )}
              </div>
  
              {/* Achievements */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Thành tích</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-600 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Right Column */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Hoạt động gần đây</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          <span className="text-red-600">{activity.action}</span> {activity.lesson}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
                <div className="space-y-2">
                  <button className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-lg text-left font-medium transition-colors">
                    Xem lịch sử học tập
                  </button>
                  <button className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-lg text-left font-medium transition-colors">
                    Khóa học đang theo dõi
                  </button>
                  <button className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-lg text-left font-medium transition-colors">
                    Cài đặt tài khoản
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default UserProfile;