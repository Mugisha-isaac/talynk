'use client';

import { redirect } from 'next/navigation';

// The talent profile + portfolio management UI now lives at /dashboard/talent
// (a talent's personal page). This route is kept as a redirect so existing
// links/bookmarks to /talents/new keep working.
export default function NewTalentRedirect() {
  redirect('/dashboard/talent');
}
