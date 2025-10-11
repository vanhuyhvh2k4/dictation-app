import { useState, useRef, useEffect } from 'react';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  minLength?: number;
  required?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
  placeholder = '',
  minLength,
  required,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Check if browser supports speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map(result => result.transcript)
          .join('');
        
        onChange(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onChange]);

  const toggleListening = () => {
    if (!isSupported || disabled) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        placeholder={placeholder}
        minLength={minLength}
        required={required}
        disabled={disabled}
        rows={3}
      />
      
      {isSupported && !disabled && (
        <button
          type="button"
          onClick={toggleListening}
          className={`absolute right-3 bottom-3 p-2 rounded-full transition-all duration-200
            ${isListening 
              ? 'bg-red-100 text-red-600 animate-pulse' 
              : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
            }
          `}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {/* Microphone icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-5 h-5"
          >
            <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
            <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
          </svg>

          {/* Recording animation dots */}
          {isListening && (
            <span className="flex gap-1 absolute -right-1 -top-1">
              <span className="h-2 w-2 bg-red-600 rounded-full animate-ping"></span>
            </span>
          )}
        </button>
      )}
    </div>
  );
};