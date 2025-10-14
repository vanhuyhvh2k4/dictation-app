import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Video } from '../../types/video';
import { getTopicById, getVideosByTopicId } from '../../services/topicService';
import VideoCard from '../../components/video/VideoCard';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import type { Topic } from '../../types/topic';

export default function TopicVideos() {
  const { topicId } = useParams<{ topicId: string }>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [topic, setTopic] = useState<Topic>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    fetchTopic(); 
    fetchVideos();
  }, [topicId]);

  const fetchVideos = async () => {
      if (!topicId) return;
      
      try {
        setLoading(true);
        const data = await getVideosByTopicId(topicId);
        setVideos(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching topic videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTopic = async () => {
      if (!topicId) return null;
      try {
        const topic = await getTopicById(topicId);
        console.log(topic);
        
        setTopic(topic);
      } catch (err) {
        console.error('Error fetching topic info:', err);
        return null;
      }
    };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* Topic Info Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {topic?.title || 'Topic Videos'}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{videos.length} videos</span>
                {topic?.levels && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Level: {topic?.levels}
                  </span>
                )}
              </div>
            </div>

            {/* Videos Grid */}
            {videos.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                No videos found for this topic
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    className="bg-white hover:transform hover:-translate-y-1"
                  />
                ))}
              </div>
            )}

            {/* Video Count */}
            {videos.length > 0 && (
              <div className="mt-8 text-center text-sm text-gray-500">
                Showing {videos.length} {videos.length === 1 ? 'video' : 'videos'}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};
