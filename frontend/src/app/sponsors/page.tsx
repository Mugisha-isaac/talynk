'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { UserRole } from '@/types';

// The sponsor discovery experience (Top 5 recommended talents + sector
// browsing) now lives at /talents. This route just forwards visitors there.
// Talents are never allowed onto this page at all — they're sent to their
// own dashboard instead.
export default function SponsorsRedirect() {
  const router = useRouter();
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/auth/session')
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (cancelled) return;
        const role = data?.user?.role as UserRole | undefined;

        if (role === UserRole.TALENT) {
          setBlocked(true);
          router.replace('/talent');
          return;
        }

        router.replace('/talents');
      })
      .catch(() => {
        router.replace('/talents');
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 px-4 text-center">
      <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      <p className="text-slate-400 text-sm">
        {blocked ? "Sponsor discovery isn't available for talent accounts. Redirecting..." : 'Redirecting...'}
      </p>
    </div>
  );
}