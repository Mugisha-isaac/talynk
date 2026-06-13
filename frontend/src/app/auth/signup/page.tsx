'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Get the query parameters from the URL
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const role = searchParams.get('role');
    
    // Redirect to the actual signup page with query params preserved
    const redirectUrl = role ? `/signup?role=${role}` : '/signup';
    router.replace(redirectUrl);
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Redirecting...</p>
      </div>
    </div>
  );
}
