export interface Transcript {
  id: string;
  text: string;
  start: number;        // thời gian bắt đầu video (giây)
  end: number;          // thời gian kết thúc
  translation?: string; // bản dịch (nếu có)
  pronunciation?: string; // phát âm (nếu có)
}