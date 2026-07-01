'use client';

import React, { useState } from 'react';
import { PageLayout, PageHeader } from '@/components/layout/AdvancedLayouts';
import { Upload, Music, Video, Image, X, Check } from 'lucide-react';
import { Tabs } from '@/components/common/AdvancedCommon';

interface UploadedFile {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  size: number;
  progress: number;
  status: 'uploading' | 'processing' | 'done' | 'error';
  rawFile: File;
}

/**
 * Upload Studio Page
 * Content creation and upload interface
 */
export default function StudioPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [talentId, setTalentId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setTalentId(data?.creator?.id ?? null))
      .catch(() => setTalentId(null));
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary-blue', 'bg-primary-blue/5');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-primary-blue', 'bg-primary-blue/5');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary-blue', 'bg-primary-blue/5');

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const addFiles = (fileList: File[]) => {
    const newFiles = fileList.map((file) => ({
      id: Math.random().toString(),
      name: file.name,
      type: getFileType(file.type),
      size: file.size,
      progress: 0,
      status: 'uploading' as const,
      rawFile: file,
    }));

    setFiles([...files, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          clearInterval(interval);
          progress = 100;
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, progress: 100, status: 'processing' }
                : f
            )
          );
          setTimeout(() => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id ? { ...f, status: 'done' } : f
              )
            );
          }, 1500);
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, progress } : f
            )
          );
        }
      }, 300);
    });
  };

  const getFileType = (mimeType: string): 'video' | 'image' | 'audio' => {
    if (mimeType.startsWith('video')) return 'video';
    if (mimeType.startsWith('image')) return 'image';
    if (mimeType.startsWith('audio')) return 'audio';
    return 'image';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-6 h-6 text-accent-orange" />;
      case 'audio':
        return <Music className="w-6 h-6 text-accent-teal" />;
      default:
        return <Image className="w-6 h-6 text-primary-blue" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handlePublish = async () => {
    if (!talentId) {
      setPublishError('You need a creator profile before publishing. Finish onboarding first.');
      return;
    }
    if (files.length === 0 || !title) return;

    setPublishing(true);
    setPublishError(null);

    try {
      const primary = files[0];
      const formData = new FormData();
      formData.append('file', primary.rawFile);
      formData.append('talentId', talentId);
      formData.append('title', title);
      formData.append('description', description);
      formData.append(
        'type',
        primary.type === 'image' ? 'IMAGE' : primary.type === 'video' ? 'VIDEO' : 'AUDIO'
      );
      formData.append('sector', category || 'music');

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Upload failed');
      }

      window.location.href = `/talents/${talentId}`;
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const tabs = [
    {
      id: 'upload',
      label: '📤 Upload Content',
      content: (
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="border-2 border-dashed border-border-medium rounded-xl p-12 text-center cursor-pointer hover:border-primary-blue transition-colors duration-200 bg-bg-medium/30"
          >
            <Upload className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <h3 className="font-semibold text-text-primary mb-2">
              Drag and drop your files here
            </h3>
            <p className="text-text-secondary mb-6">
              or{' '}
              <label className="text-primary-blue hover:underline cursor-pointer">
                browse your files
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
                />
              </label>
            </p>
            <p className="text-text-tertiary text-sm">
              Supported formats: MP4, MOV, MP3, WAV, JPG, PNG (Max 1GB each)
            </p>
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-text-primary">Uploads</h4>
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-bg-medium border border-border-medium"
                >
                  {getFileIcon(file.type)}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{file.name}</p>
                    <p className="text-xs text-text-tertiary">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  <div className="w-24">
                    {file.status === 'done' ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <Check className="w-4 h-4" />
                        <span className="text-xs">Done</span>
                      </div>
                    ) : (
                      <div>
                        <div className="h-1.5 bg-bg-dark rounded-full overflow-hidden mb-1">
                          <div
                            className="h-full bg-gradient-to-r from-primary-blue to-primary-purple transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-text-tertiary">
                          {Math.round(file.progress)}%
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 hover:bg-bg-light rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-text-tertiary" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'details',
      label: '📝 Content Details',
      content: (
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What is your content about?"
              className="w-full px-4 py-3 bg-bg-medium border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary-blue/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us more about your content..."
              rows={5}
              className="w-full px-4 py-3 bg-bg-medium border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary-blue/50"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-bg-medium border border-border-medium rounded-lg text-text-primary focus:outline-none focus:border-primary-blue/50"
            >
              <option value="">Select a category</option>
              <option value="music">Music</option>
              <option value="comedy">Comedy</option>
              <option value="dance">Dance</option>
              <option value="art">Visual Art</option>
              <option value="sports">Sports</option>
              <option value="content">Content Creation</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tags (AI Generated)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tags..."
                className="flex-1 px-4 py-2 bg-bg-medium border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary-blue/50"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-primary-blue hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => removeTag(tag)}
                  className="px-3 py-1.5 rounded-full bg-primary-blue/20 border border-primary-blue/50 text-primary-blue text-sm hover:bg-primary-blue/30 transition-colors flex items-center gap-2"
                >
                  #{tag}
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageLayout maxWidth="2xl">
      {/* Page Header */}
      <PageHeader
        title="Upload Content"
        subtitle="Share your talent with the world"
      />

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="upload" />

      {/* Action Buttons */}
      {publishError && (
        <p className="mt-4 text-sm text-red-400">{publishError}</p>
      )}
      <div className="flex gap-4 mt-8">
        <button className="px-6 py-3 rounded-lg border border-border-medium text-text-secondary hover:text-text-primary transition-colors font-medium">
          Save as Draft
        </button>
        <button
          onClick={handlePublish}
          className="px-6 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-blue/20 transition-all duration-300 disabled:opacity-50"
          disabled={files.length === 0 || !title || publishing}
        >
          {publishing ? 'Publishing...' : 'Publish Content'}
        </button>
      </div>
    </PageLayout>
  );
}
