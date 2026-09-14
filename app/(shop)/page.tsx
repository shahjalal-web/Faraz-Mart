import type { Metadata } from "next";
import { getFeaturedCategories } from "@/lib/services/category-service";
import {
  getBestSellers,
  getFeaturedProducts,
  getFlashSaleProducts,
  getNewArrivals,
  getNextFlashSaleDeadline,
} from "@/lib/services/product-service";
import { getHeroSlides, getPromoBanners } from "@/lib/services/content-service";
import { getTestimonials } from "@/lib/services/review-service";

import { HeroSection } from "@/components/home/hero-section";
import { CategorySection } from "@/components/home/category-section";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { FlashSaleSection } from "@/components/home/flash-sale-section";
import { NewArrivalsSection } from "@/components/home/new-arrivals-section";
import { BestSellersSection } from "@/components/home/best-sellers-section";
import { PromoBannerSection } from "@/components/home/promo-banner-section";
import { WhyShopWithUsSection } from "@/components/home/why-shop-with-us-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { NewsletterSection } from "@/components/home/newsletter-section";

export const metadata: Metadata = {
  title: "Faraz Mart — Shop Everything You Love",
  description:
    "Discover electronics, fashion, home, beauty and more on Faraz Mart — a modern multi-category marketplace with fast delivery and easy returns.",
};

export default async function Home() {
  const [
    heroSlides,
    featuredCategories,
    featuredProducts,
    flashSaleProducts,
    flashSaleDeadline,
    newArrivals,
    bestSellers,
    promoBanners,
    testimonials,
  ] = await Promise.all([
    getHeroSlides(),
    getFeaturedCategories(8),
    getFeaturedProducts(8),
    getFlashSaleProducts(10),
    getNextFlashSaleDeadline(),
    getNewArrivals(10),
    getBestSellers(10),
    getPromoBanners(),
    getTestimonials(6),
  ]);

  return (
    <>
      <HeroSection slides={heroSlides} />
      <CategorySection categories={featuredCategories} />
      <FeaturedProductsSection products={featuredProducts} />
      <FlashSaleSection products={flashSaleProducts} deadline={flashSaleDeadline} />
      <NewArrivalsSection products={newArrivals} />
      <BestSellersSection products={bestSellers} />
      <PromoBannerSection banners={promoBanners} />
      <WhyShopWithUsSection />
      <TestimonialsSection testimonials={testimonials} />
      <NewsletterSection />
    </>
  );
}
