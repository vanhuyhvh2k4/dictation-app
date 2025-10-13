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
  status: string;
  thumbnail: string;
  duration: string;
  channel: string;
  view: string;
  date: string;
  level?: string;  
  Transcripts: Transcript[];
  progress?: {
    currentTranscriptIndex: number;
    transcriptsCompleted: number;
    totalScore: number;
    completed: boolean;
    totalTranscripts: number;
  } | null;
}


export interface UploadVideoData {
  title: string;
  channel: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'publish' | 'draft';
  thumbnail: File;
  video: File;
  transcript: File;
  duration?: string;
  onProgress?: (progress: number) => void;
}
