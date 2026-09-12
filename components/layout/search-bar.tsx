"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn(
        "group relative flex w-full items-center rounded-pill border border-border bg-surface-alt transition-colors focus-within:border-primary focus-within:bg-surface",
        className
      )}
    >
      <Search className="pointer-events-none absolute left-4 size-4 text-muted-foreground" aria-hidden="true" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products, brands and categories..."
        aria-label="Search products"
        className="h-11 w-full rounded-pill bg-transparent pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
    </form>
  );
}
