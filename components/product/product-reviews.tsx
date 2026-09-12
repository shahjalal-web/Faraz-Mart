"use client";

import { useState, type FormEvent } from "react";
import { BadgeCheck, MessageSquarePlus, Star } from "lucide-react";
import type { ProductReview } from "@/types/review";
import { useToast } from "@/context/toast-context";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { gradientForSeed } from "@/lib/visual";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function DistributionBar({ star, count, total }: { star: number; count: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="w-8 shrink-0">{star}★</span>
      <div className="h-2 flex-1 overflow-hidden rounded-pill bg-surface-alt">
        <div className="h-full rounded-pill bg-star" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-8 shrink-0 text-right">{count}</span>
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} out of 5 stars`}
          className="p-0.5"
        >
          <Star className={cn("size-6 transition-colors", star <= value ? "fill-star text-star" : "text-border")} />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({
  productId,
  productName,
  initialReviews,
}: {
  productId: string;
  productName: string;
  initialReviews: ProductReview[];
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const { showToast } = useToast();

  const total = reviews.length;
  const average = total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!comment.trim()) return;

    const newReview: ProductReview = {
      id: `local-${Date.now()}`,
      productId,
      customerName: "You",
      avatar: "Y",
      rating,
      title: title.trim() || undefined,
      comment: comment.trim(),
      isVerifiedPurchase: false,
      date: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    setTitle("");
    setComment("");
    setRating(5);
    setIsFormOpen(false);
    showToast("Thanks! Your review has been submitted.", "success");
  };

  return (
    <div id="reviews" className="flex flex-col gap-6 scroll-mt-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex shrink-0 flex-col items-center gap-1 sm:border-r sm:border-border sm:pr-6">
          <span className="font-heading text-4xl font-extrabold text-foreground">{average.toFixed(1)}</span>
          <Rating value={average} size="sm" />
          <span className="text-xs text-muted-foreground">{total} review{total === 1 ? "" : "s"}</span>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          {counts.map(({ star, count }) => (
            <DistributionBar key={star} star={star} count={count} total={total} />
          ))}
        </div>
      </div>

      {!isFormOpen ? (
        <Button variant="outline" className="w-fit" onClick={() => setIsFormOpen(true)}>
          <MessageSquarePlus className="size-4" />
          Write a Review
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-card border border-border bg-surface-alt/40 p-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-foreground">Your Rating</span>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="review-title" className="text-sm font-semibold text-foreground">
              Title (optional)
            </label>
            <input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience"
              className="h-10 rounded-button border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="review-comment" className="text-sm font-semibold text-foreground">
              Review
            </label>
            <textarea
              id="review-comment"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`What did you think of ${productName}?`}
              rows={4}
              className="rounded-button border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" size="sm">
              Submit Review
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquarePlus}
          title="No reviews yet"
          description="Be the first to share what you think about this product."
        />
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {reviews.map((review) => (
            <li key={review.id} className="flex gap-3 py-5 first:pt-0">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white",
                  gradientForSeed(review.id)
                )}
              >
                {review.avatar}
              </span>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{review.customerName}</span>
                  {review.isVerifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-info">
                      <BadgeCheck className="size-3.5" /> Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Rating value={review.rating} size="xs" />
                  <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
                </div>
                {review.title && <p className="text-sm font-semibold text-foreground">{review.title}</p>}
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
