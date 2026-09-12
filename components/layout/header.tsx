import Link from "next/link";
import { getFeaturedCategories } from "@/lib/services/category-service";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Logo } from "@/components/layout/logo";
import { SearchBar } from "@/components/layout/search-bar";
import { HeaderActions } from "@/components/layout/header-actions";
import { CategoryMegaMenu } from "@/components/layout/category-mega-menu";
import { MobileMenu } from "@/components/layout/mobile-menu";

const SECONDARY_NAV_LINKS = [
  { href: "/deals", label: "Deals" },
  { href: "/new-arrivals", label: "New Arrivals" },
];

export async function Header() {
  const categories = await getFeaturedCategories(10);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <AnnouncementBar />
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Logo />

        <SearchBar className="hidden max-w-md flex-1 md:flex" />

        <nav className="ml-2 hidden items-center gap-6 lg:flex" aria-label="Primary">
          <Link
            href="/shop"
            className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            Shop
          </Link>
          <CategoryMegaMenu categories={categories} />
          {SECONDARY_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <HeaderActions />
          <MobileMenu categories={categories} />
        </div>
      </div>

      <div className="border-t border-border px-4 py-2.5 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
