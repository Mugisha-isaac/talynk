'use client';

import { redirect } from 'next/navigation';

// No dedicated settings UI yet.
export default function SponsorSettings() {
  redirect('/sponsors');
}
