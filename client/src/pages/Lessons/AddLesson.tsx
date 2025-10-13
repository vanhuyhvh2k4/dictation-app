import React, { useState, type ChangeEvent } from 'react';
import { Upload, Video, FileText, Image, Save, X, CheckCircle } from 'lucide-react';
import type { UploadVideoData } from '../../types/video';
import { uploadVideo } from '../../services/videoServices';

interface FormData {
  title: string;
  channel: string;
  level: 'intermediate' | 'upper-intermediate' | 'advanced' | 'proficient';
  status: 'publish' | 'draft';
}

interface Files {
  thumbnail: File | null;
  video: File | null;
  transcript: File | null;
}

interface Previews {
  thumbnail: string | null;
}

interface Level {
  value: 'intermediate' | 'upper-intermediate' | 'advanced' | 'proficient';
  label: string;
}

const AddLessonForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    channel: '',
    level: 'intermediate',
    status: 'draft'
  });
  
  const [files, setFiles] = useState<Files>({
    thumbnail: null,
    video: null,
    transcript: null
  });
  
  const [previews, setPreviews] = useState<Previews>({
    thumbnail: null
  });
  
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ video?: string; submit?: string }>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const levels: Level[] = [
    { value: 'intermediate', label: 'Beginner (A1-A2)' },
    { value: 'upper-intermediate', label: 'Intermediate (B1-B2)' },
    { value: 'advanced', label: 'Advanced (C1-C2)' },
    { value: 'proficient', label: 'Proficient (C2+)' },
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: keyof Files): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra kích thước video (max 50MB)
      if (type === 'video' && file.size > 50 * 1024 * 1024) {
        setErrors({ video: 'Kích thước video vượt quá 50MB. Vui lòng chọn file nhỏ hơn.' });
        return;
      }

      // Kiểm tra file transcript
      if (type === 'transcript') {
        const allowedExtensions = ['.txt', '.srt', '.vtt'];
        const fileExtension = file.name.toLowerCase().slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity));
        if (!allowedExtensions.includes(fileExtension)) {
          setErrors({ submit: 'File transcript phải có định dạng .txt, .srt hoặc .vtt' });
          return;
        }
      }
      
      setErrors({});
      setFiles(prev => ({
        ...prev,
        [type]: file
      }));

      if (type === 'thumbnail' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({
            ...prev,
            thumbnail: reader.result as string
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeFile = (type: keyof Files): void => {
    setFiles(prev => ({
      ...prev,
      [type]: null
    }));
    if (type === 'thumbnail') {
      setPreviews(prev => ({
        ...prev,
        thumbnail: null
      }));
    }
    if (type === 'video') {
      setErrors({});
    }
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      // Reset errors
      setErrors({});
      setLoading(true);

      // Validate files
      if (!files.video || !files.thumbnail || !files.transcript) {
        setErrors({ submit: 'Please upload all required files' });
        return;
      }

      // Get video duration if possible
      let duration: string | undefined;
      if (files.video) {
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        videoElement.src = URL.createObjectURL(files.video);
        await new Promise((resolve) => {
          videoElement.onloadedmetadata = () => {
            const minutes = Math.floor(videoElement.duration / 60);
            const seconds = Math.floor(videoElement.duration % 60);
            duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            URL.revokeObjectURL(videoElement.src);
            resolve(null);
          };
        });
      }

      // Prepare upload data
      const uploadData: UploadVideoData = {
        title: formData.title,
        channel: formData.channel,
        level: formData.level,
        status: formData.status,
        video: files.video,
        thumbnail: files.thumbnail,
        transcript: files.transcript,
        duration
      };

      // Upload video
      await uploadVideo({
        ...uploadData,
        onProgress: (progress: number) => {
          setUploadProgress(progress);
        }
      });

      // Show success message
      setShowSuccess(true);
      
      // Reset form after delay
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({ title: '', channel: '', level: 'intermediate', status: 'draft' });
        setFiles({ thumbnail: null, video: null, transcript: null });
        setPreviews({ thumbnail: null });
        setUploadProgress(0);
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to upload video. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = (): boolean => {
    return !!(
      formData.title && 
      formData.channel && 
      files.thumbnail && 
      files.video && 
      files.transcript
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Thêm Bài Học Mới</h1>
            <p className="text-indigo-100 mt-2">Điền đầy đủ thông tin bài học và tải lên các file cần thiết</p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tiêu đề bài học <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                placeholder="Nhập tiêu đề bài học..."
              />
            </div>

            {/* Channel & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kênh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="channel"
                  value={formData.channel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                  placeholder="Nhập tên kênh..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cấp độ <span className="text-red-500">*</span>
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                >
                  {levels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800">Trạng thái bài học</h3>
                <p className="text-sm text-gray-600">
                  {formData.status === 'publish' 
                    ? 'Bài học sẽ được hiển thị công khai' 
                    : 'Bài học sẽ được lưu dưới dạng nháp'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  status: prev.status === 'publish' ? 'draft' : 'publish'
                }))
              }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  formData.status === 'publish' ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.status === 'publish' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Tải lên Files</h3>

              {/* Thumbnail Upload */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Image className="inline w-5 h-5 mr-2" />
                  Thumbnail <span className="text-red-500">*</span>
                </label>
                
                {previews.thumbnail ? (
                  <div className="relative">
                    <img 
                      src={previews.thumbnail} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('thumbnail')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="mt-2 text-sm text-gray-600">
                      {files.thumbnail?.name}
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click để tải ảnh thumbnail</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG (Max: 5MB)</span>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'thumbnail')}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Video Upload */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Video className="inline w-5 h-5 mr-2" />
                  Video <span className="text-red-500">*</span>
                </label>
                
                {errors.video && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {errors.video}
                  </div>
                )}
                
                {files.video ? (
                  <div className="flex items-center justify-between bg-white p-4 rounded-lg border-2 border-green-300">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded">
                        <Video className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{files.video.name}</p>
                        <p className="text-sm text-gray-500">{(files.video.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('video')}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click để tải video</span>
                    <span className="text-xs text-gray-400 mt-1">MP4, WebM, MOV (Max: 50MB)</span>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'video')}
                      accept="video/*"
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Transcript Upload */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <FileText className="inline w-5 h-5 mr-2" />
                  Transcript <span className="text-red-500">*</span>
                </label>
                
                {files.transcript ? (
                  <div className="flex items-center justify-between bg-white p-4 rounded-lg border-2 border-blue-300">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{files.transcript.name}</p>
                        <p className="text-sm text-gray-500">{(files.transcript.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('transcript')}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click để tải file transcript</span>
                    <span className="text-xs text-gray-400 mt-1">TXT, SRT, VTT (Max: 5MB)</span>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'transcript')}
                      accept=".txt,.srt,.vtt"
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid() || loading}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition ${
                  isFormValid() && !loading
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Lưu Bài Học
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setFormData({ title: '', channel: '', level: 'intermediate', status: 'draft' });
                  setFiles({ thumbnail: null, video: null, transcript: null });
                  setPreviews({ thumbnail: null });
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl text-center animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Thành công!</h3>
              <p className="text-gray-600">Bài học đã được thêm thành công</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddLessonForm;