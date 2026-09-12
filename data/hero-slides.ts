import type { HeroSlide, PromoBanner } from "@/types/content";

/**
 * Homepage marketing content. Modeled the way an admin-managed "Homepage"
 * content module would look, so wiring this up to a real CMS/admin API
 * later only means swapping this file's source in `content-service.ts`.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: "hero-everything",
    eyebrow: "New season, new finds",
    title: "Shop Everything",
    highlight: "You Love",
    description:
      "From tech to fashion to home essentials — one trusted marketplace with fast delivery and easy returns.",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
    secondaryCtaLabel: "Explore Deals",
    secondaryCtaHref: "/deals",
    gradient: "from-[#FF6A3D] via-[#FF3D77] to-[#6D5DF6]",
  },
  {
    id: "hero-flash-sale",
    eyebrow: "Ends this week",
    title: "Flash Deals Up To",
    highlight: "60% Off",
    description:
      "Handpicked electronics, fashion and home items at their lowest prices. Grab them before the timer runs out.",
    ctaLabel: "Shop Flash Sale",
    ctaHref: "/deals",
    secondaryCtaLabel: "View New Arrivals",
    secondaryCtaHref: "/new-arrivals",
    gradient: "from-[#6D5DF6] via-[#FF3D77] to-[#FFB020]",
  },
  {
    id: "hero-new-arrivals",
    eyebrow: "Just landed",
    title: "Discover What's",
    highlight: "New This Week",
    description:
      "Fresh arrivals across every category, curated daily. Be the first to shop the latest drops.",
    ctaLabel: "See New Arrivals",
    ctaHref: "/new-arrivals",
    secondaryCtaLabel: "Browse Categories",
    secondaryCtaHref: "/shop",
    gradient: "from-[#14B8A6] via-[#4F46E5] to-[#FF3D77]",
  },
];

export const promoBanners: PromoBanner[] = [
  {
    id: "promo-fashion",
    title: "Fashion Edit — Up to 50% Off",
    description: "Refresh your wardrobe with this season's most-loved styles.",
    ctaLabel: "Shop Fashion",
    ctaHref: "/category/fashion",
    gradient: "from-[#FF3D77] to-[#6D5DF6]",
  },
  {
    id: "promo-electronics",
    title: "Latest Tech, Just Arrived",
    description: "Smartphones, laptops and audio gear from brands you trust.",
    ctaLabel: "Shop Electronics",
    ctaHref: "/category/electronics",
    gradient: "from-[#38BDF8] to-[#4F46E5]",
  },
];
