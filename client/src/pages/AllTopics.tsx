import React, { useState, useEffect } from 'react';
import { Video, ChevronRight } from 'lucide-react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { getAllTopics } from '../services/topicService';
import { useNavigate } from 'react-router-dom';
import type { Topic } from '../types/topic';

const LearningTopics: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const data = await getAllTopics();
        setTopics(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch topics. Please try again later.');
        console.error('Error fetching topics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleTopicClick = (topicId: string) => {
    navigate(`/topics/${topicId}/videos`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className={`group relative bg-white border-2 rounded-2xl shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 overflow-hidden ${
                  hoveredId === topic.id 
                    ? 'border-red-600 transform -translate-y-1' 
                    : 'border-gray-200'
                }`}
                onClick={() => handleTopicClick(topic.id)}
                onMouseEnter={() => setHoveredId(topic.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Red accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-red-600 transition-all duration-300 ${
                  hoveredId === topic.id ? 'h-2' : ''
                }`} />
                
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {/* Image */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all duration-300 ${
                      hoveredId === topic.id 
                        ? 'shadow-lg ring-2 ring-red-600' 
                        : ''
                    }`}>
                      <img 
                        src={topic.image} 
                        alt={topic.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Title */}
                    <h2 className={`flex-1 text-lg font-bold transition-colors duration-300 ${
                      hoveredId === topic.id ? 'text-red-600' : 'text-gray-800'
                    }`}>
                      {topic.title}
                    </h2>
                    
                    {/* Video Badge */}
                    {topic.hasVideo && (
                      <span className="flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                        <Video size={10} />
                        Video
                      </span>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Levels:</span>
                      <span className="text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">
                        {topic.levels}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Lessons:</span>
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        {topic.lessons}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className={`flex items-center justify-end gap-1 text-xs font-semibold transition-colors duration-300 ${
                    hoveredId === topic.id ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    <span>Explore</span>
                    <ChevronRight 
                      className={`transition-transform duration-300 ${
                        hoveredId === topic.id ? 'translate-x-1' : ''
                      }`} 
                      size={16} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default LearningTopics;