"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/context/toast-context";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    showToast("You're subscribed! Watch your inbox for deals.", "success");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email"
        className={cn(
          "h-11 w-full rounded-button border px-4 text-sm focus:outline-none focus-visible:outline-none",
          dark
            ? "border-white/15 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40"
            : "border-border bg-surface text-foreground placeholder:text-muted-foreground focus:border-primary"
        )}
      />
      <button type="submit" className={cn(buttonVariants({ variant: "primary", size: "md" }), "shrink-0")}>
        Subscribe
        <Send className="size-4" />
      </button>
    </form>
  );
}
