import type { Transcript as TranscriptType } from "../../types/transcript";

interface TranscriptProps {
  transcripts?: TranscriptType[];
  currentIndex?: number;
}

const Transcript: React.FC<TranscriptProps> = ({
  transcripts = [],
  currentIndex = 0,
}) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Transcript</h3>
      
      <div className="space-y-2">
        {transcripts.length === 0 ? (
          <p className="text-sm text-gray-400 italic">
            No transcript available
          </p>
        ) : (
          transcripts.map((t, idx) => (
            <p
              key={t.id}
              className={`text-sm px-3 py-2 rounded-md transition-colors duration-200 ${
                idx === currentIndex
                  ? "bg-red-50 text-red-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t.text}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default Transcript;
