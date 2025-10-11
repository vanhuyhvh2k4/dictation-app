import type { FeedbackItem } from '../../../types/feedback';

interface FeedbackDisplayProps {
  feedback: FeedbackItem[];
  showAnswer: boolean;
  onToggleShowAnswer: (show: boolean) => void;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  feedback,
  showAnswer,
  onToggleShowAnswer,
}) => {
  return (
    <div className="space-y-3">
      <p className="flex flex-wrap gap-1">
        {feedback.map((f, idx) => (
          <span
            key={idx}
            className={`px-1 rounded ${
              f.correct ? "bg-green-100 text-green-700" : ""
            }`}
          >
            {f.correct ? f.word : showAnswer ? (
              <span className="px-1 rounded text-red-600 bg-red-100">{f.word}</span>
            ) : (
              <span className="px-1 rounded text-red-600 bg-red-100">{'*'.repeat(f.word.length)}</span>
            )}
          </span>
        ))}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="show-answer"
          checked={showAnswer}
          onChange={(e) => onToggleShowAnswer(e.target.checked)}
          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
        />
        <label htmlFor="show-answer" className="text-sm text-gray-600">
          Show full answer
        </label>
      </div>
    </div>
  );
};