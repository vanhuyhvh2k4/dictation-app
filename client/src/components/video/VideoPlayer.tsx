import type { Video } from '../../types/video';
import type { RefObject } from 'react';

interface VideoPlayerProps {
  video: Video | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  onTimeUpdate: () => void;
  onPlay: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  videoRef,
  onTimeUpdate,
  onPlay,
}) => {
  return (
    <div className="rounded-xl overflow-hidden shadow border flex flex-col h-[450px]">
      {video && (
        <div className="flex-1">
          <video
            ref={videoRef}
            width="100%"
            height="100%"
            className="h-full object-cover"
            controls
            onTimeUpdate={onTimeUpdate}
            onPlay={onPlay}
          >
            <source src={`${video.url}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      <div className="p-4 bg-white">
        <h2 className="text-lg font-semibold">{video?.title}</h2>
        <p className="text-sm text-gray-500">Vocab level: {video?.level}</p>
      </div>
    </div>
  );
};