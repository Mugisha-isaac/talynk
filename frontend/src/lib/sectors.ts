// src/lib/sectors.ts
//
// One canonical mapping shared by:
//  - the talents discovery UI filter (sector id + label)
//  - the ML service ("sector" is a free-text lowercase string, e.g. "music")
//  - the Prisma `Discipline` enum (MUSIC | VISUAL_ARTS | COMEDY | ATHLETICS | PERFORMING_ARTS)
//
// Previously the UI used display strings ("Film & Video", "Performance & Theater")
// that didn't line up with either the Discipline enum or the ML sector ids, so
// filtering silently returned nothing for several categories. This file is now
// the only place that mapping is defined.

import { Discipline } from '@prisma/client';

export interface SectorDefinition {
  id: string; // used as the ML-service "sector" string and as URL/category param
  label: string; // shown in the UI
  icon: string;
  color: string;
  discipline: Discipline; // closest matching Prisma enum value
}

export const SECTORS: SectorDefinition[] = [
  { id: 'music', label: 'Music', icon: '🎵', color: '#EC4899', discipline: 'MUSIC' },
  { id: 'comedy', label: 'Comedy', icon: '😂', color: '#F59E0B', discipline: 'COMEDY' },
  { id: 'dance', label: 'Dance', icon: '💃', color: '#A78BFA', discipline: 'PERFORMING_ARTS' },
  { id: 'sports', label: 'Sports', icon: '⚽', color: '#10B981', discipline: 'ATHLETICS' },
  { id: 'art', label: 'Visual Art', icon: '🎨', color: '#06B6D4', discipline: 'VISUAL_ARTS' },
  { id: 'performance', label: 'Performance & Theater', icon: '🎭', color: '#EF4444', discipline: 'PERFORMING_ARTS' },
  { id: 'film', label: 'Film & Video', icon: '🎬', color: '#3B82F6', discipline: 'VISUAL_ARTS' },
  { id: 'fashion', label: 'Fashion', icon: '👗', color: '#FBBF24', discipline: 'VISUAL_ARTS' },
];

export const SECTOR_BY_ID: Record<string, SectorDefinition> = SECTORS.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {}
);

export function sectorIdToDiscipline(sectorId: string): Discipline | null {
  return SECTOR_BY_ID[sectorId.toLowerCase()]?.discipline ?? null;
}

/** A Discipline can map back to several sector ids (e.g. VISUAL_ARTS -> art/film/fashion). */
export function disciplineToSectorIds(discipline: Discipline): string[] {
  return SECTORS.filter((s) => s.discipline === discipline).map((s) => s.id);
}

export function disciplineToLabel(discipline: string): string {
  const match = SECTORS.find((s) => s.discipline === discipline);
  return match?.label ?? discipline;
}
