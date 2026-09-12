import { heroSlides, promoBanners } from "@/data/hero-slides";
import type { HeroSlide, PromoBanner } from "@/types/content";

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return heroSlides;
}

export async function getPromoBanners(): Promise<PromoBanner[]> {
  return promoBanners;
}
