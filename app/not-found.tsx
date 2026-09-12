import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SearchBar } from "@/components/layout/search-bar";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
      <span className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-[#FF6A3D] via-[#FF3D77] to-[#6D5DF6] shadow-glow-primary">
        <Compass className="size-9 text-white" strokeWidth={1.5} />
      </span>

      <div className="flex flex-col gap-2">
        <p className="text-gradient-brand font-heading text-7xl font-extrabold sm:text-8xl">404</p>
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Page not found</h1>
        <p className="max-w-md text-sm text-muted-foreground sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Try searching for what you need,
          or head back to familiar ground.
        </p>
      </div>

      <SearchBar className="max-w-md" />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={buttonVariants({ variant: "primary" })}>
          <Home className="size-4" />
          Back to Home
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
          Browse Shop
        </Link>
      </div>
    </Container>
  );
}
