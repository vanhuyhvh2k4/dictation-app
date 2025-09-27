import {parseTimeToSeconds} from './parseTimeToSeconds.js';
// Parser chung cho SRT & VTT (đơn giản, robust)
export function parseSubtitleContent(content) {
  // Remove BOM
  content = content.replace(/^\uFEFF/, '');

  // Remove WEBVTT header nếu có
  content = content.replace(/^WEBVTT.*\n?/i, '');

  // Split blocks by two or more newlines
  const rawBlocks = content.split(/\r?\n\r?\n+/);

  const segments = [];
  for (const block of rawBlocks) {
    const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    let timeLineIndex = -1;
    // find the line containing arrow '-->'
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('-->')) {
        timeLineIndex = i;
        break;
      }
    }

    if (timeLineIndex === -1) {
      // try if first line is time (rare)
      continue;
    }

    const timeLine = lines[timeLineIndex];
    // left lines before timeLine might include index number; ignore
    // text lines are those after timeLine
    const textLines = lines.slice(timeLineIndex + 1);

    // Possibly some SRT have the index number as first line; that's ignored

    // parse times
    const [startStr, endStr] = timeLine.split('-->').map(s => s.trim());
    if (!startStr || !endStr) continue;

    const start = parseTimeToSeconds(startStr);
    // some VTT include settings after end time e.g. "00:00:01.000 --> 00:00:04.000 align:start"
    const endPart = endStr.split(/\s+/)[0];
    const end = parseTimeToSeconds(endPart);

    // join text lines
    const text = textLines.join(' ').replace(/<\/?[^>]+(>|$)/g, '').trim(); // remove HTML tags if any

    if (text.length === 0) continue;

    segments.push({ text, start, end });
  }

  return segments;
}
