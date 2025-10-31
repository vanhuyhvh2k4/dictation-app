import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Transcript from "../components/transcript/Transcript";
import { BreadcrumbNav } from "../components/video/BreadcrumbNav";
import { VideoPlayer } from "../components/video/VideoPlayer";
import { DictationPanel } from "../components/video/DictationPanel";
import { getVideoById, updateVideoTotalUsers } from "../services/videoServices";
import { getVideoProgress, updateVideoProgress } from "../services/progressService";
import type { Video } from "../types/video";
import type { FeedbackItem } from "../types/feedback";

export default function VideoDictation() {
  const [video, setVideo] = useState<Video | null>(null);
  const { id } = useParams<{ id: string }>();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<FeedbackItem[] | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [skipped, setSkipped] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dictation' | 'transcript'>('dictation');

  const transcripts = video?.Transcripts || [];
  const currentTranscript = transcripts[currentIndex];

  // Load initial progress
  useEffect(() => {
    if (!id) return;

    const loadProgress = async () => {
      const token = Cookies.get('token');
      // Only try to get progress if user is logged in
      if (token) {
        try {
          const progress = await getVideoProgress(parseInt(id));
          if (progress) {
            // Set current transcript index from saved progress
            setCurrentIndex(progress.currentTranscriptIndex);
            
            // If there's a video and a current transcript, set the video time
            if (videoRef.current && transcripts[progress.currentTranscriptIndex]) {
              videoRef.current.currentTime = transcripts[progress.currentTranscriptIndex].start;
            }
          }
        } catch (error) {
          console.error('Error loading progress:', error);
        }
      }
    };

    loadProgress();
  }, [id, transcripts]);

  // Update total users when video starts playing
  useEffect(() => {
    const handleFirstPlay = async () => {
      if (!id || !video) return;
      try {
        await updateVideoTotalUsers(id);
      } catch (error) {
        // Ignore errors - non-authenticated users or already counted users
        console.log('Total users update:', error);
      }
    };

    const videoElement = videoRef.current;
    videoElement?.addEventListener('play', handleFirstPlay, { once: true }); // Run only on first play

    return () => {
      videoElement?.removeEventListener('play', handleFirstPlay);
    };
  }, [id, video]);

  // Setup cleanup for page unload
  useEffect(() => {
    // Save progress when leaving the page
    const handleBeforeUnload = () => {
      if (isCorrect && score !== null) {
        saveProgress(score);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Remove event listener
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Save progress one last time
      if (isCorrect && score !== null) {
        saveProgress(score);
      }
    };
  }, [isCorrect, score]);

  // Save video progress
  const saveProgress = async (transcriptScore: number) => {
    if (!id) return;

    const token = Cookies.get('token');
    // Only save progress if user is logged in
    if (token) {
      try {
        await updateVideoProgress(
          parseInt(id),
          currentIndex + 1,
          transcriptScore
        );
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  // Auto stop when reaching the end of transcript
  const handleTimeUpdate = () => {
    if (
      currentTranscript &&
      videoRef.current &&
      videoRef.current.currentTime >= currentTranscript.end
    ) {
      videoRef.current.pause();
    }
  };

  const handlePlayVideo = () => {
    if (
      currentTranscript &&
      videoRef.current &&
      videoRef.current.currentTime >= currentTranscript.end
    ) {
      // Quay lại đầu transcript
      videoRef.current.currentTime = currentTranscript.start;
    }
  };

  const handlePlayCurrentTranscript = () => {
    if (videoRef.current && currentTranscript) {
      videoRef.current.currentTime = currentTranscript.start;
      videoRef.current.play();
    }
  };

  // When user answers correctly → go to next transcript
  const handleCheckAnswer = () => {
    if (!currentTranscript) return;

    // Hàm chuẩn hóa (loại bỏ dấu câu + lowercase)
    const normalize = (str: string) =>
      str
        .replace(/[.,!?;:'"()]/g, "") // bỏ dấu câu
        .toLowerCase();

    const userWords = answer.trim().split(/\s+/).map(normalize);
    const correctWords = currentTranscript.text
      .trim()
      .split(/\s+/)
      .map(normalize);

    const result: FeedbackItem[] = correctWords.map((word, idx) => {
      if (userWords[idx] && userWords[idx] === word) {
        return { word, correct: true };
      } else {
        return { word, correct: false, userWord: userWords[idx] || "" };
      }
    });

    const correctCount = result.filter((r) => r.correct).length;
    const scorePercent = Math.round((correctCount / correctWords.length) * 100);

    setFeedback(result);
    setScore(scorePercent);
    setIsCorrect(scorePercent === 100);
    
    // If answer is correct, save progress
    if (scorePercent === 100) {
      saveProgress(scorePercent);
    }
    if (scorePercent !== 100) setSkipped(false);
  };

  const handleSkip = () => {
    if (!currentTranscript) return;
    if (videoRef.current) videoRef.current.pause();

    const correctWords = currentTranscript.text.trim().split(/\s+/);
    const result: FeedbackItem[] = correctWords.map((word) => ({
      word,
      correct: true,
    }));

    setFeedback(result);
    setScore(0);
    setIsCorrect(false);
    setSkipped(true);
    saveProgress(0);
  };

  const handleNext = () => {
    if (currentIndex < transcripts.length - 1) {
      // Save progress before moving to next transcript
      if (isCorrect && score !== null) {
        // saveProgress(score);
      }
      
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setAnswer("");
      setFeedback(null);
      setScore(null);
      setIsCorrect(false);
      setSkipped(false);

      if (videoRef.current) {
        videoRef.current.currentTime = transcripts[nextIndex].start;
        videoRef.current.play();
      }
    } else {
      // Save final progress for the last transcript
      if (isCorrect && score !== null) {
        saveProgress(score);
      }
      alert("🎉 You've completed all transcripts!");
    }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      try {
        const data = await getVideoById(id); // lấy id từ URL
        setVideo(data);
      } catch (error) {
        console.error("Failed to load video", error);
      }
    };

    fetchVideo();
  }, [id]);

  // When transcript changes → jump to its start
  useEffect(() => {
    if (currentTranscript && videoRef.current) {
      videoRef.current.currentTime = currentTranscript.start;
    }
  }, [currentIndex, currentTranscript]);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <BreadcrumbNav title={video?.title} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab Headers */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('dictation')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'dictation'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500 hover:text-red-600'
            }`}
          >
            Dictation
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'transcript'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500 hover:text-red-600'
            }`}
          >
            Full transcript
          </button>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VideoPlayer
            video={video}
            videoRef={videoRef}
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlayVideo}
          />

          {/* Right Panel - Changes based on active tab */}
          <div className="border rounded-xl shadow h-[450px] flex flex-col">
            {activeTab === 'dictation' ? (
              <DictationPanel
                currentIndex={currentIndex}
                transcripts={transcripts}
                currentTranscript={currentTranscript}
                answer={answer}
                feedback={feedback}
                score={score}
                isCorrect={isCorrect}
                skipped={skipped}
                onAnswerChange={setAnswer}
                onPlay={handlePlayCurrentTranscript}
                onSkip={handleSkip}
                onCheck={handleCheckAnswer}
                onNext={handleNext}
              />
            ) : (
              <div className="p-4 h-full overflow-y-auto">
                <Transcript transcripts={transcripts} currentIndex={currentIndex} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}