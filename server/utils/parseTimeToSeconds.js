// Chuyển "HH:MM:SS,mmm" hoặc "HH:MM:SS.mmm" -> seconds (float)
export function parseTimeToSeconds(timeStr) {
  // normalize comma -> dot
  const t = timeStr.replace(',', '.').trim();
  // possible formats: "00:01:23.456" or "01:23.456" or "1:23.456"
  const parts = t.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parseFloat(t);
}