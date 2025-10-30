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
  };
  totalTranscripts: number;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  status: 'publish' | 'draft';
  thumbnail: string;
  duration: string;
  channel: string;
  view: number;
  createdAt: string;
  level: 'beginner' | 'intermediate' | 'advanced';  
  Transcripts: Transcript[];
  progress?: {
    currentTranscriptIndex: number;
    transcriptsCompleted: number;
    totalScore: number;
    completed: boolean;
    totalTranscripts: number;
    createdAt: string;
    updatedAt: string;
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
