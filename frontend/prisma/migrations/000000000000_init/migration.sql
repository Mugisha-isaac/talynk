-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('CREATOR', 'AUDIENCE', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."Discipline" AS ENUM ('MUSIC', 'VISUAL_ARTS', 'COMEDY', 'ATHLETICS', 'PERFORMING_ARTS');

-- CreateEnum
CREATE TYPE "public"."ContentType" AS ENUM ('AUDIO', 'VIDEO', 'IMAGE');

-- CreateEnum
CREATE TYPE "public"."ContentStatus" AS ENUM ('PROCESSING', 'PUBLISHED', 'REJECTED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "public"."InteractionType" AS ENUM ('VIEW', 'LIKE', 'SHARE', 'COMMENT', 'FOLLOW');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "userType" "public"."UserType" NOT NULL DEFAULT 'AUDIENCE',
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."creators" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "discipline" "public"."Discipline" NOT NULL,
    "gender" TEXT,
    "location" TEXT,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "visibilityScoreCurrent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audience_members" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audience_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."follows" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."content_items" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contentType" "public"."ContentType" NOT NULL,
    "discipline" "public"."Discipline" NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."ContentStatus" NOT NULL DEFAULT 'PROCESSING',

    CONSTRAINT "content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "contentItemId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quality_scores" (
    "id" TEXT NOT NULL,
    "contentItemId" TEXT NOT NULL,
    "technicalQuality" DOUBLE PRECISION NOT NULL,
    "structuralCoherence" DOUBLE PRECISION NOT NULL,
    "originality" DOUBLE PRECISION NOT NULL,
    "genreAppropriateness" DOUBLE PRECISION NOT NULL,
    "accessibility" DOUBLE PRECISION NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "assessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quality_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."interactions" (
    "id" TEXT NOT NULL,
    "audienceMemberId" TEXT NOT NULL,
    "contentItemId" TEXT NOT NULL,
    "interactionType" "public"."InteractionType" NOT NULL,
    "sessionDuration" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recommendations" (
    "id" TEXT NOT NULL,
    "audienceMemberId" TEXT NOT NULL,
    "contentItemId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "rankPosition" INTEGER NOT NULL,
    "algorithm" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."visibility_scores" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "engagementScore" DOUBLE PRECISION NOT NULL,
    "qualityScore" DOUBLE PRECISION NOT NULL,
    "fairnessAdjustment" DOUBLE PRECISION NOT NULL,
    "finalScore" DOUBLE PRECISION NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visibility_scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "creators_userId_key" ON "public"."creators"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "audience_members_userId_key" ON "public"."audience_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "follows_followerId_creatorId_key" ON "public"."follows"("followerId", "creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "quality_scores_contentItemId_key" ON "public"."quality_scores"("contentItemId");

-- AddForeignKey
ALTER TABLE "public"."creators" ADD CONSTRAINT "creators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audience_members" ADD CONSTRAINT "audience_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "public"."audience_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follows" ADD CONSTRAINT "follows_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."creators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."content_items" ADD CONSTRAINT "content_items_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."creators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "public"."content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_scores" ADD CONSTRAINT "quality_scores_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "public"."content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."interactions" ADD CONSTRAINT "interactions_audienceMemberId_fkey" FOREIGN KEY ("audienceMemberId") REFERENCES "public"."audience_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."interactions" ADD CONSTRAINT "interactions_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "public"."content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommendations" ADD CONSTRAINT "recommendations_audienceMemberId_fkey" FOREIGN KEY ("audienceMemberId") REFERENCES "public"."audience_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommendations" ADD CONSTRAINT "recommendations_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "public"."content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."visibility_scores" ADD CONSTRAINT "visibility_scores_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."creators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

