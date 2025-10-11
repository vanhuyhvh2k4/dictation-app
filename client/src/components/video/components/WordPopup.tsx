interface WordPopupProps {
  word: string;
  translation: string;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

export const WordPopup: React.FC<WordPopupProps> = ({
  word,
  translation,
  position,
  onClose,
}) => {
  if (!position) return null;

  return (
    <div
      className="fixed z-50 bg-white shadow-lg rounded-lg p-3 min-w-[200px] animate-fade-in"
      style={{
        top: position.y + 'px',
        left: position.x + 'px',
        transform: 'translate(-50%, -100%)',
        filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))',
      }}
    >
      {/* Arrow pointer at bottom */}
      <div 
        className="absolute bottom-0 left-1/2 w-3 h-3 bg-white transform rotate-45 translate-y-1.5 -translate-x-1.5"
        style={{ boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}
      />
      
      {/* Content */}
      <div className="space-y-2">
        <div>
          <div className="text-xs text-gray-500 mb-1">Original</div>
          <div className="text-sm text-gray-900 font-medium">{word}</div>
        </div>
        <div className="border-t my-2" />
        <div>
          <div className="text-xs text-gray-500 mb-1">Translation</div>
          <div className="text-sm text-gray-900">{translation || 'Something went wrong!'}</div>
        </div>
      </div>
    </div>
  );
};