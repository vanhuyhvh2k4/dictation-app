import type { FeedbackItem } from '../../types/feedback';
import type { Transcript } from '../../types/transcript';

interface DictationPanelProps {
  currentIndex: number;
  transcripts: Transcript[];
  currentTranscript: Transcript | undefined;
  answer: string;
  feedback: FeedbackItem[] | null;
  score: number | null;
  isCorrect: boolean;
  skipped: boolean;
  onAnswerChange: (value: string) => void;
  onPlay: () => void;
  onSkip: () => void;
  onCheck: () => void;
  onNext: () => void;
}

export const DictationPanel: React.FC<DictationPanelProps> = ({
  currentIndex,
  transcripts,
  currentTranscript,
  answer,
  feedback,
  score,
  isCorrect,
  skipped,
  onAnswerChange,
  onPlay,
  onSkip,
  onCheck,
  onNext,
}) => {
  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded">
          {currentIndex + 1} / {transcripts.length}
        </span>
        <button
          className="px-3 py-1 text-sm bg-red-600 text-white rounded"
          onClick={onPlay}
        >
          ▶ Play
        </button>
      </div>

      <textarea
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-600"
        rows={3}
        placeholder="Type what you hear..."
        minLength={1}
        required
        disabled={isCorrect}
      />
      
      <div className="flex items-center justify-end gap-2">
        {!isCorrect && !skipped ? (
          <>
            <button
              onClick={onCheck}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Submit
            </button>
            <button
              onClick={onSkip}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Skip
            </button>
          </>
        ) : (
          <button
            onClick={onNext}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Next →
          </button>
        )}
      </div>

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
                <p className="text-gray-700">{currentTranscript.translation}</p>
              )}
              <p className="text-sm text-gray-600">
                {currentTranscript?.pronunciation || currentTranscript?.text}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};