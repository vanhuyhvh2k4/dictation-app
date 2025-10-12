import React, { useState } from 'react';
import { Video, ChevronRight } from 'lucide-react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

interface Topic {
  id: string;
  title: string;
  levels: string;
  lessons: number;
  hasVideo?: boolean;
  image: string;
}

const LearningTopics: React.FC = () => {
  const topics: Topic[] = [
    { id: '1', title: 'Short Stories', levels: 'A1-C1', lessons: 289, image: '📚' },
    { id: '2', title: 'Conversations', levels: 'A1-B1', lessons: 100, image: '💬' },
    { id: '3', title: 'Stories for Kids', levels: 'A2-B2', lessons: 13, hasVideo: true, image: '🧚' },
    { id: '4', title: 'TOEIC Listening', levels: 'A2-C1', lessons: 600, image: '🎧' },
    { id: '5', title: 'IELTS Listening', levels: 'B1-C1', lessons: 344, image: '🎓' },
    { id: '6', title: 'Random Videos', levels: 'B1-C2', lessons: 181, hasVideo: true, image: '📺' },
    { id: '7', title: 'News', levels: 'B1-C1', lessons: 202, hasVideo: true, image: '📰' },
    { id: '8', title: 'TED', levels: 'C1-C2', lessons: 89, hasVideo: true, image: '🎤' },
    { id: '9', title: 'TOEFL Listening', levels: 'B1-C2', lessons: 54, image: '📖' },
    { id: '10', title: 'Medical English (OET)', levels: 'B1-C2', lessons: 80, image: '⚕️' },
    { id: '11', title: 'IPA', levels: 'A1', lessons: 42, image: '🔤' },
    { id: '12', title: 'Numbers', levels: 'A1', lessons: 9, image: '🔢' },
    { id: '13', title: 'Spelling Names', levels: 'A1', lessons: 6, image: '✍️' },
  ];

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className={`group relative bg-white border-2 rounded-2xl shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 overflow-hidden ${
                hoveredId === topic.id 
                  ? 'border-red-600 transform -translate-y-1' 
                  : 'border-gray-200'
              }`}
              onMouseEnter={() => setHoveredId(topic.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Red accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-red-600 transition-all duration-300 ${
                hoveredId === topic.id ? 'h-2' : ''
              }`} />
              
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-3xl transition-all duration-300 ${
                    hoveredId === topic.id 
                      ? 'bg-red-600 shadow-lg' 
                      : 'bg-gray-100'
                  }`}>
                    {topic.image}
                  </div>
                  
                  {/* Video Badge */}
                  {topic.hasVideo && (
                    <span className="flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      <Video size={12} />
                      Video
                    </span>
                  )}
                </div>
                
                {/* Title */}
                <h2 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                  hoveredId === topic.id ? 'text-red-600' : 'text-gray-800'
                }`}>
                  {topic.title}
                </h2>
                
                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Levels:</span>
                    <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                      {topic.levels}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Lessons:</span>
                    <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                      {topic.lessons}
                    </span>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className={`flex items-center justify-end gap-2 text-sm font-semibold transition-colors duration-300 ${
                  hoveredId === topic.id ? 'text-red-600' : 'text-gray-500'
                }`}>
                  <span>Explore</span>
                  <ChevronRight 
                    className={`transition-transform duration-300 ${
                      hoveredId === topic.id ? 'translate-x-1' : ''
                    }`} 
                    size={20} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LearningTopics;