import { Link } from 'react-router-dom';
import type { Video } from '../../types/video';
import Cookies from 'js-cookie';

interface VideoCardProps {
  video: Video;
  className?: string;
}

const VideoCard = ({ video, className = '' }: VideoCardProps) => {
  const isLoggedIn = !!Cookies.get("token");

  const getProgressPercentage = (progress: Video['progress']) => {
    if (!progress) return 0;
    return Math.round((progress.transcriptsCompleted / progress.totalTranscripts) * 100);
  };

  return (
    <Link
      to={`/videos/${video.id}`}
      className={`rounded-xl overflow-hidden shadow hover:shadow-lg transition block ${className}`}
    >
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover"
        />
        <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </span>
      </div>

      <div className="p-3">
        <h5 className="font-semibold text-sm mb-1 line-clamp-2">{video.title}</h5>
        <p className="text-xs text-gray-500">
          {video.channel} • {video.view} views • {video.date}
        </p>
        
        {/* Progress bar - Show for logged in users */}
        {isLoggedIn && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
              <div 
                className="bg-red-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(video.progress)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>
                {video.progress ? (
                  `${video.progress.transcriptsCompleted} / ${video.progress.totalTranscripts} completed`
                ) : (
                  "Not started"
                )}
              </span>
              <span>
                {video.progress ? (
                  `${video.progress.totalScore.toFixed(0)} points`
                ) : (
                  "0 points"
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default VideoCard;