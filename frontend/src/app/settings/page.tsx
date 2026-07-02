'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Avatar } from '@/components/common/Avatar';
import { UserRole } from '@/types';
import { Camera } from 'lucide-react';

interface ProfileResponse {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        if (!sessionData?.user) {
          router.replace('/login');
          return;
        }
        setRole((sessionData.user.role as UserRole) || null);

        const profileRes = await fetch('/api/profile');
        if (!profileRes.ok) throw new Error('Could not load profile');
        const profile = (await profileRes.json()) as ProfileResponse;
        setUsername(profile.username);
        setAvatarUrl(profile.avatarUrl);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [router]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError('');
    setSuccess('');
    setAvatarFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim()) {
      setError('Username cannot be empty.');
      return;
    }
    if (!avatarFile && !username.trim()) {
      setError('Nothing to update.');
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append('username', username.trim());
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.error || 'Failed to update profile');
      }

      setUsername(result.username);
      setAvatarUrl(result.avatarUrl);
      setAvatarFile(null);
      setSuccess('Profile updated.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navigation
        isAuthenticated
        userRole={role === UserRole.ADMIN ? 'ADMIN' : role === UserRole.SPONSOR ? 'SPONSOR' : 'TALENT'}
      />

      <main className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          <p className="text-slate-400 mt-2">Update your profile picture and username.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          <div className="flex items-center gap-5">
            <div className="relative">
              {avatarPreview || avatarUrl ? (
                <img
                  src={avatarPreview || avatarUrl || ''}
                  alt="Profile picture"
                  className="w-20 h-20 rounded-full object-cover border border-slate-700"
                />
              ) : (
                <Avatar name={username} size="xl" />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center border-2 border-slate-900"
                aria-label="Change profile picture"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-200">Profile picture</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-blue-400 hover:text-blue-300 mt-1"
              >
                {avatarFile ? avatarFile.name : 'Upload a new photo'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
              placeholder="Choose a username"
              required
            />
            <p className="text-xs text-slate-500 mt-1">3-30 characters: letters, numbers, underscores, dots, hyphens.</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors text-sm"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}