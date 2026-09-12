import { Headset, RotateCcw, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { HomeSection } from "@/components/home/home-section";
import { SectionHeading } from "@/components/ui/section-heading";

const FEATURES: { icon: LucideIcon; title: string; description: string; gradient: string }[] = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Every transaction is encrypted and protected end to end.",
    gradient: "from-[#FF6A3D] to-[#FF3D77]",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Reliable shipping with real-time order tracking.",
    gradient: "from-[#6D5DF6] to-[#FF3D77]",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Changed your mind? Return most items within 30 days.",
    gradient: "from-[#14B8A6] to-[#4F46E5]",
  },
  {
    icon: Headset,
    title: "Customer Support",
    description: "Our team is here for you, every day of the week.",
    gradient: "from-[#FFB020] to-[#FF7A45]",
  },
];

export function WhyShopWithUsSection() {
  return (
    <HomeSection>
      <SectionHeading title="Why Shop With Us" align="center" />
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description, gradient }) => (
          <div
            key={title}
            className="group flex flex-col items-center gap-3 rounded-card border border-border bg-surface p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
          >
            <span
              className={`flex size-14 items-center justify-center rounded-2xl bg-linear-to-br ${gradient} text-white shadow-glow-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
            >
              <Icon className="size-6" strokeWidth={1.75} />
            </span>
            <h3 className="font-heading text-base font-bold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </HomeSection>
  );
}
