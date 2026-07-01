'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { UserRole } from '@/types';
import { SECTORS } from '@/lib/sectors';
import { Plus, Trash2 } from 'lucide-react';

type Discipline =
  | 'MUSIC'
  | 'VISUAL_ARTS'
  | 'COMEDY'
  | 'ATHLETICS'
  | 'PERFORMING_ARTS';

interface ProfileResponse {
  id: string;
  username: string;
  creator: {
    id: string;
    bio: string | null;
    discipline: Discipline;
    location: string | null;
    gender: string | null;
  } | null;
}

interface DraftMediaItem {
  id: string;
  file: File;
  title: string;
  description: string;
  type: 'IMAGE' | 'VIDEO';
  sector: string;
  previewUrl: string;
}

const DISCIPLINE_OPTIONS: { value: Discipline; label: string }[] = [
  { value: 'MUSIC', label: 'Music' },
  { value: 'VISUAL_ARTS', label: 'Visual Arts' },
  { value: 'COMEDY', label: 'Comedy' },
  { value: 'ATHLETICS', label: 'Athletics' },
  { value: 'PERFORMING_ARTS', label: 'Performing Arts' },
];

export default function TalentDashboardPage() {
  const BIO_MIN_LENGTH = 20;
  const BIO_MAX_LENGTH = 500;

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);

  const [discipline, setDiscipline] = useState<Discipline>('MUSIC');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ bio?: string; location?: string }>({});

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  const [mediaSector, setMediaSector] = useState('music');
  const [draftMedia, setDraftMedia] = useState<DraftMediaItem[]>([]);

  const validateBio = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.length < BIO_MIN_LENGTH) {
      return `Bio must be at least ${BIO_MIN_LENGTH} characters when provided.`;
    }
    if (trimmed.length > BIO_MAX_LENGTH) {
      return `Bio cannot exceed ${BIO_MAX_LENGTH} characters.`;
    }
    return null;
  };

  const validateLocation = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const locationPattern = /^[A-Za-z\s,.'-]{2,80}$/;
    if (!locationPattern.test(trimmed)) {
      return 'Location can only include letters, spaces, commas, apostrophes, periods, and hyphens (2-80 chars).';
    }
    return null;
  };

  const validateForm = (): boolean => {
    const bioError = validateBio(bio);
    const locationError = validateLocation(location);

    const nextErrors: { bio?: string; location?: string } = {};
    if (bioError) nextErrors.bio = bioError;
    if (locationError) nextErrors.location = locationError;
    setFieldErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const sectorExamples = useMemo(() => {
    return SECTORS.filter((sector) => sector.discipline === discipline)
      .map((sector) => sector.label)
      .join(', ');
  }, [discipline]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();
        const sessionRole = sessionData?.user?.role as UserRole | undefined;

        if (!sessionData?.user) {
          router.replace('/login');
          return;
        }

        setRole(sessionRole || null);

        const profileResponse = await fetch('/api/profile');
        if (!profileResponse.ok) {
          throw new Error('Could not load profile');
        }

        const profile = (await profileResponse.json()) as ProfileResponse;
        setUserId(profile.id);
        setUsername(profile.username);

        if (profile.creator) {
          setDiscipline(profile.creator.discipline);
          setBio(profile.creator.bio || '');
          setGender(profile.creator.gender || '');
          setLocation(profile.creator.location || '');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [router]);

  const handleAddMediaToDraft = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');

    if (!mediaFile) {
      setError('Select an image or video file to add.');
      return;
    }

    if (!mediaTitle.trim()) {
      setError('Media title is required.');
      return;
    }

    const draftItem: DraftMediaItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file: mediaFile,
      title: mediaTitle.trim(),
      description: mediaDescription.trim(),
      type: mediaType,
      sector: mediaSector,
      previewUrl: URL.createObjectURL(mediaFile),
    };

    setDraftMedia((prev) => [...prev, draftItem]);
    setMediaFile(null);
    setMediaTitle('');
    setMediaDescription('');
  };

  const removeDraftMedia = (id: string) => {
    setDraftMedia((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    if (!userId) {
      setError('Missing authenticated user ID. Please login again.');
      return;
    }

    if (draftMedia.length === 0) {
      setError('Add at least one image or video before saving.');
      return;
    }

    try {
      setSaving(true);

      const talentResponse = await fetch('/api/talents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          discipline,
          bio,
          gender: gender || null,
          location: location || null,
        }),
      });

      const talentResult = await talentResponse.json();
      if (!talentResponse.ok || !talentResult?.success) {
        throw new Error(talentResult?.error || 'Failed to save talent profile');
      }

      const creatorId = talentResult?.data?.id as string | undefined;
      if (!creatorId) {
        throw new Error('Talent profile saved without creator id');
      }

      for (const draft of draftMedia) {
        const uploadForm = new FormData();
        uploadForm.append('file', draft.file);
        uploadForm.append('talentId', creatorId);
        uploadForm.append('title', draft.title);
        uploadForm.append('description', draft.description);
        uploadForm.append('type', draft.type);
        uploadForm.append('sector', draft.sector);

        const mediaResponse = await fetch('/api/media', {
          method: 'POST',
          body: uploadForm,
        });

        const mediaResult = await mediaResponse.json();
        if (!mediaResponse.ok) {
          throw new Error(mediaResult?.error || `Failed to upload media: ${draft.title}`);
        }
      }

      router.push('/talents');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save talent with media');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        Loading talent setup...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navigation
        isAuthenticated
        userRole={role === UserRole.ADMIN ? 'ADMIN' : role === UserRole.SPONSOR ? 'SPONSOR' : 'TALENT'}
      />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Talent Profile</h1>
          <p className="text-slate-400 mt-2">
            Fill profile + portfolio details, then click Save once to persist everything.
          </p>
          <p className="text-xs text-slate-500 mt-2">Logged in as {username || 'user'}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">Discipline *</label>
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value as Discipline)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
              required
            >
              {DISCIPLINE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">Sector examples: {sectorExamples || 'No mapped sectors'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => {
                const next = e.target.value;
                setBio(next);
                setFieldErrors((prev) => ({ ...prev, bio: validateBio(next) || undefined }));
              }}
              rows={4}
              placeholder="Tell sponsors and audiences about your talent..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-slate-400">Optional, but if provided must be {BIO_MIN_LENGTH}-{BIO_MAX_LENGTH} characters.</p>
              <p className="text-xs text-slate-500">{bio.trim().length}/{BIO_MAX_LENGTH}</p>
            </div>
            {fieldErrors.bio && <p className="text-xs text-red-400 mt-1">{fieldErrors.bio}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">Gender</label>
              <input
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="Optional"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  const next = e.target.value;
                  setLocation(next);
                  setFieldErrors((prev) => ({ ...prev, location: validateLocation(next) || undefined }));
                }}
                placeholder="Optional"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
              />
              {fieldErrors.location && <p className="text-xs text-red-400 mt-1">{fieldErrors.location}</p>}
            </div>
          </div>

          <section className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Portfolio Media</h2>
              <span className="text-xs text-slate-400">{draftMedia.length} item(s) queued</span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1.5">Media Type *</label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as 'IMAGE' | 'VIDEO')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 text-sm"
                  >
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1.5">Sector *</label>
                  <select
                    value={mediaSector}
                    onChange={(e) => setMediaSector(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 text-sm"
                  >
                    {SECTORS.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.icon} {sector.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <input
                type="text"
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
                placeholder="Media title"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 placeholder-slate-500 text-sm"
              />

              <textarea
                value={mediaDescription}
                onChange={(e) => setMediaDescription(e.target.value)}
                rows={2}
                placeholder="Media description (optional)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 placeholder-slate-500 text-sm"
              />

              <input
                type="file"
                accept={mediaType === 'IMAGE' ? 'image/*' : 'video/*'}
                onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-sm file:text-white"
              />

              <button
                type="button"
                onClick={(e) => void handleAddMediaToDraft(e)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm"
              >
                <Plus className="w-4 h-4" />
                Add To Save Queue
              </button>
            </div>

            {draftMedia.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draftMedia.map((item) => (
                  <article key={item.id} className="bg-slate-900 border border-slate-700 rounded-lg p-3 space-y-2">
                    {item.type === 'VIDEO' ? (
                      <video src={item.previewUrl} controls className="w-full h-40 object-cover rounded" />
                    ) : (
                      <img src={item.previewUrl} alt={item.title} className="w-full h-40 object-cover rounded" />
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-white">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.sector} • {item.type}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDraftMedia(item.id)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700"
                        aria-label="Remove media"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors text-sm"
            >
              {saving ? 'Saving profile + uploading media...' : 'Save Talent'}
            </button>

            <Link
              href="/talents"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium rounded-lg transition-colors text-sm"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
