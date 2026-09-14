"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard, Smartphone, Truck, Zap } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { createOrder } from "@/lib/services/order-service";
import type { DeliveryMethod, PaymentMethod } from "@/types/order";
import { EXPRESS_SHIPPING_COST } from "@/lib/pricing";
import { cn, formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { OrderSummary } from "@/components/cart/order-summary";

const DELIVERY_OPTIONS: { value: DeliveryMethod; label: string; description: string; icon: typeof Truck }[] = [
  { value: "standard", label: "Standard Delivery", description: "3–5 business days", icon: Truck },
  { value: "express", label: "Express Delivery", description: `1–2 business days · +${formatPrice(EXPRESS_SHIPPING_COST)}`, icon: Zap },
];

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; description: string; icon: typeof CreditCard }[] = [
  { value: "card", label: "Credit / Debit Card", description: "Visa, Mastercard, Amex", icon: CreditCard },
  { value: "cod", label: "Cash on Delivery", description: "Pay when your order arrives", icon: Banknote },
  { value: "mobile-banking", label: "Mobile Banking", description: "bKash, Nagad and more", icon: Smartphone },
];

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

const INITIAL_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

export default function CheckoutPage() {
  const { items, coupon, isHydrated, clearCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only ever redirect once, on the initial empty-cart check — otherwise the
  // cart-clearing that happens on successful checkout would race this effect
  // and bounce the user back to /cart instead of landing on order-success.
  const hasCheckedCartRef = useRef(false);
  useEffect(() => {
    if (!isHydrated || hasCheckedCartRef.current) return;
    hasCheckedCartRef.current = true;
    if (items.length === 0) router.replace("/cart");
  }, [isHydrated, items.length, router]);

  const updateField = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    (Object.keys(form) as (keyof FormState)[]).forEach((field) => {
      if (!form[field].trim()) nextErrors[field] = "This field is required";
    });
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder({
        items,
        customerName: form.fullName,
        customerEmail: form.email,
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        },
        deliveryMethod,
        paymentMethod,
        coupon,
      });
      clearCart();
      router.push(`/order-success/${order.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <Container className="flex flex-col gap-6 py-8">
      <Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6">
            <h2 className="font-heading text-lg font-bold text-foreground">Customer Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full Name" htmlFor="fullName" required error={errors.fullName} className="sm:col-span-2">
                <Input id="fullName" value={form.fullName} onChange={updateField("fullName")} aria-invalid={!!errors.fullName} />
              </FormField>
              <FormField label="Email" htmlFor="email" required error={errors.email}>
                <Input id="email" type="email" value={form.email} onChange={updateField("email")} aria-invalid={!!errors.email} />
              </FormField>
              <FormField label="Phone" htmlFor="phone" required error={errors.phone}>
                <Input id="phone" type="tel" value={form.phone} onChange={updateField("phone")} aria-invalid={!!errors.phone} />
              </FormField>
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6">
            <h2 className="font-heading text-lg font-bold text-foreground">Shipping Address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Address" htmlFor="address" required error={errors.address} className="sm:col-span-2">
                <Input id="address" value={form.address} onChange={updateField("address")} aria-invalid={!!errors.address} />
              </FormField>
              <FormField label="City" htmlFor="city" required error={errors.city}>
                <Input id="city" value={form.city} onChange={updateField("city")} aria-invalid={!!errors.city} />
              </FormField>
              <FormField label="State / Region" htmlFor="state" required error={errors.state}>
                <Input id="state" value={form.state} onChange={updateField("state")} aria-invalid={!!errors.state} />
              </FormField>
              <FormField label="Postal Code" htmlFor="postalCode" required error={errors.postalCode}>
                <Input id="postalCode" value={form.postalCode} onChange={updateField("postalCode")} aria-invalid={!!errors.postalCode} />
              </FormField>
              <FormField label="Country" htmlFor="country" required error={errors.country}>
                <Input id="country" value={form.country} onChange={updateField("country")} aria-invalid={!!errors.country} />
              </FormField>
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6">
            <h2 className="font-heading text-lg font-bold text-foreground">Delivery Method</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {DELIVERY_OPTIONS.map(({ value, label, description, icon: Icon }) => (
                <label
                  key={value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-button border p-4 transition-colors",
                    deliveryMethod === value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                >
                  <input
                    type="radio"
                    name="delivery"
                    className="sr-only"
                    checked={deliveryMethod === value}
                    onChange={() => setDeliveryMethod(value)}
                  />
                  <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                    <span className="text-xs text-muted-foreground">{description}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6">
            <h2 className="font-heading text-lg font-bold text-foreground">Payment Method</h2>
            <p className="-mt-2 text-xs text-muted-foreground">
              Demo checkout — no real payment will be processed.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {PAYMENT_OPTIONS.map(({ value, label, description, icon: Icon }) => (
                <label
                  key={value}
                  className={cn(
                    "flex cursor-pointer flex-col items-start gap-2 rounded-button border p-4 transition-colors",
                    paymentMethod === value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={paymentMethod === value}
                    onChange={() => setPaymentMethod(value)}
                  />
                  <Icon className="size-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{label}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          {/* No onClick/ctaHref: this button sits inside the <form> above, so a
              native submit button (the default when no type is set) triggers
              handleSubmit — no separate click wiring needed. */}
          <OrderSummary
            shippingMethod={deliveryMethod}
            ctaLabel={isSubmitting ? "Placing Order..." : "Place Order"}
            ctaDisabled={isSubmitting}
          />
        </div>
      </form>
    </Container>
  );
}
