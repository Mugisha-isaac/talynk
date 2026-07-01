'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { UserRole } from '@/types';

type TabKey = 'talents' | 'users' | 'sponsors';

interface CrudItem {
  id: string;
  [key: string]: unknown;
}

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('talents');
  const [items, setItems] = useState<CrudItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<string>('{}');
  const [itemId, setItemId] = useState('');

  const endpoint = useMemo(() => `/api/admin/${activeTab}`, [activeTab]);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        const sessionResult = await sessionResponse.json();
        const role = sessionResult?.user?.role as UserRole | undefined;

        if (role !== UserRole.ADMIN) {
          router.replace('/login');
          return;
        }

        setAuthorized(true);
      } catch (e) {
        console.error('Admin auth check failed:', e);
        router.replace('/login');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || `Failed to load ${activeTab}`);
        return;
      }

      setItems((data?.data || []) as CrudItem[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) {
      loadItems();
    }
  }, [authorized, endpoint]);

  const createItem = async () => {
    try {
      setError(null);
      const body = JSON.parse(payload || '{}');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Create failed');
        return;
      }
      await loadItems();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON payload');
    }
  };

  const updateItem = async () => {
    if (!itemId.trim()) {
      setError('ID is required for update');
      return;
    }

    try {
      setError(null);
      const body = JSON.parse(payload || '{}');
      const res = await fetch(`${endpoint}/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Update failed');
        return;
      }
      await loadItems();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON payload');
    }
  };

  const deleteItem = async () => {
    if (!itemId.trim()) {
      setError('ID is required for delete');
      return;
    }

    const res = await fetch(`${endpoint}/${itemId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      setError(data?.error || 'Delete failed');
      return;
    }

    await loadItems();
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        Checking admin access...
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navigation isAuthenticated userRole="ADMIN" />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Admin Module</h1>
          <p className="text-slate-400 mt-2">Manage Talents, Users, and Sponsors with full CRUD operations.</p>
        </header>

        <section className="flex gap-2">
          {(['talents', 'users', 'sponsors'] as TabKey[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg border ${
                activeTab === tab
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <h2 className="text-lg font-semibold">CRUD Actions: {activeTab}</h2>
          <input
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            placeholder="Resource ID (for update/delete)"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
          />
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            rows={8}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 font-mono text-sm"
          />

          <div className="flex flex-wrap gap-2">
            <button onClick={createItem} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700">Create</button>
            <button onClick={loadItems} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">Read</button>
            <button onClick={updateItem} className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-700">Update</button>
            <button onClick={deleteItem} className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-700">Delete</button>
          </div>

          {error && <p className="text-rose-400 text-sm">{error}</p>}
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Current {activeTab}</h2>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : (
            <pre className="text-xs overflow-auto bg-slate-950 border border-slate-800 rounded-lg p-3">
              {JSON.stringify(items, null, 2)}
            </pre>
          )}
        </section>
      </main>
    </div>
  );
}
