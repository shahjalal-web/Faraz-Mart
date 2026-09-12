import { testimonials } from "@/data/testimonials";
import { productReviews } from "@/data/product-reviews";
import type { ProductReview, RatingDistribution, Testimonial } from "@/types/review";

export async function getTestimonials(limit = 6): Promise<Testimonial[]> {
  return testimonials.slice(0, limit);
}

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  return productReviews
    .filter((review) => review.productId === productId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getRatingDistribution(productId: string): Promise<RatingDistribution> {
  const reviews = await getProductReviews(productId);
  const counts: RatingDistribution["counts"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const review of reviews) {
    const bucket = Math.min(5, Math.max(1, Math.round(review.rating))) as 1 | 2 | 3 | 4 | 5;
    counts[bucket] += 1;
  }

  const total = reviews.length;
  const average = total === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / total;

  return { average, total, counts };
}
