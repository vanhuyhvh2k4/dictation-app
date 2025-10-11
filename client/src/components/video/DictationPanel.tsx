import { useState, useEffect } from 'react';
import type { FeedbackItem } from '../../types/feedback';
import type { Transcript } from '../../types/transcript';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { TranslationDisplay } from './components/TranslationDisplay';
import { LanguageSelector } from './components/LanguageSelector';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { VoiceInput } from './components/VoiceInput';

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
  const [isTranslating, setIsTranslating] = useState(false);

  // Effect to auto-translate when component loads or language changes
  useEffect(() => {
    const shouldTranslate = currentTranscript && (isCorrect || skipped);
    if (shouldTranslate) {
      handleTranslate();
    }
  }, [currentTranscript, selectedLanguage, isCorrect, skipped]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setTranslation(''); // Clear previous translation
  };

  const handleTranslate = async () => {
    if (!currentTranscript) return;
    
    setIsTranslating(true);
    setTranslation('');
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
    } finally {
      setIsTranslating(false);
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

      <VoiceInput
        value={displayText}
        onChange={onAnswerChange}
        className={`w-full border rounded-lg p-3 text-lg focus:ring-2 focus:ring-red-600 ${
          (isCorrect || skipped) ? 'bg-gray-50' : ''
        }`}
        placeholder="Type or use voice input..."
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
              <FeedbackDisplay
                feedback={feedback}
                showAnswer={showAnswer}
                onToggleShowAnswer={setShowAnswer}
              />
            </>
          ) : (
            <div className="space-y-4 mt-4 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start gap-4">
                {currentTranscript && (
                  <TranscriptDisplay 
                    text={currentTranscript.text}
                    onWordClick={async (word) => {
                      try {
                        const response = await fetch('http://localhost:3000/api/translate', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            text: word,
                            targetLanguage: selectedLanguage
                          }),
                        });
                        
                        const data = await response.json();
                        return data.translation;
                      } catch (error) {
                        console.error('Translation error:', error);
                        return 'Translation failed';
                      }
                    }}
                  />
                )}
                <div className="shrink-0">
                  <LanguageSelector
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={handleLanguageChange}
                  />
                </div>
              </div>

              <div className="border-t my-3"></div>

              <TranslationDisplay
                translation={translation}
                isTranslating={isTranslating}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};