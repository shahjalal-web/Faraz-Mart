import type { Category } from "@/types/category";
import { HomeSection } from "@/components/home/home-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryCard } from "@/components/category/category-card";
import { Grid3x3 } from "lucide-react";

export function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <HomeSection>
      <SectionHeading
        eyebrow={
          <>
            <Grid3x3 className="size-3.5" /> Shop by Category
          </>
        }
        title="Find exactly what you're looking for"
        description="Browse our most popular categories, curated across every part of your everyday life."
        viewAllHref="/shop"
        viewAllLabel="View All Categories"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </HomeSection>
  );
}
