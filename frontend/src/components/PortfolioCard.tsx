'use client';

import { Button } from '@/components/ui/button';
import { Heart, Share2, MessageCircle, Play, Send } from 'lucide-react';
import { useState } from 'react';

export interface CommentVM {
  id: string;
  body: string;
  createdAt: string;
  author: { username: string; avatarUrl: string | null };
}

export interface PortfolioItemVM {
  id: string;
  title: string;
  type: 'images' | 'video' | 'audio';
  count: number;
  cover: string;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export function PortfolioCard({ item }: { item: PortfolioItemVM }) {
  const [liked, setLiked] = useState(item.likedByMe);
  const [likeCount, setLikeCount] = useState(item.likeCount);
  const [shareCount, setShareCount] = useState(item.shareCount);
  const [likeBusy, setLikeBusy] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentVM[]>([]);
  const [commentCount, setCommentCount] = useState(item.commentCount);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [actionError, setActionError] = useState('');

  const toggleLike = async () => {
    if (likeBusy) return;
    setActionError('');
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((c) => c + (nextLiked ? 1 : -1));
    setLikeBusy(true);
    try {
      const res = await fetch(`/api/content/${item.id}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'LIKE' }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      setLiked(result.likedByMe);
      setLikeCount(result.likeCount);
    } catch {
      // Roll back on failure (e.g. not logged in).
      setLiked(!nextLiked);
      setLikeCount((c) => c + (nextLiked ? -1 : 1));
      setActionError('Log in to like this.');
    } finally {
      setLikeBusy(false);
    }
  };

  const handleShare = async () => {
    setActionError('');
    const url = `${window.location.origin}${window.location.pathname}#portfolio-${item.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // User cancelled the native share sheet — not an error.
    }

    try {
      const res = await fetch(`/api/content/${item.id}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'SHARE' }),
      });
      if (res.ok) {
        const result = await res.json();
        setShareCount(result.shareCount);
      }
    } catch {
      // Non-fatal: the share itself already happened.
    }
  };

  const loadComments = async () => {
    if (commentsLoaded || commentsLoading) return;
    setCommentsLoading(true);
    try {
      const res = await fetch(`/api/content/${item.id}/comments`);
      if (res.ok) {
        setComments(await res.json());
        setCommentsLoaded(true);
      }
    } finally {
      setCommentsLoading(false);
    }
  };

  const toggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next) void loadComments();
  };

  const postComment = async () => {
    if (!commentText.trim() || postingComment) return;
    setActionError('');
    setPostingComment(true);
    try {
      const res = await fetch(`/api/content/${item.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: commentText.trim() }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || 'Failed to post comment');
      setComments((prev) => [...prev, result]);
      setCommentCount((c) => c + 1);
      setCommentText('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Log in to comment.');
    } finally {
      setPostingComment(false);
    }
  };

  return (
    <div
      id={`portfolio-${item.id}`}
      className="rounded-xl overflow-hidden bg-muted border border-border shadow-sm hover:shadow-lg hover:shadow-black/20 transition-shadow duration-300"
    >
      <div className="group relative aspect-square bg-slate-900">
        {item.type === 'video' ? (
          <video
            src={item.cover}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover bg-black"
          />
        ) : item.type === 'audio' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Play className="w-7 h-7 text-indigo-300 fill-indigo-300 ml-0.5" />
            </div>
            <audio src={item.cover} controls preload="metadata" className="w-full max-w-[85%]" />
          </div>
        ) : (
          <img
            src={item.cover}
            alt={item.title}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {item.type !== 'video' && item.type !== 'audio' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
        )}

        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full pointer-events-none">
          {item.type === 'video' ? 'Video' : item.type === 'audio' ? 'Audio' : 'Photo'}
        </span>

        {item.type === 'images' && (
          <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
            <p className="font-semibold text-white drop-shadow">{item.title}</p>
            <p className="text-xs text-white/70">
              {item.count} photo{item.count === 1 ? '' : 's'}
            </p>
          </div>
        )}
      </div>

      {item.type !== 'images' && (
        <div className="px-4 pt-3">
          <p className="font-semibold text-foreground truncate">{item.title}</p>
        </div>
      )}

      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={toggleLike}
          className={`flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-full transition-colors ${
            liked ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
          {likeCount}
        </button>
        <button
          type="button"
          onClick={toggleComments}
          className={`flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-full transition-colors ${
            showComments ? 'text-foreground bg-muted-foreground/10' : 'text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          {commentCount}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-full text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground transition-colors"
        >
          <Share2 className="w-4 h-4" />
          {shareCount}
        </button>
      </div>

      {actionError && <p className="px-4 pb-2 text-xs text-red-500">{actionError}</p>}

      {showComments && (
        <div className="border-t border-border px-4 py-3 space-y-3 bg-background/40">
          {commentsLoading ? (
            <p className="text-xs text-muted-foreground">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-xs text-muted-foreground">No comments yet. Be the first to say something.</p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {comments.map((c) => (
                <li key={c.id} className="text-sm">
                  <span className="font-medium text-foreground">{c.author.username}</span>{' '}
                  <span className="text-muted-foreground">{c.body}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && postComment()}
              placeholder="Add a comment..."
              className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button size="icon" variant="outline" onClick={postComment} disabled={postingComment || !commentText.trim()}>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}