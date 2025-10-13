import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Video,
  MoreVertical,
  ChevronDown,
  Calendar,
  Users,
  PlayCircle
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  channel: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  duration: string;
  views: number;
  createdAt: string;
  status: 'published' | 'draft';
}

const LessonManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Mock data
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'The power of believing that you can improve',
      channel: 'TED Talks',
      level: 'intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
      duration: '10:20',
      views: 15420,
      createdAt: '2024-01-15',
      status: 'published'
    },
    {
      id: '2',
      title: 'How to learn any language in six months',
      channel: 'TEDx Talks',
      level: 'beginner',
      thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop',
      duration: '18:15',
      views: 28900,
      createdAt: '2024-01-20',
      status: 'published'
    },
    {
      id: '3',
      title: 'The secrets of learning a new language',
      channel: 'BBC Learning English',
      level: 'advanced',
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
      duration: '12:45',
      views: 8750,
      createdAt: '2024-02-01',
      status: 'draft'
    },
    {
      id: '4',
      title: 'English Grammar: Past Simple vs Present Perfect',
      channel: 'Khan Academy',
      level: 'beginner',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop',
      duration: '15:30',
      views: 12300,
      createdAt: '2024-02-05',
      status: 'published'
    },
    {
      id: '5',
      title: 'Advanced Vocabulary for Business English',
      channel: 'Business English Pod',
      level: 'advanced',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
      duration: '22:10',
      views: 5600,
      createdAt: '2024-02-08',
      status: 'published'
    },
    {
      id: '6',
      title: 'Pronunciation Practice: Common Mistakes',
      channel: 'Rachel English',
      level: 'intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop',
      duration: '14:25',
      views: 19200,
      createdAt: '2024-02-12',
      status: 'published'
    }
  ]);

  const levelColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700'
  };

  const levelLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  };

  const statusColors = {
    published: 'bg-blue-100 text-blue-700',
    draft: 'bg-gray-100 text-gray-700'
  };

  const statusLabels = {
    published: 'Published',
    draft: 'Draft'
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.channel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || lesson.level === filterLevel;
    const matchesStatus = filterStatus === 'all' || lesson.status === filterStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
      setLessons(lessons.filter(lesson => lesson.id !== id));
    }
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const stats = {
    total: lessons.length,
    published: lessons.filter(l => l.status === 'published').length,
    draft: lessons.filter(l => l.status === 'draft').length,
    totalViews: lessons.reduce((sum, l) => sum + l.views, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản Lý Bài Học</h1>
          <p className="text-gray-600">Quản lý và theo dõi tất cả các bài học video của bạn</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Tổng bài học</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Video className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Đã xuất bản</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.published}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <PlayCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Bản nháp</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.draft}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <Edit className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Tổng lượt xem</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {(stats.totalViews / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm bài học theo tiêu đề hoặc kênh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            {/* Level Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition appearance-none bg-white"
              >
                <option value="all">Tất cả cấp độ</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition appearance-none bg-white pr-10"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Add Button */}
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl">
              <Plus className="w-5 h-5" />
              Thêm bài học
            </button>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <div key={lesson.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
              {/* Thumbnail */}
              <div className="relative overflow-hidden">
                <img 
                  src={lesson.thumbnail} 
                  alt={lesson.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-semibold">
                  {lesson.duration}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                  <Eye className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-2 flex-1">
                    {lesson.title}
                  </h3>
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(lesson.id)}
                      className="p-1 hover:bg-gray-100 rounded-full transition"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    {activeDropdown === lesson.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                          <Eye className="w-4 h-4" />
                          Xem chi tiết
                        </button>
                        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                          <Edit className="w-4 h-4" />
                          Chỉnh sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(lesson.id)}
                          className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3">{lesson.channel}</p>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelColors[lesson.level]}`}>
                    {levelLabels[lesson.level]}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[lesson.status]}`}>
                    {statusLabels[lesson.status]}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{lesson.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(lesson.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLessons.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy bài học</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonManagement;