import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Transcript as TranscriptType } from "../../types/transcript";

interface TranscriptProps {
  transcripts?: TranscriptType[];
  currentIndex?: number;
}

const Transcript: React.FC<TranscriptProps> = ({
  transcripts = [],
  currentIndex = 0,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-4">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-semibold text-gray-800">Transcript</h3>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </div>

      {/* Nội dung transcript */}
      {expanded && (
        <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-2">
          {transcripts.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              No transcript available
            </p>
          ) : (
            transcripts.map((t, idx) => (
              <p
                key={t.id}
                className={`text-sm px-2 py-1 rounded-md transition-colors duration-200 ${
                  idx === currentIndex
                    ? "bg-yellow-100 font-medium text-gray-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t.text}
              </p>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Transcript;
