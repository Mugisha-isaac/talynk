import { ensureMlServiceToken } from './ml-auth';

const ML_SERVICE_URL =  process.env.ML_SERVICE_URL || 'http://localhost:8000';

export interface MlEvaluationResult {
  status: string;
  media_type: string;
  sector: string;
  visibility_score: number;
  recorded_by_user: string;
}

export interface MlRecommendationItem {
  evaluation_id: number;
  uploaded_by_user: string;
  media_type: string;
  visibility_score: number;
  visibility_approved: boolean;
}

export interface MlRecommendationsResponse {
  status: string;
  sector: string;
  source: 'cache' | 'database';
  results: MlRecommendationItem[];
}

export type MlMediaType = 'image' | 'audio' | 'video';

export function mapFrontendMediaType(
  type: string
): MlMediaType | null {
  switch (type.toUpperCase()) {
    case 'IMAGE':
      return 'image';
    case 'VIDEO':
      return 'video';
    case 'AUDIO':
      return 'audio';
    default:
      return null;
  }
}

async function authHeaders(): Promise<HeadersInit> {
  const token = await ensureMlServiceToken();
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function evaluateMediaQuality(
  talentId: string,
  file: File | Blob,
  mediaType: MlMediaType,
  sector: string,
  filename?: string
): Promise<MlEvaluationResult> {
  const formData = new FormData();
  formData.append('sector', sector);
  // The ML service authenticates every request as a shared service account
  // (see ml-auth.ts), so without this the evaluation would be recorded under
  // that shared account instead of the actual talent who uploaded it.
  formData.append('talent_id', talentId);
  formData.append(
    'file',
    file,
    filename || `upload.${mediaType === 'audio' ? 'mp3' : mediaType === 'video' ? 'mp4' : 'jpg'}`
  );

  const response = await fetch(
    `${ML_SERVICE_URL}/api/v1/${mediaType}/evaluate`,
    {
      method: 'POST',
      headers: await authHeaders(),
      body: formData,
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `ML evaluation failed (${response.status}): ${errorBody}`
    );
  }

  return response.json();
}

export async function getSectorRecommendations(
  _userId: string,
  sector: string
): Promise<MlRecommendationsResponse> {
  const response = await fetch(
    `${ML_SERVICE_URL}/api/v1/recommendations/sector-top-five`,
    {
      method: 'POST',
      headers: {
        ...(await authHeaders()),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sector: sector.toLowerCase() }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `ML recommendations failed (${response.status}): ${errorBody}`
    );
  }

  return response.json();
}

export function mapMlToRecommendation(
  item: MlRecommendationItem,
  sector: string
) {
  const score = Math.round(item.visibility_score);
  return {
    id: `rec-${item.evaluation_id}`,
    talentId: item.uploaded_by_user,
    mediaId: `media-${item.evaluation_id}`,
    matchScore: score,
    reason: item.visibility_approved
      ? `Top-ranked ${item.media_type} in ${sector} with ${item.visibility_score} visibility score`
      : `Visibility score ${item.visibility_score} — pending fairness review`,
    status: 'PENDING' as const,
    createdAt: new Date(),
    mediaType: item.media_type,
    visibilityApproved: item.visibility_approved,
  };
}
