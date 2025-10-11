interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: 'vietnamese', name: 'Tiếng Việt' },
  { code: 'japanese', name: 'Tiếng Nhật' },
  { code: 'korean', name: 'Tiếng Hàn' },
  { code: 'chinese', name: 'Tiếng Trung' },
  { code: 'french', name: 'Tiếng Pháp' },
  { code: 'german', name: 'Tiếng Đức' },
  { code: 'spanish', name: 'Tiếng Tây Ban Nha' },
  { code: 'english', name: 'Tiếng Anh' },
  { code: 'italian', name: 'Tiếng Ý' },
  { code: 'russian', name: 'Tiếng Nga' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <select
      value={selectedLanguage}
      onChange={(e) => onLanguageChange(e.target.value)}
      className="px-3 py-1.5 text-sm border rounded text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};