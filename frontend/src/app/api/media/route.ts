import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { classifyMediaLocally } from '@/lib/classification';
import {
  evaluateMediaQuality,
  mapFrontendMediaType,
} from '@/lib/ml-service';
import {
  uploadToCloudinary,
  contentTypeToCloudinaryResource,
} from '@/lib/cloudinary';

// POST /api/media - Upload a portfolio item (Cloudinary + Prisma + ML scoring)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const talentId = formData.get('talentId') as string; // Creator.id
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || '';
    const mediaType = formData.get('type') as 'AUDIO' | 'VIDEO' | 'IMAGE';
    const sectorId =
      (formData.get('sector') as string)?.trim().toLowerCase() || 'music';

    if (!file || !talentId || !title || !mediaType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const creator = await prisma.creator.findUnique({
      where: { id: talentId },
    });
    if (!creator) {
      return NextResponse.json(
        { error: 'Talent profile not found' },
        { status: 404 }
      );
    }

    // 1. Upload the real file to Cloudinary first - everything below uses its URL.
    const uploaded = await uploadToCloudinary(file, {
      folder: `talynk/${talentId}`,
      resourceType: contentTypeToCloudinaryResource(mediaType),
    });

    // 2. Local heuristic classification (sector tagging) + ML quality scoring.
    const localMediaType =
      mediaType === 'AUDIO' ? 'audio' : mediaType === 'VIDEO' ? 'video' : 'image';
    const classification = await classifyMediaLocally(file, localMediaType);

    let overallScore = Math.round(classification.confidence * 100);
    let mlScored = false;

    const mlMediaType = mapFrontendMediaType(mediaType);
    if (mlMediaType) {
      try {
        // Pass the Creator.id (talentId), not the requester's userId, so the
        // ML service attributes this score to the correct talent regardless
        // of which service-account is used to authenticate to it.
        const mlResult = await evaluateMediaQuality(
          talentId,
          file,
          mlMediaType,
          sectorId,
          file.name
        );
        overallScore = mlResult.visibility_score;
        mlScored = true;
      } catch (mlError) {
        console.warn('ML service unavailable, using local classification:', mlError);
      }
    }

    // 3. Persist the content item (+ quality score) in Postgres.
    const contentItem = await prisma.contentItem.create({
      data: {
        creatorId: talentId,
        title,
        description,
        contentType: mediaType,
        discipline: creator.discipline,
        mediaUrl: uploaded.url,
        cloudinaryPublicId: uploaded.publicId,
        status: 'PUBLISHED',
        qualityScore: {
          create: {
            technicalQuality: overallScore,
            structuralCoherence: overallScore,
            originality: overallScore,
            genreAppropriateness: overallScore,
            accessibility: overallScore,
            overallScore,
          },
        },
      },
      include: { qualityScore: true },
    });

    // Keep the Creator's cached visibility score in sync so talent listings
    // and admin views (which sort/display visibilityScoreCurrent) reflect
    // the latest ML-evaluated portfolio quality, not a stale 0.
    const aggregate = await prisma.qualityScore.aggregate({
      where: { contentItem: { creatorId: talentId } },
      _avg: { overallScore: true },
    });
    await prisma.creator.update({
      where: { id: talentId },
      data: { visibilityScoreCurrent: aggregate._avg.overallScore ?? overallScore },
    });

    return NextResponse.json({
      id: contentItem.id,
      talentId: contentItem.creatorId,
      title: contentItem.title,
      description: contentItem.description,
      type: contentItem.contentType,
      fileUrl: contentItem.mediaUrl,
      sector: { id: sectorId, name: sectorId },
      visibilityScore: overallScore,
      confidenceScore: overallScore,
      mlScored,
      classification: {
        sector: classification.sector,
        labels: classification.labels,
      },
      createdAt: contentItem.uploadDate,
    });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    );
  }
}

// GET /api/media?talentId= - List a creator's published content
export async function GET(request: NextRequest) {
  try {
    const talentId = request.nextUrl.searchParams.get('talentId');

    if (!talentId) {
      return NextResponse.json(
        { error: 'talentId is required' },
        { status: 400 }
      );
    }

    const items = await prisma.contentItem.findMany({
      where: { creatorId: talentId },
      include: { qualityScore: true },
      orderBy: { uploadDate: 'desc' },
    });

    const media = items
      .map((item) => ({
        id: item.id,
        talentId: item.creatorId,
        title: item.title,
        description: item.description,
        type: item.contentType,
        fileUrl: item.mediaUrl,
        status: item.status,
        visibilityScore: item.qualityScore?.overallScore ?? 0,
        confidenceScore: item.qualityScore?.overallScore ?? 0,
        mlScored: !!item.qualityScore,
        createdAt: item.uploadDate,
      }))
      .sort((a, b) => b.visibilityScore - a.visibilityScore);

    return NextResponse.json(media);
  } catch (error) {
    console.error('Media fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}
