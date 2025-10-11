import { useState, useEffect } from 'react';
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
  isCorrect,
  skipped,
  onAnswerChange,
  onPlay,
  onSkip,
  onCheck,
  onNext,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);

  // Xác định nội dung hiển thị trong textarea
  const displayText = (isCorrect || skipped) && currentTranscript 
    ? currentTranscript.text 
    : answer;

  const [translation, setTranslation] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState('vietnamese');

  // Effect to auto-translate when answer is correct
  useEffect(() => {
    if ((isCorrect || skipped) && currentTranscript) {
      handleTranslate();
    }
  }, [isCorrect, skipped, currentTranscript, selectedLanguage]);

  const languages = [
    { code: 'vietnamese', name: 'Tiếng Việt' },
    { code: 'japanese', name: '日本語' },
    { code: 'korean', name: '한국어' },
    { code: 'chinese', name: '中文' },
    { code: 'french', name: 'Français' },
    { code: 'german', name: 'Deutsch' },
    { code: 'spanish', name: 'Español' }
  ];

  const handleTranslate = async () => {
    if (!currentTranscript) return;
    
    try {
      const response = await fetch('http://localhost:3000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: currentTranscript.text,
          targetLanguage: selectedLanguage
        }),
      });
      
      const data = await response.json();
      setTranslation(data.translation);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded">
          {currentIndex + 1} / {transcripts.length}
        </span>
        <button
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          onClick={onPlay}
        >
          ▶ Play
        </button>
      </div>

      <textarea
        value={displayText}
        onChange={(e) => onAnswerChange(e.target.value)}
        className={`w-full border rounded-lg p-3 text-lg focus:ring-2 focus:ring-red-600 ${
          (isCorrect || skipped) ? 'bg-gray-50' : ''
        }`}
        rows={3}
        placeholder="Type what you hear..."
        minLength={1}
        required
        disabled={isCorrect || skipped}
      />
      
      <div className="flex items-center gap-2">
        <div className="flex-1">
          {isCorrect && (
            <p className="text-green-600 font-semibold">
              ✅ You are correct!
            </p>
          )}
        </div>
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
                    onChange={(e) => setShowAnswer(e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="show-answer" className="text-sm text-gray-600">
                    Show full answer
                  </label>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4 mt-4 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-2">Original Text</div>
                  <p className="text-gray-900">{currentTranscript?.text}</p>
                </div>
                <div className="shrink-0">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => {
                      setSelectedLanguage(e.target.value);
                      setTranslation(''); // Clear previous translation
                    }}
                    className="px-3 py-1.5 text-sm border rounded text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t my-3"></div>

              <>
                <div className="text-xs text-gray-500 mb-2">Translation</div>
                {translation ? (
                  <p className="text-gray-900">{translation}</p>
                ) : (
                  <p className="text-gray-400 italic">Translation will appear here...</p>
                )}
              </>
            </div>
          )}
        </div>
      )}
    </div>
  );
};