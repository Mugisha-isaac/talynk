export interface ClassificationResult {
  sector: string;
  confidence: number;
  labels: Array<{
    label: string;
    score: number;
  }>;
  rawData?: Record<string, any>;
}

/**
 * Classify media content using Hugging Face API
 * Supports image and audio classification
 */
export async function classifyMediaWithHuggingFace(
  fileUrl: string,
  mediaType: 'image' | 'video' | 'audio'
): Promise<ClassificationResult> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY is not configured');
  }

  let modelId: string;

  switch (mediaType) {
    case 'image':
      modelId = 'google/vit-base-patch16-224';
      break;
    case 'audio':
      modelId = 'facebook/wav2vec2-base-960h';
      break;
    default:
      throw new Error(`Unsupported media type: ${mediaType}`);
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        method: 'POST',
        body: JSON.stringify({ url: fileUrl }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const result = await response.json();
    return mapHuggingFaceToSector(result);
  } catch (error) {
    console.error('Classification error:', error);
    throw error;
  }
}

/**
 * Map Hugging Face classification results to Talynk sectors
 */
function mapHuggingFaceToSector(
  result: Array<{ label: string; score: number }> | any
): ClassificationResult {
  const labels = Array.isArray(result) ? result : result?.scores || [];
  const topResult = labels[0] || { label: 'Other', score: 0.5 };

  // Map label to sector
  const sector = mapLabelToSector(topResult.label);

  return {
    sector,
    confidence: topResult.score,
    labels: labels.slice(0, 5),
    rawData: result,
  };
}

/**
 * Map classification labels to Talynk sectors
 */
function mapLabelToSector(label: string): string {
  const labelLower = label.toLowerCase();

  // Visual Arts
  if (
    labelLower.includes('painting') ||
    labelLower.includes('art') ||
    labelLower.includes('sketch')
  ) {
    return 'Visual Arts';
  }

  // Photography
  if (
    labelLower.includes('photograph') ||
    labelLower.includes('portrait') ||
    labelLower.includes('landscape')
  ) {
    return 'Photography';
  }

  // Design
  if (
    labelLower.includes('design') ||
    labelLower.includes('graphic') ||
    labelLower.includes('illustration')
  ) {
    return 'Design';
  }

  // Music
  if (
    labelLower.includes('music') ||
    labelLower.includes('audio') ||
    labelLower.includes('instrument')
  ) {
    return 'Music';
  }

  // Film & Video
  if (
    labelLower.includes('film') ||
    labelLower.includes('video') ||
    labelLower.includes('movie')
  ) {
    return 'Film & Video';
  }

  // Fashion
  if (
    labelLower.includes('fashion') ||
    labelLower.includes('clothing') ||
    labelLower.includes('model')
  ) {
    return 'Fashion';
  }

  // Performance & Theater
  if (
    labelLower.includes('performance') ||
    labelLower.includes('theater') ||
    labelLower.includes('dance')
  ) {
    return 'Performance & Theater';
  }

  // Sports
  if (
    labelLower.includes('sport') ||
    labelLower.includes('athlete') ||
    labelLower.includes('game')
  ) {
    return 'Sports';
  }

  // Default
  return 'General Arts';
}

/**
 * Classify media with local model (lightweight alternative)
 * This is a simple implementation - for production, consider using TensorFlow.js or ONNX
 */
export async function classifyMediaLocally(
  file: File,
  _mediaType: 'image' | 'video' | 'audio'
): Promise<ClassificationResult> {
  // Simple heuristic-based classification based on file metadata
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  let sector = 'General Arts';
  let confidence = 0.5;

  // Check file extension and MIME type
  if (
    mimeType.includes('image') ||
    fileName.match(/\.(jpg|jpeg|png|webp|gif)$/i)
  ) {
    if (
      fileName.includes('photo') ||
      fileName.includes('portrait') ||
      fileName.includes('landscape')
    ) {
      sector = 'Photography';
      confidence = 0.8;
    } else if (
      fileName.includes('art') ||
      fileName.includes('painting') ||
      fileName.includes('sketch')
    ) {
      sector = 'Visual Arts';
      confidence = 0.8;
    } else if (
      fileName.includes('design') ||
      fileName.includes('graphic')
    ) {
      sector = 'Design';
      confidence = 0.8;
    } else if (fileName.includes('fashion') || fileName.includes('model')) {
      sector = 'Fashion';
      confidence = 0.8;
    } else {
      sector = 'Visual Arts';
      confidence = 0.6;
    }
  } else if (
    mimeType.includes('audio') ||
    fileName.match(/\.(mp3|wav|flac|m4a)$/i)
  ) {
    sector = 'Music';
    confidence = 0.75;
  } else if (
    mimeType.includes('video') ||
    fileName.match(/\.(mp4|webm|mov|avi)$/i)
  ) {
    if (fileName.includes('film') || fileName.includes('movie')) {
      sector = 'Film & Video';
      confidence = 0.85;
    } else if (
      fileName.includes('performance') ||
      fileName.includes('dance')
    ) {
      sector = 'Performance & Theater';
      confidence = 0.8;
    } else if (fileName.includes('sport')) {
      sector = 'Sports';
      confidence = 0.8;
    } else {
      sector = 'Film & Video';
      confidence = 0.7;
    }
  }

  return {
    sector,
    confidence,
    labels: [
      { label: sector, score: confidence },
      { label: 'General Arts', score: 1 - confidence },
    ],
  };
}
