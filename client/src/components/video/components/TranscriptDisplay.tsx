import { useState, useEffect } from 'react';
import { WordPopup } from './WordPopup';

interface TranscriptDisplayProps {
  text: string;
  onWordClick?: (word: string) => Promise<string>;
}

interface PopupState {
  word: string;
  translation: string;
  position: { x: number; y: number } | null;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ 
  text,
  onWordClick 
}) => {
  const [popup, setPopup] = useState<PopupState>({
    word: '',
    translation: '',
    position: null,
  });

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popup.position) {
        const target = e.target as HTMLElement;
        if (!target.closest('.word-popup')) {
          setPopup(prev => ({ ...prev, position: null }));
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popup.position]);

  const handleWordClick = async (e: React.MouseEvent, word: string) => {
    e.preventDefault();
    
    // Get click position
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top
    };

    // If clicking the same word, close popup
    if (word === popup.word && popup.position) {
      setPopup(prev => ({ ...prev, position: null }));
      return;
    }

    // Show loading state
    setPopup({
      word,
      translation: 'Translating...',
      position
    });

    // Get translation
    if (onWordClick) {
      try {
        const translation = await onWordClick(word);
        setPopup(prev => ({
          ...prev,
          translation
        }));
      } catch (error) {
        setPopup(prev => ({
          ...prev,
          translation: 'Translation failed'
        }));
      }
    }
  };

  // Split text into words and preserve punctuation
  const words = text.match(/\b[\w']+\b|[^\w\s]|\s+/g) || [];

  return (
    <div className="flex-1">
      <div className="text-xs text-gray-500 mb-2">Original Text</div>
      <p className="text-gray-900 leading-relaxed">
        {words.map((word, index) => {
          // For whitespace, just render it directly
          if (/^\s+$/.test(word)) {
            return word;
          }
          
          // For punctuation and special characters, render without click handler
          if (/^[^\w\s]$/.test(word)) {
            return <span key={index}>{word}</span>;
          }
          
          // For actual words, add click handler and styling
          return (
            <span
              key={index}
              onClick={(e) => handleWordClick(e, word)}
              className={`
                inline-block px-1 py-0.5 rounded text-lg
                cursor-pointer hover:bg-gray-100 hover:text-red-600
                ${popup.word === word ? 'bg-gray-100 text-red-600' : ''}
              `}
            >
              {word}
            </span>
          );
        })}
      </p>

      {/* Word Popup */}
      <WordPopup
        word={popup.word}
        translation={popup.translation}
        position={popup.position}
        onClose={() => setPopup(prev => ({ ...prev, position: null }))}
      />
    </div>
  );
};