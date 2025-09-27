import type { Transcript } from "./transcript";

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  channel: string;
  view: string;
  date: string;
  level?: string;   // mức độ (beginner, intermediate,...)
  Transcripts: Transcript[];
}