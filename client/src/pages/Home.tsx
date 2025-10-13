import { useState, useEffect } from "react";
import { getVideos } from "../services/videoServices";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import VideoCard from "../components/video/VideoCard";
import type { Video } from "../types/video";

export default function HomePage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("intermediate");
  const [videosByLevel, setVideosByLevel] = useState<{ [key: string]: Video[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const levels = ["intermediate", "upper-intermediate", "advanced", "proficient"];

  const fetchVideosByLevel = async (level: string) => {
    try {
      setLoading(true);
      const videos = await getVideos(level);
      setVideosByLevel(prev => ({
        ...prev,
        [level]: videos
      }));
    } catch (error) {
      console.error(`Failed to load videos for ${level}`, error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi chọn level mới
  const handleLevelChange = async (level: string) => {
    setSelectedLevel(level);
    // Chỉ gọi API nếu chưa có data của level này
    if (!videosByLevel[level]) {
      await fetchVideosByLevel(level);
    }
  };

  // Chỉ gọi API cho level mặc định khi mount
  useEffect(() => {
    fetchVideosByLevel(selectedLevel);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <p className="text-gray-600">Loading videos...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="text-center py-12 bg-gray-50">
        <h2 className="text-4xl font-bold mb-4">
          Watch. Learn. <br /> Have fun!
        </h2>
        <p className="text-gray-600 mb-6">
          Master English daily conversations and authentic usages with countless
          trending videos.
        </p>
        <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700">
          START NOW
        </button>
      </section>

      <div className="bg-red-600 text-white text-center py-3 font-medium">
        Over 1000+ videos to learn English
      </div>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <h3 className="text-xl font-semibold mb-2">
          A Learning Experience Personalized
        </h3>
        <p className="text-gray-600 mb-6">
          Achieve your goals with videos that's tailored to your proficiency
          level, and interests. Stay motivated with real-time feedback, progress
          trackers, and handy visualizations.
        </p>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
          {levels.map((tab) => (
            <button
              key={tab}
              onClick={() => handleLevelChange(tab)}
              className={`pb-2 capitalize whitespace-nowrap ${
                selectedLevel === tab
                  ? "border-b-2 border-red-600 text-red-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Level Sections */}
        {levels.map(level => (
          <div key={level} className={`mb-12 ${selectedLevel === level ? '' : 'hidden'}`}>
            <h4 className="text-lg font-semibold mb-4 capitalize">
              {level === 'intermediate' && 'B1 - Intermediate'}
              {level === 'upper-intermediate' && 'B2 - Upper Intermediate'}
              {level === 'advanced' && 'C1 - Advanced'}
              {level === 'proficient' && 'C2 - Proficient'}
            </h4>
            <p className="text-gray-600 mb-6">
              {level === 'intermediate' && 'Listening practice to help you understand the main points of clear, standard speech about everyday or job-related topics.'}
              {level === 'upper-intermediate' && 'Practice with natural, fluent speech and a variety of accents. Understand main ideas of complex texts.'}
              {level === 'advanced' && 'Master complex technical discussions and abstract topics. Handle nuanced expressions and implied meanings.'}
              {level === 'proficient' && 'Understand virtually everything heard or read. Express spontaneously, fluently and precisely.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videosByLevel[level]?.map((video: Video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        ))}
      </section>
      <Footer />
    </div>
  );
}