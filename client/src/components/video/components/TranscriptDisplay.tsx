interface TranscriptDisplayProps {
  text: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ text }) => {
  return (
    <div className="flex-1">
      <div className="text-xs text-gray-500 mb-2">Original Text</div>
      <p className="text-gray-900">{text}</p>
    </div>
  );
};