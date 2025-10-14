import React, { useState } from 'react';
import { BookOpen, Clock, CheckCircle, TrendingUp, Calendar, Award } from 'lucide-react';
import Header from '../components/header/Header';

interface Lesson {
  id: number;
  title: string;
  channel: string;
  completedAt: string;
  duration: number;
  score: number;
  status: 'completed' | 'in-progress';
  image: string;
}

const LessonHistory = () => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
  
  const lessons: Lesson[] = [
    {
      id: 1,
      title: 'Giới thiệu về React Hooks',
      channel: 'React cho người mới bắt đầu',
      completedAt: '2025-10-14',
      duration: 45,
      score: 95,
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      title: 'TypeScript Fundamentals',
      channel: 'TypeScript từ A-Z',
      completedAt: '2025-10-13',
      duration: 60,
      score: 88,
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      title: 'Tailwind CSS Advanced',
      channel: 'CSS Framework Master',
      completedAt: '2025-10-12',
      duration: 30,
      score: 0,
      status: 'in-progress',
      image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=250&fit=crop'
    },
    {
      id: 4,
      title: 'State Management với Redux',
      channel: 'React cho người mới bắt đầu',
      completedAt: '2025-10-11',
      duration: 75,
      score: 92,
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop'
    },
    {
      id: 5,
      title: 'API Integration',
      channel: 'Backend Integration',
      completedAt: '2025-10-10',
      duration: 50,
      score: 85,
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop'
    }
  ];

  const filteredLessons = lessons.filter(lesson => 
    filter === 'all' ? true : lesson.status === filter
  );

  const totalCompleted = lessons.filter(l => l.status === 'completed').length;
  const totalHours = Math.round(lessons.reduce((sum, l) => sum + l.duration, 0) / 60);
  const avgScore = Math.round(
    lessons.filter(l => l.score > 0).reduce((sum, l) => sum + l.score, 0) / 
    lessons.filter(l => l.score > 0).length
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
        <Header />
      <div className="max-w-6xl mx-auto mt-5">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch Sử Học Tập</h1>
              <p className="text-gray-600">Theo dõi tiến độ học tập của bạn</p>
            </div>
            <div className="bg-red-600 text-white p-4 rounded-lg">
              <Award className="w-8 h-8" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bài học hoàn thành</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCompleted}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tổng thời gian học</p>
                  <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
                </div>
                <Clock className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Điểm trung bình</p>
                  <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đã hoàn thành
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'in-progress'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đang học
            </button>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative w-full h-48">
                <img 
                  src={lesson.image} 
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                />
                {lesson.status === 'completed' && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-lg shadow-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
                {lesson.status === 'in-progress' && (
                  <div className="absolute top-3 right-3 bg-yellow-500 text-white p-2 rounded-lg shadow-lg">
                    <Clock className="w-5 h-5" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    {lesson.status === 'completed' && (
                      <span className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                        Hoàn thành
                      </span>
                    )}
                    {lesson.status === 'in-progress' && (
                      <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded">
                        Đang học
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                  {lesson.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-1">{lesson.channel}</p>
                
                <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <span>{new Date(lesson.completedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span>{lesson.duration} phút</span>
                    </div>
                    {lesson.score > 0 && (
                      <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded">
                        <TrendingUp className="w-4 h-4 text-red-600" />
                        <span className="font-semibold text-red-600">{lesson.score}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {lesson.status === 'completed' && (
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    Xem lại
                  </button>
                )}
                {lesson.status === 'in-progress' && (
                  <button className="w-full bg-white hover:bg-gray-50 border-2 border-red-600 text-red-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    Tiếp tục học
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonHistory;