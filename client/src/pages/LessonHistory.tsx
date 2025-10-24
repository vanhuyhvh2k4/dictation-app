import { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";
import Header from "../components/header/Header";
import { getAllProgress } from "../services/progressService";
import type { Video } from "../types/video";

const LessonHistory = () => {
  const [filter, setFilter] = useState<"all" | "completed" | "in-progress">(
    "all"
  );
  const [progressData, setProgressData] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await getAllProgress();
        setProgressData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError("Không thể tải lịch sử học tập");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const filteredLessons = progressData.filter((progress) =>
    filter === "all"
      ? true
      : filter === "completed"
      ? progress.progress?.completed
      : !progress.progress?.completed
  );

  const totalCompleted = progressData.filter(
    (p) => p.progress?.completed
  ).length;

  // Convert duration string (MM:SS) to minutes
  const parseDuration = (duration: string): number => {
    const [minutes, seconds] = duration.split(":").map(Number);
    return minutes + seconds / 60;
  };

  const totalHours = Math.round(
    progressData.reduce((sum, p) => sum + parseDuration(p.duration), 0) / 60
  );

  const avgScore =
    progressData.length > 0
      ? Math.round(
          progressData.reduce(
            (sum, p) => sum + (p.progress?.totalScore || 0),
            0
          ) / progressData.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header />
      <div className="max-w-6xl mx-auto mt-5">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Lịch Sử Học Tập
              </h1>
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
                  <p className="text-sm text-gray-600 mb-1">
                    Bài học hoàn thành
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalCompleted}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Tổng thời gian học
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalHours}h
                  </p>
                </div>
                <Clock className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Điểm trung bình</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {avgScore}%
                  </p>
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
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === "completed"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Đã hoàn thành
            </button>
            <button
              onClick={() => setFilter("in-progress")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === "in-progress"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Đang học
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredLessons.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có lịch sử học tập
            </h3>
            <p className="text-gray-600">
              Bắt đầu học một bài học để xem lịch sử của bạn tại đây
            </p>
          </div>
        )}

        {/* Lessons Grid */}
        {!loading && !error && filteredLessons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredLessons.map((progress) => (
              <div
                key={progress.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative w-full h-48">
                  <img
                    src={progress.thumbnail}
                    alt={progress.title}
                    className="w-full h-full object-cover"
                  />
                  {progress.progress?.completed && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-lg shadow-lg">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                  {!progress.progress?.completed && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white p-2 rounded-lg shadow-lg">
                      <Clock className="w-5 h-5" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      {progress.progress?.completed && (
                        <span className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                          Hoàn thành
                        </span>
                      )}
                      {!progress.progress?.completed && (
                        <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded">
                          Đang học ({progress.progress?.transcriptsCompleted}{" "}
                          câu)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem]">
                    {progress.title}
                  </h3>

                  <div className="flex flex-col gap-2 text-sm text-gray-500 mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>Ngày xem: </span>
                      <span>
                        {progress.progress?.updatedAt
                          ? new Date(progress.progress.updatedAt).toLocaleDateString("vi-VN")
                          : ""}
                      </span>
                    </div>
                      {(progress.progress?.totalScore || 0) > 0 && (
                        <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded">
                          <TrendingUp className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-600">
                            {progress.progress?.totalScore}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {progress.progress?.completed && (
                    <button
                      onClick={() =>
                        (window.location.href = `/videos/${progress.id}`)
                      }
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Xem lại
                    </button>
                  )}
                  {!progress.progress?.completed && (
                    <button
                      onClick={() =>
                        (window.location.href = `/videos/${progress.id}`)
                      }
                      className="w-full bg-white hover:bg-gray-50 border-2 border-red-600 text-red-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Tiếp tục học
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonHistory;
