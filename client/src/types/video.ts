import type { Transcript } from "./transcript";

export interface VideoProgress {
  id: number;
  userId: number;
  videoId: number;
  currentTranscriptIndex: number;
  transcriptsCompleted: number;
  totalScore: number;
  completed: boolean;
  Video?: {
    title: string;
    Transcripts: { id: string }[];
  };
  totalTranscripts: number;
}

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
  progress?: {
    currentTranscriptIndex: number;
    transcriptsCompleted: number;
    totalScore: number;
    completed: boolean;
    totalTranscripts: number;
  } | null;
}