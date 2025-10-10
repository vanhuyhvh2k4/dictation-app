import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Transcript from "../components/transcript/Transcript";
import { getVideoById } from "../services/videoServices";
import { getVideoProgress, updateVideoProgress } from "../services/progressService";
import type { Video } from "../types/video";

// Feedback type
interface FeedbackItem {
  word: string;
  correct: boolean;
  userWord?: string;
}

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
      <div className="py-3">
        <nav className="max-w-6xl mx-auto px-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <a href="/" className="text-gray-600 hover:text-red-600">All topics</a>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <a href="/stories" className="text-gray-600 hover:text-red-600">Stories for Kids</a>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-red-600">{video?.title || "Loading..."}</span>
            </li>
          </ol>
        </nav>
      </div>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video */}
          <div className="rounded-xl overflow-hidden shadow border">
            {video && (
              <video
                ref={videoRef}
                width="100%"
                controls
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlayVideo}
              >
                <source src={`${video.url}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{video?.title}</h2>
              <p className="text-sm text-gray-500">
                Vocab level: {video?.level}
              </p>
            </div>
          </div>

          {/* Dictation Input */}
          <div className="p-4 border rounded-xl shadow flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded">
                {currentIndex + 1} / {transcripts.length}
              </span>
              <button
                className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                onClick={() => {
                  if (videoRef.current && currentTranscript) {
                    videoRef.current.currentTime = currentTranscript.start;
                    videoRef.current.play();
                  }
                }}
              >
                ▶ Play
              </button>
            </div>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-600"
              rows={3}
              placeholder="Type what you hear..."
              minLength={1}
              required
            />
            <button
              onClick={handleSkip}
              className="px-4 py-2 ml-auto bg-gray-500 text-white rounded"
            >
              Skip
            </button>

            {feedback && (
              <div className="text-sm">
                {!isCorrect && !skipped ? (
                  <>
                    <p className="mb-2 font-medium">
                      Score: <span className="text-blue-600">{score}%</span>
                    </p>
                    <p className="flex flex-wrap gap-1">
                      {feedback.map((f, idx) => (
                        <span
                          key={idx}
                          className={`px-1 rounded ${
                            f.correct
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {f.word}
                        </span>
                      ))}
                    </p>
                  </>
                ) : (
                  <div className="space-y-3">
                    {isCorrect ? (
                      <p className="text-green-600 font-semibold">
                        ✅ You are correct!
                      </p>
                    ) : (
                      <p className="text-yellow-600 font-semibold">
                        ⏭️ You skipped this one
                      </p>
                    )}
                    {currentTranscript?.translation && (
                      <p className="text-gray-700">
                        {currentTranscript.translation}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      {currentTranscript?.pronunciation ||
                        currentTranscript?.text}
                    </p>
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleCheckAnswer}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="mt-10">
          <Transcript transcripts={transcripts} currentIndex={currentIndex} />
        </div>
      </main>
      <Footer />
    </div>
  );
}