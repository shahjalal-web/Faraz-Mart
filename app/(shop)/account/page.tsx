"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LogOut, Mail, Package, Phone, User } from "lucide-react";
import { useCustomerAuth } from "@/context/customer-auth-context";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const router = useRouter();
  const { customer, isLoading, logout } = useCustomerAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Skip the guard during a deliberate logout — otherwise clearing
    // `customer` here races this effect's own redirect against the
    // logout handler's own navigate-to-home below.
    if (!isLoading && !customer && !isLoggingOut) router.replace("/login?from=/account");
  }, [isLoading, customer, isLoggingOut, router]);

  if (isLoading || !customer) return null;

  return (
    <Container className="flex flex-col gap-6 py-8">
      <Breadcrumb items={[{ label: "My Account" }]} />
      <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">My Account</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-6">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="size-6" />
          </span>
          <div>
            <p className="font-heading text-lg font-bold text-foreground">{customer.name}</p>
            {customer.email && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="size-3.5" /> {customer.email}
              </p>
            )}
            {customer.phone && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="size-3.5" /> {customer.phone}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 w-fit"
            onClick={async () => {
              setIsLoggingOut(true);
              await logout();
              router.push("/");
            }}
          >
            <LogOut className="size-4" />
            Log out
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/account/orders"
            className="flex items-center gap-3 rounded-card border border-border bg-surface p-5 transition-colors hover:border-primary/50"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Package className="size-5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">My Orders</p>
              <p className="text-xs text-muted-foreground">Track and review your orders</p>
            </div>
          </Link>
          <Link
            href="/account/wishlist"
            className="flex items-center gap-3 rounded-card border border-border bg-surface p-5 transition-colors hover:border-primary/50"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Heart className="size-5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Wishlist</p>
              <p className="text-xs text-muted-foreground">Items you&apos;ve saved for later</p>
            </div>
          </Link>
        </div>
      </div>
    </Container>
  );
}
