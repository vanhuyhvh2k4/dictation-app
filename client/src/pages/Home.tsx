import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVideos } from "../services/videoServices";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Cookies from "js-cookie";
import type { Video } from "../types/video";

export default function HomePage() {
  const [level, setLevel] = useState<string>("intermediate");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isLoggedIn = !!Cookies.get("token");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Failed to load videos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getProgressPercentage = (progress: Video['progress']) => {
    if (!progress) return 0;
    return Math.round((progress.transcriptsCompleted / progress.totalTranscripts) * 100);
  };

  if (loading) return <p>Loading...</p>;

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
          {["intermediate", "upper intermediate", "advanced", "proficient"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setLevel(tab)}
                className={`pb-2 capitalize ${
                  level === tab
                    ? "border-b-2 border-red-600 text-red-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Video List */}
        <div>
          <h4 className="text-lg font-semibold mb-4">B1 - Intermediate</h4>
          <p className="text-gray-600 mb-6">
            Listening practice to help you understand the main points of clear,
            standard speech about everyday or job-related topics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Link
                key={video.id}
                to={`/videos/${video.id}`}
                className="rounded-xl overflow-hidden shadow hover:shadow-lg transition block"
              >
                <div className="relative">
                  <img
                    src={`${video.thumbnail}`}
                    alt={video.title}
                  />
                  <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="p-3">
                  <h5 className="font-semibold text-sm mb-1">{video.title}</h5>
                  <p className="text-xs text-gray-500">
                    {video.channel} • {video.view} • {video.date}
                  </p>
                  
                  {/* Progress bar - Only show for logged in users with progress */}
                  {isLoggedIn && video.progress && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                        <div 
                          className="bg-red-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(video.progress)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{video.progress.transcriptsCompleted} / {video.progress.totalTranscripts} completed</span>
                        <span>{video.progress.totalScore.toFixed(0)} points</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}