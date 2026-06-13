'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface MediaUploadProps {
  talentId: string;
  onSuccess?: () => void;
}

export function MediaUploadDialog({ talentId, onSuccess }: MediaUploadProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'IMAGE',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!file) {
        toast.error('Please select a file');
        setLoading(false);
        return;
      }

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('talentId', talentId);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('type', formData.type);

      const response = await fetch('/api/media', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      toast.success('Media uploaded and classified successfully!');
      setOpen(false);
      setFile(null);
      setFormData({ title: '', description: '', type: 'IMAGE' });
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to upload media');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="gap-2" type="button">
          <Upload className="h-4 w-4" />
          Upload Portfolio Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Portfolio Item</DialogTitle>
          <DialogDescription>
            Share your creative work. Our AI will automatically classify it by sector.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Media Type</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            >
              <option value="IMAGE">Image (Artwork, Photography, Design)</option>
              <option value="VIDEO">Video (Performance, Film, Demonstration)</option>
              <option value="AUDIO">Audio (Music, Podcast, Voiceover)</option>
              <option value="DOCUMENT">Document (Portfolio, Resume)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Choose File</Label>
            <div className="border-2 border-dashed border-input rounded-lg p-6 text-center">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept={
                  formData.type === 'IMAGE'
                    ? 'image/*'
                    : formData.type === 'VIDEO'
                      ? 'video/*'
                      : formData.type === 'AUDIO'
                        ? 'audio/*'
                        : 'application/*'
                }
              />
              <label
                htmlFor="file"
                className="cursor-pointer"
              >
                {file ? (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    {file.name}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <span>Click to browse or drag and drop</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., 'Abstract Oil Painting No. 3'"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Tell sponsors about this piece..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload & Classify'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
